import React, { Component } from 'react';
import { Box, Heading, Button, Image, CheckBox } from 'grommet';
import { Close, Previous } from 'grommet-icons';
import { movie } from './HomePage';
//import SingleMovieView from './SingleMovieView';

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
  state: { movieList: searchResults } = {
    movieList: {
      movies: []
    }
  };

  componentDidMount = () => {
    fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US&query=${this.props.title}&page=1&include_adult=false&year=${this.props.year}`
    )
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data.results);
        const results = data.results;
        const movieItems: searchResultMovie[] = [];
        results.map((item: any) => {
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
          movieItems.push(newSearchResultMovie);
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
    this.setState({
      movieList: newMovieList
    });
  };

  render() {
    return (
      <Box
        pad="medium"
        background="linear-gradient(90deg, rgba(33,52,68,1) 25%, rgba(24,122,204,1) 100%)"
        align="center"
        justify="center"
        round
      >
        {this.state.movieList.movies.map((item) => {
          <Box direction="row" justify="between" gap="medium" alignSelf="end">
            <Box
              height={{ min: '225px', max: '225px' }}
              width={{ min: '150px', max: '150px' }}
              style={{ backgroundColor: '#34495E', borderRadius: 20 }}
              border={{ size: 'small', color: '#34495E', side: 'all' }}
            >
              <Image
                fill
                fit="cover"
                src={item.movie.poster}
                style={{ borderRadius: 20 }}
              />
            </Box>
            <Box direction="row" gap="small">
              <Heading level="3">{item.movie.name}</Heading>
              <CheckBox
                checked={item.checked}
                label="add film?"
                onChange={() => {
                  this.checkedMovie(item);
                }}
              />
            </Box>
          </Box>;
        })}
        <Box direction="row" justify="between" pad={{ top: 'medium' }} fill>
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
      </Box>
    );
  }
}
