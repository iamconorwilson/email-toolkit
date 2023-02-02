const options = () => {
  return {
    dir: {
        build: "./test/build",
        source: "./test/src",
    },
    nunjucks: {
        customExt: null,
        customFilters: null,
    },
    postcss: {
        plugins: [],
    },
    passthrough: [
        {
            src: './test/src/passthrough/*',
            dest: './test/build/passthrough'
        }
    ]
  };
};

export default options;
