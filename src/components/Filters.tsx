import React, { Component } from 'react';
import { Layer, Box, Heading, Menu, Button, Text } from 'grommet';
import {
  Sort,
  Filter,
  FormTrash,
  FormRefresh,
  Edit,
  Rewind,
  FormCheckmark
} from 'grommet-icons';
import FilterViewTags from './FilterViewTags';

interface FiltersProps {
  tags: string[];
  handleSort(sortBy: string): void;
}

export default class Filters extends Component<FiltersProps> {
  state: {
    showFilters: boolean;
    editMode: boolean;
    selectedFilter: string;
    selectedTagsToUpdate: number[];
  } = {
    showFilters: false,
    editMode: false,
    selectedFilter: '',
    selectedTagsToUpdate: []
  };
  render() {
    return (
      <Box align="center">
        <Button
          icon={<Filter />}
          hoverIndicator="accent-1"
          focusIndicator={false}
          title="filters"
          onClick={() => this.setState({ showFilters: true })}
        />
        {this.state.showFilters && (
          <Layer
            position="right"
            responsive={false}
            style={{ height: '100%', borderRadius: 15 }}
            margin="small"
            onClickOutside={() => this.setState({ showFilters: false })}
          >
            <Box
              flex
              pad="small"
              align="center"
              background="filters"
              round="small"
              width="medium"
            >
              <Heading textAlign="center">filters</Heading>
              <Box gap="medium">
                <Box
                  pad="small"
                  round
                  fill="horizontal"
                  border={{
                    side: 'all',
                    color: 'accent-3',
                    size: 'medium',
                    style: 'outset'
                  }}
                >
                  <Box border="between" gap="small" align="center">
                    <Text textAlign="center" weight="bold">
                      sort by
                    </Text>
                    <Menu
                      style={{ borderRadius: 10 }}
                      alignSelf="center"
                      hoverIndicator="accent-1"
                      title="sort films by..."
                      focusIndicator={false}
                      dropAlign={{ top: 'bottom', right: 'left' }}
                      icon={<Sort />}
                      items={[
                        {
                          label: 'title (asc)',
                          onClick: () => this.props.handleSort('nameAsc'),
                          hoverIndicator: 'accent-1'
                        },
                        {
                          label: 'title (desc)',
                          onClick: () => this.props.handleSort('nameDesc'),
                          hoverIndicator: 'accent-1'
                        },
                        {
                          label: 'runtime (asc)',
                          onClick: () => this.props.handleSort('runtimeAsc'),
                          hoverIndicator: 'accent-1'
                        },
                        {
                          label: 'runtime (desc)',
                          onClick: () => this.props.handleSort('runtimeDesc'),
                          hoverIndicator: 'accent-1'
                        },
                        {
                          label: 'mpaa rating (g - nc17)',
                          onClick: () => this.props.handleSort('mpaaAsc'),
                          hoverIndicator: 'accent-1'
                        },
                        {
                          label: 'mpaa rating (nc17 - g)',
                          onClick: () => this.props.handleSort('mpaaDesc'),
                          hoverIndicator: 'accent-1'
                        },
                        {
                          label: 'reset',
                          onClick: () => this.props.handleSort(''),
                          hoverIndicator: 'brand'
                        }
                      ]}
                    />
                  </Box>
                </Box>
                <Box
                  pad="small"
                  gap="small"
                  justify="between"
                  align="center"
                  round
                  fill="horizontal"
                  border={{
                    side: 'all',
                    color: 'accent-3',
                    size: 'medium',
                    style: 'inset'
                  }}
                >
                  <Text textAlign="center" weight="bold">
                    tags
                  </Text>
                  <FilterViewTags
                    tags={['blu-ray', 'dvd', '4k-uhd']}
                    handleSelectedFilter={(selected) =>
                      this.setState({ selectedFilter: selected })
                    }
                    handleSelectedTagsToUpdate={(tags) =>
                      this.setState({ selectedTagsToUpdate: tags })
                    }
                    createTagSearch={!this.state.editMode ? true : false}
                  />
                  <Box>
                    {!this.state.editMode ? (
                      <Box gap="medium" align="center">
                        <Button
                          icon={<Edit />}
                          title="edit tags"
                          style={{ borderRadius: 30 }}
                          primary
                          hoverIndicator="accent-1"
                          onClick={() =>
                            this.setState({
                              editMode: true
                            })
                          }
                        />
                        <Button
                          disabled={
                            this.state.selectedFilter.length > 0 ? false : true
                          }
                          label="done"
                          hoverIndicator="accent-1"
                          icon={<FormCheckmark />}
                          reverse
                        />
                      </Box>
                    ) : (
                      <Box gap="small" align="center">
                        <Box direction="row" gap="small">
                          <Button
                            disabled={
                              this.state.selectedTagsToUpdate.length > 0
                                ? false
                                : true
                            }
                            style={{ borderRadius: 30 }}
                            primary
                            title="delete selected tag(s)"
                            color="neutral-4"
                            icon={<FormTrash />}
                          />
                          <Button
                            disabled={
                              this.state.selectedTagsToUpdate.length === 1
                                ? false
                                : true
                            }
                            style={{ borderRadius: 30 }}
                            title="update selected tag"
                            icon={<FormRefresh />}
                            primary
                            color="accent-4"
                          />
                        </Box>
                        <Button
                          icon={<Rewind />}
                          title="back"
                          style={{ borderRadius: 30 }}
                          primary
                          hoverIndicator="accent-1"
                          onClick={() => {
                            this.setState({
                              editMode: false,
                              selectedFilter: ''
                            });
                          }}
                        />
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Layer>
        )}
      </Box>
    );
  }
}
