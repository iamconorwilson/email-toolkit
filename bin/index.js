#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { program } from 'commander';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDirectory = path.resolve(__dirname); // Get the root directory of the application

program
    .version('0.0.1')
    .description('A CLI for generating new projects');

const loadPlugins = async () => {

    const pluginsDirectory = path.join(rootDirectory, 'plugins'); // Construct the absolute path to the plugins directory

    //read all directories in plugins directory
    const plugins = fs.readdirSync(pluginsDirectory);

    //for each plugin folder, read the index.js file
    for (const plugin of plugins) {
        const pluginDirectory = path.join(pluginsDirectory, plugin);
        const pluginFile = path.join(pluginDirectory, 'index.js');

        //if index.js exists, import the command function and run it
        if (fs.existsSync(pluginFile)) {
            const { default: command } = await import(pluginFile);
            command(program);
        }
    }
};

loadPlugins().then(() => {
    program.parse(process.argv);
});