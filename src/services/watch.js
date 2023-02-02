import chokidar from 'chokidar';

class Watch {
    constructor(context) {
        this.chokidar = chokidar;
        this.buildDir = context.dir.build;
        this.templateDir = context.templateDir;
        this.sourceDir = context.dir.source;
        this.dataDir = context.dir.data;
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

export default Watch;