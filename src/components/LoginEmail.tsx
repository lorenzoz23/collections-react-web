import React, { Component } from 'react';
import { ResponsiveContext, Box, Tabs, Tab } from 'grommet';
import firebase from 'firebase';
import 'firebase/database';

import SignIn from './SignIn';
import SignUp from './SignUp';

interface LoginEmailProps {
  handleLogin(name: string): void;
  handleRememberMe(checked: boolean): void;
  goBack(): void;
  rememberMe: boolean;
}

export default class LoginEmail extends Component<LoginEmailProps> {
  state = {
    email: '',
    password: '',
    name: '',
    activeIndex: 0,
    created: false
  };

  handleUserSignUp = (email: string, password: string, name: string) => {
    this.setState({
      email: email,
      password: password,
      name: name,
      activeIndex: 0,
      created: true
    });
  };

  handleLogin = () => {
    let username: string = '';
    const id = firebase.auth().currentUser?.uid;
    firebase
      .database()
      .ref('/users/' + id)
      .once('value')
      .then((snapshot) => {
        username = snapshot.val() && snapshot.val().name;
      })
      .catch(() => {
        console.log('error');
      });
    this.props.handleLogin(username);
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
                  email={this.state.email}
                  handleRememberMe={(checked: boolean) =>
                    this.props.handleRememberMe(checked)
                  }
                  password={this.state.password}
                  handleLogin={this.handleLogin}
                  created={this.state.created}
                  rememberMe={this.props.rememberMe}
                />
              </Tab>
              <Tab title="sign up">
                <SignUp
                  handleUserSignUp={(
                    email: string,
                    password: string,
                    name: string
                  ) => this.handleUserSignUp(email, password, name)}
                />
              </Tab>
            </Tabs>
          </Box>
        )}
      </ResponsiveContext.Consumer>
    );
  }
}
