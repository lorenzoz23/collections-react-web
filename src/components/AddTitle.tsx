import React, { Component } from 'react';
import {
  Box,
  Button,
  Heading,
  TextInput,
  Layer,
  FormField,
  ResponsiveContext,
  Form
} from 'grommet';
import {
  FormNextLink,
  FormClose,
  CircleQuestion,
  Refresh
} from 'grommet-icons';

import MovieSearchResult, { searchResults } from './MovieSearchResult';
import { movie } from './HomePage';
import { TooltipButton } from './TooltipButton';

interface AddTitleProps {
  moviesAdded(lotMovies: movie[], wishlistMovies: movie[]): void;
  parsed?: boolean;
  movieList?: searchResults;
  handleFinishedImport?(): void;
  handleClose?(): void;
  title?: string;
  width: number;
}

export default class AddTitle extends Component<AddTitleProps> {
  state = {
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
      searchTitle: '',
      searchYear: '',
      searched: false
    });
    this.props.handleClose!();
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
      if (data.backdrops[i]) {
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
      let rating: string = 'NR';
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
    if (this.props.parsed) this.props.handleFinishedImport!();
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
          <Box align="center">
            {this.props.parsed ? (
              <Layer
                position="center"
                responsive={
                  size === 'small' && this.props.width < 700 ? true : false
                }
                onClickOutside={this.closeAddTitle}
              >
                <MovieSearchResult
                  back={false}
                  imports={this.props.movieList}
                  closeAdd={this.props.handleFinishedImport!}
                  parsed={true}
                  moviesAdded={(lotMovies: movie[], wishlistMovies: movie[]) =>
                    this.moviesAdded(lotMovies, wishlistMovies)
                  }
                />
              </Layer>
            ) : (
              <Layer
                style={{
                  borderRadius:
                    (size !== 'small' && !this.state.searched) ||
                    (size === 'small' && this.props.width > 700)
                      ? 30
                      : 0
                }}
                position="center"
                responsive={
                  size === 'small' && this.props.width < 700 ? true : false
                }
                onClickOutside={this.closeAddTitle}
              >
                {this.state.searched || this.props.title?.length! > 0 ? (
                  <MovieSearchResult
                    back={this.props.title ? false : true}
                    parsed={false}
                    title={this.props.title || this.state.searchTitle}
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
                    align="center"
                    justify="center"
                    overflow="auto"
                    background="layer"
                    round={
                      size === 'small' && this.props.width < 700 ? false : true
                    }
                    border={{ size: 'small', side: 'all', color: 'accent-1' }}
                  >
                    <Heading textAlign="center" level="3">
                      Search a film to add!
                    </Heading>
                    <Box gap="small" align="center">
                      <Form
                        onSubmit={this.search}
                        onReset={() =>
                          this.setState({ searchTitle: '', searchYear: '' })
                        }
                      >
                        <FormField label="Title">
                          <TextInput
                            autoFocus
                            placeholder="Parasite"
                            value={this.state.searchTitle}
                            onChange={(e) => {
                              this.setState({
                                searchTitle: e.target.value
                              });
                            }}
                          />
                        </FormField>
                        <FormField label="Year">
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
                        <Box direction="row" justify="between">
                          <Button
                            style={{ borderRadius: 100 }}
                            size="small"
                            type="submit"
                            hoverIndicator="accent-1"
                            primary
                            disabled={
                              this.state.searchTitle.length === 0 ? true : false
                            }
                            icon={<FormNextLink />}
                          />
                          <Button
                            icon={<Refresh />}
                            type="reset"
                            style={{ borderRadius: 100 }}
                            size="small"
                            hoverIndicator="accent-1"
                            primary
                            disabled={
                              this.state.searchTitle.length === 0 &&
                              this.state.searchYear.length === 0
                                ? true
                                : false
                            }
                          />
                        </Box>
                      </Form>
                    </Box>
                    <Box>
                      {size === 'small' ? (
                        <Box alignContent="center">
                          <Button
                            icon={<FormClose />}
                            onClick={this.props.handleClose}
                          />
                          <TooltipButton
                            width={this.props.width}
                            title=""
                            icon={<CircleQuestion />}
                            focus={true}
                          />
                        </Box>
                      ) : (
                        <TooltipButton
                          width={this.props.width}
                          title=""
                          icon={<CircleQuestion />}
                          focus={false}
                        />
                      )}
                    </Box>
                  </Box>
                )}
              </Layer>
            )}
          </Box>
        )}
      </ResponsiveContext.Consumer>
    );
  }
}
