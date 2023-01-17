const nunjucks = require('nunjucks');
const fs = require('fs');
const path = require('path');

class Nunjucks {
    constructor(context) {
        this.nunjucks = nunjucks;
        //directories
        this.buildDir = context.buildDir;
        this.templateDir = context.templateDir;
        this.sourceDir = context.sourceDir;
        this.dataDir = context.dataDir;

        //environment
        this.customExt = context.customExt;
        this.customFilters = context.customFilters;

        this.init = this.init.bind(this);
    }

    init() {
        this.env = this.nunjucks.configure([this.templateDir, path.join(this.buildDir, 'css')], {
            autoescape: true
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

        return this.env

    }
}

exports.Nunjucks = Nunjucks;