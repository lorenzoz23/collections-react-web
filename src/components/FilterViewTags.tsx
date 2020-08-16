import React, { Component } from 'react';
import { Box } from 'grommet';
import SelectMultiple from './SelectMultiple';
import SelectSingular from './SelectSingular';

interface FilterViewTagsProps {
  tags: string[];
  createTagSearch?: boolean;
  handleSelectedFilter(selected: string): void;
  handleSelectedTagsToUpdate(tags: number[]): void;
  selectedFilter?: string;
  selectedFilters?: number[];
}

export default class FilterViewTags extends Component<FilterViewTagsProps> {
  render() {
    return (
      <Box
        align="center"
        justify="center"
        border={{
          color: 'header',
          side: 'all',
          size: 'medium'
        }}
        background={{ color: 'header', opacity: 0.5 }}
        round
      >
        {this.props.createTagSearch ? (
          <SelectSingular
            placeholder="Select media tags"
            title="Filter your films with a tag or start typing to create one!"
            selectedFilter={this.props.selectedFilter!}
            plain={true}
            tags={this.props.tags}
            handleSelected={(selected) =>
              this.props.handleSelectedFilter(selected)
            }
          />
        ) : (
          <SelectMultiple
            placeholder="Select tags to edit"
            selectedFilters={this.props.selectedFilters!}
            title="Select a tag to delete or update!"
            save={false}
            plain={true}
            tags={this.props.tags}
            handleSelectedTags={(tags) =>
              this.props.handleSelectedTagsToUpdate(tags)
            }
          />
        )}
      </Box>
    );
  }
}
