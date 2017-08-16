import React, { Component } from 'react'
import { Menu, Button } from 'semantic-ui-react'

class App extends Component {
  goTo(route) {
    this.props.history.replace(`/${route}`)
  }

  login() {
    this.props.auth.login();
  }

  logout() {
    this.props.auth.logout();
  }

  render() {
    const { isAuthenticated } = this.props.auth;
    console.log('render App', isAuthenticated())
    return (
      <div>
        <Menu fluid>
          <Menu.Item header>
            <a href="#">Auth0 - React</a>
            <Button
              primary
              className="btn-margin"
              onClick={this.goTo.bind(this, 'home')}
            >
              Home
            </Button>
            {
              !isAuthenticated() && (
                  <Button
                    primary
                    className="btn-margin"
                    onClick={this.login.bind(this)}
                  >
                    Log In
                  </Button>
                )
            }
            {
              isAuthenticated() && (
                  <Button
                    primary
                    className="btn-margin"
                    onClick={this.logout.bind(this)}
                  >
                    Log Out
                  </Button>
                )
            }
          </Menu.Item>
        </Menu>
      </div>
    );
  }
}

export default App;
