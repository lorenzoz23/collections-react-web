import React, { Component } from 'react';
import { Layer, Box, Heading, Menu, Button, Text } from 'grommet';
import {
  Sort,
  Filter,
  FormTrash,
  FormRefresh,
  Edit,
  Rewind
} from 'grommet-icons';
import MovieViewTags from './MovieViewTags';

interface FiltersProps {
  tags: string[];
  handleSort(sortBy: string): void;
}

export default class Filters extends Component<FiltersProps> {
  state: { showFilters: boolean; editMode: boolean; selected: number[] } = {
    showFilters: false,
    editMode: false,
    selected: []
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
                  <MovieViewTags
                    tags={['blu-ray', 'dvd', '4k-uhd']}
                    backgroundColor="header"
                    handleSelected={(selected) =>
                      this.setState({ selected: selected })
                    }
                    createTagSearch={!this.state.editMode ? true : false}
                  />
                  <Box round="full">
                    {!this.state.editMode ? (
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
                    ) : (
                      <Box gap="small" align="center">
                        <Box direction="row" gap="small">
                          <Button
                            disabled={this.state.selected.length ? false : true}
                            style={{ borderRadius: 30 }}
                            primary
                            title="delete selected tag(s)"
                            color="neutral-4"
                            icon={<FormTrash />}
                          />
                          <Button
                            disabled={
                              this.state.selected.length === 1 ? false : true
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
                          onClick={() =>
                            this.setState({
                              editMode: false
                            })
                          }
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
