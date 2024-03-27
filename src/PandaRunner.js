import React from 'react';
import PropTypes from 'prop-types';

import { AutoscrollRunner } from '@tripetto/runner-autoscroll';
import { ChatRunner } from '@tripetto/runner-chat';
import { ClassicRunner } from '@tripetto/runner-classic';
import { Export } from '@tripetto/runner';
import PandaBridge from 'pandasuite-bridge';
import {
  isBoolean,
  isNull,
  isNumber,
  isString,
  isUndefined,
  map,
  pickBy,
} from 'lodash';

function PandaRunner(props) {
  const { formFace, ...other } = props;

  const onSubmit = (instance) => {
    const { fields } = Export.exportables(instance) || [];
    const schema = {
      fields: {
        type: 'Collection',
        value: map(fields, (field) => {
          const f = pickBy(
            field,
            (v) =>
              isUndefined(v) ||
              isNull(v) ||
              isBoolean(v) ||
              isString(v) ||
              isNumber(v),
          );
          f.id = f.key;
          delete f.key;
          return f;
        }),
      },
    };

    PandaBridge.send(PandaBridge.UPDATED, {
      queryable: schema,
    });
    requestAnimationFrame(() => {
      PandaBridge.send('onSubmit', [schema]);
    });
  };

  const customStyle = { width: '100%', height: '100%' };

  switch (formFace) {
    case 'chat':
      return (
        <ChatRunner {...other} onSubmit={onSubmit} customStyle={customStyle} />
      );
    case 'classic':
      return (
        <ClassicRunner
          {...other}
          onSubmit={onSubmit}
          customStyle={customStyle}
        />
      );
    default:
      return (
        <AutoscrollRunner
          {...other}
          onSubmit={onSubmit}
          customStyle={customStyle}
        />
      );
  }
}

PandaRunner.propTypes = {
  formFace: PropTypes.string.isRequired,
};

export default PandaRunner;
