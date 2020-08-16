import React, { Component } from 'react';
import { Button, Box, Select, Text } from 'grommet';
import { FormClose, Star, Multimedia } from 'grommet-icons';

interface SelectSingularProps {
  tags: string[];
  placeholder: string;
  title?: string;
  plain: boolean;
  handleSelected(selected: string): void;
  selectedFilter: string;
}

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
    this.props.handleSelected('');
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
          title="Clear selected tag"
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

  render() {
    return (
      <Box
        align="center"
        justify="center"
        round={!this.props.plain ? false : true}
        style={{ borderRadius: 5 }}
        title={this.props.title || undefined}
        border={{
          color: this.props.placeholder.includes('rating')
            ? 'accent-4'
            : this.props.placeholder.includes('genre')
            ? 'accent-3'
            : undefined
        }}
      >
        <Select
          icon={
            this.props.placeholder.includes('rating') ? (
              <Star color="plain" />
            ) : this.props.placeholder.includes('genre') ? (
              <Multimedia color="accent-3" />
            ) : undefined
          }
          closeOnChange={true}
          focusIndicator={this.props.plain ? false : true}
          plain={this.props.plain}
          onClose={() => this.setState({ options: this.state.defaultOptions })}
          valueLabel={
            <Box wrap direction="row" width="small">
              {this.state.value && this.state.value.length > 0 ? (
                this.renderTag(this.state.value)
              ) : (
                <Box
                  pad={{ vertical: 'xsmall', horizontal: 'small' }}
                  margin="xsmall"
                >
                  <Text>{this.props.placeholder}</Text>
                </Box>
              )}
            </Box>
          }
          value={this.state.value}
          options={this.state.options}
          onChange={({ option }) => {
            this.setState({ value: option === this.state.value ? '' : option });
            this.props.handleSelected(option);
          }}
        />
      </Box>
    );
  }
}
