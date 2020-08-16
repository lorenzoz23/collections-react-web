import React, { Component } from 'react';
import { Box, Heading, Button, Text, ResponsiveContext, Image } from 'grommet';
import { Previous, Trash, Eject, View } from 'grommet-icons';
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
  handleWatched?(): void;
  rand?: number;
  width?: number;
  movie: movie;
  wishlist: boolean;
  add: boolean;
  tags?: string[];
}

export default class SingleMovieView extends Component<SingleMovieViewProps> {
  state = {
    watched: this.props.movie.watched
  };
  render() {
    const numGenre = this.props.movie.genre.length;
    const mode = localStorage.getItem('visualModeValue') || 'wedding';
    const images: string[] = [
      ...this.props.movie.backDrop,
      this.props.movie.poster
    ];

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
              width={{
                min: size !== 'small' && !this.props.add ? 'large' : undefined
              }}
              justify="center"
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
                    src={this.props.add ? images[0] : images[this.props.rand!]}
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
                    placeholder={
                      this.props.wishlist
                        ? 'How would you like to own this?'
                        : 'How do you own this?'
                    }
                    title={
                      this.props.wishlist
                        ? 'How would you like to own this title?'
                        : 'How do you own this title?'
                    }
                    movieTags={this.props.movie.tags!}
                    movieName={this.props.movie.name}
                    tags={this.props.tags!}
                    plain={false}
                    save={true}
                    width={this.props.width!}
                    handleSelectedTags={(tags) =>
                      this.props.handleSelectedTags!(tags)
                    }
                  />
                </Box>
              )}
              <Box align="center" alignSelf="center" overflow="hidden">
                <Heading
                  color={
                    size === 'small' && mode === 'solid' ? 'black' : undefined
                  }
                  level="2"
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
                          title="Rating"
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
                      bottom: 0,
                      zIndex: 2
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
                  src={
                    this.props.movie.backDrop![
                      this.props.add ? 0 : this.props.rand!
                    ]
                  }
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
                  title="Back"
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
                    ? {
                        position: 'fixed',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        zIndex: 2
                      }
                    : {
                        position: 'fixed',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        zIndex: 2
                      }
                }
                pad={size !== 'small' ? 'small' : 'none'}
              >
                {size === 'small' && (
                  <Button
                    title="Back"
                    icon={<Previous />}
                    onClick={() => this.props.closeDetailView!()}
                  />
                )}
                {size !== 'small' && (
                  <SelectMultiple
                    placeholder={
                      this.props.wishlist
                        ? 'How would you like to own this?'
                        : 'How do you own this?'
                    }
                    title={
                      this.props.wishlist
                        ? 'How would you like to own this title?'
                        : 'How do you own this title?'
                    }
                    movieTags={this.props.movie.tags!}
                    movieName={this.props.movie.name}
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
                        title="Transfer film to Lot"
                        label="Transfer to Lot"
                        icon={<Eject />}
                        onClick={() => {
                          this.props.handleTransfer!();
                        }}
                      />
                    ) : (
                      <Box direction="row" gap="small" align="center">
                        <Button
                          icon={
                            <View
                              color={
                                this.props.movie.starCount !== -1 ||
                                this.state.watched === 1
                                  ? 'accent-1'
                                  : undefined
                              }
                            />
                          }
                          focusIndicator={false}
                          onClick={() => {
                            this.setState({
                              watched: this.state.watched === 1 ? 0 : 1
                            });
                            this.props.handleWatched!();
                          }}
                          disabled={this.props.movie.starCount !== -1}
                          label={
                            this.props.width! > 700 &&
                            (this.props.movie.starCount !== -1 ||
                              this.state.watched === 1)
                              ? 'Watched'
                              : 'Unwatched'
                          }
                        />
                        <RateFilm
                          movie={this.props.movie}
                          handleRate={(updatedMovie: movie) =>
                            this.props.handleRate!(updatedMovie)
                          }
                        />
                      </Box>
                    )}
                    <Button
                      icon={<Trash color="deleteMovie" />}
                      alignSelf="end"
                      title="Remove film"
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
