const { Nunjucks } = require('./nunjucks.js');
const { Watch } = require('./watch.js');
const { Express } = require('./express.js');
const { LiveReload } = require('./livereload.js');
const { Sass } = require('./sass.js');

const fs = require('fs');
const path = require('path');


const init = (options) => {
    const context = {
        buildDir: options.buildDir,
        templateDir: options.templateDir,
        sourceDir: options.sourceDir,
        dataDir: options.dataDir,
        customExt: options.customExt,
        customFilters: options.customFilters,
    }

    //check if build directory exists, if not, create it
    if (!fs.existsSync(context.buildDir)) {
        fs.mkdirSync(context.buildDir);
    }

    //check if css directory exists, if not, create it
    if (!fs.existsSync(path.join(context.buildDir, 'css'))) {
        fs.mkdirSync(path.join(context.buildDir, 'css'));
    }



    const nunjucks = new Nunjucks(context);
    const sass = new Sass(context);
    const watcher = new Watch(context);
    const express = new Express(context);
    const livereload = new LiveReload(context);

    let njk = nunjucks.init();
    let sassRender = sass.init();
    let watch = watcher.init();
    let reload = livereload.init();
    let app = express.init();

    return {
        njk,
        sassRender,
        watch,
        app,
        reload
    }
}

exports.init = init;