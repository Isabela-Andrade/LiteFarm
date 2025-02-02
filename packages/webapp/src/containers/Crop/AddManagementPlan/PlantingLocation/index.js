import React, { useState } from 'react';
import {
  hookFormPersistSelector,
  setDefaultInitialLocation,
  setPlantingLocationIdManagementPlanFormData,
  setTransplantContainerLocationIdManagementPlanFormData,
  setWildCropLocation,
} from '../../../hooks/useHookFormPersist/hookFormPersistSlice';
import useHookFormPersist from '../../../hooks/useHookFormPersist';
import { useDispatch, useSelector } from 'react-redux';
import PurePlantingLocation from '../../../../components/Crop/PlantingLocation';
import TransplantSpotlight from './TransplantSpotlight';

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
  const isInGround = Boolean(persistedFormData.in_ground);
  const isTransplant = Boolean(persistedFormData.needs_transplant);

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

  if (isTransplant && isInGround) {
    persistedPath.push(`/crop/${variety_id}/add_management_plan/inground_transplant_method`);
  }

  const dispatch = useDispatch();
  //TODO: remove [selectedLocationId, setLocationId] and use state from persistedHookForm instead
  const onContinue = (data) => {
    if (isTransplantPage) {
      dispatch(setTransplantContainerLocationIdManagementPlanFormData(selectedLocationId));
      history.push(`/crop/${variety_id}/add_management_plan/planting_method`);
    } else if (isWildCrop && !isTransplant) {
      pinLocation
        ? setWildCropLocation(pinLocation)
        : dispatch(setPlantingLocationIdManagementPlanFormData(selectedLocationId));
      dispatch(setPlantingLocationIdManagementPlanFormData(selectedLocationId));
      history.push(`/crop/${variety_id}/add_management_plan/name`);
    } else if (isWildCrop && isTransplant) {
      pinLocation
        ? setWildCropLocation(pinLocation)
        : dispatch(setPlantingLocationIdManagementPlanFormData(selectedLocationId));
      dispatch(setPlantingLocationIdManagementPlanFormData(selectedLocationId));
      history.push(`/crop/${variety_id}/add_management_plan/choose_transplant_location`);
    } else if (isInGround && isTransplant) {
      dispatch(setPlantingLocationIdManagementPlanFormData(selectedLocationId));
      history.push(`/crop/${variety_id}/add_management_plan/inground_transplant_method`);
    } else {
      dispatch(setPlantingLocationIdManagementPlanFormData(selectedLocationId));
      history.push(`/crop/${variety_id}/add_management_plan/planting_method`);
    }
  };

  const onGoBack = () => {
    if (isTransplantPage) {
      console.log(isInGround);
      if (isInGround) {
        dispatch(setTransplantContainerLocationIdManagementPlanFormData(selectedLocationId));
        history.push(`/crop/${variety_id}/add_management_plan/inground_transplant_method`);
      } else {
        dispatch(setTransplantContainerLocationIdManagementPlanFormData(selectedLocationId));
        history.push(`/crop/${variety_id}/add_management_plan/transplant_container`);
      }
    } else {
      dispatch(setPlantingLocationIdManagementPlanFormData(selectedLocationId));
      if (isWildCrop) {
        history.push(`/crop/${variety_id}/add_management_plan/next_harvest`);
      } else {
        history.push(`/crop/${variety_id}/add_management_plan/planting_date`);
      }
    }
  };

  const onCancel = () => {
    history.push(`/crop/${variety_id}/management`);
  };

  const progress = isTransplantPage ? 50 : 37.5;

  const { needs_transplant, seeding_type, in_ground } = persistedFormData;

  const onSelectCheckbox = (e) => {
    if (!e?.target?.checked) {
      dispatch(setDefaultInitialLocation(undefined));
    } else {
      dispatch(setDefaultInitialLocation(selectedLocationId));
    }
  };

  useHookFormPersist(persistedPath, () => ({}));

  return (
    <>
      <PurePlantingLocation
        selectedLocationId={selectedLocationId}
        onContinue={onContinue}
        onGoBack={onGoBack}
        onCancel={onCancel}
        setLocationId={setLocationId}
        useHookFormPersist={useHookFormPersist}
        persistedFormData={persistedFormData}
        transplant={isTransplantPage}
        progress={progress}
        setPinLocation={setPinLocation}
        pinLocation={pinLocation}
        onSelectCheckbox={onSelectCheckbox}
      />
      {needs_transplant && !in_ground && <TransplantSpotlight seedingType={seeding_type} />}
    </>
  );
}
