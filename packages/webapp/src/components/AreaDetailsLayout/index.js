import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Input from '../Form/Input';
import FormTitleLayout from '../Form/FormTitleLayout';
import Button from '../Form/Button';
import { fieldEnum } from '../../containers/fieldSlice';

export default function AreaDetailsLayout({
  name,
  title,
  additionalProperties,
  onBack,
  onSubmit,
  onError,
  register,
  setValue,
  disabled,
  isNameRequired,
  children,
}) {
  const { t } = useTranslation();

  useEffect(() => {
    name === 'Farm site boundary'
      ? setDisabled(!areaField || !perimeterField)
      : setDisabled(!areaField || !perimeterField || !nameField);
  });

  return (
    <FormTitleLayout
      onGoBack={onBack}
      onSubmit={handleSubmit(onSubmit, onError)}
      title={title}
      style={{ flexGrow: 9, order: 2 }}
      buttonGroup={
        <>
          <Button onClick={onBack} color={'secondary'} fullLength>
            {t('common:CANCEL')}
          </Button>
          <Button type={'submit'} disabled={disabled} fullLength>
            {t('common:SAVE')}
          </Button>
        </>
      }
    >
      <Input
        label={name + ' name'}
        type="text"
        optional={name === 'Farm site boundary' ? true : false}
        style={{ marginBottom: '40px' }}
        name={fieldEnum.name}
        inputRef={register({ required: isNameRequired })}
      />
      <div>
        <Input
          label={t('FARM_MAP.AREA_DETAILS.TOTAL_AREA')}
          type="text"
          style={{ marginBottom: '40px', width: '50%', float: 'left' }}
          name={AREAFIELD}
          inputRef={areaInputRegister}
        />
        <Input
          label={t('FARM_MAP.AREA_DETAILS.PERIMETER')}
          type="text"
          style={{ marginBottom: '40px', width: '50%', paddingLeft: '10px' }}
          name={PERIMETERFIELD}
          inputRef={perimeterInputRegister}
        />
      </div>
      {children}
      <Input label={t('common:NOTES')} type="text" optional style={{ marginBottom: '40px' }} />
    </FormTitleLayout>
  );
}
