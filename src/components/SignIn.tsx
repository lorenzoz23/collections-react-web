import React, { Component } from 'react';
import {
  Form,
  FormField,
  TextInput,
  Box,
  Button,
  ResponsiveContext,
  Anchor
} from 'grommet';
import { Previous, Erase, Login } from 'grommet-icons';
import firebase from 'firebase/app';
import 'firebase/auth';
import { motion } from 'framer-motion';
import Notification from './Notification';

const variants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 }
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.5
    }
  }
};

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
    created: this.props.created,
    notificationVisible: false
  };

  defaultState = {
    email: '',
    password: '',
    errorMessage: ['']
  };

  handleLogin = (email: string, password: string) => {
    if (this.state.created) {
      this.props.handleLogin();
    } else {
      firebase
        .auth()
        .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(() => {
          firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then(() => {
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

  handleResetPassword = () => {
    firebase
      .auth()
      .sendPasswordResetEmail(this.state.email)
      .then(() => {
        this.setState(
          {
            errorMessage: [''],
            notificationVisible: true
          },
          () => {
            setTimeout(
              () => this.setState({ notificationVisible: false }),
              4000
            );
          }
        );
      })
      .catch((error) => {
        let message: string[] = ['', ''];
        switch (error.code) {
          case 'auth/invalid-email':
            message = ['email', 'invalid email'];
            break;
          case 'auth/user-not-found':
            message = ['email', 'user not found'];
            break;
          case 'auth/user-disabled':
            message = ['password', 'user account is disabled'];
            break;
          default:
            message = ['password', 'unknown error; please try again'];
            break;
        }
        this.setState({
          errorMessage: message
        });
      });
  };

  onFormChange = (nextFormValue: any) => {
    this.setState({
      email: nextFormValue.email,
      password: nextFormValue.password,
      errorMessage: ['']
    });
  };

  render() {
    return (
      <ResponsiveContext.Consumer>
        {(size) => (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={variants}
            transition={{ ease: 'easeOut', duration: 2 }}
          >
            <Box>
              <Form
                value={this.state}
                onSubmit={() =>
                  this.handleLogin(this.state.email, this.state.password)
                }
                onChange={(nextFormValue: any) =>
                  this.onFormChange(nextFormValue)
                }
                onReset={() => this.setState(this.defaultState)}
              >
                <FormField
                  label="Email"
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
                    autoFocus
                    autoComplete="email"
                    size={size === 'small' ? 'medium' : 'xlarge'}
                    value={this.state.email}
                    onChange={(e: any) => {
                      this.setState({ email: e.target.value });
                    }}
                  />
                </FormField>
                <FormField
                  label="Password"
                  required
                  name="password"
                  autoComplete="current-password"
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
                <Box
                  direction="row"
                  justify="between"
                  pad="small"
                  align="center"
                >
                  <Button
                    alignSelf="center"
                    onClick={() => this.props.goBack()}
                    icon={<Previous />}
                    title="Back"
                    style={{ borderRadius: 30 }}
                    hoverIndicator="accent-3"
                    size={size === 'small' ? 'small' : 'medium'}
                  />
                  <Button
                    alignSelf="center"
                    icon={<Erase />}
                    title="Reset"
                    hoverIndicator="brand"
                    size={size === 'small' ? 'small' : 'medium'}
                    style={{ borderRadius: 30 }}
                    type="reset"
                  />
                  <Button
                    alignSelf="center"
                    icon={<Login />}
                    type="submit"
                    style={{ borderRadius: 30 }}
                    title="Continue"
                    hoverIndicator="accent-1"
                    size={size === 'small' ? 'small' : 'medium'}
                  />
                </Box>
                <Box align="center">
                  <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                  >
                    <Anchor
                      disabled={this.state.email.length === 0}
                      label="Forgot password"
                      alignSelf="center"
                      onClick={this.handleResetPassword}
                    />
                  </motion.div>
                </Box>
              </Form>
              {this.state.notificationVisible && (
                <Notification
                  good={true}
                  notificationText={'Password reset email sent!'}
                  onNotificationClose={() =>
                    this.setState({ notificationVisible: false })
                  }
                />
              )}
            </Box>
          </motion.div>
        )}
      </ResponsiveContext.Consumer>
    );
  }
}
