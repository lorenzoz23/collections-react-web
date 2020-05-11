import React, { Component } from 'react';
import { ResponsiveContext, Box, Heading, Text, Tabs, Tab } from 'grommet';
import {
  BrowserRouter as Router,
  Redirect,
  Switch,
  Route
} from 'react-router-dom';
import SignIn from './SignIn';
import SignUp from './SignUp';
import HomePage from './HomePage';

export default class Login extends Component {
  state = {
    username: '',
    password: '',
    secondPassword: '',
    name: '',
    valid: false
  };

  handleLogin = () => {
    this.setState({
      valid: true
    });
  };

  handleSignUp = (username: string, password: string) => {
    this.setState({
      username: username,
      password: password
    });
  };

  render() {
    return (
      <ResponsiveContext.Consumer>
        {(size) => (
          <Router>
            {this.state.valid ? (
              <Redirect exact to="/home" />
            ) : (
              <Box
                fill
                direction="row"
                flex
                background="neutral-4"
                justify="evenly"
                align="center"
              >
                <Box
                  justify="center"
                  align="center"
                  height="medium"
                  width="large"
                  background="status-warning"
                  pad={{ bottom: 'large', right: 'large', left: 'large' }}
                  border={{
                    color: 'dark-1',
                    size: 'large',
                    style: 'solid',
                    side: 'all'
                  }}
                >
                  <Heading>collections</Heading>
                  <Text>your entire film collection at your fingertips</Text>
                </Box>
                <Box align="center" justify="center" width="medium">
                  <Heading>login</Heading>
                  <Tabs>
                    <Tab title="sign in">
                      <SignIn
                        handleLogin={this.handleLogin}
                        username={this.state.username}
                        password={this.state.password}
                      />
                    </Tab>
                    <Tab title="sign up">
                      <SignUp handleSignUp={this.handleSignUp} />
                    </Tab>
                  </Tabs>
                </Box>
              </Box>
            )}
            <Switch>
              <Route exact path="/home" component={HomePage} />
            </Switch>
          </Router>
        )}
      </ResponsiveContext.Consumer>
    );
  }
}
