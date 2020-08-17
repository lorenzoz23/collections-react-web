import React, { Component } from 'react';
import { Box, Text, ResponsiveContext, Grid, Layer, Button } from 'grommet';
import DotLoader from 'react-spinners/DotLoader';

import type { movie } from './HomePage';
import SingleMovieView from './SingleMovieView';
import { Movie } from './Movie';
import { Sort } from './Sort';
import { Dislike, Aed, SearchAdvanced } from 'grommet-icons';
import AddMovieTemplate from './AddMovieTemplate';
import { filter } from './FilterSearch';

const columns: Record<string, string[]> = {
  small: ['auto', 'auto'],
  medium: ['auto', 'auto', 'auto', 'auto'],
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
  showAdvSearch(): void;
  loading: boolean;
  width: number;
  sortBy: string;
  filterBy: filter[];
  tags: string[];
  rand: number;
  handleWatched(movie: movie): void;
}

const DeleteMovieConfirmation = (props: any) => {
  return (
    <Layer
      onClickOutside={() => props.closeModal(false)}
      position="bottom"
      style={{
        borderRadius: 30,
        width: props.size === 'small' ? '100%' : undefined
      }}
      margin="small"
      responsive={false}
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
          Are you sure you want to delete {props.movie.name} from your
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
      backDrop: [],
      watched: 0
    },
    randBackDrop: 0,
    showConfirm: false
    //movies: []
  };

  emptyState = (size: string) => {
    return (
      <Box align="center" justify={size === 'small' ? 'start' : 'center'} flex>
        {this.props.searchList.length === 0 &&
        this.props.searchVal.length > 0 ? (
          <Box
            align="center"
            gap="small"
            pad={size === 'small' ? 'small' : 'none'}
          >
            <Text textAlign="center">
              No such title present in your{' '}
              {this.props.wishlist ? 'wishlist' : 'lot'}
            </Text>
            <Dislike size="large" />
          </Box>
        ) : (
          <Box
            align="center"
            gap="small"
            pad={size === 'small' ? 'small' : 'none'}
          >
            {size !== 'small' && this.props.width > 950 && (
              <Box
                pad="large"
                background={{ color: 'brand', opacity: 'strong' }}
                align="center"
                gap="small"
                round="large"
                border={{ side: 'all', size: 'small', color: 'accent-1' }}
              >
                <Text textAlign="center" weight="bold" size="xlarge">
                  Add a film!
                </Text>
                <Button
                  hoverIndicator="accent-3"
                  style={{ borderRadius: 30 }}
                  icon={<SearchAdvanced size="large" />}
                  color="accent-1"
                  primary
                  onClick={this.props.showAdvSearch}
                />
              </Box>
            )}
            <Text textAlign="center">
              Looks like you have no films in your
              {this.props.wishlist ? ' wishlist' : ' lot'}
            </Text>
            <Aed size="large" color="neutral-4" />
            <Text textAlign="center">
              Click the search button above or search bar at the top of the
              screen to add one!
            </Text>
          </Box>
        )}
      </Box>
    );
  };

  getRows = (size: string) => {
    let rows: string[] = [];
    const moviesToMap: movie[] =
      this.props.searchVal.length > 0
        ? this.props.searchList
        : this.props.movies;
    const numMovies: number = moviesToMap.length;
    let numRows: number = 0;
    if (size === 'medium' && numMovies % 4 === 0) {
      numRows = Math.ceil(numMovies / columns[size].length) + 1;
    } else {
      if (numMovies % 6 === 0 && this.props.width > 950) {
        numRows = Math.ceil(numMovies / columns[size].length) + 1;
      } else numRows = Math.ceil(numMovies / columns[size].length);
    }

    let i: number = 0;
    for (i = 0; i < numRows; i++) {
      if (this.props.width < 950) {
        if (this.props.width < 700) {
          rows.push('small');
        } else rows.push('medium');
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

  showMovie = (movie: movie) => {
    let rand: number = 0;
    if (this.props.width < 950) {
      rand = Math.floor(Math.random() * movie.backDrop.length + 1);
    } else rand = Math.floor(Math.random() * movie.backDrop.length);
    this.setState({
      movieDetailsVisible: true,
      movieToShow: movie,
      randBackDrop: rand
    });
  };

  getSortedFilteredFilms = (filteredMovies: movie[]) => (
    <Sort by={this.props.sortBy} key={1}>
      {filteredMovies.map((movie) => (
        <Movie
          key={movie.id}
          movie={movie}
          showMovie={() => this.showMovie(movie)}
        />
      ))}
    </Sort>
  );

  listMovieBoxes = () => {
    const moviesToMap: movie[] =
      this.props.searchVal.length > 0
        ? this.props.searchList
        : this.props.movies;
    let filteredMovies: movie[] = [];
    if (this.props.filterBy.length !== 0) {
      this.props.filterBy.forEach((filter) => {
        if (filter.type === 'starCount') {
          if (filteredMovies.length > 0) {
            filteredMovies = filteredMovies.filter(
              (child) => child.starCount === +filter.name
            );
          } else {
            filteredMovies = moviesToMap.filter(
              (child) => child.starCount === +filter.name
            );
          }
        } else if (filter.type === 'genre') {
          if (filteredMovies.length > 0) {
            filteredMovies = filteredMovies.filter((child) =>
              child.genre.includes(filter.name, 0)
            );
          } else {
            filteredMovies = moviesToMap.filter((child) =>
              child.genre.includes(filter.name, 0)
            );
          }
        } else if (filter.type === 'watched') {
          if (filteredMovies.length > 0) {
            filteredMovies = filteredMovies.filter((child) =>
              filter.name === 'Watched'
                ? child.watched === 1
                : child.watched === 0
            );
          } else {
            filteredMovies = moviesToMap.filter((child) =>
              filter.name === 'Watched'
                ? child.watched === 1
                : child.watched === 0
            );
          }
        } else {
          const filterIndex = this.props.tags.indexOf(filter.name);
          if (filteredMovies.length > 0) {
            filteredMovies = filteredMovies.filter((child) =>
              child.tags.includes(filterIndex, 0)
            );
          } else {
            filteredMovies = moviesToMap.filter((child) =>
              child.tags.includes(filterIndex, 0)
            );
          }
        }
      });
    } else {
      filteredMovies = moviesToMap;
    }

    return this.getSortedFilteredFilms(filteredMovies);
  };

  movieCollection = (size: string) => {
    let col: string[] = [];
    if (size === 'medium' && this.props.width < 950) {
      col = columns[size].slice(0, 3);
    } else {
      col = columns[size];
    }
    let gridMovies = [];

    if (this.props.width > 950) {
      gridMovies.push(
        <AddMovieTemplate
          width={this.props.width}
          key={0}
          moviesAdded={(lotMovies: movie[], wishlistMovies: movie[]) =>
            this.props.moviesAdded(lotMovies, wishlistMovies)
          }
          rand={this.props.rand}
        />
      );
    }
    gridMovies.push(this.listMovieBoxes());
    return (
      <Grid
        gap="medium"
        columns={col}
        rows={this.getRows(size)}
        areas={undefined}
        pad={{ horizontal: 'medium', top: 'small', bottom: 'medium' }}
        margin={{ bottom: 'large' }}
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
                size={size !== 'small' ? 150 : 75}
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
                ? this.emptyState(size)
                : this.movieCollection(size)}
              {this.state.movieDetailsVisible ? (
                <Layer
                  responsive={this.props.width > 950 ? false : true}
                  onClickOutside={() =>
                    this.setState({
                      movieDetailsVisible: false
                    })
                  }
                  position="center"
                  style={{
                    borderRadius: size !== 'small' ? 30 : 0,
                    width: this.props.width < 950 ? '100%' : undefined,
                    height: this.props.width < 950 ? '100%' : undefined
                  }}
                >
                  <SingleMovieView
                    handleWatched={() =>
                      this.props.handleWatched(this.state.movieToShow)
                    }
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
                      size={size}
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
