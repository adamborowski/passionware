import pluginTester from 'babel-plugin-tester';
import plugin from 'babel-plugin-macros';
import prettier from 'prettier';
import path from 'path';

jest.mock('./extractStoryPath', () => ({
  extractStoryPath: jest.fn().mockReturnValue('[generated title]'),
}));

pluginTester({
  plugin,
  snapshot: true,
  babelOptions: {
    filename: path.join(__dirname, '/deep/AwesomeComponent.stories.js'),
  },
  formatResult: result =>
    prettier.format(result, { trailingComma: 'es5', parser: 'babel' }),
  tests: {
    'no usage 1': 'import {title} from "../../src/macro";',
    'no usage 2': 'import anythingFooBar from "../../src/macro";',
    'basic usage - title as shortened object key-value form ': `
      import {title} from "../../src/macro";
      export default {title};
    `,
    'basic usage - title as object value ': `
      import {title} from "../../src/macro";
      export default {title: title};
    `,
    'basic usage - read as variable': `
      import {title} from "../../src/macro";
      const actualTitle = title;
    `,
    'advanced usage - story exports more data ': `
      import React from 'react';
      import {title} from "../../src/macro";
      export const Story1 = ()=> "A story";
      export default {title: title, decorators: [1,2,3]};
    `,
  },
});
