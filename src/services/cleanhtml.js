import { comb } from 'email-comb';
import { basename } from 'path';
import prettier from 'prettier';

import { task } from '../functions/task.js';

let defaultOpts = {
    whitelist: [".External*",".ReadMsgBody",".yshortcuts",".Mso*","#outlook",".module*",".video*",".Singleton", "#MessageViewBody"],
    removeHTMLComments: false,
    uglify: false,
    htmlCrushOpts: {removeIndentations: false, removeLineBreaks: false}
}

class CleanHtml {
    constructor(context) {
        this.buildDir = context.dir.build;
        this.sourceDir = context.dir.source;
        this.combOpts = context?.combOpts || defaultOpts;

        this.init = this.init.bind(this);
        this.render = this.render.bind(this);
    }

    init() {
        return { render: this.render }
    }

    render() {
        return new Promise((resolve) => {
            task('cleanHtml', { src: this.buildDir + '/*.html', dest: this.buildDir }, (filePath, fileString) => {
                let fileName = basename(filePath);
                fileString = Buffer.from(fileString).toString('utf8');
                let string = prettier.format(fileString, { parser: 'html' });

                string = comb(string, this.combOpts).result;
                //remove any empty lines
                // let string = fileString.replace(/^\s*[\r\n]/gm, '');

                return { fileName: fileName, string: string };
            }, resolve);
        });
    }
}

export default CleanHtml;