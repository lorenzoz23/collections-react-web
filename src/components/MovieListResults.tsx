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
import { Next } from 'grommet-icons';

interface MovieListResultsProps {
  movieList: searchResults;
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
                no film data
              </Text>
            ) : (
              this.props.movieList.movies.map((item) => (
                <Box
                  key={item.movie.id}
                  height={{ min: 'small', max: 'small' }}
                  width={{ min: 'large' }}
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
                    alignSelf="center"
                    round="xsmall"
                  />
                  <Box alignSelf="center">
                    <Heading alignSelf="start" level="3">
                      {item.movie.date
                        ? item.movie.name +
                          ' (' +
                          item.movie.date.substring(0, 4) +
                          ')'
                        : item.movie.name}
                    </Heading>
                    <Box direction="row" gap="small" alignSelf="start">
                      <CheckBox
                        checked={item.checkedLot}
                        label={size === 'small' ? 'lot?' : 'add film to lot?'}
                        onChange={() => {
                          this.props.checkedMovie(item, false);
                        }}
                      />
                      <CheckBox
                        checked={item.checkedWishlist}
                        label={
                          size === 'small'
                            ? 'wishlist?'
                            : 'add film to wishlist?'
                        }
                        onChange={() => {
                          this.props.checkedMovie(item, true);
                        }}
                      />
                      <Button
                        icon={<Next />}
                        title="details"
                        onClick={() => this.props.showMovieDetails(item.movie)}
                      />
                    </Box>
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