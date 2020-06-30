import React, { Component } from 'react';
import { Box, Heading, Button, Text } from 'grommet';
import { Previous, Trash } from 'grommet-icons';
import { movie } from './HomePage';

interface SingleMovieViewProps {
  closeDetailView?(): void;
  movieAdded?(movie: movie): void;
  handleDelete?(movieId: string): void;
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
    const numGenre = this.state.movieView.movie.genre.length;
    return (
      <Box gap="small" pad="small" background="movieSearchResult" round>
        <Box direction="row" justify="start" gap="medium">
          <Box
            round="xsmall"
            height={{ min: '225px', max: '225px' }}
            width={{ min: '150px', max: '150px' }}
            background={{
              image: `url(${this.state.movieView.movie.poster})`,
              color: 'movieBorder',
              size: 'cover'
            }}
            border={{ size: 'small', color: 'movieBorder', side: 'all' }}
            alignSelf="end"
          />
          <Box justify="evenly" alignSelf="end">
            <Heading level="3">{this.state.movieView.movie.name}</Heading>
            {this.props.add ? (
              <Box gap="small">
                <Text weight="bold">
                  {this.state.movieView.movie.date.substring(0, 4)}
                </Text>
                <Text size="small">{this.state.movieView.movie.plot}</Text>
              </Box>
            ) : (
              <Box gap="small">
                <Box direction="row" border="between" gap="medium">
                  <Box direction="row" gap="xsmall">
                    {this.state.movieView.movie.genre.map(
                      (genre: string, i: number) => (
                        <Text weight="bold" key={genre}>
                          {numGenre === i + 1 ? genre : `${genre},`}
                        </Text>
                      )
                    )}
                  </Box>
                  <Box direction="row" gap="small">
                    <Text weight="bold">
                      {this.state.movieView.movie.date.substring(0, 4)}
                    </Text>
                    {this.state.movieView.movie.rating !== '?' ? (
                      <Text weight="bold">
                        {this.state.movieView.movie.rating}
                      </Text>
                    ) : null}
                    <Text weight="bold">
                      {this.state.movieView.movie.runtime} min
                    </Text>
                  </Box>
                </Box>
                <Text size="small">{this.state.movieView.movie.plot}</Text>
              </Box>
            )}
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
        ) : (
          <Box>
            <Button
              icon={<Trash color="deleteMovie" />}
              alignSelf="end"
              title="remove film from lot"
              onClick={() =>
                this.props.handleDelete!(this.state.movieView.movie.id)
              }
            />
          </Box>
        )}
      </Box>
    );
  }
}
