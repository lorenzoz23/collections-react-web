import React, { Component } from 'react';
import { Box, Select, Button, Text } from 'grommet';
import { FormClose } from 'grommet-icons';

interface MovieViewTagsProps {
  tags: string[];
  backgroundColor?: string;
  createTagSearch?: boolean;
  handleSelected?(selected: number[]): void;
}

export default class MovieViewTags extends Component<MovieViewTagsProps> {
  state: { selected: number[]; options: string[]; searchText: string } = {
    selected: [],
    options: this.props.tags,
    searchText: ''
  };

  handleRemoveTag = (tag: string) => {
    const tagIndex = this.state.options.indexOf(tag);
    const updatedSelected: number[] = this.state.selected.filter(
      (selectedTag) => selectedTag !== tagIndex
    );
    if (this.props.handleSelected) {
      this.props.handleSelected(updatedSelected);
    }
    this.setState({
      selected: updatedSelected
    });
  };

  renderTag = (tag: string) => (
    <Button
      key={tag}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        this.handleRemoveTag(tag);
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

  render() {
    return (
      <Box
        align="center"
        justify="center"
        border={
          this.props.backgroundColor
            ? {
                color: this.props.backgroundColor,
                side: 'all',
                size: 'medium'
              }
            : undefined
        }
        background={
          this.props.backgroundColor
            ? { color: this.props.backgroundColor, opacity: 0.5 }
            : undefined
        }
        round
      >
        <Select
          focusIndicator={this.props.backgroundColor ? false : true}
          plain={true}
          closeOnChange={false}
          onSearch={
            this.props.backgroundColor
              ? (text) => {
                  // The line below escapes regular expression special characters:
                  // [ \ ^ $ . | ? * + ( )
                  const escapedText = text.replace(
                    /[-\\^$*+?.()|[\]{}]/g,
                    '\\$&'
                  );

                  // Create the regular expression with modified value which
                  // handles escaping special characters. Without escaping special
                  // characters, errors will appear in the console
                  const exp = new RegExp(escapedText, 'i');
                  this.setState({
                    options: this.props.tags.filter((o) => exp.test(o)),
                    searchText: text
                  });
                }
              : undefined
          }
          onClose={() => this.setState({ options: this.props.tags })}
          searchPlaceholder={
            this.props.backgroundColor && this.props.createTagSearch
              ? 'search to filter/create tags...'
              : this.props.backgroundColor && !this.props.createTagSearch
              ? 'search tags to delete/update...'
              : undefined
          }
          emptySearchMessage={
            this.props.backgroundColor && !this.props.createTagSearch
              ? 'no tags with that title'
              : this.props.backgroundColor && this.props.createTagSearch
              ? 'create tag: ' + this.state.searchText + '?'
              : undefined
          }
          multiple
          value={
            <Box
              wrap
              direction="row"
              width={this.state.selected.length > 4 ? 'medium' : 'small'}
            >
              {this.state.selected && this.state.selected.length ? (
                this.state.selected.map((tag, index) =>
                  this.renderTag(this.props.tags[this.state.selected[index]])
                )
              ) : (
                <Box
                  pad={{ vertical: 'xsmall', horizontal: 'small' }}
                  margin="xsmall"
                >
                  <Text>select tags</Text>
                </Box>
              )}
            </Box>
          }
          options={this.state.options}
          selected={this.state.selected}
          onChange={({ selected: nextSelected }) => {
            const updatedSelected: number[] = [...nextSelected].sort();
            if (this.props.handleSelected) {
              this.props.handleSelected(updatedSelected);
            }
            this.setState({ selected: updatedSelected });
          }}
        />
      </Box>
    );
  }
}
