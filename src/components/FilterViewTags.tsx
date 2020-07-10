import React, { Component } from 'react';
import { Button, Box, Text } from 'grommet';
import { FormClose } from 'grommet-icons';
import SelectMultiple from './SelectMultiple';
import SelectSingular from './SelectSingular';

interface FilterViewTagsProps {
  tags: string[];
  createTagSearch?: boolean;
  handleSelectedFilter(selected: string): void;
  handleSelectedTagsToUpdate(tags: number[]): void;
}

const prefix: string = 'create';

export default class FilterViewTags extends Component<FilterViewTagsProps> {
  state: {
    value: string;
    defaultOptions: string[];
    options: string[];
    searchText: string;
  } = {
    value: '',
    defaultOptions: this.props.tags,
    options: [],
    searchText: ''
  };

  componentDidMount = () => {
    this.setState({
      options: this.props.tags
    });
  };

  handleRemoveTag = () => {
    this.setState({
      value: ''
    });
    this.props.handleSelectedFilter('');
  };

  renderTag = (tag: string) => (
    <Button
      key={tag}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        this.handleRemoveTag();
      }}
      onFocus={(event) => event.stopPropagation()}
    >
      <Box
        align="center"
        direction="row"
        gap="xsmall"
        pad={{ vertical: 'xsmall', horizontal: 'small' }}
        margin="xsmall"
        background="accent-1"
        round="large"
      >
        <Text size="small" color="white">
          {tag}
        </Text>
        <Box background="white" round="full" margin={{ left: 'xsmall' }}>
          <FormClose
            color="accent-1"
            size="small"
            style={{ width: '12px', height: '12px' }}
          />
        </Box>
      </Box>
    </Button>
  );

  getRegExp = (text: string) => {
    // The line below escapes regular expression special characters:
    // [ \ ^ $ . | ? * + ( )
    const escapedText = text.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');

    // Create the regular expression with modified value which
    // handles escaping special characters. Without escaping special
    // characters, errors will appear in the console
    return new RegExp(escapedText, 'i');
  };

  updateCreateOption = (text: string) => {
    const len = this.state.defaultOptions.length;
    if (this.state.defaultOptions[len - 1].includes(prefix)) {
      // remove Create option before adding an updated one
      this.state.defaultOptions.pop();
    }
    this.state.defaultOptions.push(`${prefix} '${text}'`);
  };

  handleSelectedFilter = (selected: string) => {
    this.setState({ value: selected });
    this.props.handleSelectedFilter(selected);
  };

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
            plain={true}
            tags={this.props.tags}
            handleSelected={(selected) => this.handleSelectedFilter(selected)}
          />
        ) : (
          <SelectMultiple
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
