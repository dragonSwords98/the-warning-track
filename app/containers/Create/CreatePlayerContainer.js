import React, {Component} from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import CreatePlayer from '@track/components/Form/CreatePlayer'

class CreatePlayerContainer extends Component {
  render () {
    const { thisYear, twentyYearsAgo, oneHundredYearsAgo, teamOptions, handsArray, positionsArray, createPlayerToggleableLabels, formChangeHandler, formSubmissionHandler } = this.props
    return (
      <CreatePlayer
        thisYear={thisYear}
        twentyYearsAgo={twentyYearsAgo}
        oneHundredYearsAgo={oneHundredYearsAgo}
        teamOptions={teamOptions}
        handsArray={handsArray}
        positionsArray={positionsArray}
        createPlayerToggleableLabels={createPlayerToggleableLabels}
        formChangeHandler={formChangeHandler}
        formSubmissionHandler={formSubmissionHandler}
      />
    )
  }
}
CreatePlayerContainer.propTypes = {
  teamOptions: PropTypes.array.isRequired,
  formChangeHandler: PropTypes.func.isRequired,
  formSubmissionHandler: PropTypes.func.isRequired
}
CreatePlayerContainer.defaultProps = {
  thisYear: moment().year(),
  twentyYearsAgo: moment().subtract(20, 'year').year(),
  oneHundredYearsAgo: moment().subtract(100, 'year').year(),
  handsArray: [
    { key: 'Right', value: 'Right', text: 'Right' },
    { key: 'Left', value: 'Left', text: 'Left' },
    { key: 'Switch', value: 'Switch', text: 'Switch' }
  ],
  createPlayerToggleableLabels: {
    throws: 'Right',
    gender: 'Male'
  },
  positionsArray: [
    { key: 'P', value: 'P', text: 'P' },
    { key: 'C', value: 'C', text: 'C' },
    { key: '1B', value: '1B', text: '1B' },
    { key: '2B', value: '2B', text: '2B' },
    { key: 'SS', value: 'SS', text: 'SS' },
    { key: '3B', value: '3B', text: '3B' },
    { key: 'LF', value: 'LF', text: 'LF' },
    { key: 'LR', value: 'LR', text: 'LR' },
    { key: 'CF', value: 'CF', text: 'CF' },
    { key: 'RR', value: 'RR', text: 'RR' },
    { key: 'RF', value: 'RF', text: 'RF' }
  ]
}
export default CreatePlayerContainer
