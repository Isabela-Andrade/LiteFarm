import React, { useState } from 'react';
import Joyride, { STATUS, ACTIONS, LIFECYCLE } from 'react-joyride';
import PropTypes from 'prop-types';
import styles from './styles.module.scss';
import { ReactComponent as AddLogo } from '../../../assets/images/map/add.svg';
import { ReactComponent as FilterLogo } from '../../../assets/images/map/filter.svg';
import { ReactComponent as ExportLogo } from '../../../assets/images/map/export.svg';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import MapFilter from '../../MapFilter';

export default function PureMapFooter({
  className,
  style,
  isAdmin,
  showSpotlight,
  resetSpotlight,
  onClickAdd,
  onClickFilter,
  onClickExport,
  showModal,
  setHeight,
  height,
  state,
  toggleDrawer,
  setRoadview,
  setShowMapFilter,
  showMapFilter,
}) {
  const { t } = useTranslation();
  const [stepSpotlighted, setStepSpotlighted] = useState(null);

  const resetSpotlightStatus = (data) => {
    const { action, status, lifecycle } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status) || action === ACTIONS.CLOSE) {
      setStepSpotlighted(null);
      resetSpotlight();
    } else if ([ACTIONS.UPDATE].includes(action) && lifecycle === LIFECYCLE.TOOLTIP) {
      setStepSpotlighted(data.index);
    }
  };
  const steps = [
    {
      target: '#mapFirstStep',
      title: TitleContent(t('FARM_MAP.SPOTLIGHT.ADD_TITLE')),
      content: BodyContent(t('FARM_MAP.SPOTLIGHT.ADD')),
      locale: {
        next: NextButtonContent(t('common:NEXT')),
      },
      showCloseButton: false,
      disableBeacon: true,
      placement: 'top-start',
      styles: {
        options: {
          width: 240,
        },
      },
    },
    {
      target: '#mapSecondStep',
      title: TitleContent(t('FARM_MAP.SPOTLIGHT.FILTER_TITLE')),
      content: BodyContent(t('FARM_MAP.SPOTLIGHT.FILTER')),
      locale: {
        next: NextButtonContent(t('common:NEXT')),
      },
      showCloseButton: false,
      placement: 'top-start',
      styles: {
        options: {
          width: 260,
        },
      },
    },
    {
      target: '#mapThirdStep',
      title: TitleContent(t('FARM_MAP.SPOTLIGHT.EXPORT_TITLE')),
      content: BodyContent(t('FARM_MAP.SPOTLIGHT.EXPORT')),
      locale: {
        last: NextButtonContent(t('common:GOT_IT')),
      },
      placement: 'top-start',
      showCloseButton: false,
      styles: {
        options: {
          width: 210,
        },
      },
      floaterProps: {
        styles: {
          floater: {
            marginRight: '12px',
          },
        },
      },
    },
  ];

  const { container, button, svg, spotlighted } = styles;
  return (
    <>
      {showSpotlight && (
        <Joyride
          steps={steps}
          continuous
          callback={resetSpotlightStatus}
          floaterProps={{ disableAnimation: true }}
          styles={{
            options: {
              // modal arrow color
              arrowColor: '#fff',
              // modal background color
              backgroundColor: '#fff',
              // tooltip overlay color
              overlayColor: 'rgba(30, 30, 48, 1)',
              // next button color
              primaryColor: '#FCE38D',
              //width of modal
              width: 270,
              //zindex of modal
              zIndex: 100,
            },
            buttonClose: {
              display: 'none',
            },
            buttonBack: {
              display: 'none',
            },
            tooltip: {
              padding: '20px',
            },
            tooltipContent: {
              padding: '4px 0 0 0',
              marginBottom: '20px',
            },
          }}
        />
      )}
      <div className={clsx(container, className)} style={style}>
        {isAdmin && (
          <button
            className={clsx(button, stepSpotlighted === 0 && spotlighted)}
            id="mapFirstStep"
            onClick={onClickAdd}
          >
            <AddLogo className={svg} />
          </button>
        )}
        <button
          className={clsx(button, stepSpotlighted === 1 && spotlighted)}
          id="mapSecondStep"
          onClick={onClickFilter}
        >
          {' '}
          <div>
            {['bottom'].map((anchor) => (
              <React.Fragment key={anchor}>
                <FilterLogo
                  className={svg}
                  onClick={showMapFilter ? toggleDrawer(anchor, true) : toggleDrawer(anchor, false)}
                />
                <MapFilter
                  setRoadview={setRoadview}
                  anchor={anchor}
                  setHeight={setHeight}
                  height={height}
                  state={state}
                  toggleDrawer={toggleDrawer}
                />
              </React.Fragment>
            ))}
          </div>
        </button>
        <button
          className={clsx(button, (stepSpotlighted === 2 || showModal) && spotlighted)}
          id="mapThirdStep"
          onClick={onClickExport}
        >
          <ExportLogo className={svg} />
        </button>
      </div>
    </>
  );
}

PureMapFooter.prototype = {
  className: PropTypes.string,
  style: PropTypes.object,
  isAdmin: PropTypes.bool,
  showSpotlight: PropTypes.bool,
  resetSpotlight: PropTypes.func,
  onClickAdd: PropTypes.func,
  onClickFilter: PropTypes.func,
  onClickExport: PropTypes.func,
  showModal: PropTypes.bool,
};

const TitleContent = (text) => {
  return (
    <span className={styles.spotlightTitle}>
      <p align="left" className={styles.spotlightText}>
        {text}
      </p>
    </span>
  );
};

const BodyContent = (text) => {
  const { t } = useTranslation();
  return (
    <>
      <p align="left">{t('FARM_MAP.SPOTLIGHT.HERE_YOU_CAN')}</p>
      <ul style={{ paddingInlineStart: '20px' }}>
        {text.split(',').map(function (item, key) {
          return (
            <li key={key} className={styles.spotlightText}>
              {item}
            </li>
          );
        })}
      </ul>
    </>
  );
};

const NextButtonContent = (text) => {
  return <span className={styles.spotlightButton}>{text}</span>;
};
