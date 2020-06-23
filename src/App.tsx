import React, { Component } from 'react';
import { Box, Grommet } from 'grommet';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom';

import Login from './components/Login';
import HomePage from './components/HomePage';

const themeGradient = {
  global: {
    colors: {
      header: '#213444',
      home:
        'radial-gradient(circle, rgba(27,50,163,1) 0%, rgba(143,38,59,1) 100%)',
      footer: '#213444',
      addTitle:
        'radial-gradient(circle, rgba(33,52,68,1) 10%, rgba(24,122,204,1) 100%)',
      movieSearchResult:
        'linear-gradient(45deg, rgba(33,52,68,1) 10%, rgba(24,122,204,1) 100%)'
    },
    font: {
      family: 'Roboto',
      size: '14px',
      height: '20px'
    }
  }
};

const themeSolid = {
  global: {
    colors: {
      header: '#228BE6',
      home: '#213444',
      footer: 'brand',
      addTitle:
        'radial-gradient(circle, rgba(255,226,163,1) 0%, rgba(163,255,231,1) 100%)',
      movieSearchResult:
        'linear-gradient(135deg, rgba(74,224,226,1) 0%, rgba(255,226,163,1) 100%)'
    },
    font: {
      family: 'Roboto',
      size: '14px',
      height: '20px'
    }
  }
};

export default class App extends Component {
  state = {
    visualModeValue: ''
  };

  componentDidMount = () => {
    const mode = this.getInitialState();
    this.setState({ visualModeValue: mode });
  };

  getInitialState = () => {
    const mode = localStorage.getItem('visualModeValue') || 'gradient';
    return mode;
  };

  render() {
    return (
      <Router>
        <Grommet
          theme={
            this.state.visualModeValue === 'gradient'
              ? themeGradient
              : themeSolid
          }
          full
        >
          <Box fill>
            <Switch>
              <Route exact path="/" component={Login} />
              <Route exact path="/home/:id" component={HomePage} />
              <Redirect to="/" from="/*" />
            </Switch>
          </Box>
        </Grommet>
      </Router>
    );
  }
}
