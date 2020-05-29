import React, { Component } from 'react';
import { Box, Heading, Button, Text, Image, CheckBox } from 'grommet';
import { Close, Previous } from 'grommet-icons';

interface MovieSearchResultProps {
  title: string;
  year: string;
  closeAdd(): void;
  closeResult(): void;
}

type searchResult = {
  name: string;
  plot: string;
  date: string;
  poster: string;
  id: string;
  checked: boolean;
};

export default class MovieSearchResult extends Component<
  MovieSearchResultProps
> {
  state: { movie: searchResult } = {
    movie: {
      name: '',
      plot: '',
      date: '',
      poster: '',
      id: '',
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
        const result: searchResult = {
          name: data.results[0].title,
          plot: data.results[0].overview,
          date: data.results[0].release_date,
          poster:
            'https://image.tmdb.org/t/p/w500' + data.results[0].poster_path,
          id: data.results[0].id,
          checked: false
        };
        console.log(result);
        this.setState({
          movie: result
        });
      })
      .catch((err) => {
        console.log('error: ' + err);
      });
  };

  checkedMovie = () => {
    const checkedMovie: searchResult = {
      ...this.state.movie,
      checked: !this.state.movie.checked
    };
    this.setState({
      movie: checkedMovie
    });
  };

  render() {
    return (
      <Box
        pad="medium"
        background="linear-gradient(135deg, rgba(74,224,226,1) 0%, rgba(255,226,163,1) 100%)"
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
              src={this.state.movie.poster}
              style={{ borderRadius: 20 }}
            />
          </Box>
          <Box justify="evenly" alignSelf="end">
            <Heading level="3">{this.state.movie.name}</Heading>
            <Box gap="small">
              <Text weight="bold">{this.state.movie.date.substring(0, 4)}</Text>
              <Text size="small">{this.state.movie.plot}</Text>
            </Box>
          </Box>
        </Box>
        <Box direction="row" justify="between" pad={{ top: 'medium' }} fill>
          <Button
            title="back"
            icon={<Previous />}
            onClick={() => this.props.closeResult()}
          />
          <CheckBox
            checked={this.state.movie.checked}
            label="add film?"
            onChange={() => {
              this.checkedMovie();
            }}
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
