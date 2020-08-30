import React, { Component } from 'react';
import { ResponsiveContext, Box, Text, Button, DropButton } from 'grommet';
import { Sort, FormNext, FormPrevious } from 'grommet-icons';

const sortlabels = [
  { label: 'Title (Asc)', sortBy: 'nameAsc' },
  { label: 'Title (Desc)', sortBy: 'nameDesc' },
  { label: 'Runtime (Asc)', sortBy: 'runtimeAsc' },
  { label: 'Runtime (Desc)', sortBy: 'runtimeDesc' },
  { label: 'MPAA Rating (Asc)', sortBy: 'mpaaAsc' },
  { label: 'MPAA Rating (Desc)', sortBy: 'mpaaDesc' },
  { label: 'Star Count (Asc)', sortBy: 'starCountAsc' },
  { label: 'Star Count (Desc)', sortBy: 'starCountDesc' },
  { label: 'Year Released (Asc)', sortBy: 'yearAsc' },
  { label: 'Year Released (Desc)', sortBy: 'yearDesc' },
  { label: 'Reset (Original Order)', sortBy: '' }
];

interface SortMoviesMenuProps {
  handleSort(sortBy: string): void;
  sortBy: string;
  width: number;
  onOpen?(open: boolean): void;
}

export default class SortMoviesMenu extends Component<SortMoviesMenuProps> {
  state = {
    showSortLayer: false
  };

  handleSort = (sortBy: string) => {
    this.props.handleSort(sortBy);
  };

  render() {
    return (
      <ResponsiveContext.Consumer>
        {(size) => (
          <Box margin={{ left: this.props.width > 950 ? 'medium' : 'none' }}>
            {this.props.width < 950 ? (
              <Box background="light-2">
                {this.state.showSortLayer && this.props.width < 950 ? (
                  <Box
                    gap="xsmall"
                    border="between"
                    overflow={{ vertical: 'scroll' }}
                  >
                    {sortlabels.map((item) => (
                      <Box
                        pad={{
                          left: 'xsmall',
                          top: 'small',
                          bottom: 'small',
                          right: 'small'
                        }}
                        onClick={() => {
                          this.setState({ showSortLayer: false });
                          this.props.handleSort(item.sortBy);
                        }}
                        key={item.label}
                      >
                        <Text>{item.label}</Text>
                      </Box>
                    ))}
                    <Button
                      margin={{ top: 'medium' }}
                      alignSelf="center"
                      icon={<FormPrevious />}
                      primary
                      style={{ borderRadius: 30 }}
                      onClick={() => {
                        this.setState({ showSortLayer: false });
                        this.props.onOpen!(false);
                      }}
                    />
                  </Box>
                ) : (
                  <Box
                    round
                    background={{ color: 'accent-1', opacity: 'medium' }}
                    direction="row"
                    justify="between"
                    border={{ color: 'accent-1', side: 'all', size: 'small' }}
                    pad={{
                      left: 'small',
                      top: 'medium',
                      bottom: 'medium',
                      right: 'medium'
                    }}
                    onClick={() => {
                      this.setState({ showSortLayer: true });
                      this.props.onOpen!(true);
                    }}
                  >
                    <Box direction="row" gap="small">
                      <Text weight="bold">Sort</Text>
                      <Sort color="dark-2" />
                    </Box>
                    <FormNext color="dark-2" />
                  </Box>
                )}
              </Box>
            ) : (
              <DropButton
                title="Sort films by..."
                primary={this.props.sortBy !== ''}
                color={this.props.sortBy.length > 0 ? 'accent-1' : undefined}
                style={{ borderRadius: 25 }}
                alignSelf="center"
                hoverIndicator={
                  this.props.sortBy.length > 0 ? undefined : 'neutral-3'
                }
                label={
                  <Box
                    direction="row"
                    align="center"
                    gap="small"
                    background={{ dark: true }}
                  >
                    <Text textAlign="center">
                      {this.props.sortBy === '' ? 'Sort' : 'Active'}
                    </Text>
                    <Sort
                      color={
                        this.props.sortBy.length > 0 ? 'dark-2' : undefined
                      }
                    />
                  </Box>
                }
                dropAlign={{ top: 'bottom', left: 'right' }}
                dropContent={
                  <Box background="light-2">
                    {sortlabels.map((item) => (
                      <Box
                        key={item.label}
                        direction="row"
                        justify="between"
                        pad={{
                          left: 'small',
                          top: 'medium',
                          bottom: 'medium',
                          right: 'medium'
                        }}
                        hoverIndicator={
                          item.label === 'Reset (Original Order)'
                            ? 'brand'
                            : 'accent-1'
                        }
                        onClick={() => this.handleSort(item.sortBy)}
                      >
                        <Text>{item.label}</Text>
                      </Box>
                    ))}
                  </Box>
                }
              />
            )}
          </Box>
        )}
      </ResponsiveContext.Consumer>
    );
  }
}
