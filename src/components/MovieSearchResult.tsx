import React, { Component } from 'react';
import { Box, Heading, Button, Image, CheckBox, Footer } from 'grommet';
import { Close, Next, Previous } from 'grommet-icons';
import { movie } from './HomePage';
import SingleMovieView from './SingleMovieView';

interface MovieSearchResultProps {
  title: string;
  year: string;
  closeAdd(): void;
  closeResult(): void;
  movieAdded(movie: movie): void;
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
      id: ''
    },
    numToAdd: 0
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
          movieList: newMovieList
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

  render() {
    const label = 'add ' + this.state.numToAdd + ' films';
    return (
      <Box
        pad="small"
        gap="small"
        background="linear-gradient(45deg, rgba(33,52,68,1) 10%, rgba(24,122,204,1) 100%)"
        overflow={{ horizontal: 'hidden', vertical: 'auto' }}
        height={{ max: 'medium' }}
        flex
      >
        {this.state.visible ? (
          <SingleMovieView
            movie={this.state.movieToShow}
            add={true}
            closeDetailView={this.closeDetailView}
          />
        ) : (
          this.state.movieList.movies.map((item) => (
            <Box
              height={{ min: '200px', max: '200px' }}
              pad="small"
              direction="row"
              gap="medium"
              fill="horizontal"
              border={{ size: 'small', color: 'accent-1', side: 'all' }}
            >
              <Box
                style={{ backgroundColor: '#34495E', borderRadius: 20 }}
                border={{ size: 'small', color: '#34495E', side: 'all' }}
                height={{ min: '175px', max: '175px' }}
                width={{ min: '125px', max: '125px' }}
                alignSelf="center"
              >
                <Image
                  fill
                  fit="cover"
                  src={item.movie.poster}
                  style={{ borderRadius: 20 }}
                />
              </Box>
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
                    title="movie details"
                    onClick={() => this.showMovieDetails(item.movie)}
                  />
                </Box>
              </Box>
            </Box>
          ))
        )}
        {!this.state.visible ? (
          <Footer>
            <Box direction="row" fill gap="small">
              <Button
                title="back"
                icon={<Previous />}
                onClick={() => this.props.closeResult()}
              />
              <Button
                title="cancel"
                icon={<Close />}
                onClick={() => this.props.closeAdd()}
              />
            </Box>
          </Footer>
        ) : null}
        {this.state.numToAdd > 0 ? (
          <Button
            label={label}
            primary
            hoverIndicator="transparent"
            style={{
              position: 'fixed',
              bottom: '20px',
              //zIndex: 99,
              right: '30px'
            }}
          />
        ) : null}
      </Box>
    );
  }
}
