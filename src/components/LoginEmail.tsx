import React, { Component } from 'react';
import { ResponsiveContext, Box, Tabs, Tab } from 'grommet';
import SignIn from './SignIn';
import SignUp from './SignUp';

interface LoginEmailProps {
  handleLogin(): void;
  handleSignUp(email: string, password: string, name: string): void;
  goBack(): void;
}

export default class LoginEmail extends Component<LoginEmailProps> {
  state = {
    email: '',
    password: '',
    name: '',
    activeIndex: 0,
    show: false
  };

  handleSignUp = () => {
    this.props.handleSignUp(
      this.state.email,
      this.state.password,
      this.state.name
    );
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
              <Tab title="sign in">
                <SignIn
                  goBack={this.props.goBack}
                  handleLogin={this.props.handleLogin}
                  email={this.state.email}
                  password={this.state.password}
                />
              </Tab>
              <Tab title="sign up">
                <SignUp handleSignUp={this.handleSignUp} />
              </Tab>
            </Tabs>
          </Box>
        )}
      </ResponsiveContext.Consumer>
    );
  }
}
