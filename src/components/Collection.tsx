import React, { Component } from 'react';
import { Box, Text, ResponsiveContext, Grid, Layer, Button } from 'grommet';
import DotLoader from 'react-spinners/DotLoader';

import type { movie } from './HomePage';
import SingleMovieView from './SingleMovieView';
import { Movie } from './Movie';
import { Sort } from './Sort';
import { Aed, Add, Dislike } from 'grommet-icons';
import AddMovieTemplate from './AddMovieTemplate';

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
  moviesAdded(lotMovies: movie[], wishlistMovies: movie[]): void;
  loading: boolean;
  width: number;
  sortBy: string;
  filterBy: string;
  tags: string[];
  rand: number;
}

const DeleteMovieConfirmation = (props: any) => {
  return (
    <Layer
      onClickOutside={() => props.closeModal(false)}
      position="bottom"
      style={{ borderRadius: 30 }}
      margin="small"
    >
      <Box
        align="center"
        pad="medium"
        round
        gap="medium"
        background="home"
        border={{ side: 'all', size: 'small', color: 'light-2' }}
      >
        <Text weight="bold" textAlign="center">
          Are you sure you want to delete this movie from your
          {props.wishlist ? ' wishlist' : ' lot'}?
        </Text>
        <Box align="center" gap="small">
          <Button
            color="status-error"
            primary
            label="Yes, I'm sure"
            onClick={() => {
              props.closeModal(false);
              props.handleDelete(props.movie.id);
            }}
          />
          <Button
            primary
            color="accent-1"
            label="No, I'll keep it around"
            onClick={() => props.closeModal(false)}
          />
        </Box>
      </Box>
    </Layer>
  );
};

export default class Collection extends Component<CollectionProps> {
  state: {
    movieDetailsVisible: boolean;
    movieToShow: movie;
    randBackDrop: number;
    showConfirm: boolean;
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
    randBackDrop: 0,
    showConfirm: false
    //movies: []
  };

  emptyState = () => {
    return (
      <Box align="center" justify="center" flex>
        {this.props.searchList.length === 0 &&
        this.props.searchVal.length > 0 ? (
          <Box align="center" gap="small">
            <Text>
              No such title present in your{' '}
              {this.props.wishlist ? 'wishlist' : 'lot'}
            </Text>
            <Dislike size="large" />
          </Box>
        ) : (
          <Box align="center" gap="small">
            <Text>
              There is nothing in your{' '}
              {this.props.wishlist ? 'wishlist' : 'lot'}.
            </Text>
            <Aed size="large" />
            Add a film by clicking on the <Add /> button!
          </Box>
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
      if (numMovies % 6 === 0) {
        numRows = Math.ceil(numMovies / columns[size].length) + 1;
      } else numRows = Math.ceil(numMovies / columns[size].length);
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
    const filterIndex = this.props.tags.indexOf(this.props.filterBy);
    const filteredMovies = this.props.filterBy
      ? moviesToMap.filter((child) => child.tags.includes(filterIndex, 0))
      : moviesToMap;

    return (
      <Sort by={this.props.sortBy} key={1}>
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
    let gridMovies = [];

    gridMovies.push(
      <AddMovieTemplate
        key={0}
        moviesAdded={(lotMovies: movie[], wishlistMovies: movie[]) =>
          this.props.moviesAdded(lotMovies, wishlistMovies)
        }
        rand={this.props.rand}
      />
    );
    gridMovies.push(this.listMovieBoxes());
    return (
      <Grid
        gap="medium"
        columns={col}
        rows={this.getRows(size)}
        areas={undefined}
        pad={{ horizontal: 'medium', top: 'small', bottom: 'medium' }}
      >
        {gridMovies}
      </Grid>
    );
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
                    handleDelete={() =>
                      this.setState({
                        showConfirm: true
                      })
                    }
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
                  {this.state.showConfirm && (
                    <DeleteMovieConfirmation
                      movie={this.state.movieToShow}
                      wishlist={this.props.wishlist}
                      closeModal={() => this.setState({ showConfirm: false })}
                      handleDelete={() => {
                        this.setState({ movieDetailsVisible: false });
                        this.props.handleDelete(this.state.movieToShow.id);
                      }}
                    />
                  )}
                </Layer>
              ) : null}
            </Box>
          )}
        </ResponsiveContext.Consumer>
      );
    }
  }
}
