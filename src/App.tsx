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
      header: '#228BE6',
      home: '#213444',
      footer: 'brand'
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
              <Route path="/home" component={HomePage} />
              <Redirect to="/" from="/*" />
            </Switch>
          </Box>
        </Grommet>
      </Router>
    );
  }
}
