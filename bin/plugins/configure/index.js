import inquirer from "inquirer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const command = (program) => {
    program
        .command('config')
        .description('Configure options')
        .action((options) => {
            run(options);
        });

}

const run = (options) => {

    console.log(`[${chalk.magentaBright('email-pipeline')}] ${chalk.bold('Config')}`);

    //read secret from secrets.json in root of package, if it doesn't exist, create it
    const secretsPath = path.resolve(__dirname, "../../../secrets.json");
    let config = {}; 

    if (!fs.existsSync(secretsPath)) {
        console.log('Creating secrets.json');
        fs.writeFileSync(secretsPath, JSON.stringify(config), 'utf8');
    } else {
        config = JSON.parse(fs.readFileSync(secretsPath, 'utf8'));
    }

    inquirer.prompt([
        {
            type: 'input',
            name: 'email',
            message: 'Enter email address:',
        },
        {
            type: 'password',
            name: 'password',
            message: 'Enter email password:',
        }
    ]).then((answers) => {
        //if input is empty, don't update
        if (answers.email === '') {
            delete answers.email;
        }
        if (answers.password === '') {
            delete answers.password;
        }
        config.credentials.test_email = answers.email;
        config.credentials.test_password = answers.password;
        fs.writeFile(path.resolve(__dirname, "../../../secrets.json"), JSON.stringify(config), 'utf8', (err) => {
            if (err) {
                console.error(`Error writing file: ${err}`);
                return;
            }
            console.log('Config file updated!');
            process.exit(0);
        });
    });
}


    

export default command;