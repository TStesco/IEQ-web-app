'use strict';

const $ = require('jquery');
const Chart = require('Chart.react');
const React = require('React');

const {PropTypes} = React;

const ChartGroup = React.createClass({
  propTypes: {
    dataTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
    deviceID: PropTypes.string.isRequired,
  },

  getDefaultProps() {
    return {
      dataTypes: [
        'airFlow',
        'co2',
        'coal',
        'humidity',
        'light',
        'light_alt',
        'o2',
        'sound',
        'temperature',
        'temperature_alt',
        'voc',
        'pressure',
      ],
      deviceID: '5000000001',
    };
  },

  getInitialState() {
    return {
      sensorData: null,
    };
  },

  componentDidMount() {
    const {deviceID} = this.props;
    $.getJSON(`http://api.atmena.com/v1/device/${deviceID}/data`, {limit: 120}, sensorData => {
      sanitizeData(sensorData);
      this.setState({sensorData});
    });
  },

  render() {
    const {sensorData} = this.state;
    if (!sensorData) {
      return <div />;
    }

    const {dataTypes, deviceID} = this.props;
    const charts = new Array(dataTypes.length);
    for (var i = 0; i < dataTypes.length; i++) {
      charts[i] =
        <Chart
          dataType={dataTypes[i]}
          deviceID={deviceID}
          key={dataTypes[i]}
          sensorData={sensorData}
        />;
    }
    return <div className="chartGroupRoot">{charts}</div>;
  },
});

function sanitizeData(sensorData) {
  // Must convert `created` strings into Date objects for the Dygraphs library
  for (var i = 0; i < sensorData.length; i++) {
    const dataPoint = sensorData[i];
    dataPoint.created = new Date(dataPoint.created);
  }
}

module.exports = ChartGroup;
