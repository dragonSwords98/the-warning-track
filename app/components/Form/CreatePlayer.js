import React, {Component} from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

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
import { Button, Checkbox, Form, Dropdown } from 'semantic-ui-react'

class CreatePlayer extends Component {
  //
  // handleBirthyearChange (e) {
  //   console.log(e)
  //   this.setState({
  //     activeBirthyearIndex: Number(e.target.value)
  //   })
  // }


  render() {
    const { activeBirthyearIndex, thisYear, twentyYearsAgo, oneHundredYearsAgo, teamOptions } = this.props
    console.log(this.props)
    return (
      <Form>
        <Form.Field>
          <label>Full Name</label>
          <input placeholder='Full Name' />
        </Form.Field>
        <Form.Field>
          <label>Gender</label>
          <Checkbox toggle label='Male'/>
        </Form.Field>
        <Form.Field>
          <label>Birthyear</label>
          <SliderTooltip min={oneHundredYearsAgo} max={thisYear} defaultValue={twentyYearsAgo} tipFormatter={value => `${value}`} />
        </Form.Field>
        <Form.Field>
          <label>Jersey</label>
          <SliderTooltip min={0} max={99} defaultValue={50} tipFormatter={value => `${value}`} />
        </Form.Field>
        <Form.Field>
          <label>Hits</label>
          <SliderTooltip min={0} max={2} defaultValue={0} tipFormatter={value => value} />
          <label>Throws</label>
          <Checkbox toggle label='Right'/>
        </Form.Field>
        <Form.Field>
          <label>Teams</label>
          <Dropdown placeholder='Select Teams' fluid multiple search selection options={teamOptions} />
        </Form.Field>
        <Form.Field>
          <Checkbox label='I agree to check this checkbox and sign my life away to the cause... :)' />
        </Form.Field>
        <Button type='submit'>Submit</Button>
      </Form>
    )
  }
}
CreatePlayer.propTypes = {
  teamOptions:  PropTypes.array.isRequired
}

CreatePlayer.defaultProps = {
  thisYear: moment().year(),
  twentyYearsAgo: moment().subtract(20, 'year').year(),
  oneHundredYearsAgo: moment().subtract(100, 'year').year(),
  hitsArray: [ 'right', 'left', 'switch' ]
}
export default CreatePlayer
