import React, { Component } from 'react';
import { Box, Text, ResponsiveContext, Grid, Layer } from 'grommet';
import DotLoader from 'react-spinners/DotLoader';

import type { movie } from './HomePage';
import SingleMovieView from './SingleMovieView';

const columns: Record<string, string[]> = {
  small: ['auto', 'auto', 'auto'],
  medium: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
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
    'auto',
    'auto',
    'auto'
  ]
};

interface CollectionProps {
  wishlist: boolean;
  movies: movie[];
  searchList: movie[];
  searchVal: string;
  handleDelete(movieId: string): void;
  loading: boolean;
  width: number;
}

export default class Collection extends Component<CollectionProps> {
  state: { movieDetailsVisible: boolean; movieToShow: movie } = {
    movieDetailsVisible: false,
    movieToShow: {
      name: '',
      plot: '',
      date: '',
      poster: '',
      rating: '',
      runtime: 0,
      genre: [],
      id: ''
    }
  };

  emptyState = () => {
    return (
      <Box align="center" justify="center" flex>
        {this.props.searchList.length === 0 &&
        this.props.searchVal.length > 0 ? (
          <Text>no such title in your film lot</Text>
        ) : (
          <Text>
            there is nothing in your {this.props.wishlist ? 'wishlist' : 'lot'}
          </Text>
        )}
      </Box>
    );
  };

  getRows = (size: string) => {
    let rows: string[] = [];
    const numMovies: number = this.props.movies.length;
    const numRows: number = Math.ceil(numMovies / columns[size].length);

    let i: number = 0;
    for (i = 0; i < numRows; i++) {
      // if (size === 'small') {
      //   rows.push('xsmall');
      // } else {
      //   rows.push('small');
      // }
      rows.push('small');
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
    const moviesToMap: movie[] =
      this.props.searchVal.length > 0
        ? this.props.searchList
        : this.props.movies;
    boxArr = moviesToMap.map((movie) => (
      <Box
        key={movie.id}
        title={movie.name + ' (' + movie.date.substring(0, 4) + ')'}
        background={{
          image: `url(${movie.poster})`,
          color: 'movieBorder',
          size: 'cover'
        }}
        border={{ size: 'xsmall', color: 'lotBorder', side: 'all' }}
        round="xsmall"
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
        columns={
          this.props.width >= 500 && size === 'small'
            ? columns['medium']
            : columns[size]
        }
        rows={this.getRows(size)}
        areas={undefined}
        pad="small"
      >
        {this.listMovieBoxes()}
      </Grid>
    );
  };

  handleDelete = (id: string) => {
    this.setState({
      movieDetailsVisible: false
    });
    this.props.handleDelete(id);
  };

  render() {
    const moviesToMap: movie[] =
      this.props.searchVal.length > 0
        ? this.props.searchList
        : this.props.movies;
    if (this.props.loading) {
      return (
        <ResponsiveContext.Consumer>
          {(size) => (
            <Box align="center" justify="center" flex>
              <DotLoader
                size={size !== 'small' ? 150 : 100}
                color={'#6FFFB0'}
                loading={this.props.loading}
              />
            </Box>
          )}
        </ResponsiveContext.Consumer>
      );
    } else {
      return (
        <ResponsiveContext.Consumer>
          {(size) => (
            <Box justify="start" alignContent="center" flex>
              {moviesToMap.length === 0
                ? this.emptyState()
                : this.movieCollection(size)}
              {this.state.movieDetailsVisible ? (
                <Layer
                  responsive={size !== 'small' ? false : true}
                  onClickOutside={() =>
                    this.setState({
                      movieDetailsVisible: false
                    })
                  }
                  position="center"
                  style={{
                    borderRadius: size !== 'small' ? 30 : 0
                  }}
                >
                  <SingleMovieView
                    movie={this.state.movieToShow}
                    add={false}
                    handleDelete={(id: string) => this.handleDelete(id)}
                    closeDetailView={() =>
                      this.setState({ movieDetailsVisible: false })
                    }
                  />
                </Layer>
              ) : null}
            </Box>
          )}
        </ResponsiveContext.Consumer>
      );
    }
  }
}
