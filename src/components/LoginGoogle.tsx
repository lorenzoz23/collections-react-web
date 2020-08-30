import React, { Component } from 'react';
import { ResponsiveContext, Box, Button } from 'grommet';
import { Google } from 'grommet-icons';
import firebase from 'firebase/app';
import 'firebase/auth';

interface LoginGoogleProps {
  handleLogin(): void;
}

export default class LoginGoogle extends Component<LoginGoogleProps> {
  popup = async () => {
    const providerGoogle = new firebase.auth.GoogleAuthProvider();
    await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    const result = await firebase.auth().signInWithPopup(providerGoogle);

    // The signed-in user info.
    const user = result.user!;
    const isNew: boolean = result.additionalUserInfo!.isNewUser;
    if (isNew) {
      const userRef = firebase.database().ref('users/' + user.uid);
      const tagRef = userRef.child('tags');

      const bluRayTagRef = tagRef.push();
      bluRayTagRef.set({ title: 'blu-ray' });

      const digitalTagRef = tagRef.push();
      digitalTagRef.set({ title: 'digital' });

      const dvdTagRef = tagRef.push();
      dvdTagRef.set({ title: 'dvd' });

      localStorage.setItem('isNew', 'google.com');
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
              color="#CDFEE2"
              size={size === 'small' ? 'medium' : 'large'}
              label="Google"
              icon={<Google color="plain" />}
              reverse
              onClick={async () => await this.popup()}
            />
          </Box>
        )}
      </ResponsiveContext.Consumer>
    );
  }
}
