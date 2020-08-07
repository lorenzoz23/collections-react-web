import React, { Component } from 'react';
import { ResponsiveContext, Button, Box, Text } from 'grommet';
import {
  PowerReset,
  Tag,
  FormNext,
  Aed,
  Star,
  FormPrevious
} from 'grommet-icons';
import SelectSingular from './SelectSingular';

export type filter = {
  name: string;
  type: string;
};

interface FilterSearchProps {
  mediaTags: string[];
  genreTags: string[];
  ratings: string[];
  handleResetFilters(): void;
  handleFilterByTag(filters: filter[]): void;
  onOpen?(open: boolean): void;
  allowedFilters: boolean[];
  width: number;
}

export default class FilterSearch extends Component<FilterSearchProps> {
  state: {
    selectedFilters: filter[];
    showMediaLayer: boolean;
    showGenreLayer: boolean;
    showRatingsLayer: boolean;
  } = {
    selectedFilters: [],
    showMediaLayer: false,
    showGenreLayer: false,
    showRatingsLayer: false
  };

  handleTagSelected = (tag: string, type: string) => {
    let newFilters = this.state.selectedFilters;
    const filter: filter = {
      name: tag,
      type: type
    };
    let sameType: boolean = false;
    newFilters.forEach((filter) => {
      if (filter.type === type) {
        sameType = true;
      }
    });
    let sameName: boolean = false;
    newFilters.forEach((filter) => {
      if (filter.name === tag) {
        sameName = true;
      }
    });
    if (sameName && sameType) {
      newFilters = newFilters.filter((filter) => filter.name !== tag);
    } else if (sameType && !sameName) {
      if (tag === '') {
        newFilters = newFilters.filter((filter) => filter.type !== type);
      } else {
        newFilters = newFilters.filter((filter) => filter.type !== type);
        newFilters.push(filter);
      }
    } else {
      newFilters.push(filter);
    }

    this.setState({ selectedFilters: newFilters });
    this.props.handleFilterByTag(newFilters);
  };

  renderTag = (tag: string) => {
    let same: boolean = false;
    this.state.selectedFilters.forEach((filter) => {
      if (filter.name === tag && filter.type === 'media') {
        same = true;
      }
    });

    return (
      <Button
        key={tag}
        onClick={() => this.handleTagSelected(tag, 'media')}
        focusIndicator={false}
      >
        <Box
          align="center"
          pad={{
            vertical: 'xsmall',
            horizontal: 'medium'
          }}
          margin="xsmall"
          background={same ? 'accent-1' : 'light-6'}
          round="large"
          onClick={() => {}}
          hoverIndicator="light-1"
        >
          <Text weight="bold" textAlign="center">
            {tag}
          </Text>
        </Box>
      </Button>
    );
  };

  handleResetFilters = () => {
    const empty: filter[] = [];
    this.setState({
      selectedFilters: empty
    });
    this.props.handleResetFilters();
  };

  render() {
    return (
      <ResponsiveContext.Consumer>
        {(size) => (
          <Box>
            {size === 'small' && this.props.width < 700 ? (
              <Box>
                {this.state.showMediaLayer && (
                  <Box gap="xsmall" align="center">
                    <Box
                      direction="row"
                      align="center"
                      overflow={{ horizontal: 'auto' }}
                    >
                      {this.props.mediaTags.map((tag) => this.renderTag(tag))}
                    </Box>
                    <Button
                      margin={{ top: 'medium' }}
                      alignSelf="center"
                      icon={<FormPrevious />}
                      primary
                      style={{ borderRadius: 30 }}
                      onClick={() => {
                        this.setState({ showMediaLayer: false });
                        this.props.onOpen!(false);
                      }}
                    />
                  </Box>
                )}
                {this.state.showGenreLayer && (
                  <Box
                    background={{ color: 'neutral-3', opacity: 'medium' }}
                    round
                    pad={{ bottom: 'medium', horizontal: 'medium' }}
                    gap="xsmall"
                    border="between"
                    overflow={{ vertical: 'scroll' }}
                  >
                    {this.props.genreTags.map((genre) => (
                      <Box
                        margin={{ vertical: 'small', right: 'small' }}
                        pad={{
                          left: 'small',
                          top: 'medium',
                          bottom: 'medium',
                          right: 'medium'
                        }}
                        key={genre}
                      >
                        <Text>{genre}</Text>
                      </Box>
                    ))}
                    <Button
                      margin={{ top: 'medium' }}
                      alignSelf="center"
                      icon={<FormPrevious />}
                      primary
                      style={{ borderRadius: 30 }}
                      onClick={() => {
                        this.setState({ showGenreLayer: false });
                        this.props.onOpen!(false);
                      }}
                    />
                  </Box>
                )}
                {this.state.showRatingsLayer && (
                  <Box gap="xsmall">
                    <Text size="small" textAlign="center">
                      Note: This is based off of your own ratings!
                    </Text>
                    <Box
                      background={{ color: 'accent-3', opacity: 'medium' }}
                      round
                      gap="xsmall"
                      border="between"
                      overflow={{ vertical: 'scroll' }}
                      pad={{ bottom: 'medium', horizontal: 'medium' }}
                    >
                      {this.props.ratings.map((rating) => (
                        <Box
                          margin={{ vertical: 'small', right: 'small' }}
                          pad={{
                            left: 'small',
                            top: 'medium',
                            bottom: 'medium',
                            right: 'medium'
                          }}
                          key={rating}
                        >
                          <Text>{rating}</Text>
                        </Box>
                      ))}
                    </Box>
                    <Button
                      margin={{ top: 'small' }}
                      alignSelf="center"
                      icon={<FormPrevious />}
                      primary
                      style={{ borderRadius: 30 }}
                      onClick={() => {
                        this.setState({ showRatingsLayer: false });
                        this.props.onOpen!(false);
                      }}
                    />
                  </Box>
                )}
                {!this.state.showGenreLayer &&
                  !this.state.showMediaLayer &&
                  !this.state.showRatingsLayer && (
                    <Box gap="small">
                      <Box
                        round
                        background={{ color: 'brand', opacity: 'medium' }}
                        direction="row"
                        justify="between"
                        border={{ color: 'brand', side: 'all', size: 'small' }}
                        pad={{
                          left: 'small',
                          top: 'medium',
                          bottom: 'medium',
                          right: 'medium'
                        }}
                        onClick={() => {
                          this.props.onOpen!(true);
                          this.setState({
                            showMediaLayer: true,
                            showGenreLayer: false,
                            showRatingsLayer: false
                          });
                        }}
                      >
                        <Box direction="row" gap="small">
                          <Text weight="bold">Your Media Tags</Text>
                          <Tag color="dark-2" />
                        </Box>
                        <FormNext color="dark-2" />
                      </Box>
                      <Box
                        round
                        background={{ color: 'brand', opacity: 'medium' }}
                        direction="row"
                        justify="between"
                        border={{ color: 'brand', side: 'all', size: 'small' }}
                        pad={{
                          left: 'small',
                          top: 'medium',
                          bottom: 'medium',
                          right: 'medium'
                        }}
                        onClick={() => {
                          this.props.onOpen!(true);
                          this.setState({
                            showGenreLayer: true,
                            showRatingsLayer: false,
                            showMediaLayer: false
                          });
                        }}
                      >
                        <Box direction="row" gap="small">
                          <Text weight="bold">Genre</Text>
                          <Aed color="dark-2" />
                        </Box>
                        <FormNext color="dark-2" />
                      </Box>
                      <Box
                        round
                        background={{ color: 'brand', opacity: 'medium' }}
                        direction="row"
                        justify="between"
                        border={{ color: 'brand', side: 'all', size: 'small' }}
                        pad={{
                          left: 'small',
                          top: 'medium',
                          bottom: 'medium',
                          right: 'medium'
                        }}
                        onClick={() => {
                          this.props.onOpen!(true);
                          this.setState({
                            showRatingsLayer: true,
                            showGenreLayer: false,
                            showMediaLayer: false
                          });
                        }}
                      >
                        <Box direction="row" gap="small">
                          <Text weight="bold">Your Ratings</Text>
                          <Star color="dark-2" />
                        </Box>
                        <FormNext color="dark-2" />
                      </Box>
                    </Box>
                  )}
              </Box>
            ) : (
              <Box
                align="center"
                pad={{ horizontal: 'medium', vertical: 'small' }}
                gap="small"
                direction={
                  size !== 'large' && size !== 'xlarge' ? 'column' : 'row'
                }
                justify={
                  size === 'large' || size === 'xlarge' ? 'between' : undefined
                }
              >
                {size !== 'large' &&
                  size !== 'xlarge' &&
                  this.props.allowedFilters[0] && (
                    <Box gap="xsmall" align="center">
                      <Text textAlign="center" weight="bold">
                        Your Media Tags
                      </Text>
                      <Box direction="row" align="center">
                        {this.props.mediaTags.map((tag) => this.renderTag(tag))}
                      </Box>
                    </Box>
                  )}
                <Box direction="row" align="center" gap="medium">
                  {(size === 'large' || size === 'xlarge') &&
                    this.props.allowedFilters[0] && (
                      <Box gap="xsmall" align="center">
                        <Text textAlign="center" weight="bold">
                          Your Media Tags
                        </Text>
                        <Box direction="row" align="center">
                          {this.props.mediaTags.map((tag) =>
                            this.renderTag(tag)
                          )}
                        </Box>
                      </Box>
                    )}
                  {this.props.allowedFilters[1] && (
                    <Box gap="xsmall" align="center">
                      <Text textAlign="center" weight="bold">
                        Genre
                      </Text>
                      <SelectSingular
                        tags={this.props.genreTags}
                        placeholder="Choose a genre"
                        plain={false}
                        selectedFilter={''}
                        handleSelected={(selected) =>
                          this.handleTagSelected(selected, 'genre')
                        }
                      />
                    </Box>
                  )}
                  {this.props.allowedFilters[2] && (
                    <Box gap="xsmall" align="center">
                      <Text textAlign="center" weight="bold">
                        Your Ratings
                      </Text>
                      <SelectSingular
                        tags={this.props.ratings}
                        placeholder="Choose a rating"
                        plain={false}
                        selectedFilter={''}
                        handleSelected={(selected) =>
                          this.handleTagSelected(selected, 'starCount')
                        }
                      />
                    </Box>
                  )}
                </Box>
                <Button
                  margin="xsmall"
                  disabled={this.state.selectedFilters.length === 0}
                  alignSelf={
                    size !== 'large' && size !== 'xlarge' ? 'center' : 'end'
                  }
                  onClick={this.handleResetFilters}
                  label="Reset filters"
                  primary
                  hoverIndicator="transparent"
                  icon={<PowerReset />}
                  reverse
                />
              </Box>
            )}
          </Box>
        )}
      </ResponsiveContext.Consumer>
    );
  }
}
