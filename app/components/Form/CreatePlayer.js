import React, {Component} from 'react'
import PropTypes from 'prop-types'

import Tooltip from 'rc-tooltip';
import Slider from 'rc-slider';
// import Slider from 'rc-slider';
// We can just import Slider or Range to reduce bundle size
// import Slider from 'rc-slider/lib/Slider';
// import Range from 'rc-slider/lib/Range';
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const SliderTooltip = createSliderWithTooltip(Slider);
import { Button, Checkbox, Form, Input, Dropdown } from 'semantic-ui-react'

class CreatePlayer extends Component {
  // constructor(props) {
  //   super(props)
  //   this.state = {throwLabel: 'Left'}
  //   this.toggleThrowLabel = this.toggleThrowLabel.bind(this)
  // }

  //https://stackoverflow.com/questions/44062024/submit-form-using-button-in-parent-component-in-react

  render () {
    const { thisYear, twentyYearsAgo, oneHundredYearsAgo, teamOptions, hitsArray, createPlayerToggleableLabels, formChangeHandler, formSubmissionHandler } = this.props
    return (
      <Form id='createPlayerForm' onSubmit={formSubmissionHandler}>
        <Form.Field>
          <label>Full Name</label>
          <Input placeholder='Full Name' data-create-id='name' onChange={formChangeHandler} />
        </Form.Field>
        <Form.Field>
          <label>Gender</label>
          <Checkbox toggle data-create-id='gender' label={createPlayerToggleableLabels.gender} onChange={formChangeHandler} />
        </Form.Field>
        <Form.Field>
          <label>Birthyear</label>
          <Input type='number' data-create-id='birthyear' min={oneHundredYearsAgo} max={thisYear} defaultValue={twentyYearsAgo} onChange={formChangeHandler} />
        </Form.Field>
        <Form.Field>
          <label>Jersey</label>
          <SliderTooltip data-create-id='jersey' min={0} max={99} defaultValue={50} tipFormatter={value => `${value}`} onChange={formChangeHandler} />
        </Form.Field>
        <Form.Field>
          <label>Hits</label>
          <Dropdown placeholder='hits' data-create-id='hits' fluid selection options={hitsArray} onChange={formChangeHandler} />
          <label>Throws</label>
          <Checkbox toggle data-create-id='throws' label={createPlayerToggleableLabels.throw} onChange={formChangeHandler} />
        </Form.Field>
        <Form.Field>
          <label>Teams</label>
          <Dropdown data-create-id='teams' placeholder='Select Teams' fluid multiple search selection options={teamOptions} onChange={formChangeHandler} />
        </Form.Field>
        <Button type='submit'>Submit</Button>
      </Form>
    )
  }
}
CreatePlayer.propTypes = {
  teamOptions:  PropTypes.array.isRequired,
  createPlayerToggleableLabels: PropTypes.object.isRequired,
  formChangeHandler: PropTypes.func.isRequired,
  formSubmissionHandler: PropTypes.func.isRequired
        // thisYear={thisYear}
        // twentyYearsAgo={twentyYearsAgo}
        // oneHundredYearsAgo={oneHundredYearsAgo}
        // teamOptions={teamOptions}
        // hitsArray={hitsArray}
        // throwLabel={throwLabel}
        // formChangeHandler={formChangeHandler} 
        // formSubmissionHandler={formSubmissionHandler}
}
export default CreatePlayer
