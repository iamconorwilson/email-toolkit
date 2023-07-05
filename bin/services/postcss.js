import postcss from 'postcss';
import { basename } from 'path';

import autoprefixer from 'autoprefixer';
import sortMediaQueries from 'postcss-sort-media-queries';
import emailDarkmode from '../plugins/postcss/postcss-email-darkmode.js';

import { task } from '../functions/task.js';
import { log } from '../functions/logger.js';

// const defaultPlugins = [ autoprefixer, sortMediaQueries({ sort: 'desktop-first' }), emailDarkmode ];
const defaultPlugins = [ autoprefixer, emailDarkmode ];

class PostCss {
    constructor(context) {
        this.postcss = postcss;
        this.buildDir = context.dir.dest;
        this.sourceDir = context.dir.src;
        this.postcssPlugins = defaultPlugins.concat(context?.postCss ?? []);

        this.init = this.init.bind(this);
        this.render = this.render.bind(this);
    }

    init() {
        return { render: this.render }
    }
    render() {
        return new Promise((resolve) => {
            task('postCss', async (utils) => {
                let { getFiles, readFromFile, writeFile } = utils;

                let files = await getFiles(this.buildDir + '/css/*.css');
                
                files.forEach(async (file) => {

                    let fileString = await readFromFile(file);
                    let fileName = basename(file);
                    let string = '';
                    await this.postcss(this.postcssPlugins)
                    .process(fileString, { from: file, to: file })
                    .then((result) => {
                        result.warnings().forEach((warn) => {
                            log(warn.toString(), 'warn');
                        });
                        string = result.css;
                    });
                    await writeFile(this.buildDir + '/css/', fileName, string);
                });
            }, resolve);
        });
    }
}

export default PostCss;