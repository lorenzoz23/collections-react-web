import React, { Component } from 'react';
import { ResponsiveContext, Box, Button } from 'grommet';
import { Google } from 'grommet-icons';
import firebase from 'firebase/app';
import 'firebase/auth';

interface LoginGoogleProps {
  handleLogin(): void;
  rememberMe: boolean;
}

export default class LoginGoogle extends Component<LoginGoogleProps> {
  signInWithGoogle = (size: string) => {
    if (size === 'small') this.popup();
    else this.popup();
  };

  // redirect = async () => {
  //   const providerGoogle = new firebase.auth.GoogleAuthProvider();
  //   const type: string = this.props.rememberMe
  //     ? firebase.auth.Auth.Persistence.LOCAL
  //     : firebase.auth.Auth.Persistence.SESSION;
  //   await firebase.auth().setPersistence(type);
  //   await firebase.auth().signInWithRedirect(providerGoogle);
  //   const result = await firebase.auth().getRedirectResult();

  //   // The signed-in user info.
  //   const user = result.user!;
  //   const isNew: boolean = result.additionalUserInfo!.isNewUser;
  //   console.log(isNew);
  //   if (isNew) {
  //     console.log('new');
  //     const userRef = firebase.database().ref('users/' + user.uid);
  //     const tagRef = userRef.child('tags');

  //     const bluRayTagRef = tagRef.push();
  //     bluRayTagRef.set({ title: 'blu-ray' });

  //     const digitalTagRef = tagRef.push();
  //     digitalTagRef.set({ title: 'digital' });

  //     const dvdTagRef = tagRef.push();
  //     dvdTagRef.set({ title: 'dvd' });

  //     //const providerFb = new firebase.auth.FacebookAuthProvider();
  //     //await user.linkWithPopup(providerFb);
  //     if (user.email) {
  //       console.log('email exists');
  //       user.linkWithCredential(
  //         firebase.auth.EmailAuthProvider.credential(user.email, 'test123')
  //       );
  //     }
  //   }
  //   if (this.props.rememberMe) localStorage.setItem('rememberMe', 'remember');
  //   this.props.handleLogin();
  // };

  popup = async () => {
    const providerGoogle = new firebase.auth.GoogleAuthProvider();
    const type: string = this.props.rememberMe
      ? firebase.auth.Auth.Persistence.LOCAL
      : firebase.auth.Auth.Persistence.SESSION;
    await firebase.auth().setPersistence(type);
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
    if (this.props.rememberMe) localStorage.setItem('rememberMe', 'remember');
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
              label="Continue with Google"
              icon={<Google color="plain" />}
              reverse
              onClick={() => this.signInWithGoogle(size)}
            />
          </Box>
        )}
      </ResponsiveContext.Consumer>
    );
  }
}
