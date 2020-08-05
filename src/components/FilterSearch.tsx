import React, { Component } from 'react';
import { ResponsiveContext, Button, Box, Text } from 'grommet';
import { PowerReset } from 'grommet-icons';
import SelectSingular from './SelectSingular';

export type filter = {
  name: string;
  type: string;
};

interface FilterSearchProps {
  mediaTags: string[];
  genreTags: string[];
  ratings: string[];
  handleResetFilters(): void;
  handleFilterByTag(filters: filter[]): void;
}

export default class FilterSearch extends Component<FilterSearchProps> {
  state: { selectedFilters: filter[] } = {
    selectedFilters: []
  };

  handleTagSelected = (tag: string, type: string) => {
    let newFilters = this.state.selectedFilters;
    const filter: filter = {
      name: tag,
      type: type
    };
    let sameType: boolean = false;
    newFilters.forEach((filter) => {
      if (filter.type === type) {
        sameType = true;
      }
    });
    let sameName: boolean = false;
    newFilters.forEach((filter) => {
      if (filter.name === tag) {
        sameName = true;
      }
    });
    if (sameName && sameType) {
      newFilters = newFilters.filter((filter) => filter.name !== tag);
    } else if (sameType && !sameName) {
      if (tag === '') {
        newFilters = newFilters.filter((filter) => filter.type !== type);
      } else {
        newFilters = newFilters.filter((filter) => filter.type !== type);
        newFilters.push(filter);
      }
    } else {
      newFilters.push(filter);
    }

    this.setState({ selectedFilters: newFilters });
    this.props.handleFilterByTag(newFilters);
  };

  renderTag = (tag: string) => {
    let same: boolean = false;
    this.state.selectedFilters.forEach((filter) => {
      if (filter.name === tag && filter.type === 'media') {
        same = true;
      }
    });

    return (
      <Button
        key={tag}
        onClick={() => this.handleTagSelected(tag, 'media')}
        focusIndicator={false}
      >
        <Box
          align="center"
          pad={{
            vertical: 'xsmall',
            horizontal: 'medium'
          }}
          margin="xsmall"
          background={same ? 'accent-1' : 'light-4'}
          round="large"
        >
          <Text weight="bold" textAlign="center">
            {tag}
          </Text>
        </Box>
      </Button>
    );
  };

  handleResetFilters = () => {
    const empty: filter[] = [];
    this.setState({
      selectedFilters: empty
    });
    this.props.handleResetFilters();
  };

  render() {
    return (
      <ResponsiveContext.Consumer>
        {(size) => (
          <Box
            direction="row"
            justify="between"
            align="center"
            pad={{ horizontal: 'medium', vertical: 'small' }}
          >
            <Box direction="row" align="center" gap="medium">
              <Box gap="xsmall" align="center">
                <Text textAlign="center" color="light-4" weight="bold">
                  Your Media Tags
                </Text>
                <Box direction="row" align="center">
                  {this.props.mediaTags.map((tag) => this.renderTag(tag))}
                </Box>
              </Box>
              <Box gap="xsmall" align="center">
                <Text textAlign="center" color="light-4" weight="bold">
                  Genre
                </Text>
                <SelectSingular
                  tags={this.props.genreTags}
                  placeholder="Filter by genre"
                  plain={false}
                  selectedFilter={''}
                  handleSelected={(selected) =>
                    this.handleTagSelected(selected, 'genre')
                  }
                />
              </Box>
              <Box gap="xsmall" align="center">
                <Text textAlign="center" color="light-4" weight="bold">
                  Your Ratings
                </Text>
                <SelectSingular
                  tags={this.props.ratings}
                  placeholder="Filter by star count"
                  plain={false}
                  selectedFilter={''}
                  handleSelected={(selected) =>
                    this.handleTagSelected(selected, 'starCount')
                  }
                />
              </Box>
            </Box>
            <Button
              margin="xsmall"
              disabled={this.state.selectedFilters.length === 0}
              alignSelf="end"
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
