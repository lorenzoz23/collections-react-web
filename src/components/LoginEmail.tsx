import React, { Component } from 'react';
import { ResponsiveContext, Box, Tabs, Tab } from 'grommet';

import SignIn from './SignIn';
import SignUp from './SignUp';

interface LoginEmailProps {
  handleLogin(): void;
  goBack(): void;
}

export default class LoginEmail extends Component<LoginEmailProps> {
  state = {
    email: '',
    password: '',
    activeIndex: 0,
    created: false
  };

  handleUserSignUp = (email: string, password: string) => {
    this.setState({
      email: email,
      password: password,
      activeIndex: 0,
      created: true
    });
    this.props.handleLogin();
  };

  render() {
    return (
      <ResponsiveContext.Consumer>
        {(size) => (
          <Box alignSelf="center">
            <Tabs
              activeIndex={this.state.activeIndex}
              onActive={(index) => {
                this.setState({ activeIndex: index });
              }}
            >
              <Tab title="Sign In">
                <SignIn
                  goBack={this.props.goBack}
                  email={this.state.email}
                  password={this.state.password}
                  handleLogin={this.props.handleLogin}
                  created={this.state.created}
                />
              </Tab>
              <Tab title="Sign Up">
                <SignUp
                  handleUserSignUp={(email, password) =>
                    this.handleUserSignUp(email, password)
                  }
                />
              </Tab>
            </Tabs>
          </Box>
        )}
      </ResponsiveContext.Consumer>
    );
  }
}
