import React, { Component } from 'react';
import { Box, Button, Text } from 'grommet';
import { FormPrevious } from 'grommet-icons';
import { filter } from './FilterSearch';

interface MobileRatingsTagsProps {
  ratingsTags: string[];
  onOpen(checked: boolean): void;
  handleFilterByTag(filters: filter[]): void;
}

export default class MobileRatingsTags extends Component<
  MobileRatingsTagsProps
> {
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
      if (filter.name === tag && filter.type === 'starCount') {
        same = true;
      }
    });

    return (
      <Button
        key={tag}
        onClick={() => this.handleTagSelected(tag, 'starCount')}
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

  render() {
    return (
      <Box align="center">
        <Box direction="row" align="center" overflow={{ horizontal: 'auto' }}>
          {this.props.ratingsTags.map((tag) => this.renderTag(tag))}
        </Box>
        <Button
          margin={{ top: 'small' }}
          alignSelf="center"
          icon={<FormPrevious />}
          primary
          style={{ borderRadius: 30 }}
          onClick={() => {
            this.props.onOpen!(false);
          }}
        />
      </Box>
    );
  }
}
