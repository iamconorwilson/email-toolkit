import inquirer from "inquirer";
import fs from "fs";
import sftp from "ssh2-sftp-client";
import ora from 'ora';
import chalk from 'chalk';
import { loadConfig } from "../../functions.js";
import { htmlReplace, cssReplace } from "./functions/replace.js";

const command = (program) => {
    program
        .command('upload')
        .description('Upload images to FTP server and replace image paths in HTML file.')
        .action((options) => {
            run(options);
        });
}

const run = (options) => {
    console.log(`[${chalk.magentaBright('email-toolkit')}] ${chalk.bold('Upload')}`);

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

        const { file, location: inputLocation } = answers;

        //if location does not have a trailing slash, add one
        const location = inputLocation.endsWith('/') ? inputLocation : `${inputLocation}/`;

        const credentials = config.upload;

        if (!credentials) {
            console.error(`[${chalk.magentaBright('email-toolkit')}] No credentials found in config file.`);
            process.exit(1);
        }

        filePath = `${process.cwd()}/${file}`;

        const spinner = ora(`[${chalk.magentaBright('email-toolkit')}] Uploading HTML...`).start();

        let originalHtml = fs.readFileSync(filePath, 'utf8');

        const destUrl = `${config.upload.public_url}/${location}`;

        // Replace HTML
        const { html: html1, images: htmlimages } = htmlReplace(originalHtml, destUrl);

        // Replace CSS
        const { html: html2, images: cssimages } = cssReplace(html1, destUrl);

        const imgArr = [...htmlimages, ...cssimages];

        const images = [...new Set(imgArr)];

        fs.writeFileSync(filePath, html2);

        const ftpPaths = {
            baseRemotePath: config.upload.base_path,
            publicUrl: config.upload.public_url,
            location: location
        };

        const client = new sftp();

        try {
            await client.connect({
                host: credentials.host,
                username: credentials.user,
                password: credentials.password
            });

            if (await client.exists(`${ftpPaths.baseRemotePath}/${location}`) === false) {
                await client.mkdir(`${ftpPaths.baseRemotePath}/${location}`, true);
            }
        } catch (err) {
            console.log(err);
        }



        for (let img of images) {
            await uploadFile(client, img, `${process.cwd()}/${img}`, ftpPaths, spinner);
        }

        spinner.text = `[${chalk.magentaBright('email-toolkit')}] Writing HTML file...`;

        await client.put(filePath, `${ftpPaths.baseRemotePath}/${location}${file}`);
        
        client.end();

        let uploadedFile = new URL(`${ftpPaths.publicUrl}/${location}${file}`);

        spinner.succeed(`[${chalk.magentaBright('email-toolkit')}] Upload complete! File available at: ${chalk.underline(uploadedFile)}`);

        process.exit(0);

    });
        
}

const uploadFile = async (client, src, imgPath, ftpPaths, spinner) => {

    const { baseRemotePath, location, publicUrl } = ftpPaths;

    let remotePath = `${baseRemotePath}/${location}${src.split('/').slice(0, -1).join('/')}/`;
    let remoteFile = `${baseRemotePath}/${location}${src}`;
    try {
        spinner.text = `[${chalk.magentaBright('email-toolkit')}] Uploading ${src}...`;

        await client.mkdir(remotePath, true);
        await client.put(imgPath, remoteFile);
    } catch (err) {
        console.log(err);
    }
    return `${publicUrl}${src}`;
}

export default command;