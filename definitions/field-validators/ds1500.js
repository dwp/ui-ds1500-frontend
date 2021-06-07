const { validationRules: r, simpleFieldValidation: sf } = require('@dwp/govuk-casa')

const moment = require('moment');
const { isValidPhoneNumber, isValidPatientName, hasValidWords } = require('../../lib/validation-rules/ds1500');
const { isEmptyDateOfBirth, isDateNumericDob, isValidDateRangeDob, isTooLongDob } = require('../../lib/validation-rules/ds1500DateOfBirth')
const { isEmptyDateOfDiagnosis, isDateNumeric, isValidDateRange, isDateOfDiagnosisInFuture, isDateBeforeDoB } = require('../../lib/validation-rules/ds1500DateOfDiagnosis')

const { VALID_POSTCODE } = require('../../lib/constants')
const fieldValidators = {
  patientName: sf([
    r.required.bind({
      errorMsg: 'ds1500:patientName.empty'
    }),
    hasValidWords,
    isValidPatientName
  ]),

  patientAddress: sf([
    r.required.bind({
      errorMsg: 'ds1500:patientAddress.empty'
    })
  ]),

  patientPostcode: sf([
    r.required.bind({
      errorMsg: 'ds1500:patientPostcode.empty'
    }),
    r.strlen.bind({
      max: 8,
      errorMsgMax: 'ds1500:patientPostcode.tooLong'
    }),
    r.regex.bind({
      pattern: VALID_POSTCODE,
      errorMsg: 'ds1500:patientPostcode.invalid'
    })
  ]),

  patientDateOfBirth: sf([
    isEmptyDateOfBirth,
    isDateNumericDob,
    isValidDateRangeDob,
    isTooLongDob,
    r.dateObject.bind({
      allowSingleDigitDay: true,
      allowSingleDigitMonth: true,
      beforeOffsetFromNow: moment.duration(1, 'day'),
      afterOffsetFromNow: moment.duration(moment('1890-01-01').diff(moment())),
      errorMsg: {
        summary: 'ds1500:patientDateOfBirth.invalid',
        focusSuffix: '[dd]'
      },
      errorMsgAfterOffset: {
        summary: 'ds1500:patientDateOfBirth.rangePast',
        focusSuffix: ['[dd]', '[mm]', '[yyyy]']
      },
      errorMsgBeforeOffset: {
        summary: 'ds1500:patientDateOfBirth.future',
        focusSuffix: ['[dd]', '[mm]', '[yyyy]']
      }
    })
  ]),

  patientNino: sf([
    r.optional,
    r.nino.bind({
      allowWhitespace: true,
      errorMsg: 'ds1500:patientNino.invalid'
    })
  ]),

  diagnosis: sf([
    r.required.bind({
      errorMsg: 'ds1500:diagnosis.empty'
    }),
    r.strlen.bind({
      max: 126,
      errorMsgMax: 'ds1500:diagnosis.tooLong'
    }),
    hasValidWords
  ]),

  dateOfDiagnosis: sf([
    isEmptyDateOfDiagnosis,
    isDateNumeric,
    isValidDateRange,
    isDateOfDiagnosisInFuture,
    isDateBeforeDoB.bind({
      otherFieldName: 'patientDateOfBirth'
    })
  ]),

  otherDiagnoses: sf([
    r.optional,
    r.strlen.bind({
      max: 132,
      errorMsgMax: 'ds1500:otherDiagnoses.tooLong'
    })
  ]),

  patientAware: sf([
    r.required.bind({
      errorMsg: 'ds1500:patientAware.empty'
    }),
    r.inArray.bind({
      source: ['Yes', 'No'],
      errorMsg: 'ds1500:patientAware.empty'
    })
  ]),

  formRequester: sf([
    r.required.bind({
      errorMsg: 'ds1500:formRequester.empty'
    }),
    r.inArray.bind({
      source: ['Patient', 'Representative'],
      errorMsg: 'ds1500:formRequester.empty'
    })
  ]),
  representativeName: sf([
    r.optional
  ]),
  representativeAddress: sf([
    r.optional
  ]),
  representativePostcode: sf([
    r.optional,
    r.strlen.bind({
      max: 8,
      errorMsgMax: 'ds1500:representativePostcode.tooLong'
    }),
    r.regex.bind({
      pattern: VALID_POSTCODE,
      errorMsg: 'ds1500:representativePostcode.invalid'
    })
  ]),
  clinicalFeatures: sf([
    r.required.bind({
      errorMsg: 'ds1500:clinicalFeatures.empty'
    }),
    hasValidWords,
    r.strlen.bind({
      max: 236,
      errorMsgMax: 'ds1500:clinicalFeatures.tooLong'
    })
  ]),
  treatment: sf([
    r.required.bind({
      errorMsg: 'ds1500:treatment.empty'
    }),
    hasValidWords,
    r.strlen.bind({
      max: 160,
      errorMsgMax: 'ds1500:treatment.tooLong'
    })
  ]),
  otherIntervention: sf([
    r.optional,
    hasValidWords,
    r.strlen.bind({
      max: 120,
      errorMsgMax: 'ds1500:otherIntervention.tooLong'
    })
  ]),

  declaration: sf([
    r.required.bind({
      errorMsg: 'ds1500:declaration.empty'
    }),
    r.inArray.bind({
      source: ['General Practitioner', 'GMC registered consultant', 'Other'],
      errorMsg: 'ds1500:declaration.empty'
    })
  ]),

  gmcNumber: sf([
    r.required.bind({
      errorMsg: 'ds1500:gmcNumber.empty'
    }),
    r.strlen.bind({
      max: 7,
      min: 7,
      errorMsgMax: 'ds1500:gmcNumber.tooLong',
      errorMsgMin: 'ds1500:gmcNumber.tooShort'
    }),
    r.regex.bind({
      pattern: /^(?!0000000)[0-9]*$/,
      errorMsg: 'ds1500:gmcNumber.pattern'
    })
  ], (dataContext) => {
    const { waypointId, journeyContext } = dataContext
    const formData = journeyContext.getDataForPage(waypointId);
    const validValues = ['General Practitioner', 'GMC registered consultant']
    return validValues.indexOf(formData.declaration) > -1;
  }),

  declarationAdditionalDetail: sf([
    r.required.bind({
      errorMsg: 'ds1500:declarationAdditionalDetail.empty'
    }),
    hasValidWords
  ], (dataContext) => {
    const { waypointId, journeyContext } = dataContext
    const formData = journeyContext.getDataForPage(waypointId);
    return formData.declaration === 'Other';
  }),

  gpName: sf([
    r.required.bind({
      errorMsg: 'ds1500:gpName.empty'
    })
  ]),

  trustName: sf([
    r.optional
  ]),

  gpAddress: sf([
    r.required.bind({
      errorMsg: 'ds1500:gpAddress.empty'
    })
  ]),

  gpPhone: sf([
    r.required.bind({
      errorMsg: 'ds1500:gpPhone.empty'
    }),
    isValidPhoneNumber
  ])
};

module.exports = fieldValidators;
