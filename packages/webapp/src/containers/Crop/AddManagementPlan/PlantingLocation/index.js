import React, { useState } from 'react';
import {
  hookFormPersistSelector,
  setPlantingLocationIdManagementPlanFormData,
  setTransplantContainerLocationIdManagementPlanFormData,
  setWildCropLocation,
  resetWildCropLocation
} from '../../../hooks/useHookFormPersist/hookFormPersistSlice';
import useHookFormPersist from '../../../hooks/useHookFormPersist';
import { useDispatch, useSelector } from 'react-redux';
import PurePlantingLocation from '../../../../components/Crop/PlantingLocation';

export default function PlantingLocation({ history, match }) {
  const isTransplantPage =
    match?.path === '/crop/:variety_id/add_management_plan/choose_transplant_location';
  const persistedFormData = useSelector(hookFormPersistSelector);
  const [selectedLocationId, setLocationId] = useState(
    isTransplantPage
      ? persistedFormData?.transplant_container?.location_id
      : persistedFormData?.location_id,
  );
  const [pinLocation, setPinLocation] = useState(persistedFormData?.pinLocation);
  const variety_id = match.params.variety_id;

  const isWildCrop = Boolean(persistedFormData.wild_crop);
  const persistedPath = isTransplantPage
    ? [
      `/crop/${variety_id}/add_management_plan/transplant_container`,
      `/crop/${variety_id}/add_management_plan/planting_method`,
    ]
    : [
      `/crop/${variety_id}/add_management_plan/transplant_container`,
      `/crop/${variety_id}/add_management_plan/planting_method`,
      `/crop/${variety_id}/add_management_plan/planting_date`,
    ];

  if (isWildCrop && !isTransplantPage) {
    persistedPath.push(`/crop/${variety_id}/add_management_plan/next_harvest`);
  }

  const dispatch = useDispatch();

  const onContinue = (data) => {
    dispatch(resetWildCropLocation());
    if (isWildCrop) {
      dispatch(setWildCropLocation(pinLocation));
    } else if(isTransplantPage) {
      dispatch(setTransplantContainerLocationIdManagementPlanFormData(selectedLocationId));
      history.push(`/crop/${variety_id}/add_management_plan/planting_method`);
    } else if (persistedFormData.needs_transplant) {
      dispatch(setPlantingLocationIdManagementPlanFormData(selectedLocationId));
      history.push(`/crop/${variety_id}/add_management_plan/transplant_container`);
    } else {
      dispatch(setPlantingLocationIdManagementPlanFormData(selectedLocationId));
      history.push(`/crop/${variety_id}/add_management_plan/planting_method`);
    }
  };

  const onGoBack = () => {
    if (isTransplantPage) {
      history.push(`/crop/${variety_id}/add_management_plan/transplant_container`);
      dispatch(setTransplantContainerLocationIdManagementPlanFormData(selectedLocationId));
    } else {
      if (isWildCrop) {
        history.push(`/crop/${variety_id}/add_management_plan/next_harvest`);
      } else {
        history.push(`/crop/${variety_id}/add_management_plan/planting_date`);
      }
      dispatch(setPlantingLocationIdManagementPlanFormData(selectedLocationId));
    }
  };

  const onCancel = () => {
    history.push(`/crop/${variety_id}/management`);
  };

  const progress = isTransplantPage ? 55 : 37.5;

  return (
    <>
      <PurePlantingLocation
        selectedLocationId={selectedLocationId}
        onContinue={onContinue}
        onGoBack={onGoBack}
        onCancel={onCancel}
        setLocationId={setLocationId}
        useHookFormPersist={useHookFormPersist}
        persistedPath={persistedPath}
        persistedFormData={persistedFormData}
        transplant={isTransplantPage}
        progress={progress}
        setPinLocation={setPinLocation}
        pinLocation={pinLocation}
      />
    </>
  );
}
