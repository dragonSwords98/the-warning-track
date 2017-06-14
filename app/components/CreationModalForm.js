import React from 'react'
import { Button, Icon, Modal } from 'semantic-ui-react'
import CreateTeamContainer from '@track/containers/Create/CreateTeamContainer'
import CreatePlayerContainer from '@track/containers/Create/CreatePlayerContainer'

function CreationModalForm ({ type, teamOptions, playerOptions, leagueOptions, createPlayerToggleableLabels, formChangeHandler, formSubmissionHandler }) {

  // const formSubmissionHandler = (formId) => {
  //   this.refs.createForm.getWrappedInstance().submit()
  // }

  let title = 'Create a '
  let form
  if (type === 'teams') {
    title += 'Team'
    form = <CreateTeamContainer playerOptions={playerOptions} leagueOptions={leagueOptions} formChangeHandler={formChangeHandler} formSubmissionHandler={formSubmissionHandler} />
  }
  if (type === 'players') {
    title += 'Player'
    form = <CreatePlayerContainer teamOptions={teamOptions} createPlayerToggleableLabels={createPlayerToggleableLabels} formChangeHandler={formChangeHandler} formSubmissionHandler={formSubmissionHandler} />
  }
  return (
    <Modal trigger={<Button>{title}</Button>} size='fullscreen'>
      <Modal.Header>{title}</Modal.Header>
      <Modal.Content>
        {form}
      </Modal.Content>
      <Modal.Actions>
        <Button basic color='red' inverted>
          <Icon name='remove' /> Clear
        </Button>
        <Button color='green' inverted>
          <Icon name='checkmark' /> Create
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

export default CreationModalForm
