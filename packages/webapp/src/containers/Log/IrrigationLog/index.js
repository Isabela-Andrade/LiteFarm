import React, { Component } from 'react';
import { connect } from 'react-redux';
import PageTitle from '../../../components/PageTitle/v2';

import DateContainer from '../../../components/Inputs/DateContainer';
import { actions, Form } from 'react-redux-form';
import DefaultLogForm from '../../../components/Forms/Log';
import Unit from '../../../components/Inputs/Unit';
import LogFooter from '../../../components/LogFooter';
import moment from 'moment';
import { addLog } from '../Utility/actions';
import styles from '../styles.module.scss';
import parseCrops from '../Utility/parseCrops';
import parseFields from '../Utility/parseFields';
import { convertToMetric, getUnit } from '../../../util';
import { userFarmSelector } from '../../userFarmSlice';
import { withTranslation } from 'react-i18next';
import { currentAndPlannedManagementPlansSelector } from '../../managementPlanSlice';
import { cropLocationsSelector } from '../../locationSlice';
import { Semibold } from '../../../components/Typography';
import { irrigationStateSelector } from '../selectors';

class IrrigationLog extends Component {
  constructor(props) {
    super(props);
    this.props.dispatch(actions.reset('logReducer.forms.irrigationLog'));
    this.state = {
      date: moment(),
      ratePerMin: getUnit(this.props.farm, 'l/min', 'gal/min'),
      ratePerHr: getUnit(this.props.farm, 'l/h', 'gal/h'),
    };
    this.setDate = this.setDate.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  setDate(date) {
    this.setState({
      date: date,
    });
  }

  componentDidMount() {}

  handleSubmit(irrigationLog) {
    const { dispatch, locations } = this.props;
    let selectedCrops = parseCrops(irrigationLog);
    let selectedFields = parseFields(irrigationLog, locations);

    let formValue = {
      activity_kind: 'irrigation',
      date: this.state.date,
      crops: selectedCrops,
      locations: selectedFields,
      type: irrigationLog.type.value,
      notes: irrigationLog.notes,
      'flow_rate_l/min': convertToMetric(
        irrigationLog['flow_rate_l/min'],
        irrigationLog.unit,
        'l/min',
      ),
      hours: irrigationLog.hours,
    };
    dispatch(addLog(formValue));
  }

  render() {
    const crops = this.props.crops;
    const locations = this.props.locations;
    const rateOptions = [this.state.ratePerMin, this.state.ratePerHr];

    const customFieldset = () => {
      return (
        <div>
          <Unit
            model=".flow_rate_l/min"
            title={`${this.props.t('LOG_IRRIGATION.FLOW_RATE')} ${this.props.t('common:OPTIONAL')}`}
            dropdown={true}
            options={rateOptions}
          />
          <Unit
            model=".hours"
            title={`${this.props.t('LOG_IRRIGATION.TOTAL_TIME')} ${this.props.t(
              'common:OPTIONAL',
            )}`}
            type="hrs"
          />
        </div>
      );
    };

    return (
      <div className="page-container">
        <PageTitle
          onGoBack={() => this.props.history.push('/new_log')}
          onCancel={() => this.props.history.push('/log')}
          style={{ paddingBottom: '24px' }}
          title={this.props.t('LOG_COMMON.ADD_A_LOG')}
        />
        <Semibold style={{ marginBottom: '24px' }}>{this.props.t('LOG_IRRIGATION.TITLE')}</Semibold>
        <DateContainer
          date={this.state.date}
          onDateChange={this.setDate}
          label={this.props.t('common:DATE')}
        />
        <Form
          model="logReducer.forms"
          className={styles.formContainer}
          onSubmit={(val) => this.handleSubmit(val.irrigationLog)}
        >
          <DefaultLogForm
            style={styles.labelContainer}
            model=".irrigationLog"
            locations={locations}
            crops={crops}
            isCropNotRequired={true}
            notesField={true}
            typeField={true}
            typeOptions={['sprinkler', 'drip', 'subsurface', 'flood']}
            customFieldset={customFieldset}
          />
          <LogFooter disabled={!this.props.formState.$form.valid} />
        </Form>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    crops: currentAndPlannedManagementPlansSelector(state),
    locations: cropLocationsSelector(state),
    farm: userFarmSelector(state),
    formState: irrigationStateSelector(state),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(IrrigationLog));
