import React from 'react';
import Table from '../../../../../../components/Table';
import moment from 'moment';

const Employee = ({ shifts, startDate, endDate }) => {
  let data = [];
  let sortObj = {};

  for (let s of shifts) {
    if (moment(s.start_time).isBetween(moment(startDate), moment(endDate))) {
      if (sortObj.hasOwnProperty(s.user_id)) {
        sortObj[s.user_id].time = sortObj[s.user_id].time + parseInt(s.duration, 10);
      } else {
        let wage_amount = 0;
        if (s.wage.type === 'hourly') {
          wage_amount = parseFloat(s.wage.amount);
        }
        sortObj[s.user_id] = {
          time: parseInt(s.duration, 10),
          wage_amount,
          employee: s.first_name + ' ' + s.last_name.substring(0, 1).toUpperCase() + '.',
        };
      }
    }
  }

  let keys = Object.keys(sortObj);

  for (let k of keys) {
    let timeInHour = (sortObj[k].time / 60).toFixed(1);
    data.push({
      employee: sortObj[k].employee,
      time: timeInHour.toString() + ' HR',
      labour_cost: '$' + ((sortObj[k].time / 60) * sortObj[k].wage_amount).toFixed(2).toString(),
    });
  }

  const columns = [
    {
      id: 'employee',
      Header: 'Employee',
      accessor: (d) => d.employee,
      minWidth: 80,
    },
    {
      id: 'time',
      Header: 'Time',
      accessor: (d) => d.time,
      minWidth: 75,
    },
    {
      id: 'labour_cost',
      Header: 'Labour Cost',
      accessor: (d) => d.labour_cost,
    },
  ];

  return (
    <Table
      columns={columns}
      data={data}
      showPagination={false}
      minRows={5}
      className="-striped -highlight"
    />
  );
};

export default Employee;
