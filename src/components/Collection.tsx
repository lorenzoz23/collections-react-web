import React, { Component } from 'react';
import { Box, Text, ResponsiveContext, Grid, Layer } from 'grommet';
import type { movie } from './HomePage';
import SingleMovieView from './SingleMovieView';

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
    'auto',
    'auto'
  ]
};

interface CollectionProps {
  wishlist: boolean;
  movies: movie[];
}

export default class Collection extends Component<CollectionProps> {
  state: { movieDetailsVisible: boolean; movieToShow: movie } = {
    movieDetailsVisible: false,
    movieToShow: {
      name: '',
      plot: '',
      date: '',
      poster: '',
      id: ''
    }
  };

  emptyState = () => {
    return (
      <Box align="center" justify="center" flex>
        <Text>
          there is nothing in your {this.props.wishlist ? 'wishlist' : 'lot'}
        </Text>
      </Box>
    );
  };

  getRows = (size: string) => {
    let rows: string[] = [];
    const numMovies: number = this.props.movies.length;
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

  // componentDidMount = () => {
  //   this.getMovieCollection();
  // };

  // getMovieCollection = () => {
  //   let movies: movie[] = [];
  //   for (let i = 0; i < 10; i++) {
  //     movies.push({
  //       name: '',
  //       plot: '',
  //       date: '',
  //       poster:
  //         'https://image.tmdb.org/t/p/w500/8j58iEBw9pOXFD2L0nt0ZXeHviB.jpg',
  //       id: ''
  //     });
  //   }
  //   this.setState({
  //     movies: movies
  //   });
  // };

  // Create box for each movie
  listMovieBoxes = () => {
    let boxArr = [];
    boxArr = this.props.movies.map((movie) => (
      <Box
        key={movie.id}
        background={{ image: `url(${movie.poster})`, color: '#34495E' }}
        border={{ size: 'small', color: '#34495E', side: 'all' }}
        round="small"
        onClick={() =>
          this.setState({ movieDetailsVisible: true, movieToShow: movie })
        }
      />
    ));

    return boxArr;
  };

  movieCollection = (size: string) => {
    return (
      <Grid
        gap="small"
        columns={columns[size]}
        rows={this.getRows(size)}
        areas={undefined}
        pad="small"
      >
        {this.listMovieBoxes()}
      </Grid>
    );
  };

  render() {
    return (
      <ResponsiveContext.Consumer>
        {(size) => (
          <Box justify="start" alignContent="center" flex>
            {this.state.movieDetailsVisible ? (
              <Layer
                onClickOutside={() =>
                  this.setState({
                    movieDetailsVisible: false
                  })
                }
                position="center"
                animation="slide"
                style={{ borderRadius: 30 }}
              >
                <SingleMovieView movie={this.state.movieToShow} add={false} />
              </Layer>
            ) : this.props.movies.length === 0 ? (
              this.emptyState()
            ) : (
              this.movieCollection(size)
            )}
          </Box>
        )}
      </ResponsiveContext.Consumer>
    );
  }
}
