import React, { Component } from 'react';
import { Box, Select, Button, Text } from 'grommet';
import { FormClose } from 'grommet-icons';

interface SelectMultipleProps {
  tags: string[];
  backgroundColor?: string;
  plain: boolean;
  handleSelectedTags?(selected: number[]): void;
}

export default class SelectMultiple extends Component<SelectMultipleProps> {
  state: {
    selected: number[];
  } = {
    selected: []
  };

  handleRemoveTag = (tag: string) => {
    const tagIndex = this.props.tags.indexOf(tag);
    const updatedSelected: number[] = this.state.selected.filter(
      (selectedTag) => selectedTag !== tagIndex
    );
    if (this.props.handleSelectedTags) {
      this.props.handleSelectedTags(updatedSelected);
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
        round
        background={this.props.backgroundColor}
      >
        <Select
          dropAlign={{ top: 'top', right: 'left' }}
          focusIndicator={this.props.plain ? false : true}
          plain={this.props.plain}
          closeOnChange={false}
          multiple
          valueLabel={
            <Box
              wrap
              direction="row"
              width={this.state.selected.length > 4 ? 'medium' : 'small'}
            >
              {this.state.selected && this.state.selected.length ? (
                this.state.selected.map((index) =>
                  this.renderTag(this.props.tags[index])
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
          value={this.state.selected}
          options={this.props.tags}
          selected={this.state.selected}
          onChange={({ selected: nextSelected }) => {
            const updatedSelected: number[] = [...nextSelected].sort();
            if (this.props.handleSelectedTags) {
              this.props.handleSelectedTags(updatedSelected);
            }
            this.setState({
              selected: updatedSelected
            });
          }}
        />
      </Box>
    );
  }
}
