import { extractStoryPath } from './extractStoryPath';
import path from 'path';

describe.each`
  stories
  ${'stories'}
  ${'stories.dev'}
`('extractStoryPath - $stories', ({ stories }) => {
  it.each`
    packageJsonDirectory                                          | fileRelativePath                                          | expectedStoryTitle
    ${'/passionware/packages/dev/some-test'}                      | ${`src/utils/super.${stories}.ts`}                        | ${'Packages/dev/test-package/utils/super'}
    ${'/passionware/packages/ui/components/tabs'}                 | ${`src/Tabs.${stories}.ts`}                               | ${'Packages/ui components/test-package/Tabs'}
    ${'/passionware/packages/ui/components/tabs'}                 | ${`stories/Tabs.${stories}.ts`}                           | ${'Packages/ui components/test-package/Tabs'}
    ${'/passionware/packages/ui/components/transformations-page'} | ${`src/components/CodeSnippet/Tabs.${stories}.js`}        | ${'Packages/ui components/test-package/components/CodeSnippet/Tabs'}
    ${'/passionware/packages/ui/components/transformations-page'} | ${`src/components/CodeSnippet/CodeSnippet.${stories}.js`} | ${'Packages/ui components/test-package/components/CodeSnippet'}
    ${'/passionware/apps/collection-share'}                       | ${`src/components/CodeSnippet/Tabs.${stories}.js`}        | ${'Apps/test-package/components/CodeSnippet/Tabs'}
    ${'/passionware/packages/ui/components/button'}               | ${`stories/index.${stories}.js`}                          | ${'Packages/ui components/test-package'}
    ${'/passionware/packages/ui/components/button'}               | ${`src/index.${stories}.js`}                              | ${'Packages/ui components/test-package'}
    ${'/passionware/packages/ui/components/button'}               | ${`stories/test-package.${stories}.js`}                   | ${'Packages/ui components/test-package'}
    ${'/passionware/packages/ui/components/button'}               | ${`src/test-package.${stories}.js`}                       | ${'Packages/ui components/test-package'}
  `(
    'when packageJsonDirectory is $packageJsonDirectory and relative path is $fileRelativePath',
    ({ packageJsonDirectory, fileRelativePath, expectedStoryTitle }) => {
      const filePath = path.resolve(packageJsonDirectory, fileRelativePath);

      expect(
        extractStoryPath(
          '/passionware/package.json',
          packageJsonDirectory + '/package.json',
          filePath,
          '@passionware/test-package'
        )
      ).toBe(expectedStoryTitle);
    }
  );
});
