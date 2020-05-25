import React, { Component } from 'react';
import { Box, Text, ResponsiveContext, Grid, Heading } from 'grommet';

type movie = { name: string; plot: string; rating: string; year: number };

// columns, rows and areas are for Grid with a known number of contents / boxes.

// If the size is small, we only see 1 column
// If the size is medium, we only see 2 columns
// If the size is either large or xlarge, we see 3 columns
const columns: Record<string, string[]> = {
  small: ['auto', 'auto', 'auto', 'auto'],
  medium: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
  large: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
  xlarge: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto']
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
      <Box align="center">
        <Text>there is nothing</Text>
        <Text>in your collection.</Text>
      </Box>
    );
  };

  getRows = (size: string) => {
    let rows: string[] = [];
    const numMovies: number = this.state.movies.length;
    const numRows: number = Math.ceil(numMovies / columns[size].length);

    let i: number = 0;
    for (i = 0; i < numRows; i++) {
      rows.push('small');
    }

    return rows;
  };

  getMovieCollection = () => {
    let movies: movie[] = [];
    let i = 0;
    for (i = 0; i < 20; i++) {
      movies.push({
        name: 'film title',
        plot: 'plot',
        rating: 'rating',
        year: 2019
      });
    }
    this.setState({
      movies: movies
    });
  };

  // Create box for each movie
  listMovieBoxes = () => {
    let boxArr = [];
    boxArr = this.state.movies.map((movie) => (
      <Box
        key={movie.name}
        background="light-2"
        flex={false}
        justify="center"
        align="center"
        pad="small"
        round="small"
        onClick={() => {}}
      >
        <Heading level={2}>{movie.name}</Heading>
        <Text>{movie.plot}</Text>
        <Text>{movie.rating}</Text>
        <Text>year</Text>
      </Box>
    ));

    return boxArr;
  };

  movieCollection = (size: string) => {
    return (
      <Grid
        gap="large"
        margin="small"
        columns={columns[size]}
        rows={this.getRows(size)}
        areas={undefined}
      >
        {this.listMovieBoxes()}
      </Grid>
    );
  };

  render() {
    return (
      <ResponsiveContext.Consumer>
        {(size) => (
          <Box flex justify="start" align="center">
            {this.state.movies.length === 0
              ? this.movieCollection(size)
              : this.movieCollection(size)}
          </Box>
        )}
      </ResponsiveContext.Consumer>
    );
  }
}
