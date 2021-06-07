const Browser = require('zombie');
const chai = require('chai');
const expect = chai.expect;
const { CONFIRM_BTN } = require('./constants');

Browser.localhost('localhost', 3000);
Browser.silent = true;

const browser = new Browser();

before(function () {
  return browser.visit('/ds1500');
});

describe('validation: otherIntervention', function () {
  it('should not trigger error if left blank', function () {
    browser.fill('otherIntervention', '');
    browser.pressButton(CONFIRM_BTN);
    expect(browser.query('#otherIntervention-error li')).not.to.exist; // eslint-disable-line
  });

  it('should trigger error if invalid charaters are entered', function () {
    browser.fill('otherIntervention', '$%^&*()');
    browser.pressButton(CONFIRM_BTN);
    browser.assert.text('#otherIntervention-error .parsley-invalidcharacters', 'Contains invalid characters: $%&');
  });

  it('should reject strings longer than 120 characters', function () {
    browser.fill('otherIntervention', '123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 1');
    browser.pressButton(CONFIRM_BTN);
    browser.assert.text('#otherIntervention-error .parsley-maxlength', 'Intervention and planned treatment has a maximum length of 120 characters');
  });

  it('should accept standard values', function () {
    browser.fill('otherIntervention', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean congue tortor ex, ut lobortis est venenatis at.');
    browser.pressButton(CONFIRM_BTN);
    expect(browser.query('#otherIntervention-error li')).not.to.exist; // eslint-disable-line
  });
});
