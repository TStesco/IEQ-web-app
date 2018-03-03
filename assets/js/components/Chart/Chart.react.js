'use strict';

const Dygraph = require('dygraphs');
const React = require('React');
const SensorDataEvents = require('SensorDataEvents');

const {PropTypes} = React;

const dataTypeToTitleMap = {
  airFlow: 'Air Flow',
  co2: 'CO<sub>2</sub>',
  coal: 'Gas',
  humidity: 'Humidity',
  light: 'Light',
  light_alt: 'Light Alt', // eslint-disable-line camelcase
  o2: 'O<sub>2</sub>',
  pressure: 'Pressure',
  sound: 'Sound',
  temperature: 'Temperature',
  temperature_alt: 'Temperature Alt', // eslint-disable-line camelcase
  voc: 'VOC',
};

const dataTypeToUnitsMap = {
  airFlow: 'm/s',
  co2: 'ppm',
  coal: 'ppm Equiv. CO<sub>2</sub>',
  humidity: '%',
  light: 'lumens',
  light_alt: 'lumens', // eslint-disable-line camelcase
  o2: '%',
  pressure: 'Pa',
  sound: 'dB',
  temperature: '°C',
  temperature_alt: '°C', // eslint-disable-line camelcase
  voc: 'Equiv. CO<sub>2</sub>',
};

const Chart = React.createClass({
  propTypes: {
    dataType: PropTypes.string.isRequired,
    deviceID: PropTypes.string.isRequired,
    sensorData: PropTypes.arrayOf(PropTypes.object).isRequired,
  },

  componentDidMount() {
    this._renderChart();

    const listener = newData => {
      this._handleNewData(newData);
    };
    SensorDataEvents.addListener(this.props.deviceID, listener);
    this._listener = listener;
  },

  shouldComponentUpdate(nextProps) {
    for (var prop in nextProps) {
      if (nextProps[prop] !== this.props[prop]) {
        return true;
      }
    }
    return false;
  },

  componentWillUpdate(nextProps) {
    const {deviceID} = this.props;
    if (nextProps.deviceID !== deviceID) {
      SensorDataEvents.removeListener(deviceID, this._listener);
    }
  },

  componentDidUpdate(prevProps) {
    this._renderChart();
    const {deviceID} = this.props;
    if (prevProps.deviceID !== deviceID) {
      SensorDataEvents.addListener(deviceID, this._listener);
    }
  },

  componentWillUnmount() {
    SensorDataEvents.removeListener(this.props.deviceID, this._listener);
  },

  render() {
    return <div className="chartRoot" ref="chartRoot" style={{width: '100%'}} />;
  },

  _renderChart() {
    const {dataType, sensorData} = this.props;
    const units = dataTypeToUnitsMap[dataType];

    // The data needs to be transformed for dygraphs
    const chartData = new Array(sensorData.length);
    for (var i = 0; i < sensorData.length; i++) {
      chartData[i] = [sensorData[i].created, sensorData[i][dataType]];
    }

    this._chart = new Dygraph(this.refs.chartRoot, chartData, {
      drawGapEdgePoints: true,
      labels: ['Time', dataType],
      labelsDivStyles: {textAlign: 'right'},
      labelsDivWidth: 270,
      rollPeriod: 1,
      showRangeSelector: true,
      showRoller: true,
      title: dataTypeToTitleMap[dataType] + ' (' + units + ')',
      xlabel: 'Time',
      ylabel: units,
    });

    this._charData = chartData;
  },

  _handleNewData(newData) {
    const chartData = this._charData;
    chartData.push([newData.created, newData[this.props.dataType]]);
    this._chart.updateOptions({file: chartData});
  },
});

module.exports = Chart;
