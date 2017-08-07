import React from 'react'
import PropTypes from 'prop-types'
import { Button, Form, Dropdown, Input } from 'semantic-ui-react'

function CreateTeam ({ captainOptions, playerOptions, leagueOptions, formChangeHandler, formSubmissionHandler, fieldErrors }) {
  return (
    <Form id="createTeamForm" onSubmit={formSubmissionHandler}>
      <Form.Field>
        <label>Name</label>
        <Form.Input placeholder="Name" data-create-id="name" onChange={formChangeHandler} error={fieldErrors.name} />
      </Form.Field>
      <Form.Field>
        <label>Roster</label>
        <Form.Dropdown placeholder="Select Roster" data-create-id="roster" fluid multiple search selection options={playerOptions} onChange={formChangeHandler} error={fieldErrors.roster} />
      </Form.Field>
      <Form.Field>
        <label>Captain</label>
        <Form.Dropdown placeholder="Select Captain" data-create-id="captain" fluid search selection options={captainOptions} onChange={formChangeHandler} error={fieldErrors.captain} />
      </Form.Field>
      <Form.Field>
        <label>Leagues</label>
        <Form.Dropdown placeholder="Select Leagues" data-create-id="leagues" fluid multiple search selection options={leagueOptions} onChange={formChangeHandler} error={fieldErrors.leagues} />
      </Form.Field>
      <Form.Field>
        <label>Description</label>
        <Form.Input placeholder="Description" data-create-id="description" onChange={formChangeHandler} />
      </Form.Field>
      <Button type="submit">Submit</Button>
    </Form>
  )
}

CreateTeam.propTypes = {
  captainOptions: PropTypes.array.isRequired,
  playerOptions: PropTypes.array.isRequired,
  leagueOptions: PropTypes.array.isRequired,
  formChangeHandler: PropTypes.func.isRequired,
  formSubmissionHandler: PropTypes.func.isRequired,
  fieldErrors: PropTypes.object.isRequired
}
export default CreateTeam
