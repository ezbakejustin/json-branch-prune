const supportedOptions = [null, "", "{}", "[]"];

(() => {
  let options;
  const exec = (input, optionsArray) => {
    if (!optionsArray) {
      optionsArray = supportedOptions;
    } else {
      optionsArray = checkArguments(optionsArray);
    }
    options = optionsArray;

    input = prune(input);
    input = isUndefined(input) || matchesOptions(input) ? {} : input;

    return JSON.parse(JSON.stringify(input));
  };

  const prune = input => {
    if (matchesOptions(input)) input = undefined;

    if (input instanceof Array) {
      input.forEach((item, index) => {
        input[index] = prune(item);
      });
      while (input.indexOf(undefined) > -1) {
        input.splice(input.indexOf(undefined), 1);
      }
    } else if (input instanceof Object) {
      let keys = Object.keys(input);
      keys.forEach(key => {
        let value = input[key];
        value = prune(value);
        if (value instanceof Object) {
          value = prune(value);
          // if (isEmptyObject(value)) value = undefined;
        }
        input[key] = value;
      });
    }

    return input;
  };

  const isUndefined = input => {
    return input === undefined;
  };

  const matchesOptions = input => {
    return (
      isNull(input) ||
      isEmptyString(input) ||
      isEmptyObject(input) ||
      isEmptyArray(input)
    );
  };

  const isNull = input => {
    if (options.indexOf(null) === -1) return false;
    return input === null;
  };

  const isEmptyString = input => {
    if (options.indexOf("") === -1) return false;
    return input === "";
  };

  const isEmptyObject = input => {
    if (options.indexOf("{}") === -1) return false;
    return JSON.stringify(input) === "{}";
  };

  const isEmptyArray = input => {
    if (options.indexOf("[]") === -1) return false;
    return input instanceof Array && input.length === 0;
  };

  const checkArguments = options => {
    options.forEach((option, index) => {
      if (supportedOptions.indexOf(option) === -1) options[index] = undefined;
    });

    return JSON.parse(JSON.stringify(options));
  };

  module.exports = exec;
})();
