import React, { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import { useTranslation } from 'react-i18next';
import { Main } from '../../Typography';
import Input, { getInputErrors, integerOnKeyDown } from '../../Form/Input';
import Form from '../../Form';
import Button from '../../Form/Button';
import { useForm } from 'react-hook-form';
import { container_plant_spacing, container_planting_depth, seedYield } from '../../../util/unit';
import Unit from '../../Form/Unit';
import MultiStepPageTitle from '../../PageTitle/MultiStepPageTitle';
import RadioGroup from '../../Form/RadioGroup';
import { cloneObject } from '../../../util';
import PropTypes from 'prop-types';
import { HideForm } from '../../HideForm/HideForm';

export default function PureRowMethod({
  onGoBack,
  onCancel,
  onContinue,
  system,
  variety,
  useHookFormPersist,
  persistedFormData,
  persistPath,
}) {
  const { t } = useTranslation(['translation']);
  const {
    register,
    handleSubmit,
    getValues,
    watch,
    control,
    setValue,
    setError,
    formState: { errors, isValid },
  } = useForm({
    shouldUnregister: false,
    mode: 'onChange',
    defaultValues: cloneObject(persistedFormData),
  });

  useHookFormPersist(persistPath, getValues);

  const progress = 75;

  const row_prefix = 'rows.';

  const SAME_LENGTH = row_prefix + 'same_length';
  const NUMBER_OF_ROWS = row_prefix + 'number_of_rows';
  const LENGTH_OF_ROW = row_prefix + 'row_length';
  const LENGTH_OF_ROW_UNIT = row_prefix + 'row_length_unit';
  const PLANT_SPACING = row_prefix + 'plant_spacing';
  const PLANT_SPACING_UNIT = row_prefix + 'plant_spacing_unit';
  const TOTAL_LENGTH = row_prefix + 'total_rows_length';
  const TOTAL_LENGTH_UNIT = row_prefix + 'total_rows_length_unit';
  const ESTIMATED_SEED = row_prefix + 'estimated_seeds';
  const ESTIMATED_SEED_UNIT = row_prefix + 'estimated_seeds_unit';
  const ESTIMATED_YIELD = row_prefix + 'estimated_yield';
  const ESTIMATED_YIELD_UNIT = row_prefix + 'estimated_yield_unit';

  const same_length = watch(SAME_LENGTH);
  const num_of_rows = watch(NUMBER_OF_ROWS);
  const length_of_row = watch(LENGTH_OF_ROW);
  const total_length = watch(TOTAL_LENGTH);
  const plant_spacing = watch(PLANT_SPACING);

  const IsValidNumberInput = (number) => number === 0 || number > 0;

  const [showEstimatedValue, setShowEstimatedValue] = useState(false);

  useEffect(() => {
    const { average_seed_weight = 0, yield_per_plant = 0 } = variety;
    if (
      same_length &&
      IsValidNumberInput(num_of_rows) &&
      IsValidNumberInput(length_of_row) &&
      IsValidNumberInput(plant_spacing)
    ) {
      const estimated_seed_required =
        ((num_of_rows * length_of_row) / plant_spacing) * average_seed_weight;
      const estimated_yield = ((num_of_rows * length_of_row) / plant_spacing) * yield_per_plant;
      setValue(ESTIMATED_SEED, estimated_seed_required);
      setValue(ESTIMATED_YIELD, estimated_yield);
      setShowEstimatedValue(true);
    } else if (
      !same_length &&
      IsValidNumberInput(total_length) &&
      IsValidNumberInput(plant_spacing)
    ) {
      const estimated_seed_required = (total_length / plant_spacing) * average_seed_weight;
      const estimated_yield = (total_length / plant_spacing) * yield_per_plant;
      setValue(ESTIMATED_SEED, estimated_seed_required);
      setValue(ESTIMATED_YIELD, estimated_yield);
      setShowEstimatedValue(true);
    } else {
      setShowEstimatedValue(false);
    }
  }, [num_of_rows, length_of_row, total_length, plant_spacing, same_length]);

  return (
    <Form
      buttonGroup={
        <Button type={'submit'} disabled={!isValid} fullLength>
          {t('common:CONTINUE')}
        </Button>
      }
      onSubmit={handleSubmit(onContinue)}
    >
      <MultiStepPageTitle
        onGoBack={onGoBack}
        onCancel={onCancel}
        cancelModalTitle={t('MANAGEMENT_PLAN.MANAGEMENT_PLAN_FLOW')}
        value={progress}
        title={t('MANAGEMENT_PLAN.ADD_MANAGEMENT_PLAN')}
        style={{ marginBottom: '24px' }}
      />
      <Main style={{ paddingBottom: '24px' }}>{t('MANAGEMENT_PLAN.ROW_METHOD.SAME_LENGTH')}</Main>
      <div>
        <RadioGroup hookFormControl={control} name={SAME_LENGTH} required />
      </div>
      {(same_length === true || same_length === false) && (
        <>
          {same_length && (
            <>
              <div className={styles.row}>
                <Input
                  label={t('MANAGEMENT_PLAN.ROW_METHOD.NUMBER_OF_ROWS')}
                  hookFormRegister={register(NUMBER_OF_ROWS, {
                    required: true,
                    valueAsNumber: true,
                  })}
                  style={{ flexGrow: 1 }}
                  type={'number'}
                  onKeyDown={integerOnKeyDown}
                  max={999}
                  errors={getInputErrors(errors, NUMBER_OF_ROWS)}
                />
                <Unit
                  style={{ paddingLeft: '16px' }}
                  register={register}
                  label={t('MANAGEMENT_PLAN.ROW_METHOD.LENGTH_OF_ROW')}
                  name={LENGTH_OF_ROW}
                  displayUnitName={LENGTH_OF_ROW_UNIT}
                  errors={errors[LENGTH_OF_ROW]}
                  unitType={container_planting_depth}
                  system={system}
                  hookFormSetValue={setValue}
                  hookFormGetValue={getValues}
                  hookFromWatch={watch}
                  control={control}
                  required
                  style={{ flexGrow: 1 }}
                />
              </div>
            </>
          )}
          {!same_length && (
            <div style={{ marginBottom: '40px' }}>
              <Unit
                register={register}
                label={t('MANAGEMENT_PLAN.ROW_METHOD.TOTAL_LENGTH')}
                name={TOTAL_LENGTH}
                displayUnitName={TOTAL_LENGTH_UNIT}
                errors={errors[TOTAL_LENGTH]}
                unitType={container_plant_spacing}
                system={system}
                hookFormSetValue={setValue}
                hookFormGetValue={getValues}
                hookFromWatch={watch}
                control={control}
                required
                style={{ flexGrow: 1 }}
              />
            </div>
          )}
          <div>
            <Unit
              style={{ paddingLeft: '16px' }}
              register={register}
              label={t('MANAGEMENT_PLAN.PLANT_SPACING')}
              name={PLANT_SPACING}
              displayUnitName={PLANT_SPACING_UNIT}
              errors={errors[PLANT_SPACING]}
              unitType={container_plant_spacing}
              system={system}
              hookFormSetValue={setValue}
              hookFormGetValue={getValues}
              hookFromWatch={watch}
              control={control}
              required
              style={{ flexGrow: 1 }}
            />
          </div>
          {showEstimatedValue && (
            <>
              <div className={styles.row} style={{ marginTop: '40px' }}>
                <Unit
                  register={register}
                  label={t('MANAGEMENT_PLAN.ESTIMATED_SEED')}
                  name={ESTIMATED_SEED}
                  displayUnitName={ESTIMATED_SEED_UNIT}
                  errors={errors[ESTIMATED_SEED]}
                  unitType={seedYield}
                  system={system}
                  hookFormSetValue={setValue}
                  hookFormGetValue={getValues}
                  hookFromWatch={watch}
                  control={control}
                  required
                  style={{ flexGrow: 1 }}
                />
                <Unit
                  register={register}
                  label={t('MANAGEMENT_PLAN.ESTIMATED_YIELD')}
                  name={ESTIMATED_YIELD}
                  displayUnitName={ESTIMATED_YIELD_UNIT}
                  errors={errors[ESTIMATED_YIELD]}
                  unitType={seedYield}
                  system={system}
                  hookFormSetValue={setValue}
                  hookFormGetValue={getValues}
                  hookFromWatch={watch}
                  control={control}
                  required
                  style={{ flexGrow: 1 }}
                />
              </div>
            </>
          )}
        </>
      )}
    </Form>
  );
}

PureRowMethod.prototype = {
  onGoBack: PropTypes.func,
  onCancel: PropTypes.func,
  onContinue: PropTypes.func,
  useHookFormPersist: PropTypes.func,
  persistedFormData: PropTypes.object,
  variety: PropTypes.object,
  system: PropTypes.oneOf(['imperial', 'metric']),
  persistPath: PropTypes.array,
};
