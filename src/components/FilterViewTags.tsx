import React, { Component } from 'react';
import { Box } from 'grommet';
import SelectMultiple from './SelectMultiple';
import SelectSingular from './SelectSingular';

interface FilterViewTagsProps {
  tags: string[];
  createTagSearch?: boolean;
  handleSelectedFilter(selected: string, created: boolean): void;
  handleSelectedTagsToUpdate(tags: number[]): void;
  selectedFilter?: string;
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
            selectedFilter={this.props.selectedFilter!}
            plain={true}
            tags={this.props.tags}
            handleSelected={(selected, created) =>
              this.props.handleSelectedFilter(selected, created)
            }
          />
        ) : (
          <SelectMultiple
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
