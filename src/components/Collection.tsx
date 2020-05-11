import React, { Component } from 'react';
import { Box, Text } from 'grommet';
import AddTitle from './AddTitle';

export default class Collection extends Component {
  state = {
    movies: []
  };

  render() {
    return (
      <Box direction="row" flex justify="center">
        <Box align="center" justify="center" flex>
          <Text>there is nothing</Text>
          <Text>in your collection.</Text>
        </Box>
        <Box justify="end" pad="small">
          <AddTitle />
        </Box>
      </Box>
    );
  }
}
