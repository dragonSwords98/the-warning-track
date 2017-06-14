import React, {Component} from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import CreatePlayer from '@track/components/Form/CreatePlayer'

class CreatePlayerContainer extends Component {

  render () {
    const { thisYear, twentyYearsAgo, oneHundredYearsAgo, teamOptions, hitsArray, createPlayerToggleableLabels, formChangeHandler, formSubmissionHandler } = this.props
    return (
      <CreatePlayer
        thisYear={thisYear}
        twentyYearsAgo={twentyYearsAgo}
        oneHundredYearsAgo={oneHundredYearsAgo}
        teamOptions={teamOptions}
        hitsArray={hitsArray}
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
  hitsArray: [
    { key: 'Right', value: 'Right', text: 'Right' },
    { key: 'Left', value: 'Left', text: 'Left' },
    { key: 'Switch', value: 'Switch', text: 'Switch' }
  ],
  createPlayerToggleableLabels: {
    throws: 'Right',
    gender: 'Male'
  }
}
export default CreatePlayerContainer
