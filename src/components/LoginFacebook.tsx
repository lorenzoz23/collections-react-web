import React, { Component } from 'react';
import { ResponsiveContext, Box, Button } from 'grommet';
import { Facebook } from 'grommet-icons';
import firebase from 'firebase/app';
import 'firebase/auth';
import { motion } from 'framer-motion';

interface LoginFacebookProps {
  handleLogin(): void;
  rememberMe: boolean;
}

export default class LoginFacebook extends Component<LoginFacebookProps> {
  signInWithFb = () => {
    const providerFb = new firebase.auth.FacebookAuthProvider();
    const type: string = this.props.rememberMe
      ? firebase.auth.Auth.Persistence.LOCAL
      : firebase.auth.Auth.Persistence.SESSION;
    firebase
      .auth()
      .setPersistence(type)
      .then(() => {
        firebase
          .auth()
          .signInWithPopup(providerFb)
          .then((result: any) => {
            // This gives you a Facebook Access Token. You can use it to access the Facebook API.
            const token = result.credential.accessToken;
            console.log(token);
            // The signed-in user info.
            const user = result.user;
            console.log(user);
            if (this.props.rememberMe)
              localStorage.setItem('rememberMe', 'remember');
            this.props.handleLogin();
          })
          .catch((error: any) => {
            // Handle Errors here.
            const errorMessage = error.message;
            console.log(errorMessage);
          });
      });
  };

  render() {
    return (
      <ResponsiveContext.Consumer>
        {(size) => (
          <motion.div whileTap={{ scale: 0.9 }}>
            <Box>
              <Button
                primary
                color="#006AFF"
                size={size === 'small' ? 'medium' : 'large'}
                label="continue with facebook"
                icon={<Facebook color="#00E0FF" />}
                reverse
                onClick={() => this.signInWithFb()}
              />
            </Box>
          </motion.div>
        )}
      </ResponsiveContext.Consumer>
    );
  }
}
