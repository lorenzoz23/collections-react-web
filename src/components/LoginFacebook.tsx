import React, { Component } from 'react';
import { ResponsiveContext, Box, Button } from 'grommet';
import { Facebook } from 'grommet-icons';
import firebase from 'firebase/app';
import 'firebase/auth';

interface LoginFacebookProps {
  handleLogin(): void;
}

export default class LoginFacebook extends Component<LoginFacebookProps> {
  signInWithFb = async () => {
    const providerFb = new firebase.auth.FacebookAuthProvider();
    await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    const result = await firebase.auth().signInWithPopup(providerFb);
    const isNew: boolean = result.additionalUserInfo!.isNewUser;
    if (isNew) {
      const userRef = firebase.database().ref('users/' + result.user!.uid);
      const tagRef = userRef.child('tags');

      const bluRayTagRef = tagRef.push();
      bluRayTagRef.set({ title: 'blu-ray' });

      const digitalTagRef = tagRef.push();
      digitalTagRef.set({ title: 'digital' });

      const dvdTagRef = tagRef.push();
      dvdTagRef.set({ title: 'dvd' });

      localStorage.setItem('isNew', 'facebook.com');
    }
    this.props.handleLogin();
  };

  render() {
    return (
      <ResponsiveContext.Consumer>
        {(size) => (
          <Box>
            <Button
              primary
              color="#006AFF"
              size={size === 'small' ? 'medium' : 'large'}
              label="Facebook"
              icon={<Facebook color="#00E0FF" />}
              reverse
              onClick={async () => await this.signInWithFb()}
            />
          </Box>
        )}
      </ResponsiveContext.Consumer>
    );
  }
}
