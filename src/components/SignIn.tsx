import React, { Component } from 'react';
import {
  Form,
  FormField,
  TextInput,
  Box,
  Button,
  ResponsiveContext,
  CheckBox
} from 'grommet';
import { Next, Previous } from 'grommet-icons';
import firebase from 'firebase/app';
import 'firebase/auth';

interface SignInProps {
  handleLogin(): void;
  goBack(): void;
  handleRememberMe(checked: boolean): void;
  email: string;
  password: string;
  created: boolean;
  rememberMe: boolean;
}

export default class SignIn extends Component<SignInProps> {
  state = {
    email: this.props.email,
    password: this.props.password,
    errorMessage: [''],
    created: this.props.created,
    rememberMe: this.props.rememberMe
  };

  handleLogin = (email: string, password: string) => {
    if (this.state.created) {
      this.props.handleLogin();
    } else {
      const type: string = this.props.rememberMe
        ? firebase.auth.Auth.Persistence.LOCAL
        : firebase.auth.Auth.Persistence.SESSION;
      firebase
        .auth()
        .setPersistence(type)
        .then(() => {
          firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then(() => {
              if (this.props.rememberMe)
                localStorage.setItem('rememberMe', 'remember');
              this.props.handleLogin();
            })
            .catch((error: any) => {
              let message: string[] = ['', ''];
              switch (error.code) {
                case 'auth/invalid-email':
                  message = ['email', 'invalid email'];
                  break;
                case 'auth/user-not-found':
                  message = ['email', 'user not found'];
                  break;
                case 'auth/wrong-password':
                  message = ['password', 'password is incorrect'];
                  break;
                case 'auth/user-disabled':
                  message = ['password', 'user account is disabled'];
                  break;
                default:
                  message = ['password', 'please try again'];
                  break;
              }
              this.setState({
                errorMessage: message
              });
            });
        })
        .catch((error: any) => {
          console.log(error);
        });
    }
  };

  handleRemember = (event: any) => {
    this.setState({
      rememberMe: event.target.checked
    });
    this.props.handleRememberMe(event.target.checked);
  };

  render() {
    return (
      <ResponsiveContext.Consumer>
        {(size) => (
          <Box>
            <Form
              value={this.state}
              onSubmit={() =>
                this.handleLogin(this.state.email, this.state.password)
              }
              onChange={(nextFormValue: {}) => this.setState(nextFormValue)}
            >
              <FormField
                label="email"
                required
                name="email"
                error={
                  this.state.errorMessage[0] === 'email'
                    ? this.state.errorMessage[1]
                    : ''
                }
              >
                <TextInput
                  name="email"
                  size={size === 'small' ? 'medium' : 'xlarge'}
                  value={this.state.email}
                  onChange={(e: any) => {
                    this.setState({ email: e.target.value });
                  }}
                />
              </FormField>
              <FormField
                label="password"
                required
                name="password"
                error={
                  this.state.errorMessage[0] === 'password'
                    ? this.state.errorMessage[1]
                    : ''
                }
              >
                <TextInput
                  name="password"
                  size={size === 'small' ? 'medium' : 'xlarge'}
                  type="password"
                  value={this.state.password}
                  onChange={(e: any) => {
                    this.setState({ password: e.target.value });
                  }}
                />
              </FormField>
              <Box direction="row" justify="between" pad="small" align="center">
                <Button
                  onClick={() => this.props.goBack()}
                  icon={<Previous />}
                  title="back"
                  style={{ borderRadius: 30 }}
                  hoverIndicator="accent-1"
                  size={size === 'small' ? 'small' : 'medium'}
                />
                <Button
                  icon={<Next />}
                  type="submit"
                  style={{ borderRadius: 30 }}
                  title="continue"
                  hoverIndicator="accent-1"
                  size={size === 'small' ? 'small' : 'medium'}
                />
              </Box>
              <Box align="center">
                <CheckBox
                  label="remember me?"
                  checked={this.state.rememberMe}
                  onChange={(event) => this.handleRemember(event)}
                />
              </Box>
            </Form>
          </Box>
        )}
      </ResponsiveContext.Consumer>
    );
  }
}
