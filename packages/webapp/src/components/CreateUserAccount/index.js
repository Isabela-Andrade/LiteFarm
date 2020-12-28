import Form from '../Form';
import Button from '../Form/Button';
import Input from '../Form/Input';
import React from 'react';
import { Title } from '../Typography';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { validatePasswordWithErrors } from '../Signup/utils';
import { PasswordError } from '../Form/Errors';
import { useTranslation } from 'react-i18next';

export default function PureCreateUserAccount({ onSignUp, email, onGoBack }) {
  const { register, handleSubmit, watch } = useForm();
  const NAME = 'name';
  const name = watch(NAME, undefined);
  const PASSWORD = 'password';
  const password = watch(PASSWORD, undefined);
  const required = watch(NAME, false);
  const { t } = useTranslation();
  const title = t('CREATE_USER.TITLE');
  const {
    isValid,
    hasNoSymbol,
    hasNoDigit,
    hasNoUpperCase,
    isTooShort,
  } = validatePasswordWithErrors(password);
  const inputRegister = register({ validate: () => isValid });
  const refInput = register({ required: required });

  const disabled = !name || !isValid;

  const onSubmit = (data) => {
    if (isValid) {
      onSignUp(data);
    }
  };
  const onError = (data) => {};

  return (
    <Form
      onSubmit={handleSubmit(onSubmit, onError)}
      buttonGroup={
        <>
          <Button onClick={onGoBack} color={'secondary'} type={'button'} fullLength>
            {t('common:BACK')}
          </Button>
          <Button disabled={disabled} type={'submit'} fullLength>
            {t('CREATE_USER.CREATE_BUTTON')}
          </Button>
        </>
      }
    >
      <Title style={{ marginBottom: '32px' }}>{title}</Title>
      <Input style={{ marginBottom: '28px' }} label={'Email'} disabled defaultValue={email} />
      <Input
        style={{ marginBottom: '28px' }}
        label={'Full name'}
        name={NAME}
        placeholder={'e.g. Juan Perez'}
        inputRef={refInput}
      />
      <Input
        style={{ marginBottom: '28px' }}
        label={'Password'}
        type={PASSWORD}
        name={PASSWORD}
        inputRef={inputRegister}
      />

      <PasswordError
        hasNoDigit={hasNoDigit}
        hasNoSymbol={hasNoSymbol}
        hasNoUpperCase={hasNoUpperCase}
        isTooShort={isTooShort}
      />
    </Form>
  );
}

PureCreateUserAccount.prototype = {
  onLogin: PropTypes.func,
};
