# @passionware/storybook.macro

A macro that returns automatically generated story title for storybook.

## Installation

Install the package using Yarn:

```sh
yarn add @passionware/storybook.macro
```

You will need to install `babel-plugin-macros` and configure babel to enable macros:
https://github.com/kentcdodds/babel-plugin-macros/blob/master/other/docs/user.md

## Usage

You can import macro and use in your story file. It will be resolved to story title.
You can use it for any method of creating stories: `storiesOf` or Component Story Format.

### storiesOf

```javascript
// packages/ui/components/myproject/src/components/Author.stories.js
import { title } from '@passionware/storybook.macro'
import { storiesOf } from '@storybook/react'

storiesOf(title, module).add(/*story*/)
```

will create

```javascript
import { storiesOf } from '@storybook/react'

storiesOf(
  'packages|ui components/myproject/components/Author',
  module
).add(/*story*/)
```

### Component Story Format

You can also use this macro to decorate CSF-like stories

```javascript
import { title } from '@passionware/storybook.macro'
export default { title }
export const MyStory = () => 'hello world'
```
