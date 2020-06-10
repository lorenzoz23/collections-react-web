import React, { Component } from 'react';
import { ResponsiveContext, Box, Button } from 'grommet';
import { MailOption } from 'grommet-icons';
import LoginEmail from './LoginEmail';
import LoginGoogle from './LoginGoogle';
import firebase from 'firebase';
import LoginFacebook from './LoginFacebook';

interface LoginButtonProps {
  firebase: any;
  handleLogin(): void;
}

export default class LoginButtons extends Component<LoginButtonProps> {
  state = {
    email: '',
    password: '',
    name: '',
    activeIndex: 0,
    show: false
  };

  handleLogin = () => {
    this.props.firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => this.props.handleLogin())
      .catch((error: any) => {
        const errorMessage = error.message;
        console.log(errorMessage);
      });
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
          activeIndex: 0
        })
      )
      .catch((error: any) => {
        const errorMessage = error.message;
        console.log(errorMessage);
      });
  };

  goBack = () => {
    this.setState({
      show: false
    });
  };

  render() {
    return (
      <ResponsiveContext.Consumer>
        {(size) => (
          <Box>
            {this.state.show ? (
              <LoginEmail
                goBack={this.goBack}
                handleLogin={this.props.handleLogin}
                handleSignUp={(email: string, password: string, name: string) =>
                  this.handleSignUp(email, password, name)
                }
              />
            ) : (
              <Box gap="medium">
                <Button
                  primary
                  size={size === 'small' ? 'medium' : 'large'}
                  label="continue with email"
                  icon={<MailOption />}
                  reverse
                  onClick={() => {
                    this.setState({ show: true });
                  }}
                />
                <LoginGoogle firebase={firebase} />
                <LoginFacebook firebase={firebase} />
              </Box>
            )}
          </Box>
        )}
      </ResponsiveContext.Consumer>
    );
  }
}
