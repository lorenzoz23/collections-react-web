import React, { Component } from 'react';
import { Box, Heading, Button, Image, CheckBox } from 'grommet';
import { Close, Previous } from 'grommet-icons';
import { movie } from './HomePage';

interface MovieSearchResultProps {
  title: string;
  year: string;
  closeAdd(): void;
  closeResult(): void;
  movieAdded(movie: movie): void;
}

type searchResult = {
  movie: movie;
  checked: boolean;
};

export default class MovieSearchResult extends Component<
  MovieSearchResultProps
> {
  state: { result: searchResult } = {
    result: {
      movie: {
        name: '',
        plot: '',
        date: '',
        poster: '',
        id: ''
      },
      checked: false
    }
  };

  componentDidMount = () => {
    fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US&query=${this.props.title}&page=1&include_adult=false&year=${this.props.year}`
    )
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data.results[0]);
        const newMovie: movie = {
          name: data.results[0].title,
          plot: data.results[0].overview,
          date: data.results[0].release_date,
          poster:
            'https://image.tmdb.org/t/p/w500' + data.results[0].poster_path,
          id: data.results[0].id
        };
        const result: searchResult = {
          movie: newMovie,
          checked: false
        };
        console.log(result);
        this.setState({
          result: result
        });
      })
      .catch((err) => {
        console.log('error: ' + err);
      });
  };

  checkedMovie = () => {
    const checkedMovie: searchResult = {
      ...this.state.result,
      checked: !this.state.result.checked
    };
    this.setState({
      movie: checkedMovie
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
              src={this.state.result.movie.poster}
              style={{ borderRadius: 20 }}
            />
          </Box>
          <Box direction="row" gap="small">
            <Heading level="3">{this.state.result.movie.name}</Heading>
            <CheckBox
              checked={this.state.result.checked}
              label="add film?"
              onChange={() => {
                this.checkedMovie();
              }}
            />
          </Box>
        </Box>
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
