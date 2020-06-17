import React, { Component } from 'react';
import {
  Form,
  FormField,
  TextInput,
  Box,
  Button,
  ResponsiveContext
} from 'grommet';
import { Next, Previous } from 'grommet-icons';
import firebase from 'firebase/app';
import 'firebase/auth';

interface SignInProps {
  handleLogin(): void;
  goBack(): void;
  email: string;
  password: string;
  created: boolean;
}

export default class SignIn extends Component<SignInProps> {
  state = {
    email: this.props.email,
    password: this.props.password,
    errorMessage: [''],
    created: this.props.created
  };

  handleLogin = (email: string, password: string) => {
    if (this.state.created) {
      this.props.handleLogin();
    } else {
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => this.props.handleLogin())
        .catch((error: any) => {
          let message: string[] = ['', ''];
          switch (error.code) {
            case 'auth/invalid-email':
              message = [
                'email',
                'you call that a properly formatted email address?!'
              ];
              break;
            case 'auth/user-not-found':
              message = [
                'email',
                'the first step towards recovery is to actually make an account'
              ];
              break;
            case 'auth/wrong-password':
              message = [
                'password',
                "hey, typing can be hard. let's give that password another go, okay?"
              ];
              break;
            case 'auth/user-disabled':
              message = [
                'password',
                'you went over the line, so we marked you a zero - account disabled'
              ];
              break;
            default:
              message = [
                'password',
                "honestly? no idea what just happened. let's try it again."
              ];
              break;
          }
          this.setState({
            errorMessage: message
          });
        });
    }
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
            </Form>
          </Box>
        )}
      </ResponsiveContext.Consumer>
    );
  }
}
