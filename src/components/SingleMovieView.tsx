import React, { Component } from 'react';
import { Box, Heading, Button, Text, ResponsiveContext, Image } from 'grommet';
import { Previous, Trash, Eject } from 'grommet-icons';
import { movie } from './HomePage';
import RateFilm from './RateFilm';
import SelectMultiple from './SelectMultiple';

interface SingleMovieViewProps {
  closeDetailView?(): void;
  movieAdded?(movie: movie): void;
  handleDelete?(movieId: string): void;
  handleRate?(updatedMovie: movie): void;
  handleSelectedTags?(tags: number[]): void;
  handleTransfer?(): void;
  movie: movie;
  wishlist: boolean;
  add: boolean;
  tags?: string[];
}

export default class SingleMovieView extends Component<SingleMovieViewProps> {
  render() {
    const numGenre = this.props.movie.genre.length;
    const mode = localStorage.getItem('visualModeValue') || 'wedding';
    const rand = Math.floor(
      Math.random() * Math.floor(this.props.movie.backDrop?.length || 0)
    );

    return (
      <ResponsiveContext.Consumer>
        {(size) => (
          <Box
            gap="medium"
            pad="small"
            background="movieSearchResult"
            round={size === 'small' ? false : true}
            justify="center"
            flex
          >
            <Box
              direction={size === 'small' ? 'column' : 'row'}
              gap={size === 'small' ? 'none' : 'medium'}
              margin={{ bottom: 'small' }}
              // height={{
              //   max: size !== 'small' ? 'medium' : undefined,
              //   min: size !== 'small' ? 'medium' : undefined
              // }}
              height={size !== 'small' ? 'medium' : undefined}
            >
              {size === 'small' && (
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
                    opacity={mode === 'solid' ? '0.2' : '0.3'}
                  />
                  {/* <Box
                    round="xsmall"
                    height={{ min: '225px', max: '225px' }}
                    width={{ min: '150px', max: '150px' }}
                    background={{
                      image: `url(${this.props.movie.poster})`,
                      color: 'movieBorder',
                      size: 'contain'
                    }}
                    border={{
                      size: 'small',
                      color: 'movieBorder',
                      side: 'all'
                    }}
                    alignSelf="end"
                  /> */}
                </Box>
              )}
              {size === 'small' && !this.props.add && (
                <Box
                  style={{
                    position: 'fixed',
                    top: 10,
                    left: 0,
                    width: '100%'
                  }}
                >
                  <SelectMultiple
                    title={
                      this.props.wishlist
                        ? 'how would you like to own this title?'
                        : 'how do you own this title?'
                    }
                    movieTags={this.props.movie.tags!}
                    tags={this.props.tags!}
                    plain={false}
                    save={true}
                    handleSelectedTags={(tags) =>
                      this.props.handleSelectedTags!(tags)
                    }
                  />
                </Box>
              )}
              <Box align="center" alignSelf="center">
                <Heading
                  color={
                    size === 'small' && mode === 'solid' ? 'black' : undefined
                  }
                  level="3"
                  textAlign="center"
                >
                  {this.props.movie.name}
                </Heading>
                {this.props.add ? (
                  <Box gap="small">
                    <Text
                      weight="bold"
                      size={size === 'small' ? 'small' : 'medium'}
                      textAlign="center"
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
                      textAlign="center"
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
                      justify="center"
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
                        <Text
                          weight="bold"
                          title="rating"
                          size={size === 'small' ? 'small' : 'medium'}
                          color={
                            size === 'small' && mode === 'solid'
                              ? 'black'
                              : undefined
                          }
                        >
                          {this.props.movie.rating}
                        </Text>
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
                      textAlign="center"
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
                {this.props.wishlist && !this.props.add && (
                  <Box
                    align="center"
                    style={{
                      position: 'fixed',
                      right: 0,
                      left: 0,
                      top: '70%',
                      bottom: 0
                    }}
                  >
                    <RateFilm
                      movie={this.props.movie}
                      handleRate={(updatedMovie: movie) =>
                        this.props.handleRate!(updatedMovie)
                      }
                    />
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
                  src={this.props.movie.backDrop![this.props.add ? 0 : rand]}
                  opacity={mode === 'solid' ? '0.2' : '0.3'}
                  style={
                    this.props.add ? { borderRadius: 0 } : { borderRadius: 25 }
                  }
                />
              </Box>
            )}
            {this.props.add ? (
              <Box
                align="center"
                alignSelf="center"
                style={
                  size === 'small'
                    ? { position: 'fixed', bottom: 0, left: 0, width: '100%' }
                    : { position: 'fixed', bottom: 0, right: 0, width: '100%' }
                }
                pad={size === 'small' ? 'medium' : 'small'}
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
                    : { position: 'fixed', bottom: 0, left: 0, width: '100%' }
                }
                pad={size !== 'small' ? 'small' : 'none'}
              >
                {size === 'small' && (
                  <Button
                    title="back"
                    icon={<Previous />}
                    onClick={() => this.props.closeDetailView!()}
                  />
                )}
                {size !== 'small' && (
                  <SelectMultiple
                    title={
                      this.props.wishlist
                        ? 'how would you like to own this title?'
                        : 'how do you own this title?'
                    }
                    movieTags={this.props.movie.tags!}
                    tags={this.props.tags!}
                    plain={false}
                    save={true}
                    handleSelectedTags={(tags) =>
                      this.props.handleSelectedTags!(tags)
                    }
                  />
                )}
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
                  <Box direction="row" align="center" gap="xsmall">
                    {this.props.wishlist ? (
                      <Button
                        alignSelf="center"
                        label={size === 'small' ? 'transfer to lot' : undefined}
                        icon={<Eject />}
                        onClick={() => {
                          this.props.handleTransfer!();
                        }}
                      />
                    ) : (
                      <RateFilm
                        movie={this.props.movie}
                        handleRate={(updatedMovie: movie) =>
                          this.props.handleRate!(updatedMovie)
                        }
                      />
                    )}
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
              </Box>
            )}
          </Box>
        )}
      </ResponsiveContext.Consumer>
    );
  }
}
