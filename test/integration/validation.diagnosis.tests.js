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

describe('validation: diagnosis', function () {
  it('should trigger error if left blank', function () {
    browser.fill('diagnosis', '');
    browser.pressButton(CONFIRM_BTN);
    browser.assert.text('#diagnosis-error .parsley-required', 'Describe your patient\'s diagnosis');
  });

  it('should trigger error if invalid charaters are entered', function () {
    browser.fill('diagnosis', '$%^&*()');
    browser.pressButton(CONFIRM_BTN);
    browser.assert.text('#diagnosis-error .parsley-invalidcharacters', 'Contains invalid characters: $%&');
  });

  it('should reject strings longer than 126 characters', function () {
    browser.fill('diagnosis', '123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 1234567');
    browser.pressButton(CONFIRM_BTN);
    browser.assert.text('#diagnosis-error .parsley-maxlength', 'Your patient\'s diagnosis has a maximum length of 126 characters');
  });

  it('should accept standard values', function () {
    browser.fill('diagnosis', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean congue tortor ex, ut lobortis est venenatis at.');
    browser.pressButton(CONFIRM_BTN);
    expect(browser.query('#diagnosis-error li')).not.to.exist; // eslint-disable-line
  });
});
