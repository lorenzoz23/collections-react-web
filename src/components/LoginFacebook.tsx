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
  signInWithFb = async () => {
    const providerFb = new firebase.auth.FacebookAuthProvider();
    const type: string = this.props.rememberMe
      ? firebase.auth.Auth.Persistence.LOCAL
      : firebase.auth.Auth.Persistence.SESSION;
    await firebase.auth().setPersistence(type);
    let result: any;
    result = await firebase.auth().signInWithPopup(providerFb);
    // This gives you a Google Access Token. You can use it to access the Google API.
    const token = result.credential.accessToken;
    console.log(token);
    // The signed-in user info.
    const user = result.user;
    console.log(user);
    if (this.props.rememberMe) localStorage.setItem('rememberMe', 'remember');
    this.props.handleLogin();
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
                onClick={async () => await this.signInWithFb()}
              />
            </Box>
          </motion.div>
        )}
      </ResponsiveContext.Consumer>
    );
  }
}
