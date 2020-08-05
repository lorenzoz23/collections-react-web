import React, { Component } from 'react';
import { ResponsiveContext, Button, Box, Text } from 'grommet';
import { PowerReset } from 'grommet-icons';

interface FilterSearchProps {
  tags: string[];
  handleResetFilters(): void;
  handleFilterByTag(tag: string): void;
}

export default class FilterSearch extends Component<FilterSearchProps> {
  state = {
    selectedTag: ''
  };

  handleTagSelected = (tag: string) => {
    this.setState({ selectedTag: tag === this.state.selectedTag ? '' : tag });
    this.props.handleFilterByTag(tag === this.state.selectedTag ? '' : tag);
  };

  renderTag = (tag: string) => (
    <Button
      key={tag}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        this.handleTagSelected(tag);
      }}
      focusIndicator={false}
      onFocus={(event) => event.stopPropagation()}
    >
      <Box
        align="center"
        pad={{
          vertical: 'xsmall',
          horizontal: 'medium'
        }}
        margin="xsmall"
        background={tag === this.state.selectedTag ? 'accent-1' : 'light-4'}
        round="large"
      >
        <Text weight="bold" textAlign="center">
          {tag}
        </Text>
      </Box>
    </Button>
  );

  handleResetFilters = () => {
    this.setState({
      selectedTag: ''
    });
    this.props.handleResetFilters();
  };

  render() {
    return (
      <ResponsiveContext.Consumer>
        {(size) => (
          <Box
            direction="row"
            align="center"
            pad={{ horizontal: 'medium', vertical: 'small' }}
          >
            <Box direction="row" align="center">
              {this.props.tags.map((tag) => this.renderTag(tag))}
            </Box>
            <Button
              margin="xsmall"
              disabled={!this.state.selectedTag}
              alignSelf="center"
              onClick={this.handleResetFilters}
              label="Reset filters"
              hoverIndicator="accent-1"
              icon={<PowerReset />}
              reverse
            />
          </Box>
        )}
      </ResponsiveContext.Consumer>
    );
  }
}
