import React from 'react';
import decorators from '../config/decorators';
import PurePlantingLocation from '../../../components/Crop/PlantingLocation';

export default {
  title: 'Page/PlantingLocation',
  decorators: decorators,
  component: PurePlantingLocation,
};

const Template = (args) => <PurePlantingLocation {...args} />;

export const PlantingLocationPage = Template.bind({});
PlantingLocationPage.args = {
  selectedLocationId: {},
  onContinue: () => {},
  onGoBack: () => {},
  onCancel: () => {},
  setLocationId: () => {},
  useHookFormPersist: () => {},
  persistedFormData: { needs_transplant: 'true' },
  persistedPath: [],
};

export const PlantingLocationPin = Template.bind({});
PlantingLocationPin.args = {
  selectedLocationId: {},
  onContinue: () => {},
  onGoBack: () => {},
  onCancel: () => {},
  setLocationId: () => {},
  useHookFormPersist: () => {},
  persistedFormData: { wild_crop: 'true', in_ground: 'true' },
  persistedPath: [],
};
