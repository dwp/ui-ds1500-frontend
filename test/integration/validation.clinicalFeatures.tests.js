const Browser = require('zombie');
const chai = require('chai');
const { CONFIRM_BTN } = require('./constants');

const expect = chai.expect;

Browser.localhost('localhost', 3000);
Browser.silent = true;

const browser = new Browser();

before(function () {
  return browser.visit('/ds1500');
});

describe('validation: clinicalFeatures', function () {
  it('should trigger error if left blank', function () {
    browser.fill('clinicalFeatures', '');
    browser.pressButton(CONFIRM_BTN);
    browser.assert.text('#clinicalFeatures-error .parsley-required', 'Describe the clinical features');
  });

  it('should trigger error if invalid charaters are entered', function () {
    browser.fill('clinicalFeatures', '$%^&*()');
    browser.pressButton(CONFIRM_BTN);
    browser.assert.text('#clinicalFeatures-error .parsley-invalidcharacters', 'Contains invalid characters: $%&');
  });

  it('should reject strings longer than 236 characters', function () {
    browser.fill('clinicalFeatures', '123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 1234567');
    browser.pressButton(CONFIRM_BTN);
    browser.assert.text('#clinicalFeatures-error .parsley-maxlength', 'Clinical features has a maximum length of 236 characters');
  });

  it('should accept standard values', function () {
    browser.fill('clinicalFeatures', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean congue tortor ex, ut lobortis est venenatis at.');
    browser.pressButton(CONFIRM_BTN);
    expect(browser.query('#clinicalFeatures-error li')).not.to.exist; // eslint-disable-line
  });
});
