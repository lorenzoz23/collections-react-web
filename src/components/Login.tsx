import React, { Component } from 'react';
import { ResponsiveContext, Box, Heading, Tabs, Tab } from 'grommet';
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
                flex
                background="radial-gradient(circle, rgba(27,50,163,1) 0%, rgba(143,38,59,1) 100%)"
                justify="center"
                align="center"
              >
                <Box
                  align="center"
                  justify="center"
                  width="large"
                  height="xxlarge"
                >
                  <Heading>collections</Heading>
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
