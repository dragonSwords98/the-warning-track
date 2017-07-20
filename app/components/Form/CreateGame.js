import React from 'react'
import PropTypes from 'prop-types'
import { Header, Select, Input, Checkbox, Form } from 'semantic-ui-react'

const CreateGame = ({ submitCreateGameForm, leagueOptions, teamsOptions, labelHomeOrAway, diamondOptions, dateRange, handleFormChange }) => (
  <Form id="createGameForm" onSubmit={submitCreateGameForm}>
    <Header as="h2">Create a Ball Game</Header>
    <Form.Field>
      <label>League</label>
      <Select placeholder="Select League" data-create-id="league" options={leagueOptions} onChange={handleFormChange} />
    </Form.Field>
    <Form.Field>
      <label>Team</label>
      <Select placeholder="Select Your Team" data-create-id="team" options={teamsOptions} onChange={handleFormChange} />
      <label>{labelHomeOrAway}</label>
      <Checkbox fitted toggle data-create-id="homeOrAway" onChange={handleFormChange} />
    </Form.Field>
    <Form.Field>
      <label>Opposing Team</label>
      <Input placeholder="Opposing Team" data-create-id="opposingTeam" onChange={handleFormChange} />
    </Form.Field>
    <Form.Field>
      <label>Location</label>
      <Select placeholder="Select Diamond" data-create-id="diamond" options={diamondOptions} onChange={handleFormChange} />
    </Form.Field>
    <Form.Field>
      <Input placeholder="Set Start Time" data-create-id="dateTime" type="date" value={dateRange.min} min={dateRange.min} max={dateRange.max} onChange={handleFormChange} />
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
