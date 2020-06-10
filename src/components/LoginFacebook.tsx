import React, { Component } from 'react';
import { ResponsiveContext, Box, Button } from 'grommet';
import { Facebook } from 'grommet-icons';

interface LoginFacebookProps {
  firebase: any;
}

export default class LoginFacebook extends Component<LoginFacebookProps> {
  state = {};

  signInWithFb = () => {
    const providerFb = new this.props.firebase.auth.FacebookAuthProvider();
    this.props.firebase
      .auth()
      .signInWithPopup(providerFb)
      .then((result: any) => {
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
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
              color="#006AFF"
              //style={{ borderColor: '#006AFF' }}
              size={size === 'small' ? 'medium' : 'large'}
              label="continue with facebook"
              icon={<Facebook color="#00E0FF" />}
              reverse
              onClick={() => this.signInWithFb()}
            />
          </Box>
        )}
      </ResponsiveContext.Consumer>
    );
  }
}
