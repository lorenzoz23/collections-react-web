import React, { Component } from 'react';
import { ResponsiveContext, Box, Button } from 'grommet';
import { Google } from 'grommet-icons';
import firebase from 'firebase/app';
import 'firebase/auth';
import { motion } from 'framer-motion';

interface LoginGoogleProps {
  size: string;
  handleLogin(): void;
  rememberMe: boolean;
}

export default class LoginGoogle extends Component<LoginGoogleProps> {
  signInWithGoogle = async () => {
    const providerGoogle = new firebase.auth.GoogleAuthProvider();
    const type: string = this.props.rememberMe
      ? firebase.auth.Auth.Persistence.LOCAL
      : firebase.auth.Auth.Persistence.SESSION;
    await firebase.auth().setPersistence(type);
    let result: any;
    if (this.props.size === 'small') {
      // await firebase.auth().signInWithRedirect(providerGoogle);
      // result = await firebase.auth().getRedirectResult();
      result = await firebase.auth().signInWithPopup(providerGoogle);
    } else {
      result = await firebase.auth().signInWithPopup(providerGoogle);
    }
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
                color="#CDFEE2"
                size={size === 'small' ? 'medium' : 'large'}
                label="continue with google"
                icon={<Google color="plain" />}
                reverse
                onClick={async () => await this.signInWithGoogle()}
              />
            </Box>
          </motion.div>
        )}
      </ResponsiveContext.Consumer>
    );
  }
}
