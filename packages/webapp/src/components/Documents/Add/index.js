import React, { useEffect } from 'react';
import Input from '../../Form/Input';
import Form from '../../Form';
import { useTranslation } from 'react-i18next';
import ReactSelect from '../../Form/ReactSelect';
import Checkbox from '../../Form/Checkbox';
import InputAutoSize from '../../Form/InputAutoSize';
import Button from '../../Form/Button';
import MultiStepPageTitle from '../../PageTitle/MultiStepPageTitle';
import PageTitle from '../../PageTitle/v2';
import { ReactComponent as TrashIcon } from '../../../assets/images/document/trash.svg';
import { Controller, useForm } from 'react-hook-form';

function PureDocumentDetailView({
  submit,
  onGoBack,
  onCancel,
  deleteImage,
  useHookFormPersist,
  imageComponent,
  persistedFormData,
  isEdit,
  persistedPath,
  documentUploader,
}) {
  const { t } = useTranslation();
  const typeOptions = {
    CLEANING_PRODUCT: { label: t('DOCUMENTS.TYPE.CLEANING_PRODUCT'), value: 'CLEANING_PRODUCT' },
    CROP_COMPLIANCE: { label: t('DOCUMENTS.TYPE.CROP_COMPLIANCE'), value: 'CROP_COMPLIANCE' },
    FERTILIZING_PRODUCT: {
      label: t('DOCUMENTS.TYPE.FERTILIZING_PRODUCT'),
      value: 'FERTILIZING_PRODUCT',
    },
    PEST_CONTROL_PRODUCT: {
      label: t('DOCUMENTS.TYPE.PEST_CONTROL_PRODUCT'),
      value: 'PEST_CONTROL_PRODUCT',
    },
    SOIL_AMENDMENT: { label: t('DOCUMENTS.TYPE.SOIL_AMENDMENT'), value: 'SOIL_AMENDMENT' },
    OTHER: { label: t('DOCUMENTS.TYPE.OTHER'), value: 'OTHER' },
  };

  const NAME = 'name';
  const TYPE = 'type';
  const VALID_UNTIL = 'valid_until';
  const NOTES = 'notes';

  const defaultData = persistedFormData
    ? {
        name: persistedFormData.name,
        type: typeOptions[persistedFormData.type],
        valid_until: persistedFormData.valid_until.substring(0, 10),
        notes: persistedFormData.notes,
      }
    : {};

  const {
    register,
    handleSubmit,
    control,
    getValues,
    watch,
    formState: { errors, isValid, isDirty },
  } = useForm({
    mode: 'onChange',
    shouldUnregister: false,
    defaultValues: defaultData,
  });

  const submitWithFiles = (data) => {
    const validUntil = !!data.valid_until ? data.valid_until : null;
    submit({
      ...data,
      thumbnail_url: uploadedFiles[0].thumbnail_url,
      files: uploadedFiles.map((file, i) => ({
        ...file,
        file_name: `${data.name}_i`,
      })),
      valid_until: validUntil
    })
  }
  const {
    persistedData: { uploadedFiles },
  } = useHookFormPersist(persistedPath, getValues);
  return (
    <Form
      onSubmit={handleSubmit(submitWithFiles)}
      buttonGroup={
        <Button type={'submit'} disabled={isEdit ? (!isValid || !isDirty) : !isValid} fullLength>
          {isEdit ? t('common:UPDATE') : t('common:SAVE')}
        </Button>
      }
    >
      {isEdit && (
        <PageTitle
          onGoBack={onGoBack}
          title={t('DOCUMENTS.EDIT_DOCUMENT')}
          style={{ marginBottom: '24px' }}
        />
      )}
      {!isEdit && (
        <MultiStepPageTitle
          onGoBack={onGoBack}
          onCancel={onCancel}
          value={50}
          title={t('DOCUMENTS.ADD.TITLE')}
          style={{ marginBottom: '24px' }}
        />
      )}
      <Input
        name={NAME}
        hookFormRegister={register(NAME, { required: true })}
        label={t('DOCUMENTS.ADD.DOCUMENT_NAME')}
        classes={{ container: { paddingBottom: '32px' } }}
      />
      <Controller
        control={control}
        name={TYPE}
        render={({ field: { onChange, onBlur, value } }) => (
          <ReactSelect
            optional
            options={Object.values(typeOptions)}
            label={t('DOCUMENTS.ADD.TYPE')}
            value={value}
            onChange={(e) => {
              onChange(e);
            }}
            style={{ paddingBottom: '40px' }}
          />
        )}
      />
      <Input
        type={'date'}
        name={VALID_UNTIL}
        hookFormRegister={register(VALID_UNTIL)}
        label={t('DOCUMENTS.ADD.VALID_UNTIL')}
        optional
        classes={{ container: { paddingBottom: '18px' } }}
      />
      <Checkbox
        label={t('DOCUMENTS.ADD.DOES_NOT_EXPIRE')}
        classes={{ container: { paddingBottom: '42px' } }}
      />
      <div style={{ width: '312px', minHeight: '383px', margin: 'auto', paddingBottom: '16px' }}>
        {uploadedFiles?.map(({ thumbnail_url }, index) => (
          <div key={index}>
            <div
              style={{
                background: 'var(--teal700)',
                width: '24px',
                height: '24px',
                position: 'relative',
                float: 'right',
                zIndex: 10,
              }}
              onClick={() => deleteImage(thumbnail_url)}
            >
              <TrashIcon />
            </div>
            {imageComponent({
              width: '100%',
              style: { position: 'relative', top: '-24px', zIndex: 0 },
              height: '100%',
              src: thumbnail_url,
            })}
          </div>
        ))}
      </div>
      {documentUploader({
        style: { paddingBottom: '32px' },
        linkText: t('DOCUMENTS.ADD.ADD_MORE_PAGES'),
      })}
      <InputAutoSize
        hookFormRegister={register(NOTES)}
        name={NOTES}
        label={t('common:NOTES')}
        optional
        classes={{ container: { paddingBottom: '40px' } }}
      />
    </Form>
  );
}

export default PureDocumentDetailView;
