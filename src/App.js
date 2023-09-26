import React from 'react';
import './App.css';

import { usePandaBridge } from 'pandasuite-bridge-react';
import PandaBridge from 'pandasuite-bridge';

import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import isString from 'lodash/isString';
import merge from 'lodash/merge';

import PandaRunner from './PandaRunner';
import usePrevious from './hooks/usePrevious';
import usePropertiesFromEmbed from './hooks/usePropertiesFromEmbed';

function App() {
  const { properties, setProperty } = usePandaBridge(
    {
      actions: {
        reload: () => {
          window.location.reload();
        },
      },
    },
  );
  const { embed } = properties || {};
  let {
    formFace, definition, styles,
  } = properties || {};

  const prevEmbed = usePrevious(embed);
  const {
    formFace: formFaceEmbed, definition: definitionEmbed, styles: stylesEmbed,
  } = usePropertiesFromEmbed(embed) || {};

  const updateProperty = (propertyName, localValue, embedValue) => {
    if (embedValue && localValue !== embedValue) {
      setProperty(propertyName, embedValue);
      return embedValue;
    }
    return localValue;
  };

  formFace = updateProperty('formFace', formFace, formFaceEmbed);
  definition = updateProperty('definition', definition, definitionEmbed);
  styles = updateProperty('styles', styles, stylesEmbed);

  if (!properties || !formFace) {
    return null;
  }

  if (PandaBridge.isStudio && !isEmpty(prevEmbed) && !isEqual(prevEmbed, embed)) {
    window.location.reload();
  }

  const safeParse = (data) => {
    try {
      if (isString(data)) {
        return JSON.parse(data);
      }
    } catch (e) {
      return {};
    }
    return data;
  };

  return (
    <div className="App">
      <PandaRunner
        formFace={formFace}
        definition={safeParse(definition)}
        styles={merge({}, safeParse(styles))}
      />
    </div>
  );
}

export default App;
