import React, { Component } from 'react';
import { Box, Button, Heading, TextInput, Layer } from 'grommet';
import { Add, FormNextLink, BlockQuote } from 'grommet-icons';
import MovieSearchResult from './MovieSearchResult';

export default class AddTitle extends Component {
  state = {
    visible: false,
    searchValue: '',
    searched: false
  };

  search = () => {
    this.setState({
      searched: true
    });
  };

  close = () => {
    this.setState({
      visible: false,
      searchValue: '',
      searched: false
    });
  };

  render() {
    return (
      <Box title="add a film!" align="center">
        <Button
          onClick={() => {
            this.setState({ visible: true });
          }}
          icon={<Add />}
        />
        {this.state.visible ? (
          <Layer
            position="center"
            onClickOutside={() => this.setState({ visible: false })}
          >
            {this.state.searched ? (
              <MovieSearchResult
                search={this.state.searchValue}
                close={this.close}
              />
            ) : (
              <Box
                flex
                pad="medium"
                width="medium"
                background="light-2"
                align="center"
                justify="center"
                overflow="auto"
                round
              >
                <Heading textAlign="center" level="3">
                  search a film to add!
                </Heading>
                <TextInput
                  icon={<BlockQuote />}
                  placeholder="type the title of the film here..."
                  value={this.state.searchValue}
                  onChange={(e) => {
                    this.setState({
                      searchValue: e.target.value
                    });
                  }}
                />
                <Box pad={{ top: 'medium' }}>
                  <Button
                    size="small"
                    hoverIndicator={{
                      color: 'accent-1'
                    }}
                    primary
                    disabled={
                      this.state.searchValue.length === 0 ? true : false
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
