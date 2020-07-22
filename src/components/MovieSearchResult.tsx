import React, { Component } from 'react';
import { Box, Button, ResponsiveContext, Text } from 'grommet';
import { Close, Previous, Trash } from 'grommet-icons';
import SyncLoader from 'react-spinners/SyncLoader';

import { movie, AppBar } from './HomePage';
import SingleMovieView from './SingleMovieView';
import MovieListResults from './MovieListResults';

interface MovieSearchResultProps {
  title?: string;
  year?: string;
  parsed: boolean;
  imports?: searchResults;
  closeAdd(): void;
  closeResult?(): void;
  moviesAdded(lotMovies: movie[], wishlistMovies: movie[]): void;
}

export type searchResultMovie = {
  movie: movie;
  checkedLot: boolean;
  checkedWishlist: boolean;
};

export type searchResults = {
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
      backDrop: [],
      rating: '',
      runtime: 0,
      genre: [],
      id: '',
      starCount: -1
    },
    numToAdd: 0,
    loading: true
  };

  componentDidMount = () => {
    if (!this.props.parsed) {
      fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US&query=${this.props.title}&page=1&include_adult=false&year=${this.props.year}`
      )
        .then((resp) => resp.json())
        .then((data) => {
          console.log(data.results);
          const results = data.results;
          const filteredResults = results.filter(
            (item: any) => item.title || item.original_title
          );
          let movieItems: searchResultMovie[] = [];
          movieItems = filteredResults.map((item: any) => {
            const image: string = item.backdrop_path
              ? 'https://image.tmdb.org/t/p/original' + item.backdrop_path
              : '';
            const newMovie: movie = {
              name: item.title || item.original_title,
              plot: item.overview || '',
              date: item.release_date || '',
              poster: item.poster_path
                ? 'https://image.tmdb.org/t/p/w500' + item.poster_path
                : '',
              backDrop: [image],
              rating: '',
              runtime: 0,
              genre: [],
              id: item.id || '',
              starCount: -1
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
    } else {
      this.setState({
        loading: false,
        numToAdd: this.props.imports!.movies.length,
        movieList: this.props.imports
      });
    }
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
    const label = !this.props.parsed
      ? 'add ' + this.state.numToAdd
      : this.state.numToAdd;
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
              height={{
                max: size !== 'small' ? 'medium' : undefined
              }}
              flex
            >
              {this.state.visible ? (
                <Box
                  border={{
                    side: 'all',
                    size: 'medium',
                    color: 'lotBorder'
                  }}
                >
                  <SingleMovieView
                    movie={this.state.movieToShow}
                    wishlist={true}
                    add={true}
                    closeDetailView={this.closeDetailView}
                  />
                </Box>
              ) : (
                <Box fill gap={size === 'small' ? 'large' : 'none'}>
                  <AppBar
                    style={{ position: 'fixed', top: 0, right: 0, left: 0 }}
                    fill="horizontal"
                    background="movieSearchResultHeader"
                  >
                    {!this.props.parsed ? (
                      <Button
                        title="back"
                        icon={<Previous />}
                        onClick={() => this.props.closeResult!()}
                      />
                    ) : (
                      <Box
                        direction="row"
                        align="center"
                        gap={this.props.parsed ? 'medium' : 'none'}
                        pad={{
                          horizontal: this.props.parsed ? 'small' : 'none'
                        }}
                      >
                        <Text weight="bold">import</Text>
                        {this.state.numToAdd > 0 && (
                          <Box
                            gap={size === 'small' ? 'none' : 'xsmall'}
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
                        )}
                      </Box>
                    )}
                    {this.state.numToAdd > 0 && !this.props.parsed ? (
                      <Box
                        gap={size === 'small' ? 'none' : 'xsmall'}
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
                  <MovieListResults
                    movieList={this.state.movieList}
                    checkedMovie={(movie, wishlist) =>
                      this.checkedMovie(movie, wishlist)
                    }
                    showMovieDetails={(movie) => this.showMovieDetails(movie)}
                  />
                </Box>
              )}
            </Box>
          )}
        </ResponsiveContext.Consumer>
      );
    }
  }
}
