import React, { Component } from 'react';
import { Footer, Box, Clock, Text, Anchor } from 'grommet';
import { Multimedia } from 'grommet-icons';

export default class FooterComponent extends Component {
  render() {
    return (
      <Footer
        pad="medium"
        gap="medium"
        background="brand"
        justify="between"
        height="10px"
      >
        <Box>
          <Clock type="digital" alignSelf="center" size="small" />
        </Box>
        <Box direction="row" gap="small" align="center">
          <Multimedia />
          <Text size="small">Movie data provided by:</Text>
          <Anchor href="https://www.themoviedb.org/" target="_blank">
            The Movie Database (tMDB)
          </Anchor>
        </Box>
      </Footer>
    );
  }
}
