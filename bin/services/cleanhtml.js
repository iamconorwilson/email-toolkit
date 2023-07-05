import { comb } from 'email-comb';
import { basename } from 'path';
import prettier from 'prettier';

import { task } from '../functions/task.js';
import { deepMerge } from '../functions/deepmerge.js';

let defaultOpts = {
    whitelist: [".External*",".ReadMsgBody",".yshortcuts",".Mso*","#outlook",".module*",".video*",".Singleton", "#MessageViewBody", ".content*", "[data-ogsc]*", "[data-ogsb]*"],
    removeHTMLComments: false,
    uglify: false,
    htmlCrushOpts: {removeIndentations: false, removeLineBreaks: false}
}

class CleanHtml {
    constructor(context) {
        this.buildDir = context.dir.dest;
        this.sourceDir = context.dir.src;
        this.combOpts = deepMerge(defaultOpts, context.cleanHtml?.customOpts);
        this.init = this.init.bind(this);
        this.render = this.render.bind(this);
    }

    init() {
        return { render: this.render }
    }

    // render() {
    //     return new Promise((resolve) => {
    //         task('cleanHtml', { src: this.buildDir + '/*.html', dest: this.buildDir }, (filePath, fileString) => {
    //             let fileName = basename(filePath);
    //             fileString = Buffer.from(fileString).toString('utf8');
    //             let string = prettier.format(fileString, { parser: 'html', printWidth: 300 });

    //             string = comb(string, this.combOpts).result;
    //             //remove any empty lines
    //             // let string = fileString.replace(/^\s*[\r\n]/gm, '');

    //             return { fileName: fileName, string: string };
    //         }, resolve);
    //     });
    // }
    render() {
        return new Promise((resolve) => {
            task('cleanHtml', async (utils) => {
                let { getFiles, readFromFile, writeFile } = utils;

                let files = await getFiles(this.buildDir + '/*.html');

                files.forEach(async (file) => {
                    let fileString = await readFromFile(file);
                    fileString = Buffer.from(fileString).toString('utf8');
                    let fileName = basename(file);
                    let string = prettier.format(fileString, { parser: 'html', printWidth: 300 });

                    string = comb(string, this.combOpts).result;
                    await writeFile(this.buildDir, fileName, string);
                });
            }, resolve);
        });
    }
}

export default CleanHtml;