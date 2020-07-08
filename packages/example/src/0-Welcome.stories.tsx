import React from 'react';
import { linkTo } from '@storybook/addon-links';
import { Welcome } from './__stories__/Welcome';

export default {
  title: 'Welcome',
  component: Welcome,
};

export const ToStorybook = () => <Welcome showApp={linkTo('Button')} />;

ToStorybook.storyName = 'to Storybook';
