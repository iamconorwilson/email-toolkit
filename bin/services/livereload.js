import livereload from 'livereload';

class LiveReload {
    constructor(context) {
        this.livereload = livereload;

        this.init = this.init.bind(this);
    }

    init() {
        const server = this.livereload.createServer();
        return server;
    }


}

export default LiveReload;