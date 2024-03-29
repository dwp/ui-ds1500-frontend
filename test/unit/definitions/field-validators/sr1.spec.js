const { expectValidatorToFail, expectValidatorToPass } = require('../../../helpers/validator-assertions');
const { validNumbers } = require('../../../helpers/commonValues');
const validators = require('../../../../definitions/fields/sr1')();

const defaultValidators = {
  patientName: '',
  patientAddress: '',
  patientDateOfBirth: { dd: '', mm: '', yyyy: '' },
  dateOfDiagnosis: { dd: '', mm: '', yyyy: '' },
  dateOfSpecialRules: { dd: '', mm: '', yyyy: '' },
  patientNino: '',
  diagnosisAware: '',
  patientAware: '',
  representativeName: '',
  representativePostcode: '',
  clinicalFeatures: ''
}

describe('Validators: sr1', () => {
  describe('field: patientName', () => {
    it('should fail "required" validator if no value is provided', async () => {
      await expectValidatorToFail(validators, 'patientName', 'Required', '', { ...defaultValidators }, {
        summary: 'sr1:patientName.empty'
      });
    });

    it('should pass "required" validator if a non-empty value is provided', async () => {
      await expectValidatorToPass(validators, 'patientName', 'Required', '', { patientName: 'test-value' });
    });

    it('should fail "hasValidWordsPatientName" validator if both first words greater than 58 characters long and last word greater than 35 characters', async () => {
      const patientName = 'a'.repeat(59) + ' ' + 'b'.repeat(36)
      await expectValidatorToFail(validators, 'patientName', 'hasValidWordsPatientName', patientName, { ...defaultValidators, patientName }, {
        summary: 'sr1:patientName.firstLastTooLong'
      });
    });

    it('should fail "hasValidWordsPatientName" validator if first word is less than 2 characters', async () => {
      const patientName = 'a'
      await expectValidatorToFail(validators, 'patientName', 'hasValidWordsPatientName', patientName, { ...defaultValidators, patientName }, {
        summary: 'sr1:patientName.wordTooShort'
      });
    });

    it('should fail "hasValidWordsPatientName" validator if first words greater than 58 characters long', async () => {
      const patientName = 'a'.repeat(59) + ' ' + 'b'.repeat(30)
      await expectValidatorToFail(validators, 'patientName', 'hasValidWordsPatientName', patientName, { ...defaultValidators, patientName }, {
        summary: 'sr1:patientName.firstWordTooLong'
      });
    });

    it('should fail "hasValidWordsPatientName" validator if last word greater than 35 characters long', async () => {
      const patientName = 'a'.repeat(50) + ' ' + 'b'.repeat(36)
      await expectValidatorToFail(validators, 'patientName', 'hasValidWordsPatientName', patientName, { ...defaultValidators, patientName }, {
        summary: 'sr1:patientName.lastWordTooLong'
      });
    });

    it('should pass "hasValidWordsPatientName" validator if first words less than 58 characters long and last word less than 35 characters long', async () => {
      const patientName = 'a'.repeat(10) + ' ' + 'b'.repeat(5)
      await expectValidatorToPass(validators, 'patientName', 'hasValidWordsPatientName', patientName, { ...defaultValidators, patientName });
    });

    it('should fail "isValidPatientName" validator if name has special char at end', async () => {
      const patientName = 'test@'
      await expectValidatorToFail(validators, 'patientName', 'isValidPatientName', patientName, { ...defaultValidators, patientName }, {
        summary: 'sr1:patientName.endCharInvalid'
      });
    });

    it('should fail "isValidPatientName" validator if name has special char', async () => {
      const patientName = '@test'
      await expectValidatorToFail(validators, 'patientName', 'isValidPatientName', patientName, { ...defaultValidators, patientName }, {
        summary: 'sr1:patientName.specialChar'
      });
    });

    it('should fail "isValidPatientName" validator if name is invalid', async () => {
      const patientName = 'test12t'
      await expectValidatorToFail(validators, 'patientName', 'isValidPatientName', patientName, { ...defaultValidators, patientName }, {
        summary: 'sr1:patientName.pattern'
      });
    });

    it('should pass "isValidPatientName" validator if name is valid', async () => {
      const patientName = 'test tester'
      await expectValidatorToPass(validators, 'patientName', 'isValidPatientName', patientName, { ...defaultValidators, patientName });
    });
  });

  describe('field: patientAddress', () => {
    it('should fail "required" validator if no value is provided', async () => {
      await expectValidatorToFail(validators, 'patientAddress', 'Required', '', { ...defaultValidators }, {
        summary: 'sr1:patientAddress.empty'
      });
    });

    it('should pass "required" validator if a non-empty value is provided', async () => {
      const patientAddress = 'London'
      await expectValidatorToPass(validators, 'patientAddress', 'Required', patientAddress, { ...defaultValidators, patientAddress });
    });

    it('should fail "hasValidWords" validator if words greater than 58 characters long', async () => {
      const patientAddress = 'a'.repeat(59)
      await expectValidatorToFail(validators, 'patientAddress', 'hasValidWords', patientAddress, { ...defaultValidators, patientAddress }, {
        summary: 'sr1:patientAddress.wordTooLong'
      });
    });

    it('should pass "hasValidWords" validator if words less than 59 characters long', async () => {
      const patientAddress = 'a'.repeat(10)
      await expectValidatorToPass(validators, 'patientAddress', 'hasValidWords', patientAddress, { ...defaultValidators, patientAddress });
    });

    it('should pass "regex" validator if a valid value is provided', async () => {
      const patientAddress = '12 London road'
      await expectValidatorToPass(validators, 'patientAddress', 'Regex', patientAddress, { ...defaultValidators, patientAddress });
    });
  })

  describe('field: patientPostcode', () => {
    it('should fail "required" validator if no value is provided', async () => {
      await expectValidatorToFail(validators, 'patientPostcode', 'Required', '', { ...defaultValidators }, {
        summary: 'sr1:patientPostcode.empty'
      });
    });

    it('should pass "required" validator if a non-empty value is provided', async () => {
      const patientPostcode = 'SW1 2AB'
      await expectValidatorToPass(validators, 'patientPostcode', 'Required', patientPostcode, { ...defaultValidators, patientPostcode });
    });

    it('should fail "strlen" validator if invalid value is provided', async () => {
      const patientPostcode = 'SW12 2ABC'
      await expectValidatorToFail(validators, 'patientPostcode', 'Strlen', patientPostcode, { ...defaultValidators, patientPostcode }, {
        summary: 'sr1:patientPostcode.tooLong'
      });
    });

    it('should pass "strlen" validator if a valid value is provided', async () => {
      const patientPostcode = 'SW12 2AB'
      await expectValidatorToPass(validators, 'patientPostcode', 'Strlen', patientPostcode, { ...defaultValidators, patientPostcode });
    });

    it('should fail "regex" validator if invalid value is provided', async () => {
      const patientPostcode = '11X X11'
      await expectValidatorToFail(validators, 'patientPostcode', 'Regex', patientPostcode, { ...defaultValidators, patientPostcode }, {
        summary: 'sr1:patientPostcode.invalid'
      });
    });

    it('should pass "regex" validator if a valid value is provided', async () => {
      const patientPostcode = 'AA1 1AA'
      await expectValidatorToPass(validators, 'patientPostcode', 'Regex', patientPostcode, { ...defaultValidators, patientPostcode });
    });
  })

  describe('field: patientNino', () => {
    it('should pass "optional" validator if no nino provided', async () => {
      await expectValidatorToPass(validators, 'patientNino', 'optional', '', { ...defaultValidators });
    });

    it('should fail "nino" validator if invalid nino provided', async () => {
      const patientNino = 'ABCD123456'
      await expectValidatorToFail(validators, 'patientNino', 'Nino', patientNino, { ...defaultValidators, patientNino }, {
        summary: 'sr1:patientNino.invalid'
      });
    });

    it('should pass "nino" validator if valid nino provided', async () => {
      const patientNino = 'AA370773A'
      await expectValidatorToPass(validators, 'patientNino', 'Nino', patientNino, { ...defaultValidators, patientNino });
    });
  });

  describe('field: diagnosis', () => {
    it('should fail "required" validator if no value is provided', async () => {
      await expectValidatorToFail(validators, 'diagnosis', 'Required', '', { ...defaultValidators }, {
        summary: 'sr1:diagnosis.empty'
      });
    });

    it('should pass "required" validator if a non-empty value is provided', async () => {
      await expectValidatorToPass(validators, 'diagnosis', 'Required', 'test-value', { diagnosis: 'test-value' });
    });

    it('should fail "strlen" validator if invalid length is provided', async () => {
      const diagnosis = 'a'.repeat(50) + '' + 'b'.repeat(50) + '' + 'c'.repeat(59)
      await expectValidatorToFail(validators, 'diagnosis', 'Strlen', diagnosis, { ...defaultValidators, diagnosis }, {
        summary: 'sr1:diagnosis.tooLong'
      });
    });

    it('should pass "strlen" validator if a valid length is provided', async () => {
      const diagnosis = 'a'.repeat(50) + '' + 'b'.repeat(50)
      await expectValidatorToPass(validators, 'diagnosis', 'Strlen', diagnosis, { ...defaultValidators, diagnosis });
    });

    it('should fail "hasValidWords" validator if words greater than 58 characters long', async () => {
      const diagnosis = 'a'.repeat(59)
      await expectValidatorToFail(validators, 'diagnosis', 'hasValidWords', diagnosis, { ...defaultValidators, diagnosis }, {
        summary: 'sr1:diagnosis.wordTooLong'
      });
    });

    it('should pass "hasValidWords" validator if words less than 59 characters long', async () => {
      const diagnosis = 'a'.repeat(10)
      await expectValidatorToPass(validators, 'diagnosis', 'hasValidWords', diagnosis, { ...defaultValidators, diagnosis });
    });

    it('should pass "regex" validator if a valid pattern is provided', async () => {
      const diagnosis = 'test test'
      await expectValidatorToPass(validators, 'diagnosis', 'Regex', diagnosis, { ...defaultValidators, diagnosis });
    });
  });

  describe('field: otherDiagnoses', () => {
    it('should pass "optional" validator if no value provided', async () => {
      await expectValidatorToPass(validators, 'otherDiagnoses', 'optional', '', { ...defaultValidators });
    });

    it('should fail "strlen" validator if invalid length is provided', async () => {
      const otherDiagnoses = 'a'.repeat(50) + '' + 'b'.repeat(50) + '' + 'c'.repeat(50)
      await expectValidatorToFail(validators, 'otherDiagnoses', 'Strlen', otherDiagnoses, { ...defaultValidators, otherDiagnoses }, {
        summary: 'sr1:otherDiagnoses.tooLong'
      });
    });

    it('should pass "strlen" validator if a valid length is provided', async () => {
      const otherDiagnoses = 'a'.repeat(50) + '' + 'b'.repeat(50)
      await expectValidatorToPass(validators, 'otherDiagnoses', 'Strlen', otherDiagnoses, { ...defaultValidators, otherDiagnoses });
    });

    it('should fail "hasValidWords" validator if words greater than 58 characters long', async () => {
      const otherDiagnoses = 'a'.repeat(59)
      await expectValidatorToFail(validators, 'otherDiagnoses', 'hasValidWords', otherDiagnoses, { ...defaultValidators, otherDiagnoses }, {
        summary: 'sr1:otherDiagnoses.wordTooLong'
      });
    });

    it('should pass "hasValidWords" validator if words less than 59 characters long', async () => {
      const otherDiagnoses = 'a'.repeat(58)
      await expectValidatorToPass(validators, 'otherDiagnoses', 'hasValidWords', otherDiagnoses, { ...defaultValidators, otherDiagnoses });
    });

    it('should pass "regex" validator if a valid pattern is provided', async () => {
      const otherDiagnoses = 'test test'
      await expectValidatorToPass(validators, 'otherDiagnoses', 'Regex', otherDiagnoses, { ...defaultValidators, otherDiagnoses });
    });
  })

  describe('field: diagnosisAware', () => {
    it('should fail "required" validator if no value is provided', async () => {
      await expectValidatorToFail(validators, 'diagnosisAware', 'Required', '', { ...defaultValidators }, {
        summary: 'sr1:diagnosisAware.empty'
      });
    });

    it('should pass "required" validator if a non-empty value is provided', async () => {
      await expectValidatorToPass(validators, 'diagnosisAware', 'Required', 'test-value', { diagnosisAware: 'test-value' });
    });

    it('should pass "inArray" validator if value is yes', async () => {
      await expectValidatorToPass(validators, 'diagnosisAware', 'inArray', 'Yes', { diagnosisAware: 'Yes' });
    });

    it('should pass "inArray" validator if value is no', async () => {
      await expectValidatorToPass(validators, 'diagnosisAware', 'inArray', 'No', { diagnosisAware: 'No' });
    });
  })

  describe('field: patientAware', () => {
    it('should fail "required" validator if no value is provided', async () => {
      await expectValidatorToFail(validators, 'patientAware', 'Required', '', { ...defaultValidators }, {
        summary: 'sr1:patientAware.empty'
      });
    });

    it('should pass "required" validator if a non-empty value is provided', async () => {
      await expectValidatorToPass(validators, 'patientAware', 'Required', 'test-value', { patientAware: 'test-value' });
    });

    it('should pass "inArray" validator if value is yes', async () => {
      await expectValidatorToPass(validators, 'patientAware', 'inArray', 'Yes', { patientAware: 'Yes' });
    });

    it('should pass "inArray" validator if value is no', async () => {
      await expectValidatorToPass(validators, 'patientAware', 'inArray', 'No', { patientAware: 'No' });
    });
  })

  describe('field: representativeName', () => {
    it('should pass "optional" validator if no value provided', async () => {
      await expectValidatorToPass(validators, 'representativeName', 'optional', '', { ...defaultValidators });
    });

    it('should fail "hasValidWordsRepresentativeDetails" validator if words greater than 43 characters long', async () => {
      const representativeName = 'a'.repeat(44)
      await expectValidatorToFail(validators, 'representativeName', 'hasValidWordsRepresentativeDetails', representativeName, { ...defaultValidators, representativeName }, {
        summary: 'sr1:representativeName.wordTooLong'
      });
    });

    it('should pass "hasValidWordsRepresentativeDetails" validator if words less than 44 characters long', async () => {
      const representativeName = 'a'.repeat(43)
      await expectValidatorToPass(validators, 'representativeName', 'hasValidWordsRepresentativeDetails', representativeName, { ...defaultValidators, representativeName });
    });

    it('should pass "regex" validator if a valid pattern is provided', async () => {
      const representativeName = 'test test'
      await expectValidatorToPass(validators, 'representativeName', 'Regex', representativeName, { ...defaultValidators, representativeName });
    });
  })

  describe('field: representativeAddress', () => {
    it('should pass "optional" validator if no value provided', async () => {
      await expectValidatorToPass(validators, 'representativeAddress', 'optional', '', { ...defaultValidators });
    });

    it('should fail "hasValidWordsRepresentativeDetails" validator if words greater than 43 characters long', async () => {
      const representativeAddress = 'a'.repeat(44)
      await expectValidatorToFail(validators, 'representativeAddress', 'hasValidWordsRepresentativeDetails', representativeAddress, { ...defaultValidators, representativeAddress }, {
        summary: 'sr1:representativeAddress.wordTooLong'
      });
    });

    it('should pass "hasValidWordsRepresentativeDetails" validator if words less than 44 characters long', async () => {
      const representativeAddress = 'a'.repeat(43)
      await expectValidatorToPass(validators, 'representativeAddress', 'hasValidWordsRepresentativeDetails', representativeAddress, { ...defaultValidators, representativeAddress });
    });

    it('should pass "regex" validator if a valid pattern is provided', async () => {
      const representativeAddress = 'test test'
      await expectValidatorToPass(validators, 'representativeAddress', 'Regex', representativeAddress, { ...defaultValidators, representativeAddress });
    });
  })

  describe('field: representativePostcode', () => {
    it('should pass "optional" validator if no value provided', async () => {
      await expectValidatorToPass(validators, 'representativePostcode', 'optional', '', { ...defaultValidators });
    });

    it('should fail "strlen" validator if invalid length is provided', async () => {
      const representativePostcode = 'SW12 2ABC'
      await expectValidatorToFail(validators, 'representativePostcode', 'Strlen', representativePostcode, { ...defaultValidators, representativePostcode }, {
        summary: 'sr1:representativePostcode.tooLong'
      });
    });

    it('should pass "strlen" validator if a valid length is provided', async () => {
      const representativePostcode = 'SW12 2AB'
      await expectValidatorToPass(validators, 'otherDiagnoses', 'Strlen', representativePostcode, { ...defaultValidators, representativePostcode });
    });

    it('should fail "regex" validator if invalid value is provided', async () => {
      const representativePostcode = '11X X11'
      await expectValidatorToFail(validators, 'representativePostcode', 'Regex', representativePostcode, { ...defaultValidators, representativePostcode }, {
        summary: 'sr1:representativePostcode.invalid'
      });
    });

    it('should pass "regex" validator if a valid value is provided', async () => {
      const representativePostcode = 'AA1 1AA'
      await expectValidatorToPass(validators, 'representativePostcode', 'Regex', representativePostcode, { ...defaultValidators, representativePostcode });
    });
  })

  describe('field: clinicalFeatures', () => {
    it('should fail "required" validator if no value is provided', async () => {
      await expectValidatorToFail(validators, 'clinicalFeatures', 'Required', '', { ...defaultValidators }, {
        summary: 'sr1:clinicalFeatures.empty'
      });
    });

    it('should pass "required" validator if a non-empty value is provided', async () => {
      await expectValidatorToPass(validators, 'clinicalFeatures', 'Required', 'test-value', { clinicalFeatures: 'test-value' });
    });

    it('should fail "hasValidWords" validator if words greater than 58 characters long', async () => {
      const clinicalFeatures = 'a'.repeat(59)
      await expectValidatorToFail(validators, 'clinicalFeatures', 'hasValidWords', clinicalFeatures, { ...defaultValidators, clinicalFeatures }, {
        summary: 'sr1:clinicalFeatures.wordTooLong'
      });
    });

    it('should pass "hasValidWords" validator if words less than 59 characters long', async () => {
      const clinicalFeatures = 'a'.repeat(10)
      await expectValidatorToPass(validators, 'clinicalFeatures', 'hasValidWords', clinicalFeatures, { ...defaultValidators, clinicalFeatures });
    });

    it('should fail "strlen" validator if invalid length is provided', async () => {
      const clinicalFeatures = 'a'.repeat(50) + ' ' + 'b'.repeat(50) + ' ' + 'c'.repeat(50) + ' ' + 'd'.repeat(50) + ' ' + 'e'.repeat(50)
      await expectValidatorToFail(validators, 'clinicalFeatures', 'Strlen', clinicalFeatures, { ...defaultValidators, clinicalFeatures }, {
        summary: 'sr1:clinicalFeatures.tooLong'
      });
    });

    it('should pass "strlen" validator if a valid length is provided', async () => {
      const clinicalFeatures = 'a'.repeat(50) + '' + 'b'.repeat(50)
      await expectValidatorToPass(validators, 'clinicalFeatures', 'Strlen', clinicalFeatures, { ...defaultValidators, clinicalFeatures });
    });

    it('should pass "regex" validator if a valid pattern is provided', async () => {
      const clinicalFeatures = 'test test'
      await expectValidatorToPass(validators, 'clinicalFeatures', 'Regex', clinicalFeatures, { ...defaultValidators, clinicalFeatures });
    });
  });

  describe('field: treatment', () => {
    it('should fail "required" validator if no value is provided', async () => {
      await expectValidatorToFail(validators, 'treatment', 'Required', '', { ...defaultValidators }, {
        summary: 'sr1:treatment.empty'
      });
    });

    it('should pass "required" validator if a non-empty value is provided', async () => {
      await expectValidatorToPass(validators, 'treatment', 'Required', 'test-value', { treatment: 'test-value' });
    });

    it('should fail "hasValidWords" validator if words greater than 58 characters long', async () => {
      const treatment = 'a'.repeat(59)
      await expectValidatorToFail(validators, 'treatment', 'hasValidWords', treatment, { ...defaultValidators, treatment }, {
        summary: 'sr1:treatment.wordTooLong'
      });
    });

    it('should pass "hasValidWords" validator if words less than 59 characters long', async () => {
      const treatment = 'a'.repeat(10)
      await expectValidatorToPass(validators, 'treatment', 'hasValidWords', treatment, { ...defaultValidators, treatment });
    });

    it('should fail "strlen" validator if invalid length is provided', async () => {
      const treatment = 'a'.repeat(85) + ' ' + 'b'.repeat(85) + ' ' + 'c'.repeat(85)
      await expectValidatorToFail(validators, 'treatment', 'Strlen', treatment, { ...defaultValidators, treatment }, {
        summary: 'sr1:treatment.tooLong'
      });
    });

    it('should pass "strlen" validator if a valid length is provided', async () => {
      const treatment = 'a'.repeat(50) + '' + 'b'.repeat(50)
      await expectValidatorToPass(validators, 'treatment', 'Strlen', treatment, { ...defaultValidators, treatment });
    });

    it('should pass "regex" validator if a valid pattern is provided', async () => {
      const treatment = 'test test'
      await expectValidatorToPass(validators, 'treatment', 'Regex', treatment, { ...defaultValidators, treatment });
    });
  });

  describe('field: declaration', () => {
    it('should fail "required" validator if no value is provided', async () => {
      await expectValidatorToFail(validators, 'declaration', 'Required', '', { ...defaultValidators }, {
        summary: 'sr1:declaration.empty'
      });
    });

    it('should pass "required" validator if a non-empty value is provided', async () => {
      await expectValidatorToPass(validators, 'declaration', 'Required', 'test-value', { declaration: 'test-value' });
    });

    it('should pass "inArray" validator if value is General Practitioner', async () => {
      await expectValidatorToPass(validators, 'declaration', 'inArray', 'General Practitioner', { declaration: 'General Practitioner' });
    });

    it('should pass "inArray" validator if value is GMC registered consultant', async () => {
      await expectValidatorToPass(validators, 'declaration', 'inArray', 'GMC registered consultant', { declaration: 'GMC registered consultant' });
    });

    it('should pass "inArray" validator if value is Other', async () => {
      await expectValidatorToPass(validators, 'declaration', 'inArray', 'Other', { declaration: 'Other' });
    });
  })

  describe('field: gmcNumber', () => {
    it('should fail "required" validator if no value is provided', async () => {
      const declaration = 'General Practitioner'
      await expectValidatorToFail(validators, 'gmcNumber', 'Required', '', { ...defaultValidators, declaration }, {
        summary: 'sr1:gmcNumber.empty'
      });
    });

    it('should pass "required" validator if a non-empty value is provided', async () => {
      const setValidators = {
        declaration: 'General Practitioner',
        gmcNumber: '0123456'
      }

      await expectValidatorToPass(validators, 'gmcNumber', 'Required', setValidators.gmcNumber, { ...defaultValidators, ...setValidators });
    });

    it('should fail "strlen" validator if max invalid length is provided', async () => {
      const setValidators = {
        declaration: 'General Practitioner',
        gmcNumber: '0123456789'
      }
      await expectValidatorToFail(validators, 'gmcNumber', 'Strlen', setValidators.gmcNumber, { ...defaultValidators, ...setValidators }, {
        summary: 'sr1:gmcNumber.tooLong'
      });
    });

    it('should fail "strlen" validator if min invalid length is provided', async () => {
      const setValidators = {
        declaration: 'General Practitioner',
        gmcNumber: '01234'
      }
      await expectValidatorToFail(validators, 'gmcNumber', 'Strlen', setValidators.gmcNumber, { ...defaultValidators, ...setValidators }, {
        summary: 'sr1:gmcNumber.tooShort'
      });
    });

    it('should pass "strlen" validator if a valid length is provided', async () => {
      const setValidators = {
        declaration: 'General Practitioner',
        gmcNumber: '0123456'
      }
      await expectValidatorToPass(validators, 'gmcNumber', 'Strlen', setValidators.gmcNumber, { ...defaultValidators, ...setValidators });
    });

    it('should fail "regex" validator if invalid value is provided', async () => {
      const setValidators = {
        declaration: 'General Practitioner',
        gmcNumber: '@12e456'
      }
      await expectValidatorToFail(validators, 'gmcNumber', 'Regex', setValidators.gmcNumber, { ...defaultValidators, ...setValidators }, {
        summary: 'sr1:gmcNumber.pattern'
      });
    });

    it('should pass "regex" validator if a valid value is provided', async () => {
      const setValidators = {
        declaration: 'General Practitioner',
        gmcNumber: '0123456'
      }
      await expectValidatorToPass(validators, 'gmcNumber', 'Regex', setValidators.gmcNumber, { ...defaultValidators, ...setValidators });
    });
  })

  describe('field: gmcNumberConsultant', () => {
    it('should fail "required" validator if no value is provided', async () => {
      const declaration = 'GMC registered consultant'
      await expectValidatorToFail(validators, 'gmcNumberConsultant', 'Required', '', { ...defaultValidators, declaration }, {
        summary: 'sr1:gmcNumberConsultant.empty'
      });
    });

    it('should pass "required" validator if a non-empty value is provided', async () => {
      const setValidators = {
        declaration: 'GMC registered consultant',
        gmcNumberConsultant: '0123456'
      }

      await expectValidatorToPass(validators, 'gmcNumberConsultant', 'Required', setValidators.gmcNumberConsultant, { ...defaultValidators, ...setValidators });
    });

    it('should fail "strlen" validator if max invalid length is provided', async () => {
      const setValidators = {
        declaration: 'GMC registered consultant',
        gmcNumberConsultant: '0123456789'
      }
      await expectValidatorToFail(validators, 'gmcNumberConsultant', 'Strlen', setValidators.gmcNumberConsultant, { ...defaultValidators, ...setValidators }, {
        summary: 'sr1:gmcNumberConsultant.tooLong'
      });
    });

    it('should fail "strlen" validator if min invalid length is provided', async () => {
      const setValidators = {
        declaration: 'GMC registered consultant',
        gmcNumberConsultant: '01234'
      }
      await expectValidatorToFail(validators, 'gmcNumberConsultant', 'Strlen', setValidators.gmcNumberConsultant, { ...defaultValidators, ...setValidators }, {
        summary: 'sr1:gmcNumberConsultant.tooShort'
      });
    });

    it('should pass "strlen" validator if a valid length is provided', async () => {
      const setValidators = {
        declaration: 'GMC registered consultant',
        gmcNumberConsultant: '0123456'
      }
      await expectValidatorToPass(validators, 'gmcNumberConsultant', 'Strlen', setValidators.gmcNumberConsultant, { ...defaultValidators, ...setValidators });
    });

    it('should fail "regex" validator if invalid value is provided', async () => {
      const setValidators = {
        declaration: 'GMC registered consultant',
        gmcNumberConsultant: '@12e456'
      }
      await expectValidatorToFail(validators, 'gmcNumberConsultant', 'Regex', setValidators.gmcNumberConsultant, { ...defaultValidators, ...setValidators }, {
        summary: 'sr1:gmcNumberConsultant.pattern'
      });
    });

    it('should pass "regex" validator if a valid value is provided', async () => {
      const setValidators = {
        declaration: 'GMC registered consultant',
        gmcNumberConsultant: '0123456'
      }
      await expectValidatorToPass(validators, 'gmcNumberConsultant', 'Regex', setValidators.gmcNumberConsultant, { ...defaultValidators, ...setValidators });
    });
  })

  describe('field: declarationAdditionalDetail', () => {
    it('should fail "required" validator if no value is provided', async () => {
      const declaration = 'Other'
      await expectValidatorToFail(validators, 'declarationAdditionalDetail', 'Required', '', { ...defaultValidators, declaration }, {
        summary: 'sr1:declarationAdditionalDetail.empty'
      });
    });

    it('should pass "required" validator if a non-empty value is provided', async () => {
      const setValidators = {
        declaration: 'Other',
        declarationAdditionalDetail: 'test'
      }

      await expectValidatorToPass(validators, 'declarationAdditionalDetail', 'Required', setValidators.declarationAdditionalDetail, { ...defaultValidators, ...setValidators });
    });

    it('should pass "regex" validator if a valid value is provided', async () => {
      const setValidators = {
        declaration: 'Other',
        declarationAdditionalDetail: 'test test'
      }
      await expectValidatorToPass(validators, 'declarationAdditionalDetail', 'Regex', setValidators.declarationAdditionalDetail, { ...defaultValidators, ...setValidators });
    });

    it('should fail "hasValidWords" validator if words greater than 58 characters long', async () => {
      const setValidators = {
        declaration: 'Other',
        declarationAdditionalDetail: 'a'.repeat(59)
      }
      await expectValidatorToFail(validators, 'declarationAdditionalDetail', 'hasValidWords', setValidators.declarationAdditionalDetail, { ...defaultValidators, ...setValidators }, {
        summary: 'sr1:declarationAdditionalDetail.wordTooLong'
      });
    });

    it('should pass "hasValidWords" validator if words less than 59 characters long', async () => {
      const setValidators = {
        declaration: 'Other',
        declarationAdditionalDetail: 'a'.repeat(10)
      }
      await expectValidatorToPass(validators, 'declarationAdditionalDetail', 'hasValidWords', setValidators.declarationAdditionalDetail, { ...defaultValidators, ...setValidators });
    });
  })

  describe('field: gpName', () => {
    it('should fail "required" validator if no value is provided', async () => {
      await expectValidatorToFail(validators, 'gpName', 'Required', '', { ...defaultValidators }, {
        summary: 'sr1:gpName.empty'
      });
    });

    it('should pass "required" validator if a non-empty value is provided', async () => {
      const gpName = 'John'
      await expectValidatorToPass(validators, 'gpName', 'Required', gpName, { ...defaultValidators, gpName });
    });

    it('should pass "regex" validator if a valid value is provided', async () => {
      const gpName = 'John Doe'
      await expectValidatorToPass(validators, 'gpName', 'Regex', gpName, { ...defaultValidators, gpName });
    });

    it('should fail "hasValidWords" validator if words greater than 58 characters long', async () => {
      const gpName = 'a'.repeat(59)
      await expectValidatorToFail(validators, 'gpName', 'hasValidWords', gpName, { ...defaultValidators, gpName }, {
        summary: 'sr1:gpName.wordTooLong'
      });
    });

    it('should pass "hasValidWords" validator if words less than 59 characters long', async () => {
      const gpName = 'a'.repeat(10)
      await expectValidatorToPass(validators, 'gpName', 'hasValidWords', gpName, { ...defaultValidators, gpName });
    });
  })

  describe('field: gpAddress', () => {
    it('should fail "required" validator if no value is provided', async () => {
      await expectValidatorToFail(validators, 'gpAddress', 'Required', '', { ...defaultValidators }, {
        summary: 'sr1:gpAddress.empty'
      });
    });

    it('should pass "required" validator if a non-empty value is provided', async () => {
      const gpAddress = 'London'
      await expectValidatorToPass(validators, 'gpAddress', 'Required', gpAddress, { ...defaultValidators, gpAddress });
    });

    it('should pass "regex" validator if a valid value is provided', async () => {
      const gpAddress = '10 Downing street'
      await expectValidatorToPass(validators, 'gpAddress', 'Regex', gpAddress, { ...defaultValidators, gpAddress });
    });

    it('should fail "hasValidWords" validator if words greater than 58 characters long', async () => {
      const gpAddress = 'a'.repeat(59)
      await expectValidatorToFail(validators, 'gpAddress', 'hasValidWords', gpAddress, { ...defaultValidators, gpAddress }, {
        summary: 'sr1:gpAddress.wordTooLong'
      });
    });

    it('should pass "hasValidWords" validator if words less than 59 characters long', async () => {
      const gpAddress = 'a'.repeat(10)
      await expectValidatorToPass(validators, 'gpAddress', 'hasValidWords', gpAddress, { ...defaultValidators, gpAddress });
    });
  })

  describe('field: gpPostcode', () => {
    it('should fail "required" validator if no value is provided', async () => {
      await expectValidatorToFail(validators, 'gpPostcode', 'Required', '', { ...defaultValidators }, {
        summary: 'sr1:gpPostcode.empty'
      });
    });

    it('should pass "required" validator if a non-empty value is provided', async () => {
      const gpPostcode = 'SW1 2AB'
      await expectValidatorToPass(validators, 'gpPostcode', 'Required', gpPostcode, { ...defaultValidators, gpPostcode });
    });

    it('should fail "strlen" validator if invalid value is provided', async () => {
      const gpPostcode = 'SW12 2ABC'
      await expectValidatorToFail(validators, 'gpPostcode', 'Strlen', gpPostcode, { ...defaultValidators, gpPostcode }, {
        summary: 'sr1:gpPostcode.tooLong'
      });
    });

    it('should pass "strlen" validator if a valid value is provided', async () => {
      const gpPostcode = 'SW12 2AB'
      await expectValidatorToPass(validators, 'gpPostcode', 'Strlen', gpPostcode, { ...defaultValidators, gpPostcode });
    });

    it('should fail "regex" validator if invalid value is provided', async () => {
      const gpPostcode = '11X X11'
      await expectValidatorToFail(validators, 'gpPostcode', 'Regex', gpPostcode, { ...defaultValidators, gpPostcode }, {
        summary: 'sr1:gpPostcode.invalid'
      });
    });

    it('should pass "regex" validator if a valid value is provided', async () => {
      const gpPostcode = 'AA1 1AA'
      await expectValidatorToPass(validators, 'gpPostcode', 'Regex', gpPostcode, { ...defaultValidators, gpPostcode });
    });
  })

  describe('field: gpPhone', () => {
    it('should fail "required" validator if no value is provided', async () => {
      await expectValidatorToFail(validators, 'gpPhone', 'Required', '', { ...defaultValidators }, {
        summary: 'sr1:gpPhone.empty'
      });
    });

    it('should pass "required" validator if a non-empty value is provided', async () => {
      const gpPhone = '0123456789'
      await expectValidatorToPass(validators, 'gpPhone', 'Required', gpPhone, { ...defaultValidators, gpPhone });
    });

    it('should fail "isValidPhoneNumber" validator if invalid value is provided', async () => {
      const gpPhone = '@123c56789'
      await expectValidatorToFail(validators, 'gpPhone', 'isValidPhoneNumber', gpPhone, { ...defaultValidators, gpPhone }, {
        summary: 'sr1:gpPhone.invalid'
      });
    });

    validNumbers.forEach((gpPhone) => {
      it(`should pass "isValidPhoneNumber" validator if a valid value is provided - ${gpPhone}`, async () => {
        await expectValidatorToPass(validators, 'gpPhone', 'isValidPhoneNumber', gpPhone, { ...defaultValidators, gpPhone });
      });
    })
    // @TODO add min/max field length tests
  })
});
