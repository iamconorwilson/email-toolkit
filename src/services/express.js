const express = require('express');
const serveIndex = require('serve-index');
const connectLiveReload = require('connect-livereload');

const { log } = require('../functions/logger.js');

const app = express();

class Express {
    constructor(context) {
        this.express = express;
        this.buildDir = context.buildDir;
        this.templateDir = context.templateDir;
        this.sourceDir = context.sourceDir;
        this.dataDir = context.dataDir;

        this.init = this.init.bind(this);
    }

    init() {
        app.use(connectLiveReload({port: 35729}));
        app.use(express.static(this.buildDir));
        app.use(serveIndex(this.buildDir, {'icons': true}));
        app.listen(3000, () => {
            log('Server started on http://localhost:3000');
        });

        return app;
    }
} 

exports.Express = Express;