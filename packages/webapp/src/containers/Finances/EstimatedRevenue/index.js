import styles from '../styles.scss';
import React, { Component } from 'react';
import PageTitle from '../../../components/PageTitle';
import Table from '../../../components/Table';
import connect from 'react-redux/es/connect/connect';
import moment from 'moment';
import { grabCurrencySymbol } from '../../../util';
import DateRangeSelector from '../../../components/Finances/DateRangeSelector';
import { userFarmSelector } from '../../userFarmSlice';
import { withTranslation } from 'react-i18next';
import { currentFieldCropsSelector } from '../../fieldCropSlice';
import { getFieldCrops } from '../../saga';

class EstimatedRevenue extends Component {
  constructor(props) {
    super(props);
    this.formatData = this.formatData.bind(this);
    this.changeDate = this.changeDate.bind(this);
    let startDate, endDate;
    const { dateRange } = this.props;
    if (dateRange && dateRange.startDate && dateRange.endDate) {
      startDate = moment(dateRange.startDate);
      endDate = moment(dateRange.endDate);
    } else {
      startDate = moment().startOf('year');
      endDate = moment().endOf('year');
    }

    this.state = {
      startDate,
      endDate,
      totalRevenue: 0,
      switchYear: true,
      currencySymbol: grabCurrencySymbol(this.props.farm),
    };
  }

  componentDidMount() {
    this.props.dispatch(getFieldCrops());
  }

  changeDate(type, date) {
    if (type === 'start') {
      this.setState({ startDate: date });
    } else if (type === 'end') {
      this.setState({ endDate: date });
    } else {
      console.log('Error, type not specified');
    }
  }

  // format data to insert into revenue table
  formatData(fieldCrops) {
    // let visited = [];
    let totalRevenue = 0;
    let cropRevenueMap = {};
    fieldCrops.forEach((f) => {
      // check if this field crop existed during this year
      const endDate = new Date(f.end_date);
      // get all field crops with end dates belonging to the chosen year
      if (
        (this.state.startDate && this.state.startDate._d) <= endDate &&
        (this.state.endDate && this.state.endDate._d) >= endDate
      ) {
        const key = this.props.t(`crop:${f.crop.crop_translation_key}`);
        if (!cropRevenueMap[key]) {
          cropRevenueMap[key] = f.estimated_revenue;
        } else {
          const curRevenue = cropRevenueMap[key];
          cropRevenueMap[key] = f.estimated_revenue + curRevenue;
        }
        totalRevenue += f.estimated_revenue;
      }
    });

    if (this.state.switchYear) {
      this.setState({
        totalRevenue,
        switchYear: false,
      });
    }
    let result = [];
    Object.keys(cropRevenueMap).forEach((k) => {
      result.push({ crop: k, estimated_revenue: cropRevenueMap[k] });
    });
    return result;
  }

  render() {
    const fieldCrops = this.props.fieldCrops || [];
    this.formatData(fieldCrops);

    // columns config for Summary Table
    const revenueColumns = [
      {
        id: 'crop',
        Header: 'Crop',
        accessor: (d) => d.crop,
        minWidth: 70,
        Footer: <div>Total</div>,
      },
      {
        id: 'estimatedRevenue',
        Header: 'Estimated Revenue',
        accessor: (d) => `${this.state.currencySymbol}${d.estimated_revenue}` || 'none',
        minWidth: 75,
        Footer: (
          <div>
            {this.state.currencySymbol + parseFloat(this.state.totalRevenue).toFixed(2) || 'none'}
          </div>
        ),
      },
    ];

    return (
      <div className={styles.financesContainer}>
        <PageTitle
          backUrl="/Finances"
          title={this.props.t('SALE.ESTIMATED_REVENUE.TITLE')}
          rightIcon
          rightIconTitle={this.props.t('SALE.ESTIMATED_REVENUE.CALCULATION')}
          rightIconBody={this.props.t('SALE.ESTIMATED_REVENUE.CALCULATION_DESCRIPTION')}
        />
        <DateRangeSelector changeDateMethod={this.changeDate} />
        <Table
          columns={revenueColumns}
          data={this.formatData(fieldCrops)}
          showPagination={false}
          minRows={5}
          className="-striped -highlight"
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    fieldCrops: currentFieldCropsSelector(state),
    farm: userFarmSelector(state),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(EstimatedRevenue));
