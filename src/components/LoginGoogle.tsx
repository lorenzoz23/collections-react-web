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
    if (size === 'small') this.redirect();
    else this.popup();
  };

  redirect = () => {
    const providerGoogle = new firebase.auth.GoogleAuthProvider();
    const type: string = this.props.rememberMe
      ? firebase.auth.Auth.Persistence.LOCAL
      : firebase.auth.Auth.Persistence.SESSION;
    firebase.auth().setPersistence(type);
    firebase.auth().signInWithRedirect(providerGoogle);
    firebase
      .auth()
      .getRedirectResult()
      .then((result: any) => {
        const token = result.credential.accessToken || undefined;
        console.log(token);
        // The signed-in user info.
        const user = result.user;
        const isNew: boolean = result.additionalUserInfo!.isNewUser;
        if (isNew) {
          const userRef = firebase.database().ref('users/' + result.user.uid);
          const tagRef = userRef.child('tags');

          const bluRayTagRef = tagRef.push();
          bluRayTagRef.set({ title: 'blu-ray' });

          const dvdTagRef = tagRef.push();
          dvdTagRef.set({ title: 'dvd' });

          const uhdTagRef = tagRef.push();
          uhdTagRef.set({ title: '4k-uhd' });
        }
        console.log(user);
        if (this.props.rememberMe)
          localStorage.setItem('rememberMe', 'remember');
        this.props.handleLogin();
      })
      .catch((error) => {
        var errorMessage = error.message;
        console.log(errorMessage);
      });
  };

  popup = () => {
    const providerGoogle = new firebase.auth.GoogleAuthProvider();
    const type: string = this.props.rememberMe
      ? firebase.auth.Auth.Persistence.LOCAL
      : firebase.auth.Auth.Persistence.SESSION;
    firebase.auth().setPersistence(type);
    firebase
      .auth()
      .signInWithPopup(providerGoogle)
      .then((result: any) => {
        const token = result.credential.accessToken || undefined;
        console.log(token);
        // The signed-in user info.
        const user = result.user;
        const isNew: boolean = result.additionalUserInfo!.isNewUser;
        if (isNew) {
          const userRef = firebase.database().ref('users/' + result.user.uid);
          const tagRef = userRef.child('tags');

          const bluRayTagRef = tagRef.push();
          bluRayTagRef.set({ title: 'blu-ray' });

          const dvdTagRef = tagRef.push();
          dvdTagRef.set({ title: 'dvd' });

          const uhdTagRef = tagRef.push();
          uhdTagRef.set({ title: '4k-uhd' });
        }
        console.log(user);
        if (this.props.rememberMe)
          localStorage.setItem('rememberMe', 'remember');
        this.props.handleLogin();
      })
      .catch((error) => {
        var errorMessage = error.message;
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
