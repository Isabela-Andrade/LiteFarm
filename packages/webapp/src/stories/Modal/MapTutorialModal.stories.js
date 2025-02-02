import React from 'react';
import MapTutorialModal from '../../components/Modals/MapTutorialModal';
import { componentDecorators } from '../Pages/config/decorators';
import { chromaticSmallScreen } from '../Pages/config/chromatic';

export default {
  title: 'Components/Modals/MapTutorialModal',
  decorators: componentDecorators,
  component: MapTutorialModal,
};

const Template = (args) => <MapTutorialModal {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  title: 'Tutorial title',
  steps: ['Step 1', 'Step 2', 'Step 3'],
};
Primary.parameters = {
  ...chromaticSmallScreen,
};

export const NoBullet = Template.bind({});
NoBullet.args = {
  title: 'Tutorial title',
  steps: ['Step 1', 'Step 2', 'Step 3'],
  hasNoBullet: true,
};
NoBullet.parameters = {
  ...chromaticSmallScreen,
};
