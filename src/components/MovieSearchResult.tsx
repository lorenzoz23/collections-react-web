import React, { Component } from 'react';
import {
  Box,
  Heading,
  Button,
  CheckBox,
  Text,
  ResponsiveContext
} from 'grommet';
import { Close, Next, Previous, Trash } from 'grommet-icons';
import SyncLoader from 'react-spinners/SyncLoader';

import { movie, AppBar } from './HomePage';
import SingleMovieView from './SingleMovieView';

interface MovieSearchResultProps {
  title: string;
  year: string;
  closeAdd(): void;
  closeResult(): void;
  moviesAdded(lotMovies: movie[], wishlistMovies: movie[]): void;
}

type searchResultMovie = {
  movie: movie;
  checkedLot: boolean;
  checkedWishlist: boolean;
};

type searchResults = {
  movies: searchResultMovie[];
};

export default class MovieSearchResult extends Component<
  MovieSearchResultProps
> {
  state: {
    movieList: searchResults;
    visible: boolean;
    movieToShow: movie;
    numToAdd: number;
    loading: boolean;
  } = {
    movieList: {
      movies: []
    },
    visible: false,
    movieToShow: {
      name: '',
      plot: '',
      date: '',
      poster: '',
      rating: '',
      runtime: 0,
      genre: [],
      id: ''
    },
    numToAdd: 0,
    loading: true
  };

  componentDidMount = () => {
    fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US&query=${this.props.title}&page=1&include_adult=false&year=${this.props.year}`
    )
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data.results);
        const results = data.results;
        let movieItems: searchResultMovie[] = [];
        movieItems = results.map((item: any) => {
          const image: string = item.backdrop_path
            ? 'https://image.tmdb.org/t/p/original' + item.backdrop_path
            : '';
          const newMovie: movie = {
            name: item.title,
            plot: item.overview,
            date: item.release_date,
            poster: 'https://image.tmdb.org/t/p/w500' + item.poster_path,
            backDrop: [image],
            rating: '',
            runtime: 0,
            genre: [],
            id: item.id
          };
          const newSearchResultMovie: searchResultMovie = {
            movie: newMovie,
            checkedLot: false,
            checkedWishlist: false
          };
          return newSearchResultMovie;
        });

        const newMovieList: searchResults = {
          movies: movieItems
        };
        this.setState({
          movieList: newMovieList,
          loading: false
        });
      })
      .catch((err) => {
        console.log('error: ' + err);
      });
  };

  checkedMovie = (movie: searchResultMovie, wishlist: boolean) => {
    const bothUnchecked = !movie.checkedLot && !movie.checkedWishlist;
    let results: searchResultMovie[] = [];
    let updatedMovie = movie;
    updatedMovie.checkedLot = wishlist
      ? updatedMovie.checkedLot
      : !updatedMovie.checkedLot;
    updatedMovie.checkedWishlist = wishlist
      ? !updatedMovie.checkedWishlist
      : updatedMovie.checkedWishlist;

    this.state.movieList.movies.forEach((element) => {
      if (element.movie.id !== movie.movie.id) {
        results.push(element);
      } else {
        results.push(updatedMovie);
      }
    });

    const newMovieList: searchResults = {
      movies: results
    };

    let numToAdd = this.state.numToAdd;
    if (
      (!updatedMovie.checkedLot &&
        updatedMovie.checkedWishlist &&
        bothUnchecked) ||
      (updatedMovie.checkedLot &&
        !updatedMovie.checkedWishlist &&
        bothUnchecked)
    ) {
      numToAdd++;
    } else if (!updatedMovie.checkedLot && !updatedMovie.checkedWishlist) {
      numToAdd--;
    }

    this.setState({
      movieList: newMovieList,
      numToAdd: numToAdd
    });
  };

  showMovieDetails = (movie: movie) => {
    this.setState({
      visible: true,
      movieToShow: movie
    });
  };

  closeDetailView = () => {
    this.setState({
      visible: false,
      movieToShow: {
        name: '',
        plot: '',
        date: '',
        poster: '',
        id: ''
      }
    });
  };

  clearSelectedMovies = () => {
    let movies = this.state.movieList.movies;

    for (let i = 0; i < movies.length; i++) {
      if (movies[i].checkedLot) {
        movies[i].checkedLot = false;
      }
      if (movies[i].checkedWishlist) {
        movies[i].checkedWishlist = false;
      }
    }

    const newMovieList: searchResults = {
      movies: movies
    };
    this.setState({
      movieList: newMovieList,
      numToAdd: 0
    });
  };

  moviesToAdd = () => {
    let lotMovies: movie[] = [];
    let wishlistMovies: movie[] = [];

    this.state.movieList.movies.forEach((element) => {
      if (element.checkedLot) {
        lotMovies.push(element.movie);
      }
      if (element.checkedWishlist) {
        wishlistMovies.push(element.movie);
      }
    });

    this.props.moviesAdded(lotMovies, wishlistMovies);
  };

  render() {
    const label = 'add ' + this.state.numToAdd;
    if (this.state.loading) {
      return (
        <Box align="center" justify="center" flex background="header">
          <SyncLoader
            size={25}
            margin={10}
            color={'#6FFFB0'}
            loading={this.state.loading}
          />
        </Box>
      );
    } else {
      return (
        <ResponsiveContext.Consumer>
          {(size) => (
            <Box
              justify="start"
              alignContent="start"
              background="movieSearchResult"
              height={{ max: size !== 'small' ? 'medium' : undefined }}
              flex
            >
              {this.state.visible ? (
                <SingleMovieView
                  movie={this.state.movieToShow}
                  add={true}
                  closeDetailView={this.closeDetailView}
                />
              ) : (
                <Box fill gap={size === 'small' ? 'large' : 'none'}>
                  <AppBar
                    style={{ position: 'fixed', top: 0, right: 0, left: 0 }}
                    fill="horizontal"
                    background="movieSearchResultHeader"
                  >
                    <Button
                      title="back"
                      icon={<Previous />}
                      onClick={() => this.props.closeResult()}
                    />
                    {this.state.numToAdd > 0 ? (
                      <Box
                        gap={size === 'small' ? 'none' : 'small'}
                        direction="row"
                      >
                        <Button
                          label={label}
                          primary
                          size="small"
                          hoverIndicator="accent-1"
                          alignSelf="center"
                          onClick={this.moviesToAdd}
                        />
                        <Button
                          focusIndicator={false}
                          icon={<Trash color="deleteMovie" />}
                          alignSelf="center"
                          title="clear selection"
                          onClick={this.clearSelectedMovies}
                        />
                      </Box>
                    ) : null}
                    <Button
                      title="cancel"
                      icon={<Close />}
                      onClick={() => this.props.closeAdd()}
                    />
                  </AppBar>
                  <Box
                    gap="small"
                    overflow={{ horizontal: 'hidden', vertical: 'auto' }}
                    pad="small"
                    margin={{ top: 'large' }}
                    flex
                    fill
                  >
                    {this.state.movieList.movies.length === 0 ? (
                      <Text textAlign="center">no film data</Text>
                    ) : (
                      this.state.movieList.movies.map((item) => (
                        <Box
                          key={item.movie.id}
                          height={{ min: 'small', max: 'small' }}
                          width={{ min: 'large' }}
                          pad="small"
                          direction="row"
                          align="center"
                          gap="medium"
                          border={{
                            size: 'medium',
                            color: 'resultBorder',
                            side: 'left'
                          }}
                        >
                          <Box
                            background={{
                              image: `url(${item.movie.poster})`,
                              color: 'movieBorder',
                              size: 'cover'
                            }}
                            border={{
                              size: 'small',
                              color: 'movieBorder',
                              side: 'all'
                            }}
                            height={{ min: '175px', max: '175px' }}
                            width={{ min: '115px', max: '115px' }}
                            alignSelf="center"
                            round="xsmall"
                          />
                          <Box alignSelf="center">
                            <Heading alignSelf="start" level="3">
                              {item.movie.name}
                            </Heading>
                            <Box direction="row" gap="small" alignSelf="start">
                              <CheckBox
                                checked={item.checkedLot}
                                label={
                                  size === 'small' ? 'lot?' : 'add film to lot?'
                                }
                                onChange={() => {
                                  this.checkedMovie(item, false);
                                }}
                              />
                              <CheckBox
                                checked={item.checkedWishlist}
                                label={
                                  size === 'small'
                                    ? 'wishlist?'
                                    : 'add film to wishlist?'
                                }
                                onChange={() => {
                                  this.checkedMovie(item, true);
                                }}
                              />
                              <Button
                                icon={<Next />}
                                title="details"
                                onClick={() =>
                                  this.showMovieDetails(item.movie)
                                }
                              />
                            </Box>
                          </Box>
                        </Box>
                      ))
                    )}
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </ResponsiveContext.Consumer>
      );
    }
  }
}
