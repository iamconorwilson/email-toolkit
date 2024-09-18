import inquirer from "inquirer";
import fs from "fs";
import * as cheerio from "cheerio";
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

        const { file, location } = answers;

        const credentials = config.upload;

        if (!credentials) {
            console.error(`[${chalk.magentaBright('email-toolkit')}] No credentials found in config file.`);
            process.exit(1);
        }

        filePath = `${process.cwd()}/${file}`;

        const spinner = ora(`[${chalk.magentaBright('email-toolkit')}] Uploading HTML...`).start();

        const html = fs.readFileSync(filePath, 'utf8');

        const $ = cheerio.load(html);

        const HTMLimages = $('img');

        const CSSimages = [];

        const cssUrlRegex = /url\(([^)]+)\)/g;
        let match;
        while ((match = cssUrlRegex.exec(html)) !== null) {
            CSSimages.push(match[1]);
        }

        spinner.text = `[${chalk.magentaBright('email-toolkit')}] Images found: ${HTMLimages.length + CSSimages.length}`;

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

        const ftpPaths = {
            baseRemotePath,
            location,
            publicUrl
        }

        for (let img of HTMLimages) {            
            let src = $(img).attr('src');
            //if src does not start with http, it's a local file
            if (!src.startsWith('http')) {
                let imgPath = `${process.cwd()}/${src}`;
                //remove filename from src
                const newSrc = await uploadFile(client, src, imgPath, ftpPaths, spinner);
                $(img).attr('src', newSrc);
            }
        }

        let modifiedHtml = $.html();

        //reverse cssimages so we can replace them in reverse order
        CSSimages.reverse();

        for (let img of CSSimages) {
            let src = img.replace(/['"]+/g, '');
            //if src does not start with http, it's a local file
            if (!src.startsWith('http')) {
                let imgPath = `${process.cwd()}/${src}`;
                //remove filename from src
                const newSrc = await uploadFile(client, src, imgPath, ftpPaths, spinner);
                modifiedHtml = modifiedHtml.replace(src, newSrc);
            }
        }


        spinner.text = `[${chalk.magentaBright('email-toolkit')}] Writing HTML file...`;

        //write the file
        fs.writeFileSync(filePath, modifiedHtml, 'utf8');

        await client.put(filePath, `${baseRemotePath}/${location}/${file}`);

        client.end();

        let uploadedFile = new URL(publicUrl + file);

    
        spinner.succeed(`[${chalk.magentaBright('email-toolkit')}] Upload complete! File available at: ${chalk.underline(uploadedFile)}`);

        process.exit(0);

    });

}

const uploadFile = async (client, src, imgPath, ftpPaths, spinner) => {

    const { baseRemotePath, location, publicUrl } = ftpPaths;

    let remotePath = `${baseRemotePath}/${location}/${src.split('/').slice(0, -1).join('/')}/`;
    let remoteFile = `${baseRemotePath}/${location}/${src}`;
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