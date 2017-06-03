import React from 'react'
import PropTypes from 'prop-types'
import { Header, Select, Button, Input, Checkbox, Form } from 'semantic-ui-react'

const CreateGameForm = ({ submitCreateGameForm, leagueOptions, handleSelectLeague, teamsOptions, labelHomeOrAway, setHomeOrAway, diamondOptions, dateRange }) => (
  <Form>
    <Header as='h2'>Create a Ball Game</Header>
    <Form.Field>
      <label>League</label>
      <Select placeholder='Select League' options={leagueOptions} onChange={handleSelectLeague} />
    </Form.Field>
    <Form.Field>
      <label>Team</label>
      <Select placeholder='Select Your Team' options={teamsOptions} />
      <label>{labelHomeOrAway}</label>
      <Checkbox fitted toggle onChange={setHomeOrAway}/>
    </Form.Field>
    <Form.Field>
      <label>Opposing Team</label>
      <Input placeholder='Opposing Team' />
    </Form.Field>
    <Form.Field>
    </Form.Field>
    <Form.Field>
      <label>Location</label>
      <Select placeholder='Select Diamond' options={diamondOptions} />
    </Form.Field>
    <Form.Field>
      <Input placeholder='Set Start Time' type='date' min={dateRange.min} max={dateRange.max} />
    </Form.Field>
    <Form.Field>
    </Form.Field>
    <Button type='submit' onClick={submitCreateGameForm}>Submit</Button>
  </Form>
)
CreateGameForm.propTypes = {
  submitCreateGameForm: PropTypes.func.isRequired,
  leagueOptions: PropTypes.array.isRequired,
  handleSelectLeague: PropTypes.func.isRequired,
  teamsOptions: PropTypes.array.isRequired,
  labelHomeOrAway: PropTypes.string.isRequired,
  setHomeOrAway: PropTypes.func.isRequired,
  diamondOptions: PropTypes.array.isRequired,
  dateRange: PropTypes.object.isRequired
}
export default CreateGameForm
