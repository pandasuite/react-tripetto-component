import PandaBridge from 'pandasuite-bridge';
import { useEffect, useState } from 'react';

export default function usePropertiesFromEmbed(data) {
  const [formFace, setFormFace] = useState(null);
  const [definition, setDefinition] = useState(null);
  const [styles, setStyles] = useState(null);

  useEffect(() => {
    if (!PandaBridge.isStudio) {
      return;
    }
    const typeRegex = new RegExp(/Tripetto([^\\.]+)\.run\((.*)\)/gs);
    const optionsRegex = new RegExp(/(\w+):(.*)/g);

    const match = typeRegex.exec(data);
    if (match) {
      setFormFace(match[1].toLowerCase());
      let optionResult;

      // eslint-disable-next-line no-cond-assign
      while ((optionResult = optionsRegex.exec(match[2])) !== null) {
        if (['definition', 'styles'].indexOf(optionResult[1]) !== -1) {
          try {
            const value = JSON.stringify(
              JSON.parse(optionResult[2].replace(/(.*),([ \t]+)?$/g, '$1')),
              undefined,
              4,
            );
            if (optionResult[1] === 'definition') {
              setDefinition(value);
            } else {
              setStyles(value);
            }
            // eslint-disable-next-line no-empty
          } catch (e) {}
        }
      }
    } else {
      const studioTypeRegex = new RegExp(/runner: Tripetto(.*?),/gs);
      const tokenRegex = new RegExp(/token: "(.*?)"/gs);

      const studioMatch = tokenRegex.exec(data);
      if (studioMatch) {
        const formFaceMatch = studioTypeRegex.exec(data);
        setFormFace(
          (formFaceMatch && formFaceMatch[1].toLowerCase()) || 'classic',
        );

        fetch('https://tripetto.app/run/definition', {
          headers: {
            'Tripetto-Runner-Token': studioMatch[1],
          },
        }).then((response) => {
          response.json().then((json) => {
            const { definition: definitionJson } = json;
            setDefinition(definitionJson);
          });
        });

        fetch('https://tripetto.app/run/styles', {
          headers: {
            'Tripetto-Runner-Token': studioMatch[1],
          },
        }).then((response) => {
          response.json().then((json) => {
            const { styles: stylesJson } = json;
            setStyles(stylesJson);
          });
        });
      }
    }
  }, [data]);

  if (formFace === null || definition === null || styles === null) {
    return null;
  }

  return {
    formFace,
    definition,
    styles,
  };
}
