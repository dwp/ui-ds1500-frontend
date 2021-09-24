const { formatDateObject, formatDateSummaryObject, isDateValue, isDateSummaryValue } = require('./standard-date-formatters')

const createSummaryItem = function (options, fieldName) {
  const { waypointEditUrl, journeyData: jData } = options
  const { t } = options
  let value = jData[fieldName]
  if (!value) {
    return false
  }

  let href = `${waypointEditUrl}#f-${fieldName}`
  if (isDateValue(value) || isDateSummaryValue(value)) {
    if (isDateValue(value)) {
      href = `${href}[dd]`
      value = formatDateObject(value)
    } else {
      href = `${href}[mm]`
      value = formatDateSummaryObject(value)
    }
  }

  return {
    key: {
      text: t(`ds1500:${fieldName}.label`)
    },
    value: {
      text: value
    },
    actions: {
      items: [
        {
          href: href,
          text: t('review:block.changeLink'),
          visuallyHiddenText: t(`ds1500:${fieldName}.label`).toLowerCase(),
          classes: 'govuk-link--no-visited-state'
        }
      ]
    }
  }
}

module.exports = {
  createSummaryItem
}
