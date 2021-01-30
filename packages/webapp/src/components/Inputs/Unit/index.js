import React from 'react';
import { Control, Errors } from 'react-redux-form';
import styles from '../styles.scss';

class Unit extends React.Component {
  parseNumber(val) {
    //TODO: Redux form will fail if val is set to -1 and then set to empty string
    return val || val === 0 ? val : undefined;
  }

  isPositive(val) {
    return val === undefined || val >= 0;
  }

  isTwoDecimalPlaces(val) {
    let decimals;
    if (val) {
      const decimalIndex = val.toString().indexOf('.');
      val = val.toString();
      console.log(decimalIndex);
      if (decimalIndex > -1) {
        decimals = val.split('.')[1].length;
      }
    }
    return !decimals || decimals < 3;
  }

  render() {
    const {
      model,
      title,
      dropdown,
      options,
      type,
      validate,
      hideLabel,
      isHarvestAllocation,
      defaultValue,
    } = this.props;
    let showLabel;
    if (!hideLabel) {
      showLabel = true;
    } else {
      showLabel = false;
    }

    return (
      <div
        style={isHarvestAllocation ? { fontSize: '14px' } : { fontSize: '18px' }}
        className={styles.textContainer}
      >
        {showLabel && <label>{title}</label>}
        {dropdown && (
          <>
            <div className={styles.selectContainer}>
              <Control.input
                data-test="unit-input"
                type="number"
                step="any"
                model={model}
                validators={{ positive: this.isPositive }}
                parser={this.parseNumber}
              />
              <Control.select data-test="unit-select" model=".unit">
                {options.map((o, index) => {
                  return (
                    <option key={'option-' + index} value={o}>
                      {o}
                    </option>
                  );
                })}
              </Control.select>
            </div>
            <Errors
              className="required"
              model={model}
              show={{ touched: true, focus: false }}
              messages={{
                positive: `Must be a non negative number`,
              }}
            />
          </>
        )}
        {!dropdown && !validate && (
          <>
            <div className={styles.inputNunit}>
              <Control.input
                data-test="unit-input"
                type="number"
                step="any"
                model={model}
                validators={{ positive: this.isPositive }}
                parser={this.parseNumber}
              />
            </div>
            <div className={styles.typeUnit}>{type}</div>

            <Errors
              className="required"
              model={model}
              show={{ touched: true, focus: false }}
              messages={{
                positive: `Must be a non negative number`,
              }}
            />
          </>
        )}
        {!dropdown && validate && (
          <>
            <div className={styles.inputNunit}>
              <Control.input
                data-test="unit-input"
                type="number"
                step="any"
                model={model}
                defaultValue={defaultValue}
                validators={{
                  required: (val) => val,
                  positive: this.isPositive,
                  twoDecimalPlaces: this.isTwoDecimalPlaces,
                }}
                parser={this.parseNumber}
              />
              <div
                style={
                  isHarvestAllocation
                    ? { marginLeft: '-40px', marginTop: '6px', color: '#9FAABE' }
                    : {}
                }
              >
                {type}
              </div>
            </div>

            <Errors
              className="required"
              model={model}
              show={{ touched: true, focus: false }}
              messages={{
                required: 'Required',
                positive: `Must be a non negative number`,
                twoDecimalPlaces: 'Quantity must be up to 2 decimal places',
              }}
            />
          </>
        )}
      </div>
    );
  }
}

export default Unit;
