const path = require('path');
const _ = require('lodash');

module.exports = {
  extractStoryPath: (rootPackagePath, actualPackagePath, storyPath, packageName) => {
    const packageNameUnscoped = packageName.replace(/^@[A-z]+\//, '');

    const rootDirectory = path.normalize(path.resolve(rootPackagePath, '..'));
    const packageDirectory = path.normalize(path.resolve(actualPackagePath, '..'));

    const pathFromRootToPackage = path.normalize(path.relative(rootDirectory, packageDirectory));
    const pathFromPackageToFile = path.normalize(path.relative(packageDirectory, storyPath));

    const packagePath = pathFromRootToPackage.split(path.sep).slice(0, -1);
    const [storyKind, ...restOfPackagePath] = packagePath;

    const storyTitle = extractStoryTitleFromPathRelativeToPackage(pathFromPackageToFile, packageNameUnscoped);

    return `${_.capitalize(storyKind)}/${[restOfPackagePath.join(' '), packageNameUnscoped, ...storyTitle]
      .filter(segment => segment !== '')
      .join('/')}`;
  },
};

/**
 * For index stories it returns title to match parent folder story
 * @param path if ends at index - it will be shortened
 * @param packageNameUnscoped if path equals to packageNameUnscoped it also will be shortened
 * @return {*[]}
 */
const stripIndexStories = (path, packageNameUnscoped) => {
  const pathCopy = [...path];
  const length = pathCopy.length;
  const stripForIndexStories = pathCopy[length - 1] === 'index';
  const stripForStoriesWithNameSameAsPackageName = pathCopy.length === 1 && pathCopy[0] === packageNameUnscoped;
  const stripForStoriesWithNameSameAsFolderName = pathCopy[length - 1] === pathCopy[length - 2];
  if (stripForIndexStories || stripForStoriesWithNameSameAsPackageName | stripForStoriesWithNameSameAsFolderName) {
    pathCopy.pop();
  }
  return pathCopy;
};

/**
 * It gets story path relative to package root (ie. src/components/Foo/index.stories) and returns a user-facing path (ie. components/Foo)
 */
const extractStoryTitleFromPathRelativeToPackage = (pathFromPackageToFile, packageNameUnscoped) =>
  stripIndexStories(
    pathFromPackageToFile
      .replace(/\.stories(\.dev)?\.\w+$/, '')
      .split(path.sep)
      .slice(1),
    packageNameUnscoped
  );
