import React, { Component } from 'react';
import {
  Form,
  FormField,
  TextInput,
  Box,
  Button,
  ResponsiveContext
} from 'grommet';
import firebase from 'firebase/app';
import 'firebase/auth';

interface SignUpProps {
  handleUserSignUp(email: string, password: string, name: string): void;
}
export default class SignUp extends Component<SignUpProps> {
  state = {
    name: '',
    email: '',
    password: '',
    errorMessage: ['']
  };

  defaultState = {
    name: '',
    email: '',
    password: '',
    errorMessage: ['']
  };

  handleSignUp = (email: string, password: string) => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        const user = firebase.auth().currentUser;
        if (user) {
          const userRef = firebase.database().ref('/users/' + user.uid);
          userRef.set({
            name: this.state.name
          });
        }
        this.props.handleUserSignUp(email, password, this.state.name);
      })
      .catch((error: any) => {
        let message: string[] = ['', ''];
        switch (error.code) {
          case 'auth/email-already-in-use':
            message = ['email', 'email already in use'];
            break;
          case 'auth/invalid-email':
            message = ['email', 'invalid email'];
            break;
          case 'auth/operation-not-allowed':
            message = ['password', 'account creation is currently not allowed'];
            break;
          case 'auth/weak-password':
            message = ['password', 'password is too weak'];
            break;
          default:
            message = ['password', 'please try again'];
            break;
        }
        this.setState({
          errorMessage: message
        });
      });
  };

  render() {
    return (
      <ResponsiveContext.Consumer>
        {(size) => (
          <Box>
            <Form
              onReset={() => this.setState(this.defaultState)}
              onSubmit={() =>
                this.handleSignUp(this.state.email, this.state.password)
              }
              onChange={(nextFormValue: {}) => this.setState(nextFormValue)}
            >
              <FormField label="name" name="name">
                <TextInput
                  name="name"
                  size={size === 'small' ? 'medium' : 'xlarge'}
                  value={this.state.name}
                  onChange={(e: any) => {
                    this.setState({ name: e.target.value });
                  }}
                />
              </FormField>
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
                  type="password"
                  size={size === 'small' ? 'medium' : 'xlarge'}
                  value={this.state.password}
                  onChange={(e: any) => {
                    this.setState({ password: e.target.value });
                  }}
                />
              </FormField>
              <Box pad="small" justify="between" align="center" direction="row">
                <Button
                  label="submit"
                  type="submit"
                  primary
                  size={size === 'small' ? 'small' : 'medium'}
                />
                <Button
                  label="reset"
                  type="reset"
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
