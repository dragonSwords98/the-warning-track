import React from 'react'
import PropTypes from 'prop-types'
import { Header, Select, Input, Checkbox, Form } from 'semantic-ui-react'

const CreateGame = ({ game, invalidFields, submitCreateGameForm, leagueOptions, teamsOptions, labelHomeOrAway, diamondOptions, dateRange, handleFormChange }) => (
  <Form id="createGameForm" onSubmit={submitCreateGameForm}>
    <Header as="h2">Create a Ball Game</Header>
    <Form.Field>
      <label>League</label>
      <Form.Select placeholder="Select League" data-create-id="league" options={leagueOptions} onChange={handleFormChange} error={invalidFields.league} />
    </Form.Field>
    <Form.Field>
      <label>Team</label>
      <Form.Select placeholder="Select Your Team" data-create-id="team" options={teamsOptions} onChange={handleFormChange} error={invalidFields.ourTeam} />
      <label>{labelHomeOrAway}</label>
      <Checkbox fitted toggle data-create-id="homeOrAway" onChange={handleFormChange} />
    </Form.Field>
    <Form.Field>
      <label>Opposing Team</label>
      <Form.Input placeholder="Opposing Team" data-create-id="opposingTeam" value={game.opposingTeam} onChange={handleFormChange} error={invalidFields.opposingTeam} />
    </Form.Field>
    <Form.Field>
      <label>Location</label>
      <Form.Select placeholder="Select Diamond" data-create-id="diamond" options={diamondOptions} onChange={handleFormChange} error={invalidFields.diamond} />
    </Form.Field>
    <Form.Field>
      <Form.Input placeholder="Set Start Time" data-create-id="dateTime" type="date" value={dateRange.min} min={dateRange.min} max={dateRange.max} onChange={handleFormChange}  error={invalidFields.dateTime} />
    </Form.Field>
  </Form>
)
CreateGame.propTypes = {
  submitCreateGameForm: PropTypes.func.isRequired,
  leagueOptions: PropTypes.array.isRequired,
  teamsOptions: PropTypes.array.isRequired,
  labelHomeOrAway: PropTypes.string.isRequired,
  diamondOptions: PropTypes.array.isRequired,
  dateRange: PropTypes.object.isRequired,
  handleFormChange: PropTypes.func.isRequired
}
export default CreateGame
