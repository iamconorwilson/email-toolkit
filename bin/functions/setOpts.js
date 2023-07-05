import path from "path";

const setOpts = async () => {
  let options;
  let defaultOptions = {
    dir: {
      dest: "./build",
      src: "./src",
    },
  };

  try {
    const imported = await import(
      path.resolve(process.cwd(), "./build.config.js")
    );
    options = imported.default();
  } catch (e) {
    console.log(e);
    log("No build.config.js file found. Using default options.", "warn");
    options = defaultOptions;
  }

  for (const [key, value] of Object.entries(defaultOptions)) {
    if (!options.hasOwnProperty(key)) {
      log(
        `No ${key} option found in build.config.js. Using default value: ${JSON.stringify(
          value
        )}`,
        "warn"
      );
      options[key] = value;
    } else if (typeof value === "object") {
      for (const [subkey, subvalue] of Object.entries(value)) {
        if (!options[key].hasOwnProperty(subkey)) {
          log(
            `No ${subkey} option found in build.config.js. Using default value: ${subvalue}`,
            "warn"
          );
          options[key][subkey] = subvalue;
        }
      }
    }
  }

  Object.entries(options.dir).map(
    ([key, value]) => (options.dir[key] = path.resolve(value))
  );

  return options;
};

export { setOpts };
