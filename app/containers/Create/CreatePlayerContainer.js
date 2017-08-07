import React, {Component} from 'react'
import PropTypes from 'prop-types'
import CreatePlayer from '@track/components/Form/CreatePlayer'

class CreatePlayerContainer extends Component {
  render () {
    const { player, teamOptions, formChangeHandler, formSubmissionHandler, fieldErrors, handsArray, positionsArray } = this.props
    return (
      <CreatePlayer
        player={player}
        teamOptions={teamOptions}
        formChangeHandler={formChangeHandler}
        formSubmissionHandler={formSubmissionHandler}
        fieldErrors={fieldErrors}
        handsArray={handsArray}
        positionsArray={positionsArray}
      />
    )
  }
}
CreatePlayerContainer.propTypes = {
  player: PropTypes.object.isRequired,
  teamOptions: PropTypes.array.isRequired,
  formChangeHandler: PropTypes.func.isRequired,
  formSubmissionHandler: PropTypes.func.isRequired,
  fieldErrors: PropTypes.object.isRequired
}
CreatePlayer.defaultProps = {
  handsArray: [
    { key: 'Right', value: 'Right', text: 'Right' },
    { key: 'Left', value: 'Left', text: 'Left' },
    { key: 'Switch', value: 'Switch', text: 'Switch' }
  ],
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
