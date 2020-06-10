import React, { Component } from 'react';
import { ResponsiveContext, Box, Heading } from 'grommet';
import {
  BrowserRouter as Router,
  Redirect,
  Switch,
  Route
} from 'react-router-dom';

import HomePage from './HomePage';
import LoginButtons from './LoginButtons';

import * as firebase from 'firebase/app';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_GOOGLE_FIREBASE_CONFIG_API_KEY,
  authDomain: 'collections-f683a.firebaseapp.com',
  databaseURL: 'https://collections-f683a.firebaseio.com',
  projectId: 'collections-f683a',
  storageBucket: 'collections-f683a.appspot.com',
  messagingSenderId: '12533574685',
  appId: '1:12533574685:web:61de5ac21b2f8b046feaf4',
  measurementId: 'G-FF5SPQP2VG'
};
firebase.initializeApp(firebaseConfig);
firebase.auth().useDeviceLanguage();

export default class Login extends Component {
  state = {
    email: '',
    password: '',
    secondPassword: '',
    name: '',
    valid: false
  };

  handleLogin = () => {
    this.setState({
      valid: true
    });
  };

  render() {
    return (
      <ResponsiveContext.Consumer>
        {(size) => (
          <Router>
            {this.state.valid ? (
              <Redirect exact to="/home" />
            ) : (
              <Box
                flex
                background="radial-gradient(circle, rgba(27,50,163,1) 0%, rgba(143,38,59,1) 100%)"
                align="center"
                margin={{ top: 'medium', bottom: 'medium' }}
                overflow="hidden"
              >
                <Box alignSelf="start" pad={{ left: 'medium' }}>
                  <Heading color="#FF6C88">cinelot</Heading>
                </Box>
                <Box
                  align="center"
                  justify="center"
                  width={size !== 'small' ? 'large' : 'medium'}
                  height="large"
                >
                  <LoginButtons
                    firebase={firebase}
                    handleLogin={this.handleLogin}
                  />
                </Box>
                <Box
                  alignSelf="end"
                  pad={{ right: 'medium', bottom: 'medium' }}
                >
                  <Heading color="#FF6C88" level="2">
                    your film collection on the go
                  </Heading>
                </Box>
              </Box>
            )}
            <Switch>
              <Route exact path="/home" component={HomePage} />
            </Switch>
          </Router>
        )}
      </ResponsiveContext.Consumer>
    );
  }
}
