import React, { Component } from 'react';
import { Box, Button, Heading, TextInput, Layer, FormField } from 'grommet';
import firebase from 'firebase/app';
import 'firebase/database';
import { Add, FormNextLink } from 'grommet-icons';

import MovieSearchResult from './MovieSearchResult';
import { movie } from './HomePage';

interface AddTitleProps {
  moviesAdded(movies: movie[]): void;
  uid: string;
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

  moviesAdded = (movies: movie[]) => {
    this.closeAddTitle();

    let userCollection: any[] = [];
    let lot: movie[] = [];

    const userRef = firebase.database().ref('/users/' + this.props.uid);
    userRef.once('value').then((snapshot) => {
      userCollection = snapshot.val() && snapshot.val().collection;
      if (userCollection) {
        lot = userCollection.map((movie) => {
          const entry: movie = {
            name: movie.name,
            plot: movie.plot,
            date: movie.date,
            poster: movie.poster,
            id: movie.id
          };
          return entry;
        });
        movies.forEach((element) => {
          lot.push(element);
        });
        userRef.set({
          collection: lot
        });
      } else {
        userRef.set({
          collection: movies
        });
      }
    });

    this.props.moviesAdded(movies);
  };

  render() {
    return (
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
            style={{ borderRadius: 30 }}
            position="center"
            responsive={false}
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
                moviesAdded={(movies: movie[]) => this.moviesAdded(movies)}
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
                round
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
                <Box pad={{ top: 'medium' }}>
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
                </Box>
              </Box>
            )}
          </Layer>
        ) : null}
      </Box>
    );
  }
}
