import React from 'react'
import PropTypes from 'prop-types'
import { Button, Form, Dropdown, Input } from 'semantic-ui-react'

function CreateTeam ({ playerOptions, leagueOptions, formChangeHandler, formSubmissionHandler }) {
  return (
    <Form id="createTeamForm" onSubmit={formSubmissionHandler}>
      <Form.Field>
        <label>Name</label>
        <Input placeholder="Name" data-create-id="name" onChange={formChangeHandler} />
      </Form.Field>
      <Form.Field>
        <label>Captain</label>
        <Dropdown placeholder="Select Captain" data-create-id="captain" fluid search selection options={playerOptions} onChange={formChangeHandler} />
      </Form.Field>
      <Form.Field>
        <label>Roster</label>
        <Dropdown placeholder="Select Roster" data-create-id="roster" fluid multiple search selection options={playerOptions} onChange={formChangeHandler} />
      </Form.Field>
      <Form.Field>
        <label>Leagues</label>
        <Dropdown placeholder="Select Leagues" data-create-id="leagues" fluid multiple search selection options={leagueOptions} onChange={formChangeHandler} />
      </Form.Field>
      <Form.Field>
        <label>Description</label>
        <Input placeholder="Description" data-create-id="description" onChange={formChangeHandler} />
      </Form.Field>
      <Button type="submit">Submit</Button>
    </Form>
  )
}

CreateTeam.propTypes = {
  playerOptions: PropTypes.array.isRequired,
  leagueOptions: PropTypes.array.isRequired,
  formChangeHandler: PropTypes.func.isRequired,
  formSubmissionHandler: PropTypes.func.isRequired
}
export default CreateTeam
