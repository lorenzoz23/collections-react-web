import React, { Component } from 'react';
import { Box, Text, ResponsiveContext, Grid } from 'grommet';

type movie = { name: string; plot: string; rating: string; year: number };

const columns: Record<string, string[]> = {
  small: ['auto', 'auto', 'auto', 'auto'],
  medium: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
  large: [
    'auto',
    'auto',
    'auto',
    'auto',
    'auto',
    'auto',
    'auto',
    'auto',
    'auto'
  ],
  xlarge: [
    'auto',
    'auto',
    'auto',
    'auto',
    'auto',
    'auto',
    'auto',
    'auto',
    'auto'
  ]
};

export default class Collection extends Component {
  state: { movies: movie[] } = {
    movies: []
  };

  componentDidMount = () => {
    this.getMovieCollection();
  };

  emptyState = () => {
    return (
      <Box align="center" justify="center" flex>
        <Text>there is nothing in your lot</Text>
      </Box>
    );
  };

  getRows = (size: string) => {
    let rows: string[] = [];
    const numMovies: number = this.state.movies.length;
    const numRows: number = Math.ceil(numMovies / columns[size].length);

    let i: number = 0;
    for (i = 0; i < numRows; i++) {
      if (size === 'small') {
        rows.push('xsmall');
      } else {
        rows.push('small');
      }
    }

    return rows;
  };

  getMovieCollection = () => {
    //TODO
  };

  // Create box for each movie
  listMovieBoxes = (size: string) => {
    let boxArr = [];
    boxArr = this.state.movies.map((movie) => (
      <Box
        key={movie.name}
        background="light-2"
        justify="start"
        align="center"
        pad="small"
        round="small"
        width={size === 'small' ? '55px' : '125px'}
        height={size === 'small' ? 'xsmall' : 'small'}
        onClick={() => {}}
      />
    ));

    return boxArr;
  };

  movieCollection = (size: string) => {
    return (
      <Grid
        gap={size !== 'small' ? 'large' : 'medium'}
        margin="small"
        columns={columns[size]}
        rows={this.getRows(size)}
        //rows={size !== 'small' ? 'medium' : 'small'}
        areas={undefined}
        fill="vertical"
      >
        {this.listMovieBoxes(size)}
      </Grid>
    );
  };

  render() {
    return (
      <ResponsiveContext.Consumer>
        {(size) => (
          <Box flex justify="center" align="center" fill>
            {this.state.movies.length === 0
              ? this.emptyState()
              : this.movieCollection(size)}
          </Box>
        )}
      </ResponsiveContext.Consumer>
    );
  }
}
