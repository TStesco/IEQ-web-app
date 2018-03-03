'use strict';

const FAQWidgetAnswers = require('FAQWidgetAnswers.react');
const React = require('React');

const FAQWidget = React.createClass({
  getInitialState() {
    return {
      faqData: [],
    };
  },

  componentWillMount() {
    // TODO: Make an API call to get the data instead of using hardcoded data
    const faqData = [
      {id: 1, question: 'How is the thermal comfort?', answers: [
        {id: '1', answer: "It's Good!"},
        {id: '2', answer: 'no oscillation!'},
      ]},
      {id: 2, question: 'How is the air quality?', answers: [
        {id: '3', answer: 'Massive.'},
        {id: '4', answer: 'Right on.'},
      ]},
      {id: 3, question: 'How is the thing?', answers: [
        {id: '5', answer: 'Stuff!'},
        {id: '6', answer: 'Cool.'},
      ]},
    ];
    this.setState({faqData});
  },

  render() {
    return (
      <div aria-multiselectable="false" className="panel-group" id="faq-accordion" role="tablist">
        {this.state.faqData.map(this._renderFAQ)}
      </div>
    );
  },

  _renderFAQ(faq) {
    const faqID = 'faq' + faq.id;

    return (
      <div className="panel panel-default" key={faq.id}>
        <div className="panel-heading" id="headingOne" role="tab">
          <h4 className="panel-title">
            <a
              aria-controls={faqID}
              aria-expanded="true"
              data-parent="#faq-accordion"
              data-toggle="collapse"
              href={'#' + faqID}
              role="button">
              {faq.question}
            </a>
          </h4>
        </div>
        <FAQWidgetAnswers faqAnswers={faq.answers} faqID={faqID} />
      </div>
    );
  },
});

module.exports = FAQWidget;
