import React, { Component } from 'react';
import { movie } from './HomePage';
import { searchResults, searchResultMovie } from './MovieSearchResult';
import {
  Box,
  Heading,
  CheckBox,
  Button,
  Text,
  ResponsiveContext
} from 'grommet';
import { Next, DocumentImage } from 'grommet-icons'; //Configure, TroubleShoot, Threats - used when no poster is available

interface MovieListResultsProps {
  movieList: searchResults;
  parsed: boolean;
  checkedMovie(movie: searchResultMovie, wishlist: boolean): void;
  showMovieDetails(movie: movie): void;
}

export default class MovieListResults extends Component<MovieListResultsProps> {
  render() {
    return (
      <ResponsiveContext.Consumer>
        {(size) => (
          <Box
            gap="small"
            overflow={{ horizontal: 'hidden', vertical: 'auto' }}
            pad="small"
            margin={{ top: 'large' }}
            flex
            fill
          >
            {this.props.movieList.movies.length === 0 ? (
              <Text textAlign="center" margin="medium">
                No film data
              </Text>
            ) : (
              this.props.movieList.movies.map((item) => (
                <Box
                  key={item.movie.id}
                  height={{ min: 'small', max: 'small' }}
                  width={{ min: size !== 'small' ? 'large' : undefined }}
                  pad="small"
                  direction="row"
                  align="center"
                  gap="medium"
                  border={{
                    size: 'medium',
                    color: 'resultBorder',
                    side: 'left'
                  }}
                >
                  <Box
                    background={{
                      image: `url(${item.movie.poster})`,
                      color: 'movieBorder',
                      size: 'cover'
                    }}
                    border={{
                      size: 'small',
                      color: 'movieBorder',
                      side: 'all'
                    }}
                    height={{ min: '175px', max: '175px' }}
                    width={{ min: '115px', max: '115px' }}
                    align="center"
                    justify="center"
                    round="xsmall"
                  >
                    {!item.movie.poster && (
                      <DocumentImage
                        alignmentBaseline="middle"
                        size={size !== 'small' ? 'large' : 'medium'}
                      />
                    )}
                  </Box>
                  <Box alignSelf="center">
                    <Heading alignSelf="start" level="3">
                      {item.movie.date
                        ? item.movie.name +
                          ' (' +
                          item.movie.date.substring(0, 4) +
                          ')'
                        : item.movie.name}
                    </Heading>
                    {this.props.parsed ? (
                      <Box direction="row" gap="small" alignSelf="start">
                        <CheckBox
                          checked={item.checkedLot}
                          label={size === 'small' ? 'Lot?' : 'Add film to Lot?'}
                          onChange={() => {
                            this.props.checkedMovie(item, false);
                          }}
                        />
                        <CheckBox
                          checked={item.checkedWishlist}
                          label={
                            size === 'small'
                              ? 'Wishlist?'
                              : 'Add film to Wishlist?'
                          }
                          onChange={() => {
                            this.props.checkedMovie(item, true);
                          }}
                        />
                        <Button
                          icon={<Next />}
                          title="Details"
                          onClick={() =>
                            this.props.showMovieDetails(item.movie)
                          }
                        />
                      </Box>
                    ) : (
                      <Box gap="medium" alignSelf="start" direction="row">
                        <Box gap="small" align="start">
                          <Button
                            color="brand"
                            hoverIndicator="brand"
                            label={size === 'small' ? 'Lot' : 'Add film to Lot'}
                            onClick={() => {
                              this.props.checkedMovie(item, false);
                            }}
                          />
                          <Button
                            hoverIndicator="accent-1"
                            label={
                              size === 'small'
                                ? 'Wishlist'
                                : 'Add film to Wishlist'
                            }
                            onClick={() => {
                              this.props.checkedMovie(item, true);
                            }}
                          />
                        </Box>
                        <Button
                          color="accent-3"
                          style={{ borderRadius: 30 }}
                          alignSelf="end"
                          primary={size === 'small'}
                          icon={<Next />}
                          label={size !== 'small' ? 'Details' : undefined}
                          title="Details"
                          onClick={() =>
                            this.props.showMovieDetails(item.movie)
                          }
                        />
                      </Box>
                    )}
                  </Box>
                </Box>
              ))
            )}
          </Box>
        )}
      </ResponsiveContext.Consumer>
    );
  }
}
