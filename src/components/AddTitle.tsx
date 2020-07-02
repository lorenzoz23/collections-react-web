import React, { Component } from 'react';
import {
  Box,
  Button,
  Heading,
  TextInput,
  Layer,
  FormField,
  ResponsiveContext
} from 'grommet';
import { Add, FormNextLink, FormClose } from 'grommet-icons';

import MovieSearchResult from './MovieSearchResult';
import { movie } from './HomePage';

interface AddTitleProps {
  moviesAdded(lotMovies: movie[], wishlistMovies: movie[]): void;
}

export default class AddTitle extends Component<AddTitleProps> {
  state = {
    visible: false,
    searchTitle: '',
    searchYear: '',
    searched: false
  };

  search = () => {
    this.setState({
      searched: true
    });
  };

  closeAddTitle = () => {
    this.setState({
      visible: false,
      searchTitle: '',
      searchYear: '',
      searched: false
    });
  };

  closeMovieSearchResult = () => {
    this.setState({
      searchTitle: '',
      searchYear: '',
      searched: false
    });
  };

  updateMovieFields = async (movies: movie[]) => {
    let updatedMovies: movie[] = [];
    for (let n = 0; n < movies.length; n++) {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movies[n].id}?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US&append_to_response=release_dates`
      );
      const data = await response.json();
      let rating: string = '?';
      let found: boolean = false;
      for (let i = 0; i < data.release_dates.results.length; i++) {
        if (!found) {
          console.log(data.release_dates.results[i]);
          if (data.release_dates.results[i].iso_3166_1 === 'US') {
            for (
              let j = 0;
              j < data.release_dates.results[i].release_dates.length;
              j++
            ) {
              console.log(data.release_dates.results[i].release_dates);
              if (
                data.release_dates.results[i].release_dates[j].certification
                  .length > 0
              ) {
                rating =
                  data.release_dates.results[i].release_dates[j].certification;
                found = true;
                break;
              }
            }
          }
        } else break;
      }
      movies[n].rating = rating;
      movies[n].runtime = data.runtime;
      movies[n].genre = data.genres.map((genre: any) => {
        return genre.name;
      });
      updatedMovies.push(movies[n]);
    }
    return updatedMovies;
  };

  moviesAdded = async (lotMovies: movie[], wishlistMovies: movie[]) => {
    this.closeAddTitle();
    let updatedLotMovies: movie[] = [];
    let updatedWishlistMovies: movie[] = [];
    if (lotMovies) {
      updatedLotMovies = await this.updateMovieFields(lotMovies);
    }
    if (wishlistMovies) {
      updatedWishlistMovies = await this.updateMovieFields(wishlistMovies);
    }

    this.props.moviesAdded(updatedLotMovies, updatedWishlistMovies);
  };

  render() {
    return (
      <ResponsiveContext.Consumer>
        {(size) => (
          <Box title="add a film!" align="center">
            <Button
              focusIndicator={false}
              hoverIndicator="accent-1"
              onClick={() => {
                this.setState({ visible: true });
              }}
              icon={<Add />}
            />
            {this.state.visible ? (
              <Layer
                style={{ borderRadius: size === 'small' ? 0 : 30 }}
                position="center"
                responsive={size === 'small' ? true : false}
                onClickOutside={() => {
                  this.setState({ visible: false });
                }}
              >
                {this.state.searched ? (
                  <MovieSearchResult
                    title={this.state.searchTitle}
                    year={this.state.searchYear}
                    closeAdd={this.closeAddTitle}
                    closeResult={this.closeMovieSearchResult}
                    moviesAdded={(
                      lotMovies: movie[],
                      wishlistMovies: movie[]
                    ) => this.moviesAdded(lotMovies, wishlistMovies)}
                  />
                ) : (
                  <Box
                    flex
                    pad="medium"
                    width="medium"
                    background="layer"
                    align="center"
                    justify="center"
                    overflow="auto"
                    fill
                    round={size === 'small' ? false : true}
                  >
                    <Heading textAlign="center" level="3">
                      search a film to add!
                    </Heading>
                    <Box gap="small">
                      <FormField label="title">
                        <TextInput
                          placeholder="parasite"
                          value={this.state.searchTitle}
                          onChange={(e) => {
                            this.setState({
                              searchTitle: e.target.value
                            });
                          }}
                        />
                      </FormField>
                      <FormField label="year">
                        <TextInput
                          title="recommended for better results"
                          placeholder="2019"
                          value={this.state.searchYear}
                          onChange={(e) => {
                            this.setState({
                              searchYear: e.target.value
                            });
                          }}
                        />
                      </FormField>
                    </Box>
                    <Box
                      pad={{ top: 'medium' }}
                      gap={size === 'small' ? 'medium' : 'none'}
                    >
                      <Button
                        style={{ borderRadius: 100 }}
                        size="small"
                        hoverIndicator={{
                          color: 'accent-1'
                        }}
                        primary
                        disabled={
                          this.state.searchTitle.length === 0 ? true : false
                        }
                        icon={<FormNextLink />}
                        onClick={() => {
                          this.search();
                        }}
                      />
                      {size === 'small' ? (
                        <Button
                          icon={<FormClose />}
                          onClick={() => {
                            this.setState({ visible: false });
                          }}
                        />
                      ) : null}
                    </Box>
                  </Box>
                )}
              </Layer>
            ) : null}
          </Box>
        )}
      </ResponsiveContext.Consumer>
    );
  }
}
