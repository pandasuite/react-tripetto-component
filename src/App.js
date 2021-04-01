import React from 'react';
import './App.css';

import { usePandaBridge } from 'pandasuite-bridge-react';
import PandaBridge from 'pandasuite-bridge';

import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import isString from 'lodash/isString';
import merge from 'lodash/merge';

import TripettoParser from './utils/TripettoParser';
import PandaRunner from './PandaRunner';
import usePrevious from './hooks/usePrevious';

function App() {
  const { properties } = usePandaBridge(
    {
      actions: {
        reload: () => {
          window.location.reload();
        },
      },
    },
  );
  const { embed } = properties || {};
  const prevEmbed = usePrevious(embed);
  const {
    formFace, definition, styles,
  } = TripettoParser.propertiesFromEmbed(embed) || {};

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
        styles={merge({}, safeParse(styles), { noBranding: true })}
      />
    </div>
  );
}

export default App;
