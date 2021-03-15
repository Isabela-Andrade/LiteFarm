import React, { useEffect, useRef, useState } from 'react';
import styles from './unit.module.scss';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Error, Info, Label, Underlined } from '../../Typography';
import { Cross } from '../../Icons';
import { mergeRefs } from '../utils';
import MoreInfo from '../../Tooltip/MoreInfo';
import { useTranslation } from 'react-i18next';
import { numberOnKeyDown } from '../Input';
import Select from 'react-select';

const Input = ({
  disabled = false,
  classes = {},
  style,
  label,
  optional,
  info,
  errors,
  icon,
  inputRef,
  isSearchBar,
  type = 'text',
  toolTipContent,
  reset,
  unit,
  name,
  hookFormSetValue,
  options,
  ...props
}) => {
  warnings(hookFormSetValue, optional);
  const { t } = useTranslation(['translation', 'common']);
  const input = useRef();
  const onClear =
    optional || hookFormSetValue
      ? () => {
          hookFormSetValue(name, undefined, { shouldValidate: true });
          setShowError(false);
        }
      : () => {
          if (input.current && input.current?.value) {
            input.current.value = '';
            setShowError(false);
          }
        };

  const [showError, setShowError] = useState();
  useEffect(() => {
    setShowError(!!errors && !disabled);
  }, [errors]);

  return (
    <div
      className={clsx(styles.container)}
      style={(style || classes.container) && { ...style, ...classes.container }}
    >
      {(label || toolTipContent || icon) && (
        <div className={styles.labelContainer}>
          <Label>
            {label}{' '}
            {optional && (
              <Label sm className={styles.sm}>
                ({t('common:OPTIONAL')})
              </Label>
            )}
          </Label>
          {toolTipContent && <MoreInfo content={toolTipContent} />}
          {icon && <span className={styles.icon}>{icon}</span>}
        </div>
      )}
      {showError && !unit && (
        <Cross
          onClick={onClear}
          style={{
            position: 'absolute',
            right: 0,
            transform: 'translate(-17px, 13px)',
            cursor: 'pointer',
          }}
        />
      )}

      <input
        disabled={disabled}
        className={clsx(
          styles.input,
          showError && styles.inputError,
          isSearchBar && styles.searchBar,
        )}
        style={{ paddingRight: `${unit ? unit.length * 8 + 8 : 4}px`, ...classes.input }}
        aria-invalid={showError ? 'true' : 'false'}
        type={'number'}
        onKeyDown={numberOnKeyDown}
        name={name}
        {...props}
      />
      <Select
        customStyles
        styles={{ ...styles, container: (provided, state) => ({ ...provided, ...style }) }}
        placeholder={placeholder}
        options={options}
        components={{
          ClearIndicator: ({ innerProps }) => (
            <Underlined {...innerProps} style={{ position: 'absolute', right: 0, bottom: '-20px' }}>
              {t('REACT_SELECT.CLEAR_ALL')}
            </Underlined>
          ),
        }}
        {...props}
      />
      <input ref={mergeRefs(inputRef, input)} />
      {info && !showError && <Info style={classes.info}>{info}</Info>}
      {showError ? <Error style={classes.errors}>{errors}</Error> : null}
    </div>
  );
};

Input.propTypes = {
  disabled: PropTypes.bool,
  label: PropTypes.string,
  optional: PropTypes.bool,
  info: PropTypes.string,
  errors: PropTypes.string,
  clearErrors: PropTypes.func,
  classes: PropTypes.exact({
    input: PropTypes.object,
    label: PropTypes.object,
    container: PropTypes.object,
    info: PropTypes.object,
    errors: PropTypes.object,
  }),
  icon: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  inputRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]),
  style: PropTypes.object,
  isSearchBar: PropTypes.bool,
  type: PropTypes.string,
  toolTipContent: PropTypes.string,
  unit: PropTypes.string,
  // reset is required when optional is true. When optional is true and reset is undefined, the component will crash on reset
  reset: PropTypes.func,
  hookFormSetValue: PropTypes.func,
  name: PropTypes.string,
};

export default Input;

const warnings = (hookFormSetValue, optional) =>
  !hookFormSetValue &&
  optional &&
  console.error('hookFormSetValue prop is required when input field is optional');
