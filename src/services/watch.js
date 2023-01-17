const chokidar = require('chokidar');


class Watch {
    constructor(context) {
        this.chokidar = chokidar;
        this.buildDir = context.buildDir;
        this.templateDir = context.templateDir;
        this.sourceDir = context.sourceDir;
        this.dataDir = context.dataDir;
        this.njkenv = context.njkenv;

        this.init = this.init.bind(this);
    }

    init() {
        const watcher = this.chokidar.watch(this.sourceDir, {
            ignoreInitial: true,
        });

        return watcher;
    }
}

exports.Watch = Watch;