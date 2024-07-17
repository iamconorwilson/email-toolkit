import inquirer from "inquirer";
import fs from "fs";
import ora from 'ora';
import chalk from 'chalk';
import { comb, defaults } from 'email-comb';
import { loadConfig } from "../../functions.js";


const command = (program) => {
    program
        .command('clean')
        .description('Remove unused CSS and compress email HTML files.')
        .action((options) => {
            run(options);
        });

}

const run = (options) => {
    console.log(`[${chalk.magentaBright('email-pipeline')}] ${chalk.bold('Upload')}`);

    const filesList = fs.readdirSync(process.cwd());

    const config = loadConfig();

    inquirer.prompt([
        {
            type: 'checkbox',
            name: 'files',
            message: 'Select files to compress:',
            choices: filesList,
        }
    ]).then(async (answers) => {

        const { files } = answers;

        // const options = config.clean?.opts || null;

        const spinner = ora(`[${chalk.magentaBright('email-pipeline')}] Cleaning ${files.length} files`).start();

        for (let file of files) {
            const filePath = `${process.cwd()}/${file}`;

            spinner.text = `[${chalk.magentaBright('email-pipeline')}] Cleaning file: ${file}`;

            const html = fs.readFileSync(filePath, 'utf8');

            const fileString = Buffer.from(html).toString('utf8');

            //if options are empty, use default settings
            const combOpts = defaults;

            combOpts.whitelist.concat(['[data-ogsb]', '[data-ogsc]', '.content*']);

            combOpts.removeHTMLComments = false;

            const modifiedHtml = comb(fileString, combOpts);

            spinner.text = `[${chalk.magentaBright('email-pipeline')}] Writing HTML file...`;

            //write the file
            fs.writeFileSync(filePath, modifiedHtml.result, 'utf8');

            spinner.text = `[${chalk.magentaBright('email-pipeline')}] File cleaned: ${file}`;

        }

        spinner.succeed(`[${chalk.magentaBright('email-pipeline')}] All files cleaned`);

        //once all files are cleaned, exit process
        process.exit(0);


    });
}


export default command;