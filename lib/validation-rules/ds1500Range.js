const { ValidationError } = require('@dwp/govuk-casa')
/**
 *
 * @param  {int} number value
 * @return {Promise} Promise
 */
function ds1500Range (value) {
  const errorMsg = this.errorMsg || {
    inline: 'validation:rule.dateObject.inline',
    summary: 'validation:rule.dateObject.summary'
  };
  const num = parseInt(value);
  const valid = num >= this.min && num <= this.max;
  return valid
    ? []
    : [ValidationError.make({ errorMsg })]
}

module.exports = ds1500Range;
