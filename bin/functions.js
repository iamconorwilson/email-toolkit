import fs from 'fs';
import os from 'os';
import path from 'path';
import chalk from 'chalk';

const homeDirectory = os.homedir(); // Get the user's home directory

const loadConfig = () => {
    //load config file from user's home directory
    const configFile = path.join(homeDirectory, '.email-pipeline.config.json');

    //if config file doesn't exist and command is not config, warn the user and exit
    if (!fs.existsSync(configFile)) {
        console.error(`[${chalk.magentaBright('email-pipeline')}] ${chalk.redBright('ERROR')}: Config file not found. Please run the 'config' command to create one.`);
        return process.exit(1);
    } else {
        return JSON.parse(fs.readFileSync(configFile, 'utf8'));;
    }
}


export { loadConfig }