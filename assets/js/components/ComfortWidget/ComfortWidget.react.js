'use strict';

const $ = require('jquery');
const React = require('React');

const ComfortWidget = React.createClass({
  getInitialState() {
    return {
      comfortData: null,
    };
  },

  componentDidMount() {
    $.getJSON('/api/comfort', comfortData => {
      this.setState({comfortData});
    });
  },

  render() {
    const {comfortData} = this.state;
    if (!comfortData) {
      return <div />;
    }

    return (
      <div style={{margin: '0 auto 10px', width: '250px'}}>
        <table className="table table-bordered"><tbody>
          <tr className={comfortLevelToRowClass(comfortData.airQuality)}>
            <td>Air Quality</td>
            <td>{safeComfortLevel(comfortData.airQuality)}</td>
          </tr>
          <tr className={comfortLevelToRowClass(comfortData.thermalComfort)}>
            <td>Thermal Comfort</td>
            <td>{safeComfortLevel(comfortData.thermalComfort)}</td>
          </tr>
          <tr className={comfortLevelToRowClass(comfortData.acousticComfort)}>
            <td>Acoustic Comfort</td>
            <td>{safeComfortLevel(comfortData.acousticComfort)}</td>
          </tr>
          <tr className={comfortLevelToRowClass(comfortData.visualComfort)}>
            <td>Visual Comfort</td>
            <td>{safeComfortLevel(comfortData.visualComfort)}</td>
          </tr>
        </tbody></table>
      </div>
    );
  },
});

function comfortLevelToRowClass(level) {
  if (level == null) return 'active';
  if (level >= 9) return 'success';
  if (level >= 7) return 'info';
  if (level >= 4) return 'warning';
  return 'danger';
}

function safeComfortLevel(level) {
  return level == null ? '?' : level;
}

module.exports = ComfortWidget;
