const { validationRules: r, simpleFieldValidation: sf } = require('@dwp/govuk-casa')

const { isValidPhoneNumber, isValidPatientName, hasValidWords } = require('../../lib/validation-rules/ds1500');
const { isEmptyDateOfBirth, isDateNumericDob, isValidDateRangeDob, isTooLongDob } = require('../../lib/validation-rules/ds1500DateOfBirth')
const { isEmptyDateOfDiagnosis, isDateNumeric, isValidDateRange, isDateOfDiagnosisInFuture, isDateBeforeDoB } = require('../../lib/validation-rules/ds1500DateOfDiagnosis')
const { DateTime } = require('luxon');

const { VALID_POSTCODE } = require('../../lib/constants')
const fieldValidators = {
  patientName: sf([
    r.required.make({
      errorMsg: 'ds1500:patientName.empty'
    }),
    hasValidWords,
    isValidPatientName
  ]),

  patientAddress: sf([
    r.required.make({
      errorMsg: 'ds1500:patientAddress.empty'
    })
  ]),

  patientPostcode: sf([
    r.required.make({
      errorMsg: 'ds1500:patientPostcode.empty'
    }),
    r.strlen.make({
      max: 8,
      errorMsgMax: 'ds1500:patientPostcode.tooLong'
    }),
    r.regex.make({
      pattern: VALID_POSTCODE,
      errorMsg: 'ds1500:patientPostcode.invalid'
    })
  ]),

  patientDateOfBirth: sf([
    isEmptyDateOfBirth,
    isDateNumericDob,
    isValidDateRangeDob,
    isTooLongDob,
    r.dateObject.make({
      allowSingleDigitDay: true,
      allowSingleDigitMonth: true,
      beforeOffsetFromNow: { days: 0 },
      afterOffsetFromNow: DateTime.fromISO('1890-01-01').diff(DateTime.now()),
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
    r.nino.make({
      allowWhitespace: true,
      errorMsg: 'ds1500:patientNino.invalid'
    })
  ]),

  diagnosis: sf([
    r.required.make({
      errorMsg: 'ds1500:diagnosis.empty'
    }),
    r.strlen.make({
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
    r.strlen.make({
      max: 132,
      errorMsgMax: 'ds1500:otherDiagnoses.tooLong'
    })
  ]),

  patientAware: sf([
    r.required.make({
      errorMsg: 'ds1500:patientAware.empty'
    }),
    r.inArray.make({
      source: ['Yes', 'No'],
      errorMsg: 'ds1500:patientAware.empty'
    })
  ]),

  formRequester: sf([
    r.required.make({
      errorMsg: 'ds1500:formRequester.empty'
    }),
    r.inArray.make({
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
    r.strlen.make({
      max: 8,
      errorMsgMax: 'ds1500:representativePostcode.tooLong'
    }),
    r.regex.make({
      pattern: VALID_POSTCODE,
      errorMsg: 'ds1500:representativePostcode.invalid'
    })
  ]),
  clinicalFeatures: sf([
    r.required.make({
      errorMsg: 'ds1500:clinicalFeatures.empty'
    }),
    hasValidWords,
    r.strlen.make({
      max: 236,
      errorMsgMax: 'ds1500:clinicalFeatures.tooLong'
    })
  ]),
  treatment: sf([
    r.required.make({
      errorMsg: 'ds1500:treatment.empty'
    }),
    hasValidWords,
    r.strlen.make({
      max: 160,
      errorMsgMax: 'ds1500:treatment.tooLong'
    })
  ]),
  otherIntervention: sf([
    r.optional,
    hasValidWords,
    r.strlen.make({
      max: 120,
      errorMsgMax: 'ds1500:otherIntervention.tooLong'
    })
  ]),

  declaration: sf([
    r.required.make({
      errorMsg: 'ds1500:declaration.empty'
    }),
    r.inArray.make({
      source: ['General Practitioner', 'GMC registered consultant', 'Other'],
      errorMsg: 'ds1500:declaration.empty'
    })
  ]),

  gmcNumber: sf([
    r.required.make({
      errorMsg: 'ds1500:gmcNumber.empty'
    }),
    r.strlen.make({
      max: 7,
      min: 7,
      errorMsgMax: 'ds1500:gmcNumber.tooLong',
      errorMsgMin: 'ds1500:gmcNumber.tooShort'
    }),
    r.regex.make({
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
    r.required.make({
      errorMsg: 'ds1500:declarationAdditionalDetail.empty'
    }),
    hasValidWords
  ], (dataContext) => {
    const { waypointId, journeyContext } = dataContext
    const formData = journeyContext.getDataForPage(waypointId);
    return formData.declaration === 'Other';
  }),

  gpName: sf([
    r.required.make({
      errorMsg: 'ds1500:gpName.empty'
    })
  ]),

  gpAddress: sf([
    r.required.make({
      errorMsg: 'ds1500:gpAddress.empty'
    })
  ]),

  gpPhone: sf([
    r.required.make({
      errorMsg: 'ds1500:gpPhone.empty'
    }),
    isValidPhoneNumber
  ])
};

module.exports = fieldValidators;
