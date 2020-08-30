import React, { Component } from 'react';
import {
  Box,
  Select,
  Button,
  Text,
  ResponsiveContext,
  Layer,
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody
} from 'grommet';
import { FormClose, CloudUpload, Inspect } from 'grommet-icons'; // or Save

interface SelectMultipleProps {
  movieTags?: number[];
  movieName?: string;
  title: string;
  placeholder: string;
  tags: string[];
  backgroundColor?: string;
  plain: boolean;
  save: boolean;
  selectedFilters?: number[];
  width?: number;
  handleSelectedTags?(selected: number[]): void;
}

export default class SelectMultiple extends Component<SelectMultipleProps> {
  state: {
    selected: number[];
    tagsChanged: boolean;
    showSelected: boolean;
  } = {
    selected: [],
    tagsChanged: false,
    showSelected: false
  };

  componentDidMount = () => {
    if (this.props.movieTags! && !this.props.selectedFilters) {
      this.setState({
        selected: this.props.movieTags!
      });
    }
    if (this.props.selectedFilters) {
      this.setState({
        selected: this.props.selectedFilters!
      });
    }
  };

  handleRemoveTag = (tag: string) => {
    let updatedSelected: number[] = [];
    if (!tag.includes('tags selected')) {
      const tagIndex = this.props.tags.indexOf(tag);
      updatedSelected = this.state.selected.filter(
        (selectedTag) => selectedTag !== tagIndex
      );
    }
    if (this.props.handleSelectedTags && !this.props.save) {
      this.props.handleSelectedTags(updatedSelected);
    }
    this.setState({
      selected: updatedSelected,
      tagsChanged: true
    });
  };

  renderTag = (tag: string, size: string) => (
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
        pad={{
          vertical: 'xsmall',
          horizontal: size === 'small' ? 'medium' : 'small'
        }}
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
    const tagLabel = `${this.state.selected.length} tags selected`;
    return (
      <ResponsiveContext.Consumer>
        {(size) => (
          <Box
            title={this.props.title}
            direction="row"
            align="center"
            justify="center"
            gap={this.props.save ? 'small' : 'none'}
            round
            background={this.props.backgroundColor}
          >
            <Select
              dropAlign={
                size === 'large' || size === 'xlarge'
                  ? { top: 'top', right: 'left' }
                  : undefined
              }
              focusIndicator={this.props.plain ? false : true}
              plain={this.props.plain}
              closeOnChange={false}
              emptySearchMessage="No tags found :("
              multiple
              valueLabel={
                <Box wrap direction="row" width="small">
                  {this.state.selected && this.state.selected.length ? (
                    this.state.selected.length <= (this.props.save ? 2 : 1) ? (
                      this.state.selected.map((index) =>
                        this.renderTag(this.props.tags[index], size)
                      )
                    ) : (
                      this.renderTag(tagLabel, size)
                    )
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
              value={this.state.selected}
              options={this.props.tags}
              selected={this.state.selected}
              onChange={({ selected: nextSelected }) => {
                const updatedSelected: number[] = [...nextSelected].sort();
                if (this.props.handleSelectedTags && !this.props.save) {
                  this.props.handleSelectedTags(updatedSelected);
                }
                this.setState({
                  selected: updatedSelected,
                  tagsChanged: true
                });
              }}
            />
            {this.props.save &&
              this.state.selected.length > 2 &&
              !this.state.tagsChanged && (
                <Button
                  label={
                    size === 'small' && this.props.width! < 400
                      ? undefined
                      : 'View selected tags'
                  }
                  alignSelf="center"
                  hoverIndicator="accent-1"
                  icon={
                    size === 'small' && this.props.width! < 400 ? (
                      <Inspect />
                    ) : undefined
                  }
                  onClick={() => this.setState({ showSelected: true })}
                />
              )}
            {this.props.save && this.state.tagsChanged && (
              <Button
                primary
                alignSelf="center"
                hoverIndicator="accent-1"
                icon={
                  size === 'small' && this.props.width! < 400 ? (
                    <CloudUpload />
                  ) : undefined
                }
                label={
                  size === 'small' && this.props.width! < 400
                    ? undefined
                    : 'Save tags'
                }
                onClick={() => {
                  this.setState({ tagsChanged: false });
                  this.props.handleSelectedTags!(this.state.selected);
                }}
              />
            )}
            {this.state.showSelected && (
              <Layer
                position={size === 'small' ? 'bottom' : 'center'}
                onClickOutside={() => this.setState({ showSelected: false })}
                responsive={false}
                style={{ borderRadius: 30 }}
              >
                <Box
                  pad="medium"
                  align="center"
                  gap="small"
                  background={{ color: 'accent-1', opacity: 'weak' }}
                  round
                  border={{
                    size: 'medium',
                    side: 'all',
                    color: 'accent-3',
                    style: 'outset'
                  }}
                >
                  <Box align="center">
                    <Text textAlign="center">
                      You own {this.props.movieName || 'this title'}
                    </Text>
                    <Text textAlign="center">on</Text>
                  </Box>
                  <Table alignSelf="center">
                    <TableHeader>
                      <TableRow>
                        <TableCell scope="col" border="bottom">
                          <Text weight="bold">Media Type</Text>
                        </TableCell>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {this.state.selected.map((index) => (
                        <TableRow>
                          <TableCell scope="row">
                            <Text>{this.props.tags[index]}</Text>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              </Layer>
            )}
          </Box>
        )}
      </ResponsiveContext.Consumer>
    );
  }
}
