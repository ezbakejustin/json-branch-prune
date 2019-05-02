const defaultOptions = [null, "", "{}", "[]"];

(() => {
  let options;
  const exec = (input, optionsArray) => {
    if (!optionsArray) {
      optionsArray = defaultOptions;
    }
    options = optionsArray;

    input = prune(input);
    input = isUndefined(input) || matchesOptions(input) ? {} : input;

    return JSON.parse(JSON.stringify(input));
  };

  const prune = input => {
    if (matchesOptions(input)) {
      input = undefined;
    }

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
          if (matchesOptions(value)) value = undefined;
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
      options.indexOf(input) > -1 || options.indexOf(JSON.stringify(input)) > -1
    );
  };

  module.exports = exec;
})();
