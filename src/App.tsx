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
      movieSearchResultHeader: '#213444',
      home:
        'radial-gradient(circle, rgba(27,50,163,1) 0%, rgba(143,38,59,1) 100%)',
      footer: '#213444',
      layer:
        'radial-gradient(circle, rgba(33,52,68,1) 10%, rgba(24,122,204,1) 100%)',
      movieSearchResult:
        'linear-gradient(45deg, rgba(33,52,68,1) 10%, rgba(24,122,204,1) 100%)',
      deleteMovie: '#FF8686',
      resultBorder: 'accent-1',
      lotBorder: '#ADB9C6',
      movieBorder: '#396897',
      miniLayer: 'linear-gradient(90deg, #e3ffe7 0%, #d9e7ff 100%)'
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
      movieSearchResultHeader: 'transparent',
      home: '#213444',
      footer: 'brand',
      layer:
        'radial-gradient(circle, rgba(121,215,255,1) 0%, rgba(225,237,255,1) 100%)',
      movieSearchResult:
        'linear-gradient(135deg, rgba(121,215,255,1) 0%, rgba(225,237,255,1) 75%)',
      lotBorder: '#ADB9C6',
      movieBorder: '#34495E',
      deleteMovie: '#FF3F3F',
      resultBorder: 'brand',
      miniLayer: 'linear-gradient(90deg, #e3ffe7 0%, #d9e7ff 100%)'
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
