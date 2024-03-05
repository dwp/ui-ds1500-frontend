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

describe('validation: dateOfSpecialRulesDay', function () {
  it('should trigger error if left blank', function () {
    browser.fill('dateOfSpecialRulesDay', '');
    browser.fill('dateOfSpecialRulesMonth', '1');
    browser.fill('dateOfSpecialRulesYear', '1981');
    browser.pressButton(CONFIRM_BTN);
    browser.assert.text('#dateOfSpecialRules-error .parsley-required', 'Enter day met Special Rules');
  });

  it('should reject values outside the range 1 and 31', function () {
    browser.fill('dateOfSpecialRulesDay', '0');
    browser.fill('dateOfSpecialRulesMonth', '1');
    browser.fill('dateOfSpecialRulesYear', '1981');
    browser.pressButton(CONFIRM_BTN);
    browser.assert.text('#dateOfSpecialRules-error .parsley-range', 'Day must be between 1 and 31');
  });

  it('should accept values inside the range 1 and 31', function () {
    browser.fill('dateOfSpecialRulesDay', '2');
    browser.fill('dateOfSpecialRulesMonth', '2');
    browser.fill('dateOfSpecialRulesYear', '1981');
    browser.pressButton(CONFIRM_BTN);
    expect(browser.query('#dateOfSpecialRules-error li')).not.to.exist; // eslint-disable-line
  });
});

describe('validation: dateOfSpecialRulesMonth', function () {
  it('should trigger error if left blank', function () {
    browser.fill('dateOfSpecialRulesDay', '1');
    browser.fill('dateOfSpecialRulesMonth', '');
    browser.fill('dateOfSpecialRulesYear', '1981');
    browser.pressButton(CONFIRM_BTN);
    browser.assert.text('#dateOfSpecialRules-error .parsley-required', 'Enter month met Special Rules');
  });

  it('should reject values outside the range 1 and 12', function () {
    browser.fill('dateOfSpecialRulesDay', '1');
    browser.fill('dateOfSpecialRulesMonth', '0');
    browser.fill('dateOfSpecialRulesYear', '1981');
    browser.pressButton(CONFIRM_BTN);
    browser.assert.text('#dateOfSpecialRules-error .parsley-range', 'Month must be between 1 and 12');
  });

  it('should accept values inside the range 1 and 12', function () {
    browser.fill('dateOfSpecialRulesDay', '1');
    browser.fill('dateOfSpecialRulesMonth', '2');
    browser.fill('dateOfSpecialRulesYear', '1981');
    browser.pressButton(CONFIRM_BTN);
    expect(browser.query('#dateOfSpecialRules-error li')).not.to.exist; // eslint-disable-line
  });
});

describe('validation: dateOfSpecialRulesYear', function () {
  it('should trigger error if left blank', function () {
    browser.fill('dateOfSpecialRulesDay', '1');
    browser.fill('dateOfSpecialRulesMonth', '1');
    browser.fill('dateOfSpecialRulesYear', '');
    browser.pressButton(CONFIRM_BTN);
    browser.assert.text('#dateOfSpecialRules-error .parsley-required', 'Enter year met Special Rules');
  });

  it('should reject values outside the range 1890 and ' + new Date().getFullYear(), function () {
    browser.fill('dateOfSpecialRulesDay', '1');
    browser.fill('dateOfSpecialRulesMonth', '1');
    browser.fill('dateOfSpecialRulesYear', '1889');
    browser.pressButton(CONFIRM_BTN);
    browser.assert.text('#dateOfSpecialRules-error .parsley-range', 'Enter a valid year');
  });

  it('should accept values inside the range 1890 and ' + new Date().getFullYear(), function () {
    browser.fill('dateOfSpecialRulesDay', '1');
    browser.fill('dateOfSpecialRulesMonth', '7');
    browser.fill('dateOfSpecialRulesYear', '1981');
    browser.pressButton(CONFIRM_BTN);
    expect(browser.query('#dateOfSpecialRules-error li')).not.to.exist; // eslint-disable-line
  });
});

describe('validation: dateOfSpecialRules', function () {
  it('should accept valid dates', function () {
    browser.fill('dateOfSpecialRulesDay', '2');
    browser.fill('dateOfSpecialRulesMonth', '4');
    browser.fill('dateOfSpecialRulesYear', '1981');
    browser.pressButton(CONFIRM_BTN);
    expect(browser.query('#dateOfSpecialRules-error li')).not.to.exist; // eslint-disable-line
  });

  it('should accept valid dates with leading zeros', function () {
    browser.fill('dateOfSpecialRulesDay', '02');
    browser.fill('dateOfSpecialRulesMonth', '04');
    browser.fill('dateOfSpecialRulesYear', '1981');
    browser.pressButton(CONFIRM_BTN);
    expect(browser.query('#dateOfSpecialRules-error li')).not.to.exist; // eslint-disable-line
  });

  it('should reject future dates', function (done) {
    browser.fill('dateOfSpecialRulesDay', new Date().getDay() + 1).toString();
    browser.fill('dateOfSpecialRulesMonth', new Date().getMonth()).toString();
    browser.fill('dateOfSpecialRulesYear', new Date().getFullYear().toString());
    browser.pressButton(CONFIRM_BTN);
    function loaded (window) {
      return window.document.querySelector('#dateOfSpecialRules-error li').innerHtml === 'Special Rules date cannot be in the future';
    }
    browser.wait(loaded, function () {
      browser.assert.text('#dateOfSpecialRules-error', 'SpecialRules cannot be in the future');
      done();
    });
  });
});
