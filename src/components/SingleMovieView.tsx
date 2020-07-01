import React, { Component } from 'react';
import { Box, Heading, Button, Text, ResponsiveContext, Image } from 'grommet';
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
      <ResponsiveContext.Consumer>
        {(size) => (
          <Box
            gap="small"
            pad="small"
            background="movieSearchResult"
            round={size === 'small' ? false : true}
            justify={size === 'small' ? 'center' : undefined}
            flex
          >
            <Box
              direction={size === 'small' ? 'column' : 'row'}
              justify="start"
              gap={size === 'small' ? 'none' : 'medium'}
            >
              {size !== 'small' ? (
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
              ) : (
                <Box
                  style={{
                    position: 'fixed',
                    top: 0,
                    bottom: 0,
                    right: 0,
                    left: 0,
                    zIndex: 0
                  }}
                >
                  <Image
                    fit="cover"
                    fill
                    src={this.state.movieView.movie.poster}
                    opacity="0.3"
                  />
                </Box>
              )}
              <Box
                justify="evenly"
                alignSelf={size === 'small' ? 'center' : 'end'}
              >
                <Heading
                  color={size === 'small' ? 'black' : undefined}
                  level="3"
                  textAlign={size === 'small' ? 'center' : undefined}
                >
                  {this.state.movieView.movie.name}
                </Heading>
                {this.props.add ? (
                  <Box gap="small">
                    <Text
                      weight="bold"
                      size={size === 'small' ? 'small' : 'medium'}
                      textAlign={size === 'small' ? 'center' : undefined}
                      color={size === 'small' ? 'black' : undefined}
                    >
                      {this.state.movieView.movie.date.substring(0, 4)}
                    </Text>
                    <Text
                      size="small"
                      textAlign={size === 'small' ? 'center' : undefined}
                      color={size === 'small' ? 'black' : undefined}
                    >
                      {this.state.movieView.movie.plot}
                    </Text>
                  </Box>
                ) : (
                  <Box gap="small">
                    <Box
                      direction="row"
                      border="between"
                      gap="medium"
                      justify={size === 'small' ? 'center' : undefined}
                    >
                      <Box direction="row" gap="xsmall">
                        {this.state.movieView.movie.genre.map(
                          (genre: string, i: number) => (
                            <Text
                              weight="bold"
                              key={genre}
                              size={size === 'small' ? 'small' : 'medium'}
                              color={size === 'small' ? 'black' : undefined}
                            >
                              {numGenre === i + 1 ? genre : `${genre},`}
                            </Text>
                          )
                        )}
                      </Box>
                      <Box direction="row" gap="small">
                        <Text
                          weight="bold"
                          size={size === 'small' ? 'small' : 'medium'}
                          color={size === 'small' ? 'black' : undefined}
                        >
                          {this.state.movieView.movie.date.substring(0, 4)}
                        </Text>
                        {this.state.movieView.movie.rating !== '?' ? (
                          <Text
                            weight="bold"
                            size={size === 'small' ? 'small' : 'medium'}
                            color={size === 'small' ? 'black' : undefined}
                          >
                            {this.state.movieView.movie.rating}
                          </Text>
                        ) : null}
                        <Text
                          weight="bold"
                          size={size === 'small' ? 'small' : 'medium'}
                          color={size === 'small' ? 'black' : undefined}
                        >
                          {this.state.movieView.movie.runtime} min
                        </Text>
                      </Box>
                    </Box>
                    <Text
                      size="small"
                      textAlign={size === 'small' ? 'center' : undefined}
                      color={size === 'small' ? 'black' : undefined}
                    >
                      {this.state.movieView.movie.plot}
                    </Text>
                  </Box>
                )}
              </Box>
            </Box>
            {this.props.add ? (
              <Box
                align="center"
                alignSelf="start"
                style={
                  size === 'small'
                    ? { position: 'fixed', bottom: 0, left: 0, width: '100%' }
                    : undefined
                }
                pad="small"
              >
                <Button
                  title="back"
                  icon={<Previous />}
                  onClick={() => this.props.closeDetailView!()}
                />
              </Box>
            ) : (
              <Box
                direction="row"
                justify="between"
                pad="small"
                style={
                  size === 'small'
                    ? { position: 'fixed', bottom: 0, left: 0, width: '100%' }
                    : undefined
                }
              >
                {size === 'small' ? (
                  <Button
                    title="back"
                    icon={<Previous />}
                    onClick={() => this.props.closeDetailView!()}
                  />
                ) : null}
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
        )}
      </ResponsiveContext.Consumer>
    );
  }
}
