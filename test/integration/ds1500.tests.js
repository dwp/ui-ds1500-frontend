const Browser = require('zombie');
const chai = require('chai');
const { CONFIRM_BTN } = require('./constants');
const expect = chai.expect;

Browser.localhost('localhost', 3000);
Browser.silent = true;

describe('ds1500 form page', function () {
  const browser = new Browser();

  before(function (done) {
    return browser.visit('/ds1500', done);
  });

  it('should be successful', function () {
    browser.assert.success();
  });

  it('should have the correct heading', function () {
    browser.assert.text('h1', 'Patient details');
  });

  it('should be able to submit the form as a GP and see the download page', function (done) {
    browser
      .fill('patientName', 'name')
      .fill('patientAddress', 'address')
      .fill('patientPostcode', 'postcode')
      .fill('patientDateOfBirthDay', '1')
      .fill('patientDateOfBirthMonth', '1')
      .fill('patientDateOfBirthYear', '1980')
      .fill('patientNino', 'AA370773A')
      .fill('diagnosis', 'test')
      .fill('dateOfDiagnosisMonth', '1')
      .fill('dateOfDiagnosisYear', '1980')
      .fill('otherDiagnoses', 'test')
      .choose('Yes')
      .choose('Representative')
      .fill('representativeName', 'name')
      .fill('representativeAddress', 'address')
      .fill('representativePostcode', 'postcode')
      .fill('clinicalFeatures', 'test')
      .fill('treatment', 'test')
      .fill('otherIntervention', 'test')
      .choose('General Practitioner')
      .fill('gmcNumber', '1234567')
      .fill('declarationAdditionalDetail', 'asd')
      .fill('gpName', 'gp name')
      .fill('trustName', 'trust name')
      .fill('gpAddress', 'gp address')
      .fill('gpPhone', '0114 2393939')
      .pressButton(CONFIRM_BTN, function () {
        browser.assert.text('h1', 'Download your documents');
        done();
      });
  });

  it('should show the fee form as GP was selected', function () {
    expect(browser.query('#fee-form')).to.exist; // eslint-disable-line
  });

  it('should be able to go back and fill a new form in as a GMC consultant', function (done) {
    browser.pressButton('Send another DS1500', function () {
      browser.clickLink('Start now', function () {
        browser
          .fill('patientName', 'name')
          .fill('patientAddress', 'address')
          .fill('patientPostcode', 'postcode')
          .fill('patientDateOfBirthDay', '1')
          .fill('patientDateOfBirthMonth', '1')
          .fill('patientDateOfBirthYear', '1980')
          .fill('patientNino', 'AA370773A')
          .fill('diagnosis', 'test')
          .fill('dateOfDiagnosisMonth', '1')
          .fill('dateOfDiagnosisYear', '1980')
          .fill('otherDiagnoses', 'test')
          .choose('Yes')
          .choose('Representative')
          .fill('representativeName', 'rep name')
          .fill('representativeAddress', 'rep address')
          .fill('representativePostcode', 'postcode')
          .fill('clinicalFeatures', 'test')
          .fill('treatment', 'test')
          .fill('otherIntervention', 'test')
          .choose('GMC registered consultant')
          .fill('gmcNumber', '1234567')
          .fill('declarationAdditionalDetail', 'asd')
          .fill('gpName', 'gp name')
          .fill('trustName', 'trust name')
          .fill('gpAddress', 'gp address')
          .fill('gpPhone', '0114 2393939')
          .pressButton(CONFIRM_BTN, function () {
            browser.assert.text('h1', 'Download your documents');
            done();
          });
      });
    });
  });

  it('should show the fee form if GMC consultant is selected', function () {
    expect(browser.query('#fee-form')).to.exist; // eslint-disable-line
  });

  it('should be able to go back and fill a new form in as Other', function (done) {
    browser.pressButton('Send another DS1500', function () {
      browser.clickLink('Start now', function () {
        browser
          .fill('patientName', 'name')
          .fill('patientAddress', 'address')
          .fill('patientPostcode', 'postcode')
          .fill('patientDateOfBirthDay', '1')
          .fill('patientDateOfBirthMonth', '1')
          .fill('patientDateOfBirthYear', '1980')
          .fill('patientNino', 'AA370773A')
          .fill('diagnosis', 'test')
          .fill('dateOfDiagnosisMonth', '1')
          .fill('dateOfDiagnosisYear', '1980')
          .fill('otherDiagnoses', 'test')
          .choose('Yes')
          .choose('Representative')
          .fill('representativeName', 'rep name')
          .fill('representativeAddress', 'rep address')
          .fill('representativePostcode', 'postcode')
          .fill('clinicalFeatures', 'test')
          .fill('treatment', 'test')
          .fill('otherIntervention', 'test')
          .choose('Other')
          .fill('gmcNumber', '1234567')
          .fill('declarationAdditionalDetail', 'Macmillan nurse')
          .fill('gpName', 'gp name')
          .fill('trustName', 'trust name')
          .fill('gpAddress', 'gp address')
          .fill('gpPhone', '0114 2393939')
          .pressButton(CONFIRM_BTN, function () {
            browser.assert.text('h1', 'Download your documents');
            done();
          });
      });
    });
  });

  it('should not show the fee form if Other is selected', function () {
    expect(browser.query('#fee-form')).not.to.exist; // eslint-disable-line
  });

  it('should show the transaction id', function () {
    browser.assert.text('.form-label-bold', '0000-0000-FAKE-ID');
  });
});
