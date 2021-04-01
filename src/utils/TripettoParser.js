export default {
  propertiesFromEmbed: (data) => {
    const typeRegex = new RegExp(/Tripetto([^\\.]+)\.run\((.*)\)/gs);
    const optionsRegex = new RegExp(/(\w+):(.*)/g);

    const match = typeRegex.exec(data);
    if (match) {
      const properties = {
        formFace: match[1].toLowerCase(),
      };
      let optionResult;

      // eslint-disable-next-line no-cond-assign
      while ((optionResult = optionsRegex.exec(match[2])) !== null) {
        if (['definition', 'styles'].indexOf(optionResult[1]) !== -1) {
          try {
            properties[optionResult[1]] = JSON.stringify(JSON.parse(optionResult[2].replace(/(.*),([ \t]+)?$/g, '$1')), undefined, 4);
          // eslint-disable-next-line no-empty
          } catch (e) {}
        }
      }
      return properties;
    }
    return null;
  },
};
