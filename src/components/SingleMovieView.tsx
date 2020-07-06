import React, { Component } from 'react';
import { Box, Heading, Button, Text, ResponsiveContext, Image } from 'grommet';
import { Previous, Trash } from 'grommet-icons';
import { movie } from './HomePage';
import RateFilm from './RateFilm';

interface SingleMovieViewProps {
  closeDetailView?(): void;
  movieAdded?(movie: movie): void;
  handleDelete?(movieId: string): void;
  handleRate?(updatedMovie: movie): void;
  movie: movie;
  add: boolean;
}

export default class SingleMovieView extends Component<SingleMovieViewProps> {
  render() {
    const numGenre = this.props.movie.genre.length;
    const mode = localStorage.getItem('visualModeValue') || 'gradient';
    const rand = Math.floor(Math.random() * Math.floor(3));

    return (
      <ResponsiveContext.Consumer>
        {(size) => (
          <Box
            gap="medium"
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
                    image: `url(${this.props.movie.poster})`,
                    color: 'movieBorder',
                    size: 'contain'
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
                    src={this.props.movie.poster}
                    opacity="0.2"
                  />
                </Box>
              )}
              <Box
                justify="evenly"
                align={size === 'small' ? 'center' : undefined}
                alignSelf={size === 'small' ? 'center' : 'end'}
              >
                <Heading
                  color={
                    size === 'small' && mode === 'solid' ? 'black' : undefined
                  }
                  level="3"
                  textAlign={size === 'small' ? 'center' : undefined}
                >
                  {this.props.movie.name}
                </Heading>
                {this.props.add ? (
                  <Box gap="small">
                    <Text
                      weight="bold"
                      size={size === 'small' ? 'small' : 'medium'}
                      textAlign={size === 'small' ? 'center' : undefined}
                      color={
                        size === 'small' && mode === 'solid'
                          ? 'black'
                          : undefined
                      }
                    >
                      {this.props.movie.date.substring(0, 4)}
                    </Text>
                    <Text
                      margin={{
                        horizontal: size === 'small' ? 'small' : 'none'
                      }}
                      size="small"
                      textAlign={size === 'small' ? 'center' : undefined}
                      color={
                        size === 'small' && mode === 'solid'
                          ? 'black'
                          : undefined
                      }
                    >
                      {this.props.movie.plot}
                    </Text>
                  </Box>
                ) : (
                  <Box gap="small">
                    <Box
                      gap={size !== 'small' ? 'medium' : 'none'}
                      justify={size === 'small' ? 'center' : undefined}
                      border={size !== 'small' ? 'between' : undefined}
                      direction={size !== 'small' ? 'row' : 'column'}
                    >
                      <Box direction="row" gap="xsmall" justify="center">
                        {this.props.movie.genre.map(
                          (genre: string, i: number) => (
                            <Text
                              weight="bold"
                              key={genre}
                              size={size === 'small' ? 'small' : 'medium'}
                              color={
                                size === 'small' && mode === 'solid'
                                  ? 'black'
                                  : undefined
                              }
                            >
                              {numGenre === i + 1 ? genre : `${genre},`}
                            </Text>
                          )
                        )}
                      </Box>
                      <Box direction="row" gap="small" justify="center">
                        <Text
                          weight="bold"
                          size={size === 'small' ? 'small' : 'medium'}
                          color={
                            size === 'small' && mode === 'solid'
                              ? 'black'
                              : undefined
                          }
                        >
                          {this.props.movie.date.substring(0, 4)}
                        </Text>
                        {this.props.movie.rating !== '?' ? (
                          <Text
                            weight="bold"
                            size={size === 'small' ? 'small' : 'medium'}
                            color={
                              size === 'small' && mode === 'solid'
                                ? 'black'
                                : undefined
                            }
                          >
                            {this.props.movie.rating}
                          </Text>
                        ) : null}
                        <Text
                          weight="bold"
                          size={size === 'small' ? 'small' : 'medium'}
                          color={
                            size === 'small' && mode === 'solid'
                              ? 'black'
                              : undefined
                          }
                        >
                          {this.props.movie.runtime} min
                        </Text>
                      </Box>
                    </Box>
                    <Text
                      size="small"
                      textAlign={size === 'small' ? 'center' : undefined}
                      color={
                        size === 'small' && mode === 'solid'
                          ? 'black'
                          : undefined
                      }
                      margin={{
                        horizontal: size === 'small' ? 'small' : 'none'
                      }}
                    >
                      {this.props.movie.plot}
                    </Text>
                  </Box>
                )}
              </Box>
            </Box>
            {size !== 'small' && (
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
                  src={this.props.movie.backDrop![rand]}
                  opacity="0.2"
                  style={{ borderRadius: 25 }}
                />
              </Box>
            )}
            {this.props.add ? (
              <Box
                align="center"
                alignSelf="start"
                style={
                  size === 'small'
                    ? { position: 'fixed', bottom: 0, left: 0, width: '100%' }
                    : undefined
                }
                pad={size === 'small' ? 'medium' : 'none'}
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
                alignSelf="end"
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
                <Box
                  direction="row"
                  gap="xsmall"
                  align="center"
                  alignSelf="end"
                  pad={size !== 'small' ? 'small' : 'none'}
                  style={
                    size !== 'small'
                      ? {
                          position: 'fixed',
                          bottom: 0,
                          right: 0
                        }
                      : undefined
                  }
                >
                  <RateFilm
                    movie={this.props.movie}
                    handleRate={(updatedMovie: movie) =>
                      this.props.handleRate!(updatedMovie)
                    }
                  />
                  <Button
                    icon={<Trash color="deleteMovie" />}
                    alignSelf="end"
                    title="remove film"
                    onClick={() =>
                      this.props.handleDelete!(this.props.movie.id)
                    }
                  />
                </Box>
              </Box>
            )}
          </Box>
        )}
      </ResponsiveContext.Consumer>
    );
  }
}
