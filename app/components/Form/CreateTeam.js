import React from 'react'
import { Button, Checkbox, Form, Dropdown } from 'semantic-ui-react'

function CreateTeam ({ playerOptions, leagueOptions }) {
  return (
    <Form>
      <Form.Field>
        <label>Name</label>
        <input placeholder='Name' />
      </Form.Field>
      <Form.Field>
        <label>Captain</label>
        <Dropdown placeholder='Select Captain' fluid search selection options={playerOptions} />
      </Form.Field>
      <Form.Field>
        <label>Roster</label>
        <Dropdown placeholder='Select Captain' fluid multiple search selection options={playerOptions} />
      </Form.Field>
      <Form.Field>
        <label>Leagues</label>
        <Dropdown placeholder='Select Leagues' fluid multiple search selection options={leagueOptions} />
      </Form.Field>
      <Form.Field>
        <label>Description</label>
        <input placeholder='Description' />
      </Form.Field>
      <Form.Field>
        <Checkbox label='I agree to check this checkbox and sign my life away to the cause... :)' />
      </Form.Field>
      <Button type='submit'>Submit</Button>
    </Form>
  )
}

export default CreateTeam
