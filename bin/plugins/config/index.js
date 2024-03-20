import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import inquirer from 'inquirer';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDirectory = path.resolve(__dirname); // Get the root directory of the application
const homeDirectory = os.homedir(); // Get the user's home directory

const command = (program, config) => {
    program
        .command('config')
        .description('Create a new config file')
        .action(() => run());

}

const run = () => {
    console.log(`[${chalk.magentaBright('email-pipeline')}] ${chalk.bold('Config')}`);
    
    //check for existing config file
    const configFile = path.join(homeDirectory, '.email-pipeline.config.json');

    //if config file exists, ask user if they want to overwrite
    if (fs.existsSync(configFile)) {
        inquirer.prompt([
            {
                type: 'confirm',
                name: 'overwrite',
                message: 'Config file already exists. Overwrite?',
                default: false,
            }
        ]).then((answers) => {
            if (answers.overwrite) {
                createConfig(configFile);
                process.exit(0);
            } else {
                console.log(`[${chalk.magentaBright('email-pipeline')}] Existing config file not overwritten.`);
                process.exit(0);
            }

        });
    } else {
        createConfig(configFile);
        process.exit(0);
    }

}

const createConfig = (configFile) => {
    fs.copyFileSync(path.join(rootDirectory, '../../../config.json.example'), configFile);
    console.log(`[${chalk.magentaBright('email-pipeline')}] Config file created at ${configFile}`);
}

export default command;