import inquirer from "inquirer";
import fs from "fs";
import nodemailer from "nodemailer";
import { randomUUID } from "crypto";
import ora from 'ora';
import chalk from 'chalk';
import { loadConfig } from "../../functions.js";

const command = (program) => {
    program
        .command('send')
        .description('Test send a single email')
        .action((options) => {
            run(options);
        });

}

const run = (options) => {
    console.log(`[${chalk.magentaBright('email-pipeline')}] ${chalk.bold('Send')}`);

    let filePath = '';

    const config = loadConfig();

    fs.readdir(process.cwd(), (err, files) => {
        if (err) {
            console.error(`Error reading directory: ${err}`);
            return;
        }

        inquirer.prompt([
            {
                type: 'list',
                name: 'file',
                message: 'Select a file to send:',
                choices: files,
            },
            {
                type: 'input',
                name: 'to',
                message: 'Enter email address(es) to send to (comma separated):',
                validate: (input) => {
                    const valid = (email) => {
                        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                        return re.test(String(email).toLowerCase());
                    }
                    let emails = input.split(',').map(e => e.trim());
                    let invalidEmails = emails.filter(e => !valid(e));
                    return invalidEmails.length === 0 ? true : `Invalid email(s): ${invalidEmails.join(', ')}`;
                }
            }
        ]).then((answers) => {

            filePath = `${process.cwd()}/${answers.file}`;
            const { to } = answers;

            //get file name from path
            let fileName = filePath.split('/').pop();

            console.log(`[${chalk.magentaBright('email-pipeline')}] Sending file: ${fileName}`);

            //read secret from secrets.json in root of package
            let credentials = config.send;

            //if no credentials, exit and warn user
            if (!credentials) {
                console.error(`[${chalk.magentaBright('email-pipeline')}] No credentials found in config file.`);
                process.exit(1);
            }

            // Set up nodemailer...
            let transporter = nodemailer.createTransport({
                'host': 'smtp.gmail.com',
                'port': 465,
                'secure': true,
                'auth': {
                    'user': credentials.email,
                    'pass': credentials.password,
                }
            });

            //read file to string
            let fileContents = fs.readFileSync(filePath, 'utf8');

            let mailOptions = {
                from: credentials.test_email,
                to: to,
                subject: `Test Email: ${fileName}`,
                text: 'This is a test email sent from Email Pipeline! If you are seeing this, change your client settings to view the HTML part of this email.',
                html: fileContents,
                headers: {
                    References: randomUUID()
                }
            };


            const spinner = ora(`[${chalk.magentaBright('email-pipeline')}] Sending email...`).start();

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    spinner.fail(`[${chalk.magentaBright('email-pipeline')}] Error sending email: ${error}`);
                } else {
                    spinner.succeed(`[${chalk.magentaBright('email-pipeline')}] Email sent: ${info.messageId}`);
                    process.exit(0);
                }
            });
        });
    });
}

export default command;