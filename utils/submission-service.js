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
  } catch (err) {
    console.error(err)
    throw new Error(`formatServiceData error: ${submissionData}`)
  }

  return serviceData
}

module.exports = {
  formatServiceData
}