import React, {Component} from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import { Segment, Message, Button, Checkbox, Form, Icon, Input, Dropdown } from 'semantic-ui-react'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import 'rc-tooltip/assets/bootstrap.css'

const createSliderWithTooltip = Slider.createSliderWithTooltip
const SliderTooltip = createSliderWithTooltip(Slider)

class CreatePlayer extends Component {
  // https://stackoverflow.com/questions/44062024/submit-form-using-button-in-parent-component-in-react
  render () {
    const { player, teamOptions, formChangeHandler, formSubmissionHandler, fieldErrors, handsArray, positionsArray, valid, submitted } = this.props
    const content = Object.keys(fieldErrors).filter(k => !!fieldErrors[k]).map(e => e).join('<br/>') //TODO: in .map(e => e), translate the fieldError to a validation message
    return (
      <Segment>
        <Message
          warning
          header='Invalid Player'
          content={content}
          hidden={valid}
        />
        <Form id="createPlayerForm" onSubmit={formSubmissionHandler}>
          <Form.Field>
            <label>Full Name</label>
            <Form.Input placeholder="First and Last Names ONLY (e.g. Anoymous Chan, Stranger Lee)" data-create-id="name" value={player.name} onChange={formChangeHandler} error={fieldErrors.name} />
          </Form.Field>
          <Form.Field>
            <Checkbox toggle data-create-id="gender" onChange={formChangeHandler} value={player.gender} />
            <Icon name={player.gender ? 'venus' : 'mars'} />
          </Form.Field>
          <Form.Field>
            <label>Birthyear</label>
            <Input type="number" data-create-id="birthyear" min={moment().subtract(100, 'year').year()} max={moment().year()} value={player.birthyear} onChange={formChangeHandler}  />
          </Form.Field>
          <Form.Field>
            <label>Jersey</label>
            <SliderTooltip data-create-id="jersey" min={0} max={99} value={player.jersey} tipFormatter={value => `${value}`} onChange={formChangeHandler} />
          </Form.Field>
          <Form.Field>
            <label>Bats</label>
            <Dropdown placeholder="Hits" data-create-id="hits" fluid selection options={handsArray} value={player.hits} onChange={formChangeHandler} />
          </Form.Field>
          <Form.Field>
            <label>Throws</label>
            <Dropdown placeholder="Throwing Hand" data-create-id="throws" fluid selection options={handsArray} value={player.throws} onChange={formChangeHandler} />
          </Form.Field>
          <Form.Field>
            <label>Positions</label>
            <Dropdown data-create-id="positions" placeholder="Select Positions" fluid multiple search selection options={positionsArray} value={player.positions} onChange={formChangeHandler} />
          </Form.Field>
          <Form.Field>
            <label>Teams</label>
            <Dropdown data-create-id="teams" placeholder="Select Teams" fluid multiple search selection options={teamOptions} value={player.teams}  onChange={formChangeHandler} />
          </Form.Field>
          <Form.Field>
            <Button type="submit">Submit</Button>
          </Form.Field>
        </Form>
        <Message
          success
          header='New Player Added!'
          hidden={!submitted}
        />
      </Segment>
    )
  }
}
CreatePlayer.propTypes = {
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
export default CreatePlayer
