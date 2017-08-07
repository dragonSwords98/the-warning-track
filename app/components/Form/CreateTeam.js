import React from 'react'
import PropTypes from 'prop-types'
import { Button, Form, Dropdown, Input } from 'semantic-ui-react'

function CreateTeam ({ team, captainOptions, playerOptions, leagueOptions, formChangeHandler, formSubmissionHandler, fieldErrors }) {
  return (
    <Form id="createTeamForm" onSubmit={formSubmissionHandler}>
      <Form.Field>
        <label>Name</label>
        <Form.Input placeholder="Name" data-create-id="name" value={team.name} onChange={formChangeHandler} error={fieldErrors.name} />
      </Form.Field>
      <Form.Field>
        <label>Roster</label>
        <Dropdown placeholder="Select Roster" data-create-id="roster" value={team.roster} fluid multiple search selection options={playerOptions} onChange={formChangeHandler} error={fieldErrors.roster} />
      </Form.Field>
      <Form.Field>
        <label>Captain</label>
        <Dropdown placeholder="Select Captain" data-create-id="captain" value={team.captain} fluid search selection options={captainOptions} onChange={formChangeHandler} error={fieldErrors.captain} />
      </Form.Field>
      <Form.Field>
        <label>Leagues</label>
        <Dropdown placeholder="Select Leagues" data-create-id="leagues" value={team.leagues} fluid multiple search selection options={leagueOptions} onChange={formChangeHandler} error={fieldErrors.leagues} />
      </Form.Field>
      <Form.Field>
        <label>Description</label>
        <Input placeholder="Description" data-create-id="description" value={team.description} onChange={formChangeHandler} />
      </Form.Field>
      <Button type="submit">Submit</Button>
    </Form>
  )
}

CreateTeam.propTypes = {
  team: PropTypes.object.isRequired,
  captainOptions: PropTypes.array.isRequired,
  playerOptions: PropTypes.array.isRequired,
  leagueOptions: PropTypes.array.isRequired,
  formChangeHandler: PropTypes.func.isRequired,
  formSubmissionHandler: PropTypes.func.isRequired,
  fieldErrors: PropTypes.object.isRequired
}
export default CreateTeam
