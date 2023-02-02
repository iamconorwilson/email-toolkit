import inlineCss from 'inline-css';
import { basename } from 'path';

import { task } from '../functions/task.js';

class CssInline {
    constructor(context) {
        this.inlineCss = inlineCss;
        this.buildDir = context.dir.build;
        this.sourceDir = context.dir.source;
        this.inlineOpts =  {
            url: 'http://localhost:3000',
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

    render() {
        return new Promise((resolve) => {
            task('cssInline', { src: this.buildDir + '/*.html', dest: this.buildDir }, async (filePath, fileString) => {
                let string = '';
                await this.inlineCss(fileString, this.inlineOpts).then((html) => {string = html});
                let fileName = basename(filePath);
                return { fileName: fileName, string: string };
            }, resolve);
        });
    }
}

export default CssInline;