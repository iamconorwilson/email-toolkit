const sass = require('sass');

class Sass {
    constructor(context) {
        this.sass = sass;
        this.buildDir = context.buildDir;
        this.sourceDir = context.sourceDir;
        this.init = this.init.bind(this);
    }

    init() {
        return this.sass;
    }
}

exports.Sass = Sass;