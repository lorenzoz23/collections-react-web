import React, { Component } from 'react';
import { Box, Select, Button, Text } from 'grommet';
import { FormClose } from 'grommet-icons';

interface SelectMultipleProps {
  movieTags?: string[];
  tags: string[];
  backgroundColor?: string;
  plain: boolean;
  save: boolean;
  handleSelectedTags?(selected: number[]): void;
}

export default class SelectMultiple extends Component<SelectMultipleProps> {
  state: {
    selected: number[];
  } = {
    selected: []
  };

  componentDidMount = () => {
    let selectedTags: number[] = [];
    this.props.movieTags!.forEach((tag) => {
      selectedTags.push(this.props.tags.indexOf(tag));
    });
    this.setState({
      selected: selectedTags
    });
  };

  handleRemoveTag = (tag: string) => {
    const tagIndex = this.props.tags.indexOf(tag);
    const updatedSelected: number[] = this.state.selected.filter(
      (selectedTag) => selectedTag !== tagIndex
    );
    if (this.props.handleSelectedTags && !this.props.save) {
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
        direction="row"
        align="center"
        justify="center"
        gap={this.props.save ? 'small' : 'none'}
        round
        background={this.props.backgroundColor}
      >
        <Select
          dropAlign={{ top: 'top', right: 'left' }}
          focusIndicator={this.props.plain ? false : true}
          plain={this.props.plain}
          closeOnChange={false}
          emptySearchMessage="no tags found :("
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
            if (this.props.handleSelectedTags && !this.props.save) {
              this.props.handleSelectedTags(updatedSelected);
            }
            this.setState({
              selected: updatedSelected
            });
          }}
        />
        {this.props.save && (
          <Button
            alignSelf="center"
            label="save"
            onClick={() => this.props.handleSelectedTags!(this.state.selected)}
          />
        )}
      </Box>
    );
  }
}
