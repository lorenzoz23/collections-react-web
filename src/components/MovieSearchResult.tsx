import React, { Component } from 'react';
import { Box, Heading, Button, CheckBox, Text } from 'grommet';
import { Close, Next, Previous, Trash } from 'grommet-icons';
import SyncLoader from 'react-spinners/SyncLoader';

import { movie, AppBar } from './HomePage';
import SingleMovieView from './SingleMovieView';

interface MovieSearchResultProps {
  title: string;
  year: string;
  closeAdd(): void;
  closeResult(): void;
  moviesAdded(movies: movie[]): void;
}

type searchResultMovie = {
  movie: movie;
  checked: boolean;
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
          const newMovie: movie = {
            name: item.title,
            plot: item.overview,
            date: item.release_date,
            poster: 'https://image.tmdb.org/t/p/w500' + item.poster_path,
            rating: '',
            runtime: 0,
            genre: [],
            id: item.id
          };
          const newSearchResultMovie: searchResultMovie = {
            movie: newMovie,
            checked: false
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

  checkedMovie = (movie: searchResultMovie) => {
    let results: searchResultMovie[] = [];
    let updatedMovie = movie;
    updatedMovie.checked = !updatedMovie.checked;

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
    const numToAdd = updatedMovie.checked
      ? this.state.numToAdd + 1
      : this.state.numToAdd - 1;
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
      if (movies[i].checked) {
        movies[i].checked = false;
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
    let movies: movie[] = [];

    this.state.movieList.movies.forEach((element) => {
      if (element.checked) {
        movies.push(element.movie);
      }
    });

    this.props.moviesAdded(movies);
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
        <Box
          justify="start"
          alignContent="start"
          background="movieSearchResult"
          height={{ max: 'medium' }}
        >
          {this.state.visible ? (
            <SingleMovieView
              movie={this.state.movieToShow}
              add={true}
              closeDetailView={this.closeDetailView}
            />
          ) : (
            <Box fill>
              <AppBar
                style={{ position: 'fixed', top: 0 }}
                fill="horizontal"
                background="movieSearchResultHeader"
              >
                <Box direction="row" fill gap="small" justify="between">
                  <Button
                    title="back"
                    icon={<Previous size="small" />}
                    onClick={() => this.props.closeResult()}
                  />
                  {this.state.numToAdd > 0 ? (
                    <Box gap="small" direction="row">
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
                    icon={<Close size="small" />}
                    onClick={() => this.props.closeAdd()}
                  />
                </Box>
              </AppBar>
              <Box
                gap="small"
                overflow={{ horizontal: 'hidden', vertical: 'auto' }}
                pad="small"
                margin={{ top: 'large', bottom: 'small' }}
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
                            checked={item.checked}
                            label="add film?"
                            onChange={() => {
                              this.checkedMovie(item);
                            }}
                          />
                          <Button
                            icon={<Next />}
                            title="details"
                            onClick={() => this.showMovieDetails(item.movie)}
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
      );
    }
  }
}
