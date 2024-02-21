import inquirer from "inquirer";
import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";
import { fileURLToPath } from 'url';
import { randomUUID } from "crypto";
import ora from 'ora';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
                message: 'Enter email address to send to:',
            }
        ]).then((answers) => {

            filePath = `${process.cwd()}/${answers.file}`;
            const { to } = answers;

            //get file name from path
            let fileName = filePath.split('/').pop();

            console.log(`[${chalk.magentaBright('email-pipeline')}] Sending file: ${fileName}`);

            //read secret from secrets.json in root of package
            let { credentials } = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../../../secrets.json"), 'utf8'));

            // Set up nodemailer...
            let transporter = nodemailer.createTransport({
                'host': 'smtp.gmail.com',
                'port': 465,
                'secure': true,
                'auth': {
                    'user': credentials.test_email,
                    'pass': credentials.test_password,
                }
            });

            //read file to string
            let fileContents = fs.readFileSync(filePath, 'utf8');

            let mailOptions = {
                from: credentials.test_email,
                to: to,
                subject: `Test Email: ${fileName}`,
                text: 'This is a test email sent from Email Pipeline! If you are seeing this, something went wrong.',
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