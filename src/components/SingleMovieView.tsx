import React, { Component } from 'react';
import { Box, Heading, Button, Text, Image } from 'grommet';
import { Previous } from 'grommet-icons';
import { movie } from './HomePage';

interface SingleMovieViewProps {
  closeDetailView?(): void;
  movieAdded?(movie: movie): void;
  movie: movie;
  add: boolean;
}

export type movieView = {
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
    this.props.movieAdded!(movieToAdd);
  };

  render() {
    return (
      <Box gap="small">
        <Box direction="row" justify="start" gap="medium">
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
        {this.props.add ? (
          <Box align="center" alignSelf="start">
            <Button
              title="back"
              icon={<Previous />}
              onClick={() => this.props.closeDetailView!()}
            />
          </Box>
        ) : null}
      </Box>
    );
  }
}
