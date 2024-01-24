const options = () => {
  return {
    dir: {
        src: "./test/src",
        dest: "./test/build",
    },
    passthrough: [
        {
            src: './test/src/sass/passthrough/*',
            dest: './test/build/css'
        },
        {
          src: './test/src/images/**/(!*.psd)',
          dest: './test/build/images'
        }
    ],
    server: {
        qrCode: true,
        port: 3030
    }
  };
};

export default options;