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
import { Add, FormNextLink, FormClose, CircleQuestion } from 'grommet-icons';

import MovieSearchResult from './MovieSearchResult';
import { movie } from './HomePage';
import { TooltipButton } from './TooltipButton';

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

  getBackDrops = async (movie: movie) => {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movie.id}/images?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US&include_image_language=include_image_language%3Den%2Cnull`
    );
    const data = await response.json();
    const images: string[] = [];
    let image: string = '';
    for (let i = 0; i < 3; i++) {
      if (data.backdrops[i].file_path) {
        image =
          'https://image.tmdb.org/t/p/original' + data.backdrops[i].file_path;
        images.push(image);
      }
    }

    return images;
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
      movies[n].backDrop = await this.getBackDrops(movies[n]);
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
                    fill={size === 'small' ? true : false}
                    pad="medium"
                    width="medium"
                    background="layer"
                    align="center"
                    justify="center"
                    overflow="auto"
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
                      gap={size === 'small' ? 'medium' : 'small'}
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
                        <Box alignContent="center">
                          <Button
                            icon={<FormClose />}
                            onClick={() => {
                              this.setState({ visible: false });
                            }}
                          />
                          <TooltipButton
                            title=""
                            icon={<CircleQuestion />}
                            focus={true}
                          />
                        </Box>
                      ) : (
                        <TooltipButton
                          title=""
                          icon={<CircleQuestion />}
                          focus={false}
                        />
                      )}
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
