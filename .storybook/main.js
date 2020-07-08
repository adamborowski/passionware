const glob = require('fast-glob')

module.exports = {
  stories: glob([`../packages/*/src/**/*.stories.tsx`], { cwd: __dirname }),
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-actions',
    '@storybook/addon-essentials'
  ]
}
