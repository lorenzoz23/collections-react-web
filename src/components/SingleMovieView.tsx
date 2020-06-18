import React, { Component } from 'react';
import { Box, Heading, Button, Text, Image, CheckBox } from 'grommet';
import { Previous } from 'grommet-icons';
import { movie } from './HomePage';

interface SingleMovieViewProps {
  closeResult(): void;
  movieAdded(movie: movie): void;
  movie: movie;
}

type movieView = {
  movie: movie;
  checked: boolean;
};

export default class SingleMovieView extends Component<SingleMovieViewProps> {
  state: { movieView: movieView } = {
    movieView: {
      movie: this.props.movie,
      checked: false
    }
  };

  checkedMovie = () => {
    const checkedMovie: movieView = {
      ...this.state.movieView,
      checked: !this.state.movieView.checked
    };
    this.setState({
      movieView: checkedMovie
    });
    const movieToAdd: movie = {
      ...this.state.movieView.movie
    };
    this.props.movieAdded(movieToAdd);
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
              src={this.state.movieView.movie.poster}
              style={{ borderRadius: 20 }}
            />
          </Box>
          <Box justify="evenly" alignSelf="end">
            <Heading level="3">{this.state.movieView.movie.name}</Heading>
            <Box gap="small">
              <Text weight="bold">
                {this.state.movieView.movie.date.substring(0, 4)}
              </Text>
              <Text size="small">{this.state.movieView.movie.plot}</Text>
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
            checked={this.state.movieView.checked}
            label="add film?"
            onChange={() => {
              this.checkedMovie();
            }}
          />
        </Box>
      </Box>
    );
  }
}
