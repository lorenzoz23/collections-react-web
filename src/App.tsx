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

const theme = {
  global: {
    colors: {
      header: '#213444',
      home:
        'radial-gradient(circle, rgba(27,50,163,1) 0%, rgba(143,38,59,1) 100%)',
      footer: '#213444'
    },
    font: {
      family: 'Roboto',
      size: '14px',
      height: '20px'
    }
  }
};

export default class App extends Component {
  render() {
    return (
      <Router>
        <Grommet theme={theme} full>
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
