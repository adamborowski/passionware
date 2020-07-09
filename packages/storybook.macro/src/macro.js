const { createMacro } = require('babel-plugin-macros');
const findPackage = require('find-package-json');
const { extractStoryPath } = require('./extractStoryPath');

module.exports = createMacro(storybookTitleMacros);

function storybookTitleMacros({ references, state, babel }) {
  const result = generateTitle({ state, babel });
  (references.title || []).forEach(referencePath => {
    referencePath.replaceWith(result);
  });
}

function generateTitle({ state, babel }) {
  const fileName = state.file.opts.filename;
  const packageFinder = findPackage(fileName);
  const packageJson = packageFinder.next();
  const rootJson = packageFinder.next();

  return babel.types.stringLiteral(extractStoryPath(rootJson.filename, packageJson.filename, fileName, packageJson.value.name));
}
