import React, { Component } from 'react';
import { Box, Text, ResponsiveContext } from 'grommet';

export default class Collection extends Component {
  state = {
    movies: []
  };

  render() {
    return (
      <ResponsiveContext.Consumer>
        {(size) => (
          <Box flex justify="center" align="center">
            <Text>there is nothing</Text>
            <Text>in your collection.</Text>
          </Box>
        )}
      </ResponsiveContext.Consumer>
    );
  }
}
