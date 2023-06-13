import chokidar from 'chokidar';

class Watch {
    constructor(context) {
        this.chokidar = chokidar;
        this.sourceDir = context.dir.src;
        this.dataDir = context.dir.data;

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