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
      smallLayer:
        'linear-gradient(135deg, rgba(121,215,255,1) 0%, rgba(225,237,255,1) 75%)',
      filters:
        'linear-gradient(0deg, rgba(0,201,255,1) 25%, rgba(146,254,157,1) 100%)'
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
      smallLayer: 'linear-gradient(90deg, #e3ffe7 0%, #d9e7ff 100%)',
      filters:
        'linear-gradient(180deg, rgba(121,255,247,1) 0%, rgba(225,237,255,1) 100%)'
    },
    font: {
      family: 'Roboto',
      size: '14px',
      height: '20px'
    }
  }
};

const themeWeird = {
  global: {
    colors: {
      header: '#213444',
      home: '#213444',
      footer: '#C39BD3',
      layer: 'neutral-3',
      movieSearchResult: '#213444',
      movieSearchResultHeader: 'neutral-3',
      deleteMovie: '#FF8686',
      lotBorder: '#C39BD3',
      resultBorder: 'accent-1',
      smallLayer: '#E7E7E7',
      filters: '#386387',
      movieBorder: '#34495E'
    },
    font: {
      family: 'Roboto',
      size: '14px',
      height: '20px'
    }
  },
  tab: {
    color: 'light-2',
    hover: {
      color: 'accent-1'
    },
    active: {
      color: 'accent-1'
    },
    border: {
      color: 'light-2',
      hover: {
        color: 'accent-1'
      },
      active: {
        color: 'accent-1'
      }
    }
  },
  checkBox: {
    hover: {
      border: {
        color: {
          dark: 'white',
          light: 'accent-1'
        }
      }
    }
  }
};

export default class App extends Component {
  state = {
    visualMode: ''
  };

  componentDidMount = () => {
    const mode = this.getInitialState();
    this.setState({ visualMode: mode });
  };

  getInitialState = () => {
    const mode = localStorage.getItem('visualMode') || 'wedding';
    return mode;
  };

  render() {
    return (
      <Router>
        <Grommet
          theme={
            this.state.visualMode === 'gradient'
              ? themeGradient
              : this.state.visualMode === 'solid'
              ? themeSolid
              : themeWeird
          }
          full
        >
          <Box fill>
            <Switch>
              <Route exact path="/" component={HomePage} />
              <Route exact path="/login" component={Login} />
              <Redirect to="/" from="/*" />
            </Switch>
          </Box>
        </Grommet>
      </Router>
    );
  }
}
