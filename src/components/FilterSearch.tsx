import React, { Component } from 'react';
import { ResponsiveContext, Button, Box, Text } from 'grommet';
import { PowerReset } from 'grommet-icons';
import SelectSingular from './SelectSingular';

export type filter = {
  name: string;
  type: string;
};

interface FilterSearchProps {
  filters: filter[];
  mediaTags: string[];
  genreTags: string[];
  ratings: string[];
  handleResetFilters(): void;
  handleFilterByTag(filters: filter[]): void;
  onOpen?(open: boolean): void;
  allowedFilters: boolean[];
  width: number;
}

export default class FilterSearch extends Component<FilterSearchProps> {
  state: {
    selectedFilters: filter[];
    showMediaLayer: boolean;
    showGenreLayer: boolean;
    showRatingsLayer: boolean;
  } = {
    selectedFilters: [],
    showMediaLayer: false,
    showGenreLayer: false,
    showRatingsLayer: false
  };

  componentDidMount = () => {
    this.setState({ selectedFilters: this.props.filters || [] });
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
          background={same ? 'accent-1' : 'light-6'}
          round="large"
          onClick={() => {}}
          hoverIndicator="light-1"
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

  getSelected = (type: string) => {
    const selected: filter = this.state.selectedFilters.filter(
      (filter) => filter.type === type
    )[0];
    if (selected) return selected.name;
    else return '';
  };

  render() {
    return (
      <ResponsiveContext.Consumer>
        {(size) => (
          <Box
            align="center"
            pad={{ horizontal: 'medium', vertical: 'small' }}
            gap="small"
            direction={this.props.width < 1400 ? 'column' : 'row'}
            justify={this.props.width < 1400 ? 'center' : 'between'}
          >
            <Box
              direction={this.props.width < 1400 ? 'column' : 'row'}
              align="center"
              gap="medium"
            >
              <Box direction="row" gap="medium" align="center">
                {this.props.allowedFilters[0] && (
                  <Box gap="xsmall" align="center">
                    <Text textAlign="center" weight="bold">
                      Your Media Tags
                    </Text>
                    <SelectSingular
                      tags={this.props.mediaTags}
                      placeholder="Choose a tag"
                      plain={false}
                      selectedFilter={
                        this.state.selectedFilters.length !== 0
                          ? this.getSelected('media')
                          : ''
                      }
                      handleSelected={(selected) =>
                        this.handleTagSelected(selected, 'media')
                      }
                    />
                  </Box>
                )}
                {this.props.allowedFilters[1] && (
                  <Box gap="xsmall" align="center">
                    <Text textAlign="center" weight="bold">
                      Genre
                    </Text>
                    <SelectSingular
                      tags={this.props.genreTags}
                      placeholder="Choose a genre"
                      plain={false}
                      selectedFilter={
                        this.state.selectedFilters.length !== 0
                          ? this.getSelected('genre')
                          : ''
                      }
                      handleSelected={(selected) =>
                        this.handleTagSelected(selected, 'genre')
                      }
                    />
                  </Box>
                )}
              </Box>
              <Box direction="row" gap="medium" align="center">
                {this.props.allowedFilters[2] && (
                  <Box gap="xsmall" align="center">
                    <Text textAlign="center" weight="bold">
                      Your Ratings
                    </Text>
                    <SelectSingular
                      tags={this.props.ratings}
                      placeholder="Choose a rating"
                      plain={false}
                      selectedFilter={
                        this.state.selectedFilters.length !== 0
                          ? this.getSelected('starCount')
                          : ''
                      }
                      handleSelected={(selected) =>
                        this.handleTagSelected(selected, 'starCount')
                      }
                    />
                  </Box>
                )}
                {this.props.allowedFilters[3] && (
                  <Box gap="xsmall" align="center">
                    <Text textAlign="center" weight="bold">
                      Watched
                    </Text>
                    <SelectSingular
                      tags={['Watched', 'Unwatched']}
                      placeholder="Have you seen it?"
                      plain={false}
                      selectedFilter={
                        this.state.selectedFilters.length !== 0
                          ? this.getSelected('watched')
                          : ''
                      }
                      handleSelected={(selected) =>
                        this.handleTagSelected(selected, 'watched')
                      }
                    />
                  </Box>
                )}
              </Box>
            </Box>
            {this.props.allowedFilters.includes(true, 0) && (
              <Button
                margin="xsmall"
                disabled={this.state.selectedFilters.length === 0}
                alignSelf={this.props.width < 1400 ? 'center' : 'end'}
                onClick={this.handleResetFilters}
                label="Reset filters"
                primary
                hoverIndicator="neutral-3"
                icon={<PowerReset />}
                reverse
              />
            )}
          </Box>
        )}
      </ResponsiveContext.Consumer>
    );
  }
}
