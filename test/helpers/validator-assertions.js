const { expect } = require('chai');
const { JourneyContext } = require('@dwp/govuk-casa');

/**
 * Expect a validator to fail.
 *
 * @param {array} fieldValidators List of validators to test
 * @param {string} fieldName Name of field to extract from page data context
 * @param {string} validatorName Validator expected to have failed in errors
 * @param {mixed} values values you actually want to test, in the form {fieldName:value,...}
 * @param {mixed} validationContext Value to pass into runValidators to trigger validation fail
 * @param {object} errorObj Expected partial error object to be returned
 * @returns {Promise} Pending processor
 */
async function expectValidatorToFailWithJourney (
  fieldValidators,
  fieldName,
  validatorName,
  values,
  validationContext,
  errorObj = {}
) {
  let errors
  if (Array.isArray(fieldValidators) && fieldValidators.length > 0) {
    fieldValidators.filter((validator) => validator.name === fieldName).forEach((validator) => {
      errors = validator.runValidators(values, validationContext);
    });
  }
  const result = (errors && errors.length > 0) ? errors.filter((r) => r.validator.toLowerCase() === validatorName.toLowerCase()).filter((r) => r.field.toLowerCase() === fieldName.toLowerCase())[0] : undefined;
  /* eslint-disable-next-line no-unused-expressions */
  expect(result).to.not.be.undefined;
  expect(result).to.deep.include(errorObj);
}

/**
 * Expect a validator to fail.
 *
 * @param {array} fieldValidators List of validators to test
 * @param {string} fieldName Name of field to vextract from page data context
 * @param {string} validatorName Validator expected to have failed in errors
 * @param {{dd: string, mm: string, yyyy: string}} values these are the values you actually want to test, in the form {fieldName:value,...}
 * @param {{}} pageDataContext Value to pass into processor to trigger validation fail
 * @param {object} errorObj Expected partial error object to be returned
 * @returns {Promise} Pending processor
 */
async function expectValidatorToFail (
  fieldValidators,
  fieldName,
  validatorName,
  values = {},
  pageDataContext = {},
  errors = {}
) {
  const fakeWaypoint = 'test';
  const journeyContext = new JourneyContext({ [fakeWaypoint]: pageDataContext });
  const context = { journeyContext, waypoint: fakeWaypoint, fieldName };

  await expectValidatorToFailWithJourney(
    fieldValidators,
    fieldName,
    validatorName,
    values,
    context,
    errors
  );
}

/**
 * Expect a validator to pass.
 *
 * @param {array} fieldValidators List of validators to test
 * @param {string} fieldName Name of field to vextract from page data context
 * @param {string} validatorName Validator expected to not to be present
 * @param {mixed} values values you actually want to test, in the form {fieldName:value,...}
 * @param {mixed} validationContext Value to pass into runValidators
 * @returns {Promise} Pending processor
 */
async function expectValidatorToPassWithJourney (
  fieldValidators,
  fieldName,
  validatorName,
  values,
  validationContext
) {
  let errors = [];
  if (Array.isArray(fieldValidators) && fieldValidators.length > 0) {
    fieldValidators.filter((validator) => validator.name === fieldName).forEach((validator) => {
      errors = validator.runValidators(values, validationContext);
    });
  }
  const result = (errors && errors.length > 0) ? errors.filter((r) => r.validator === validatorName).filter((r) => r.field === fieldName)[0] : undefined;
  // eslint-disable-next-line no-unused-expressions
  expect(result).to.be.undefined;
}

/**
 * Expect a validator to pass.
 *
 * @param {array} fieldValidators List of validators to test
 * @param {string} fieldName Name of field to vextract from page data context
 * @param {string} validatorName Validator expected to have failed in errors
 * @param {mixed} values these are the values you actually want to test, in the form {fieldName:value,...}
 * @param {{}} pageDataContext Value to pass into processor to trigger validation fail
 * @returns {Promise} Pending processor
 */
async function expectValidatorToPass (
  fieldValidators,
  fieldName,
  validatorName,
  values = {}, // these are the values you actually want to test, in the form {fieldName:value,...}
  pageDataContext = {} // extra values which might be required in the data context within the journey
) {
  const fakeWaypoint = 'test';
  const journeyContext = new JourneyContext({ [fakeWaypoint]: pageDataContext });
  const context = { journeyContext, waypoint: fakeWaypoint, fieldName };

  await expectValidatorToPassWithJourney(
    fieldValidators,
    fieldName,
    validatorName,
    values,
    context
  );
}

module.exports = {
  expectValidatorToFailWithJourney,
  expectValidatorToFail,
  expectValidatorToPassWithJourney,
  expectValidatorToPass
};
