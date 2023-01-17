const path = require('path');
const fs = require('fs');
const glob = require('glob');

const { log } = require('./src/functions/logger');
const { init } = require('./src/services');

let options = {
    buildDir: './test/build',
    templateDir: './test/src/templates',
    sourceDir: './test/src',
    dataDir: './test/src/data',
    customExt: null,
    customFilters: null,
};

let state = init(options);

let njk = state.njk;
let watch = state.watch;
let app = state.app;
let reload = state.reload;
let sass = state.sassRender;

const run = () => {
    log('Running build...');
    sassRender();
    nunjucksRender();
    reload.refresh('*');
    log('Build complete.');
}


const nunjucksRender = () => {
    log('Starting nunjucksRender')
    glob(`${options.sourceDir}/*.njk`, (err, files) => {
        let data = JSON.parse(fs.readFileSync(`${options.dataDir}/data.json`));

        files.forEach((file) => {
            let filePath = path.resolve(file);
            let fileString = fs.readFileSync(filePath, 'utf8');
            let rendered = njk.renderString(fileString, data);
            let fileName = path.basename(file, '.njk') + '.html';
            fs.writeFileSync(`${options.buildDir}/${fileName}`, rendered);
        });
    });
    log('Finished nunjucksRender')
}


const sassRender = () => {
    log('Starting sassRender')
    glob(`${options.sourceDir}/sass/!(_*).scss`, (err, files) => {
        files.forEach((file) => {
            let filePath = path.resolve(file);
            let fileString = fs.readFileSync(filePath, 'utf8');

            //if filename is inline, output style expanded, else output style compressed
            let outputStyle = path.basename(file, '.scss') === 'inline' ? 'expanded' : 'compressed';

            let rendered = sass.compileString(fileString, { outputStyle: outputStyle });
            let fileName = path.basename(file, '.scss') + '.css';
            fs.writeFileSync(`${options.buildDir}/css/${fileName}`, rendered.css);
        });
    });
    log('Finished sassRender')
}



watch.on('add', run).on('change', run)

run();

