import React, { Component } from 'react';
import { ResponsiveContext, Box, Heading } from 'grommet';
import {
  BrowserRouter as Router,
  Redirect,
  Switch,
  Route
} from 'react-router-dom';
import { motion } from 'framer-motion';
import GridLoader from 'react-spinners/GridLoader';

import HomePage from './HomePage';
import LoginButtons from './LoginButtons';

import firebase from 'firebase/app';
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
    valid: false,
    width: 0,
    height: 0,
    uid: '',
    loading: false
  };

  updateWindowDimensions = () => {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight,
      loading: true
    });
  };

  componentDidMount = () => {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
    this.handleLogin();
  };

  componentWillUnmount = () => {
    window.removeEventListener('resize', this.updateWindowDimensions);
  };

  handleLogin = () => {
    let id: string = '';
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        id = user.uid;
        this.setState({
          valid: true,
          uid: id
        });
      } else {
        // No user is signed in.
        this.setState({
          loading: false
        });
        console.log('error: user has bad credentials');
      }
    });
  };

  render() {
    return (
      <ResponsiveContext.Consumer>
        {(size) => (
          <Router>
            {this.state.valid ? (
              <Redirect
                to={{
                  pathname: '/',
                  state: { id: this.state.uid }
                }}
              />
            ) : (
              <Box
                flex
                background="home"
                style={{
                  background:
                    'radial-gradient(circle, rgba(27,50,163,1) 0%, rgba(143,38,59,1) 100%)'
                }}
                align="center"
                margin={
                  size !== 'small'
                    ? { top: 'large', bottom: 'large' }
                    : 'medium'
                }
                overflow="hidden"
                justify={this.state.width >= 500 ? 'between' : 'evenly'}
                round={size === 'small' ? true : false}
              >
                <Box
                  alignSelf={this.state.width < 500 ? 'center' : 'start'}
                  pad={{ left: this.state.width >= 500 ? 'medium' : 'none' }}
                >
                  <motion.div
                    drag
                    dragConstraints={{
                      top: this.state.width >= 500 ? -10 : -50,
                      left: this.state.width >= 500 ? -10 : -50,
                      right: this.state.width >= 500 ? 500 : 50,
                      bottom: this.state.width >= 500 ? 500 : 50
                    }}
                  >
                    <Heading color="#FF6C88">cinelot</Heading>
                  </motion.div>
                </Box>
                {!this.state.loading ? (
                  <Box align="center" justify="center">
                    <LoginButtons handleLogin={this.handleLogin} />
                  </Box>
                ) : (
                  <Box align="center" justify="center">
                    <GridLoader
                      size={size !== 'small' ? 15 : 10}
                      margin={20}
                      color={'#6FFFB0'}
                      loading={this.state.loading}
                    />
                  </Box>
                )}
                {this.state.width >= 500 ? (
                  <Box alignSelf="end" pad={{ right: 'medium' }}>
                    <motion.div
                      drag
                      dragConstraints={{
                        top: -500,
                        left: -500,
                        right: 10,
                        bottom: 10
                      }}
                    >
                      <Heading color="#FF6C88" level="2">
                        your film collection on the go
                      </Heading>
                    </motion.div>
                  </Box>
                ) : (
                  <Box alignSelf="center">
                    <motion.div
                      drag
                      dragConstraints={{
                        top: -50,
                        left: -50,
                        right: 50,
                        bottom: 50
                      }}
                    >
                      <Heading color="#FF6C88" level="3">
                        your films on the go
                      </Heading>
                    </motion.div>
                  </Box>
                )}
              </Box>
            )}
            <Switch>
              <Route exact path="/" component={HomePage} />
            </Switch>
          </Router>
        )}
      </ResponsiveContext.Consumer>
    );
  }
}
