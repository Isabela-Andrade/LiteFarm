import React from 'react';
import PureNextHarvest from '../../../components/Crop/NextHarvest';
import decorators from '../config/decorators';

export default {
  title: 'Form/ManagementPlan/NextHarvest',
  component: PureNextHarvest,
  decorators: decorators,
};

const Template = (args) => <PureNextHarvest {...args} />;

export const Management = Template.bind({});
Management.args = {
  onGoBack: () => { },
  onContinue: () => { },
  onCancel: () => { },
  useHookFormPersist: () => { },
  persistedFormData: {},
  system: 'metric',
};