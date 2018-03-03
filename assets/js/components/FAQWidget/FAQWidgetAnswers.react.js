'use strict';

const React = require('React');

const {PropTypes} = React;

const FAQWidgetAnswers = React.createClass({
  propTypes: {
    faqAnswers: PropTypes.arrayOf(PropTypes.object).isRequired,
    faqID: PropTypes.string.isRequired,
  },

  render() {
    return (
      <div
        aria-labelledby="headingOne"
        className="panel-collapse collapse"
        id={this.props.faqID}
        role="tabpanel">
        <div className="panel-body">
          {this.props.faqAnswers.map(this._renderAnswer)}
        </div>
      </div>
    );
  },

  _renderAnswer(answer) {
    return (
      <div key={answer.id}>
        <a href="#">
          {answer.answer}
        </a>
      </div>
    );
  },
});

module.exports = FAQWidgetAnswers;
