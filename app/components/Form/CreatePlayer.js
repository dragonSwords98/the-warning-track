import React, {Component} from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import { Segment, Message, Button, Checkbox, Form, Icon, Input, Dropdown, Image } from 'semantic-ui-react'
import { ALL_POSITIONS, ALL_HANDS } from '@track/utils/constants'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import 'rc-tooltip/assets/bootstrap.css'

const createSliderWithTooltip = Slider.createSliderWithTooltip
const SliderTooltip = createSliderWithTooltip(Slider)

class CreatePlayer extends Component {
  // https://stackoverflow.com/questions/44062024/submit-form-using-button-in-parent-component-in-react
  render () {
    const { player, teamOptions, formChangeHandler, formSubmissionHandler, fieldErrors, valid, submitted } = this.props
    const content = Object.keys(fieldErrors).filter(k => !!fieldErrors[k]).map(e => e).join('<br/>') //TODO: in .map(e => e), translate the fieldError to a validation message

    let selectedImage = ''
    if (player.image && player.imageData) {
      selectedImage = <Image src={player.imageData} title={player.image.name} size='small' shape='rounded' />
    }

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
            <Dropdown placeholder="Hits" data-create-id="hits" fluid selection options={ALL_HANDS} value={player.hits} onChange={formChangeHandler} />
          </Form.Field>
          <Form.Field>
            <label>Throws</label>
            <Dropdown placeholder="Throwing Hand" data-create-id="throws" fluid selection options={ALL_HANDS} value={player.throws} onChange={formChangeHandler} />
          </Form.Field>
          <Form.Field>
            <label>Positions</label>
            <Dropdown data-create-id="positions" placeholder="Select Positions" fluid multiple search selection options={ALL_POSITIONS} value={player.positions} onChange={formChangeHandler} />
          </Form.Field>
          <Form.Field>
            <label>Teams</label>
            <Dropdown data-create-id="teams" placeholder="Select Teams" fluid multiple search selection options={teamOptions} value={player.teams}  onChange={formChangeHandler} />
          </Form.Field>
          <Form.Field>
            {selectedImage}
            <label>Portrait [Ideal image dimension: (n x n)]</label>
            <input data-create-id="image" type="file" accept='image/*' onChange={formChangeHandler} />
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
export default CreatePlayer
