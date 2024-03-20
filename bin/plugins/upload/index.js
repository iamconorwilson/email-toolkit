import inquirer from "inquirer";
import fs from "fs";
import { JSDOM } from "jsdom";
import sftp from "ssh2-sftp-client";
import ora from 'ora';
import chalk from 'chalk';
import { loadConfig } from "../../functions.js";

const command = (program) => {
    program
        .command('upload')
        .description('Upload images to FTP server and replace image paths in HTML file.')
        .action((options) => {
            run(options);
        });

}

const run = (options) => {
    console.log(`[${chalk.magentaBright('email-pipeline')}] ${chalk.bold('Upload')}`);

    let filePath = '';

    const files = fs.readdirSync(process.cwd());

    const config = loadConfig();

    inquirer.prompt([
        {
            type: 'list',
            name: 'file',
            message: 'Select a file to upload:',
            choices: files,
        },
        {
            type: 'input',
            name: 'location',
            message: 'Enter file path on server (this is relative to root path in the config and will be created if it does not exist):',
        }
    ]).then(async (answers) => {

        const { file, location } = answers;

        const credentials = config.upload;

        if (!credentials) {
            console.error(`[${chalk.magentaBright('email-pipeline')}] No credentials found in config file.`);
            process.exit(1);
        }

        filePath = `${process.cwd()}/${file}`;

        const spinner = ora(`[${chalk.magentaBright('email-pipeline')}] Uploading HTML...`).start();

        const html = fs.readFileSync(filePath, 'utf8');

        const dom = new JSDOM(html);

        const images = dom.window.document.querySelectorAll('img');

        spinner.text = `[${chalk.magentaBright('email-pipeline')}] Images found: ${images.length}`;

        const client = new sftp();

        const baseRemotePath = credentials.base_path;

        const basePublicUrl = credentials.public_url;

        let publicUrl = basePublicUrl.endsWith('/') ? basePublicUrl : `${basePublicUrl}/`;

        publicUrl = publicUrl + (location.startsWith('/') ? location.slice(1) : location);

        publicUrl = publicUrl.endsWith('/') ? publicUrl : `${publicUrl}/`;

        try {
            await client.connect({
                host: credentials.host,
                user: credentials.user,
                password: credentials.password,
            });

            if (await client.exists(`${baseRemotePath}/${location}`) === false) {
                await client.mkdir(`${baseRemotePath}/${location}`, true);
            }

        } catch (err) {
            console.log(err);
        }

        for (let img of images) {
            let src = img.getAttribute('src');
            //if src does not start with http, it's a local file
            if (!src.startsWith('http')) {
                let imgPath = `${process.cwd()}/${src}`;
                //remove filename from src

                let remotePath = `${baseRemotePath}/${location}/${src.split('/').slice(0, -1).join('/')}/`;
                let remoteFile = `${baseRemotePath}/${location}/${src}`;
                try {
                    spinner.text = `[${chalk.magentaBright('email-pipeline')}] Uploading ${src}...`;
                    await client.mkdir(remotePath, true);
                    await client.put(imgPath, remoteFile);
                } catch (err) {
                    console.log(err);
                }
                const newSrc = `${publicUrl}${src}`;
                img.setAttribute('src', newSrc);
            }
        }

        spinner.text = `[${chalk.magentaBright('email-pipeline')}] Writing HTML file...`;

        //remove tbody tags from serialized dom with regex
        let htmlString = dom.serialize();

        htmlString = htmlString.replace(/<\/?tbody>/g, '');

        //write the file
        fs.writeFileSync(filePath, htmlString, 'utf8');

        await client.put(filePath, `${baseRemotePath}/${location}/${file}`);

        client.end();

        let uploadedFile = new URL(publicUrl + file);

    
        spinner.succeed(`[${chalk.magentaBright('email-pipeline')}] Upload complete! File available at: ${chalk.underline(uploadedFile)}`);

        process.exit(0);

    });

}

export default command;