'use strict';

const $ = require('jquery');
const React = require('React');

const {PropTypes} = React;

const SidebarMenu = React.createClass({
  getInitialState() {
    return {
      activeItem: null,
      buildingData: [],
    };
  },

  componentWillMount() {
    $.getJSON('http://api.atmena.com/v1/buildings_zones', buildingData => {
      this.setState({buildingData});
    });
  },

  render() {
    return (
      <div className="panel-group">
        {this.state.buildingData.map(this._renderMenuItem)}
      </div>
    );
  },

  _renderMenuItem(building) {
    const active = this.state.activeItem === building.name;

    return (
      <div className="panel panel-default" key={building.name}>
        <div className="panel-heading">
          <a className="panel-title"
            href=""
            onClick={e => {
              e.preventDefault();
              this._handleItemClick(building.name);
            }}>
            {building.name}
          </a>
        </div>
        <SidebarChildMenu active={active} zones={building.zones} />
      </div>
    );
  },

  _handleItemClick(buildingName) {
    // Toggle the active item or set the new one
    this.setState({
      activeItem: this.state.activeItem === buildingName ? null : buildingName,
    });
  },
});

const SidebarChildMenu = React.createClass({
  propTypes: {
    active: PropTypes.bool,
    zones: PropTypes.arrayOf(PropTypes.object),
  },

  componentDidUpdate(prevProps) {
    if (this.props.active !== prevProps.active) {
      $(this.refs.list).slideToggle();
    }
  },

  render() {
    return (
      <div className="panel-collapse collapse in" ref="list" style={{display: 'none'}}>
        <div className="panel-body">
          {this.props.zones.map(this._renderMenuItem)}
        </div>
      </div>
    );
  },

  _renderMenuItem(zone) {
    return (
      <div key={zone.id}>
        <a href={'#' + zone.id}>{zone.name}</a>
      </div>
    );
  },
});

module.exports = SidebarMenu;
