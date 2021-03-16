import React from 'react';
import decorators, { componentDecoratorsWithoutPadding } from '../../config/decorators';
import PureMapSuccessHeader from '../../../../components/Map/SuccessHeader/';

export default {
  title: 'Components/Map/MapSuccessHeader',
  component: PureMapSuccessHeader,
  decorators: componentDecoratorsWithoutPadding,
};

const Template = (args) => <PureMapSuccessHeader {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
Primary.parameters = {
  chromatic: { viewports: [320, 414, 768, 1024, 1800] },
};
