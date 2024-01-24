import inquirer from "inquirer";
import fs from "fs";
import nodemailer from "nodemailer";

const command = (program) => {
    program
        .command('send')
        .description('Test send a single email')
        .action((options) => {
            run(options);
        });

}

const run = (options) => {


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
        ]).then((answers) => {
            const filePath = `${process.cwd()}/${answers.file}`;
            
            return inquirer.prompt([
                {
                    type: 'input',
                    name: 'to',
                    message: 'Enter email address to send to:',
                }
            ]);
        }).then((answers) => {

            console.log(answers);

            const { to } = answers;

            console.log(`Sending file: ${filePath}`);

            // Set up nodemailer...
            let transporter = nodemailer.createTransport({
                'host': 'smtp.gmail.com',
                'port': 465,
                'secure': true,
                'auth': {
                    'user': 'conor.wilson@actionrocket.co',
                    'pass': 'errqomaiqfmhwpho',
                },
            });

            console.log(transporter)

            //read file to string
            let fileContents = fs.readFileSync(filePath, 'utf8');

            let mailOptions = {
                from: 'conor.wilson@acionrocket.co',
                to: to,
                subject: 'Test Email',
                text: 'This is a test email',
                html: fileContents
            };

            console.log('sending email...');

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(`Error sending email: ${error}`);
                } else {
                    console.log(`Email sent: ${info.response}`);
                }
            });
        });
    });
}

export default command;