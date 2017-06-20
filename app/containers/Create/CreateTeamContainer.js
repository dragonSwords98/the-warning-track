import React, {Component} from 'react'
import PropTypes from 'prop-types'
import CreateTeam from '@track/components/Form/CreateTeam'

class CreateTeamContainer extends Component {
  render () {
    const { captainOptions, playerOptions, leagueOptions, formChangeHandler, formSubmissionHandler } = this.props
    return (
      <CreateTeam
        captainOptions={captainOptions}
        playerOptions={playerOptions}
        leagueOptions={leagueOptions}
        formChangeHandler={formChangeHandler}
        formSubmissionHandler={formSubmissionHandler}
      />
    )
  }
}
CreateTeamContainer.propTypes = {
  captainOptions: PropTypes.array.isRequired,
  playerOptions: PropTypes.array.isRequired,
  leagueOptions: PropTypes.array.isRequired,
  formChangeHandler: PropTypes.func.isRequired,
  formSubmissionHandler: PropTypes.func.isRequired
}
export default CreateTeamContainer
