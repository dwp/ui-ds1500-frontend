const { SPECIALIST_NURSE } = require('../lib/constants')

const formatServiceData = (submissionData) => {
  const serviceData = { ...submissionData }
  // translate dates to how the controller is expecting
  try {
    serviceData['patientDateOfBirth-day'] = serviceData.patientDateOfBirth.dd;
    serviceData['patientDateOfBirth-month'] = serviceData.patientDateOfBirth.mm;
    serviceData['patientDateOfBirth-year'] = serviceData.patientDateOfBirth.yyyy;
    delete serviceData.patientDateOfBirth;

    serviceData['dateOfDiagnosis-month'] = serviceData.dateOfDiagnosis.mm;
    serviceData['dateOfDiagnosis-year'] = serviceData.dateOfDiagnosis.yyyy;
    delete serviceData.dateOfDiagnosis;
    const hasGmcNumberProperty = Object.prototype.hasOwnProperty.call(serviceData, 'gmcNumberConsultant');

    if (hasGmcNumberProperty) {
      serviceData.gmcNumber = serviceData.gmcNumberConsultant
    }
    delete serviceData.gmcNumberConsultant;

    if (serviceData.declaration === SPECIALIST_NURSE) {
      serviceData.declaration = 'Other'
      serviceData.declarationAdditionalDetail = SPECIALIST_NURSE
    }
  } catch (err) {
    console.error(err)
    throw new Error(`formatServiceData error: ${submissionData}`)
  }

  return serviceData
}

module.exports = {
  formatServiceData
}
