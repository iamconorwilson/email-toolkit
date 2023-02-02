import nunjucks from 'nunjucks';
import { readFileSync } from 'fs';
import { join, basename } from 'path';

import { getData, getFilepaths } from '../functions/getdata.js';
import { task } from '../functions/task.js';

class Nunjucks {
    constructor(context) {
        this.nunjucks = nunjucks;
        //directories
        this.buildDir = context.dir.build;
        this.sourceDir = context.dir.source;
        this.dataDir = context.dir.data || join(this.sourceDir, 'data');

        //environment
        this.customExt = context.nunjucks.customExt;
        this.customFilters = context.nunjucks.customFilters;
        this.customContext = context.nunjucks?.customTemplates || [];

        this.templates = [this.sourceDir, join(this.buildDir, 'css')].concat(this.customContext);

        this.init = this.init.bind(this);
        this.render = this.render.bind(this);
    }

    init() {
        this.env = this.nunjucks.configure(this.templates, {
            autoescape: true,
            noCache: true
        });

        //if custom extensions are passed, add them to the environment
        if (this.customExt) {
            this.customExt.forEach((ext) => {
                this.env.addExtension(ext.name, ext);
            });
        }

        //if custom filters are passed, add them to the environment
        if (this.customFilters) {
            this.customFilters.forEach((filter) => {
                this.env.addFilter(filter.name, filter);
            });
        }

        return { render: this.render };

    }

    render() {
        return new Promise((resolve) => {
            task('nunjucksRender', { src: this.sourceDir + '/*.njk', dest: this.buildDir }, (filePath, fileString) => {
                let data = {css: getFilepaths(this.buildDir, 'css'), ...getData(this.dataDir)};
                let fileName = basename(filePath, '.njk') + '.html';
                let string = this.env.render(filePath, data);
                return { fileName: fileName, string: string };
            }, resolve);
        });
    }
}

export default Nunjucks;