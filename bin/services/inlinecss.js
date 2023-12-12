import inlineCss from 'inline-css';
import { basename } from 'path';

import ip from 'ip';
const { address } = ip;

import { task } from '../functions/task.js';

class CssInline {
    constructor(context, services) {
        this.inlineCss = inlineCss;
        this.buildDir = context.dir.dest;
        this.sourceDir = context.dir.src;

        this.port = services.express.port ?? 3030;

        this.inlineOpts =  {
            url: `http://localhost:${this.port}`,
            applyStyleTags: false,
            removeStyleTags: false,
            applyLinkTags: true,
        }

        this.init = this.init.bind(this);
        this.render = this.render.bind(this);
    }

    init() {
        return { render: this.render }
    }
    async render() {
        await task('cssInline', async (utils) => {
            let { getFiles, readFromFile, writeFile } = utils;

            let files = await getFiles(this.buildDir + '/*.html');

            for (const file of files) {
                let fileString = await readFromFile(file);
                let fileName = basename(file);
                let string = '';
                await this.inlineCss(fileString, this.inlineOpts).then((html) => {string = html});
                await writeFile(this.buildDir, fileName, string);
            };
        });
    }
}

export default CssInline;