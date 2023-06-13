const options = () => {
  return {
    dir: {
        src: "./src",
        dest: "./build",
    },
    passthrough: [
        {
            src: './src/sass/passthrough/*',
            dest: './build/css'
        }
    ],
    server: {
        qrCode: true,
        port: 3030
    }
  };
};

module.exports = options;
