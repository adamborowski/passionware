import { ExampleComponent } from './index'
import React, { FC } from 'react'

export default { title: 'react-fast-context', component: ExampleComponent }

export const Default: FC<{ text: string }> = ({ text }) => (
  <ExampleComponent text={text} />
)
