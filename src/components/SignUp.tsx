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
import { motion } from 'framer-motion';

const variants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 }
};

interface SignUpProps {
  handleUserSignUp(email: string, password: string): void;
  rememberMe: boolean;
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

  handleSignUp = () => {
    const type: string = this.props.rememberMe
      ? firebase.auth.Auth.Persistence.LOCAL
      : firebase.auth.Auth.Persistence.SESSION;
    firebase
      .auth()
      .setPersistence(type)
      .then(() => {
        firebase
          .auth()
          .createUserWithEmailAndPassword(this.state.email, this.state.password)
          .then((result) => {
            if (this.props.rememberMe)
              localStorage.setItem('rememberMe', 'remember');
            const user = firebase.auth().currentUser!;
            const isNew: boolean = result.additionalUserInfo!.isNewUser;
            if (isNew) {
              const userRef = firebase.database().ref('users/' + user.uid);
              userRef.set({
                name: this.state.name
              });
              const tagRef = userRef.child('tags');

              const bluRayTagRef = tagRef.push();
              bluRayTagRef.set({ title: 'blu-ray' });

              const uhdTagRef = tagRef.push();
              uhdTagRef.set({ title: 'digital' });

              const dvdTagRef = tagRef.push();
              dvdTagRef.set({ title: 'dvd' });

              localStorage.setItem('isNew', 'password');
            }
            this.props.handleUserSignUp(this.state.email, this.state.password);
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
                message = [
                  'password',
                  'account creation is currently not allowed'
                ];
                break;
              case 'auth/weak-password':
                message = ['password', 'password is too weak'];
                break;
              default:
                message = ['password', 'unknown error; please try again'];
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
  };

  onFormChange = (nextFormValue: any) => {
    this.setState({
      name: nextFormValue.name,
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
                onReset={() => this.setState(this.defaultState)}
                onSubmit={this.handleSignUp}
                onChange={(nextFormValue: any) =>
                  this.onFormChange(nextFormValue)
                }
              >
                <FormField label="Name" name="name">
                  <TextInput
                    autoFocus
                    autoComplete="name"
                    name="name"
                    size={size === 'small' ? 'medium' : 'xlarge'}
                    value={this.state.name}
                    onChange={(e: any) => {
                      this.setState({ name: e.target.value });
                    }}
                  />
                </FormField>
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
                    type="email"
                    autoComplete="email"
                    name="email"
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
                  error={
                    this.state.errorMessage[0] === 'password'
                      ? this.state.errorMessage[1]
                      : ''
                  }
                >
                  <TextInput
                    name="password"
                    autoComplete="new-password"
                    type="password"
                    size={size === 'small' ? 'medium' : 'xlarge'}
                    value={this.state.password}
                    onChange={(e: any) => {
                      this.setState({ password: e.target.value });
                    }}
                  />
                </FormField>
                <Box
                  pad="small"
                  justify="between"
                  align="center"
                  direction="row"
                >
                  <motion.div whileTap={{ scale: 0.9 }}>
                    <Button
                      hoverIndicator="transparent"
                      label="Submit"
                      type="submit"
                      primary
                      size={size === 'small' ? 'small' : 'medium'}
                    />
                  </motion.div>
                  <motion.div whileTap={{ scale: 0.9 }}>
                    <Button
                      hoverIndicator="accent-1"
                      label="Reset"
                      type="reset"
                      size={size === 'small' ? 'small' : 'medium'}
                    />
                  </motion.div>
                </Box>
              </Form>
            </Box>
          </motion.div>
        )}
      </ResponsiveContext.Consumer>
    );
  }
}
