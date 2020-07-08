import React, { Component } from 'react';
import { Box, Select, Button, Text } from 'grommet';
import { FormClose } from 'grommet-icons';

interface MovieViewTagsProps {
  tags: string[];
  backgroundColor?: string;
  handleSelected?(selected: number[]): void;
}

export default class MovieViewTags extends Component<MovieViewTagsProps> {
  state: { selected: number[] } = {
    selected: []
  };

  handleRemoveTag = (tag: string) => {
    const tagIndex = this.props.tags.indexOf(tag);
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
            ? { color: this.props.backgroundColor, side: 'all', size: 'medium' }
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
          plain={true}
          closeOnChange={false}
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
          options={this.props.tags}
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
