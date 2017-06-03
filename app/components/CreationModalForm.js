import React from 'react'
import { Button, Icon, Modal } from 'semantic-ui-react'
import CreateTeam from '@track/components/Form/CreateTeam'
import CreatePlayer from '@track/components/Form/CreatePlayer'

function CreationModalForm ({ type, teamOptions, playerOptions, leagueOptions }) {
  let title = 'Create a '
  let form
  if (type === 'teams') {
    title += 'Team'
    form = <CreateTeam playerOptions={playerOptions} leagueOptions={leagueOptions} />
  }
  if (type === 'players') {
    title += 'Player'
    form = <CreatePlayer teamOptions={teamOptions} />
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
