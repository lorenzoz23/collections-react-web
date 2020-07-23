import React, { Component } from 'react';
import {
  Form,
  FormField,
  TextInput,
  Box,
  Button,
  ResponsiveContext,
  CheckBox,
  Anchor
} from 'grommet';
import { Next, Previous } from 'grommet-icons';
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
    rememberMe: this.props.rememberMe,
    notificationVisible: false
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
            message = ['email', 'unknown error'];
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
                <Box
                  direction="row"
                  justify="between"
                  pad="small"
                  align="center"
                >
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
                <Box align="center" gap="small">
                  <motion.div whileTap={{ scale: 0.9 }}>
                    <CheckBox
                      label="remember me?"
                      checked={this.state.rememberMe}
                      onChange={(event) => this.handleRemember(event)}
                    />
                  </motion.div>
                  <motion.div
                    //animate={{ opacity: 0.5 }}
                    //transition={{ flip: Infinity, duration: 0.5 }}
                    variants={container}
                    initial="hidden"
                    animate="show"
                  >
                    <Anchor
                      disabled={this.state.email.length === 0}
                      label="forgot password"
                      alignSelf="center"
                      onClick={this.handleResetPassword}
                    />
                  </motion.div>
                </Box>
              </Form>
              {this.state.notificationVisible && (
                <Notification
                  good={true}
                  notificationText={'password reset email sent!'}
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
