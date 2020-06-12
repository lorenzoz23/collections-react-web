import React, { Component } from 'react';
import { ResponsiveContext, Box, Tabs, Tab } from 'grommet';
import SignIn from './SignIn';
import SignUp from './SignUp';

interface LoginEmailProps {
  handleLogin(): void;
  goBack(): void;
  firebase: any;
}

export default class LoginEmail extends Component<LoginEmailProps> {
  state = {
    email: '',
    password: '',
    name: '',
    activeIndex: 0,
    created: false
  };

  handleLogin = (email: string, password: string) => {
    if (this.state.created) {
      this.props.handleLogin();
    } else {
      this.props.firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => this.props.handleLogin())
        .catch((error: any) => {
          const errorMessage = error.message;
          console.log(errorMessage);
        });
    }
  };

  handleSignUp = (email: string, password: string, name: string) => {
    this.props.firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() =>
        this.setState({
          email: email,
          password: password,
          name: name,
          activeIndex: 0,
          created: true
        })
      )
      .catch((error: any) => {
        const errorMessage = error.message;
        console.log(errorMessage);
      });
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
                  handleLogin={(email: string, password: string) =>
                    this.handleLogin(email, password)
                  }
                  email={this.state.email}
                  password={this.state.password}
                />
              </Tab>
              <Tab title="sign up">
                <SignUp
                  handleSignUp={(
                    email: string,
                    password: string,
                    name: string
                  ) => this.handleSignUp(email, password, name)}
                />
              </Tab>
            </Tabs>
          </Box>
        )}
      </ResponsiveContext.Consumer>
    );
  }
}
