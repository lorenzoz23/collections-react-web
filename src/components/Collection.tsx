import React, { Component } from 'react';
import { Box, Text, ResponsiveContext, Grid, Layer } from 'grommet';
import DotLoader from 'react-spinners/DotLoader';

import type { movie } from './HomePage';
import SingleMovieView from './SingleMovieView';
import { Movie } from './Movie';
import { Sort } from './Sort';

const columns: Record<string, string[]> = {
  small: ['auto', 'auto', 'auto'],
  medium: ['auto', 'auto', 'auto', 'auto', 'auto'],
  large: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
  xlarge: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto']
};

interface CollectionProps {
  wishlist: boolean;
  movies: movie[];
  searchList: movie[];
  searchVal: string;
  handleDelete(movieId: string): void;
  handleRate(updatedMovie: movie): void;
  handleSelectedTags(movie: movie, tags: number[]): void;
  handleTransfer(movie: movie): void;
  loading: boolean;
  width: number;
  sortBy: string;
  filterBy: string;
  tags: string[];
}

export default class Collection extends Component<CollectionProps> {
  state: {
    movieDetailsVisible: boolean;
    movieToShow: movie;
    randBackDrop: number;
    //movies: movie[];
  } = {
    movieDetailsVisible: false,
    movieToShow: {
      name: '',
      plot: '',
      date: '',
      poster: '',
      rating: '',
      runtime: 0,
      genre: [],
      tags: [],
      key: '',
      id: '',
      starCount: -1,
      backDrop: []
    },
    randBackDrop: 0
    //movies: []
  };

  emptyState = () => {
    return (
      <Box align="center" justify="center" flex>
        {this.props.searchList.length === 0 &&
        this.props.searchVal.length > 0 ? (
          <Text>no such title</Text>
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
    let numRows: number = 0;
    if (size === 'medium' && this.props.width < 1000) {
      numRows = Math.ceil(numMovies / columns[size].length) + 1;
    } else if (size === 'small' && this.props.width < 350) {
      numRows = Math.ceil(numMovies / columns[size].length) + 2;
    } else {
      numRows = Math.ceil(numMovies / columns[size].length);
    }

    let i: number = 0;
    for (i = 0; i < numRows; i++) {
      if (size === 'small' && this.props.width < 500) {
        rows.push('small');
      } else rows.push('medium');
    }

    return rows;
  };

  // componentDidMount = () => {
  //   this.getMovieCollection();
  // };

  // getMovieCollection = () => {
  //   let movies: movie[] = [];
  //   for (let i = 0; i < 55; i++) {
  //     movies.push({
  //       name: '',
  //       plot: '',
  //       date: '',
  //       poster:
  //         'https://image.tmdb.org/t/p/w500/8j58iEBw9pOXFD2L0nt0ZXeHviB.jpg',
  //       rating: '',
  //       runtime: 0,
  //       genre: [],
  //       id: ''
  //     });
  //   }
  //   this.setState({
  //     movies: movies
  //   });
  // };

  listMovieBoxes = () => {
    const moviesToMap: movie[] =
      this.props.searchVal.length > 0
        ? this.props.searchList
        : this.props.movies;
    const filteredMovies = this.props.filterBy
      ? moviesToMap.filter((child) =>
          child.tags.includes(this.props.filterBy, 0)
        )
      : moviesToMap;

    return (
      <Sort by={this.props.sortBy}>
        {filteredMovies.map((movie) => (
          <Movie
            key={movie.id}
            movie={movie}
            showMovie={() =>
              this.setState({
                movieDetailsVisible: true,
                movieToShow: movie,
                randBackDrop: Math.floor(
                  Math.random() * Math.floor(movie.backDrop?.length || 0)
                )
              })
            }
          />
        ))}
      </Sort>
    );
  };

  movieCollection = (size: string) => {
    let col: string[] = [];
    if (size === 'medium' && this.props.width < 1000) {
      col = columns[size].slice(0, 4);
    } else if (size === 'small' && this.props.width < 350) {
      col = columns[size].slice(0, 2);
    } else {
      col = columns[size];
    }
    return (
      <Grid
        gap="medium"
        columns={col}
        rows={this.getRows(size)}
        areas={undefined}
        pad="medium"
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
            <Box justify="start" flex alignContent="center">
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
                    handleTransfer={() => {
                      this.setState({ movieDetailsVisible: false });
                      this.props.handleTransfer(this.state.movieToShow);
                    }}
                    movie={this.state.movieToShow}
                    add={false}
                    handleDelete={(id: string) => this.handleDelete(id)}
                    handleRate={(updatedMovie: movie) =>
                      this.props.handleRate(updatedMovie)
                    }
                    closeDetailView={() =>
                      this.setState({ movieDetailsVisible: false })
                    }
                    handleSelectedTags={(tags) =>
                      this.props.handleSelectedTags(
                        this.state.movieToShow,
                        tags
                      )
                    }
                    width={this.props.width}
                    rand={this.state.randBackDrop}
                    tags={this.props.tags}
                    wishlist={this.props.wishlist}
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
