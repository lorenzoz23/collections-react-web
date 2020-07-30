import React, { Component } from 'react';
import { Button, Box, Select, Text } from 'grommet';
import { FormClose } from 'grommet-icons';

interface SelectSingularProps {
  tags: string[];
  title: string;
  plain: boolean;
  handleSelected(selected: string, created: boolean): void;
  selectedFilter: string;
}

const prefix: string = 'create';

export default class SelectSingular extends Component<SelectSingularProps> {
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
      options: this.props.tags,
      value: this.props.selectedFilter
    });
  };

  handleRemoveTag = () => {
    this.setState({
      value: ''
    });
    this.props.handleSelected('', false);
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
        <Box
          background="white"
          round="full"
          margin={{ left: 'xsmall' }}
          title="clear tag"
        >
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
    if (len > 0 && this.state.defaultOptions[len - 1].includes(prefix)) {
      // remove Create option before adding an updated one
      this.state.defaultOptions.pop();
    }
    this.state.defaultOptions.push(`${prefix} '${text}'`);
  };

  render() {
    return (
      <Box align="center" justify="center" round title={this.props.title}>
        <Select
          closeOnChange={true}
          focusIndicator={this.props.plain ? false : true}
          plain={this.props.plain}
          onSearch={(text) => {
            this.updateCreateOption(text);
            const exp = this.getRegExp(text);
            this.setState({
              options: this.state.defaultOptions.filter((o) => exp.test(o)),
              searchText: text
            });
          }}
          onClose={() => this.setState({ options: this.state.defaultOptions })}
          searchPlaceholder="filter films/create tags..."
          emptySearchMessage="no tags found :("
          valueLabel={
            <Box wrap direction="row" width="small">
              {this.state.value && this.state.value.length > 0 ? (
                this.renderTag(this.state.value)
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
          value={this.state.value}
          options={this.state.options.filter(
            (selectedTag) => selectedTag !== "create ''"
          )}
          onChange={({ option }) => {
            if (option.includes(prefix)) {
              this.state.defaultOptions.pop();
              this.state.defaultOptions.push(this.state.searchText);
              this.props.handleSelected(this.state.searchText, true);
              //this.setState({ value: this.state.searchText });
            } else {
              this.setState({ value: option });
              this.props.handleSelected(option, false);
            }
          }}
        />
      </Box>
    );
  }
}
