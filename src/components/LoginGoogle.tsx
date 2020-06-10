import React, { Component } from 'react';
import { ResponsiveContext, Box, Button } from 'grommet';
import { Google } from 'grommet-icons';

interface LoginGoogleProps {
  firebase: any;
}

export default class LoginGoogle extends Component<LoginGoogleProps> {
  state = {};

  signInWithGoogle = () => {
    const providerGoogle = new this.props.firebase.auth.GoogleAuthProvider();
    this.props.firebase
      .auth()
      .signInWithPopup(providerGoogle)
      .then((result: any) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const token = result.credential.accessToken;
        console.log(token);
        // The signed-in user info.
        const user = result.user;
        console.log(user);
      })
      .catch((error: any) => {
        // Handle Errors here.
        const errorMessage = error.message;
        console.log(errorMessage);
      });
  };

  render() {
    return (
      <ResponsiveContext.Consumer>
        {(size) => (
          <Box>
            <Button
              primary
              color="#CDFEE2"
              //style={{ borderColor: '#DB4437' }}
              size={size === 'small' ? 'medium' : 'large'}
              label="continue with google"
              icon={<Google color="plain" />}
              reverse
              onClick={() => this.signInWithGoogle()}
            />
          </Box>
        )}
      </ResponsiveContext.Consumer>
    );
  }
}
