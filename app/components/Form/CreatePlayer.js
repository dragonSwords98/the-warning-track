import React, {Component} from 'react'
import PropTypes from 'prop-types'

import { Button, Checkbox, Form, Icon, Input, Dropdown } from 'semantic-ui-react'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import 'rc-tooltip/assets/bootstrap.css'

const createSliderWithTooltip = Slider.createSliderWithTooltip
const SliderTooltip = createSliderWithTooltip(Slider)

class CreatePlayer extends Component {
  // https://stackoverflow.com/questions/44062024/submit-form-using-button-in-parent-component-in-react
  render () {
    const { gender, thisYear, twentyYearsAgo, oneHundredYearsAgo, teamOptions, handsArray, positionsArray, createPlayerToggleableLabels, formChangeHandler, formSubmissionHandler } = this.props
    return (
      <Form id="createPlayerForm" onSubmit={formSubmissionHandler}>
        <Form.Field>
          <label>Full Name</label>
          <Input placeholder="First and Last Names ONLY (e.g. Anoymous Chan, Stranger Lee)" data-create-id="name" onChange={formChangeHandler} />
        </Form.Field>
        <Form.Field>
          <Checkbox toggle data-create-id="gender" onChange={formChangeHandler} />
          <Icon name={gender ? 'venus' : 'mars'} />
        </Form.Field>
        <Form.Field>
          <label>Birthyear</label>
          <Input type="number" data-create-id="birthyear" min={oneHundredYearsAgo} max={thisYear} defaultValue={twentyYearsAgo} onChange={formChangeHandler} />
        </Form.Field>
        <Form.Field>
          <label>Jersey</label>
          <SliderTooltip data-create-id="jersey" min={0} max={99} defaultValue={50} tipFormatter={value => `${value}`} onChange={formChangeHandler} />
        </Form.Field>
        <Form.Field>
          <label>Bats</label>
          <Dropdown placeholder="Hits" data-create-id="hits" fluid selection options={handsArray} onChange={formChangeHandler} />
        </Form.Field>
        <Form.Field>
          <label>Throws</label>
          <Dropdown placeholder="Throwing Hand" data-create-id="throws" fluid selection options={handsArray} onChange={formChangeHandler} />
        </Form.Field>
        <Form.Field>
          <label>Positions</label>
          <Dropdown data-create-id="positions" placeholder="Select Positions" fluid multiple search selection options={positionsArray} onChange={formChangeHandler} />
        </Form.Field>
        <Form.Field>
          <label>Teams</label>
          <Dropdown data-create-id="teams" placeholder="Select Teams" fluid multiple search selection options={teamOptions} onChange={formChangeHandler} />
        </Form.Field>
        <Form.Field>
          <Button type="submit">Submit</Button>
        </Form.Field>
      </Form>
    )
  }
}
CreatePlayer.propTypes = {
  gender: PropTypes.number.isRequired,
  teamOptions: PropTypes.array.isRequired,
  createPlayerToggleableLabels: PropTypes.object.isRequired,
  formChangeHandler: PropTypes.func.isRequired,
  formSubmissionHandler: PropTypes.func.isRequired
}
export default CreatePlayer
