import React, { Component } from 'react';
import { Box, Heading, Button, Text } from 'grommet';
import Movie from '../classes/Movie';
import { StatusGood, StatusCritical } from 'grommet-icons';

interface MovieSearchResultProps {
  search: string;
  close(): void;
}

export default class MovieSearchResult extends Component<
  MovieSearchResultProps
> {
  state = {
    movie: new Movie()
  };
  render() {
    return (
      <Box
        flex
        pad="medium"
        width="medium"
        background="light-2"
        align="center"
        justify="center"
        overflow="auto"
        round
      >
        <Heading level="3">{this.props.search}</Heading>
        <Box justify="center" align="center">
          <Text>plot synopsis</Text>
          <Text>year</Text>
        </Box>
        <Box direction="row" pad="medium">
          <Button icon={<StatusGood color="status-ok" />} title="add film" />
          <Button
            title="cancel"
            icon={<StatusCritical color="status-error" />}
            onClick={() => this.props.close()}
          />
        </Box>
      </Box>
    );
  }
}
