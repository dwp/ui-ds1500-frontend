const formatServiceData = (submissionData) => {
  const serviceData = { ...submissionData }
  // translate dates to how the controller is expecting
  try {
    serviceData['patientDateOfBirth-day'] = serviceData.patientDateOfBirth.dd;
    serviceData['patientDateOfBirth-month'] = serviceData.patientDateOfBirth.mm;
    serviceData['patientDateOfBirth-year'] = serviceData.patientDateOfBirth.yyyy;
    delete serviceData.patientDateOfBirth;

    serviceData['dateOfDiagnosis-day'] = serviceData.dateOfDiagnosis.dd;
    serviceData['dateOfDiagnosis-month'] = serviceData.dateOfDiagnosis.mm;
    serviceData['dateOfDiagnosis-year'] = serviceData.dateOfDiagnosis.yyyy;
    delete serviceData.dateOfDiagnosis;

    serviceData['dateOfSpecialRules-day'] = serviceData.dateOfSpecialRules.dd;
    serviceData['dateOfSpecialRules-month'] = serviceData.dateOfSpecialRules.mm;
    serviceData['dateOfSpecialRules-year'] = serviceData.dateOfSpecialRules.yyyy;
    delete serviceData.dateOfSpecialRules;
    const hasGmcNumberProperty = Object.prototype.hasOwnProperty.call(serviceData, 'gmcNumberConsultant');

    if (hasGmcNumberProperty) {
      serviceData.gmcNumber = serviceData.gmcNumberConsultant
    }
    delete serviceData.gmcNumberConsultant;
  } catch (err) {
    console.error(err)
    throw new Error(`formatServiceData error: ${submissionData}`)
  }

  return serviceData
}

module.exports = {
  formatServiceData
}
