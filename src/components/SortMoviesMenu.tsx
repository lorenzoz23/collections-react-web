import React, { Component } from 'react';
import { Menu, ResponsiveContext, Box, Text, Button } from 'grommet';
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
              <Menu
                color={this.props.sortBy.length > 0 ? 'accent-1' : undefined}
                label={this.props.sortBy === '' ? 'Sort' : 'Active'}
                style={{ borderRadius: 10 }}
                primary={this.props.sortBy !== ''}
                alignSelf="center"
                justifyContent="center"
                hoverIndicator="accent-1"
                title="Sort films by..."
                dropAlign={{ top: 'bottom', left: 'right' }}
                icon={<Sort />}
                items={[
                  {
                    label: 'Title (Asc)',
                    onClick: () => this.handleSort('nameAsc'),
                    hoverIndicator: 'accent-1'
                  },
                  {
                    label: 'Title (Desc)',
                    onClick: () => this.handleSort('nameDesc'),
                    hoverIndicator: 'accent-1'
                  },
                  {
                    label: 'Runtime (Asc)',
                    onClick: () => this.handleSort('runtimeAsc'),
                    hoverIndicator: 'accent-1'
                  },
                  {
                    label: 'Runtime (Desc)',
                    onClick: () => this.handleSort('runtimeDesc'),
                    hoverIndicator: 'accent-1'
                  },
                  {
                    label: 'MPAA Rating (G - NC17)',
                    onClick: () => this.handleSort('mpaaAsc'),
                    hoverIndicator: 'accent-1'
                  },
                  {
                    label: 'MPAA Rating (NC17 - G)',
                    onClick: () => this.handleSort('mpaaDesc'),
                    hoverIndicator: 'accent-1'
                  },
                  {
                    label: 'Star Count (Asc)',
                    onClick: () => this.handleSort('starCountAsc'),
                    hoverIndicator: 'accent-1'
                  },
                  {
                    label: 'Star Count (Desc)',
                    onClick: () => this.handleSort('starCountDesc'),
                    hoverIndicator: 'accent-1'
                  },
                  {
                    label: 'Year Released (Asc)',
                    onClick: () => this.handleSort('yearAsc'),
                    hoverIndicator: 'accent-1'
                  },
                  {
                    label: 'Year Released (Desc)',
                    onClick: () => this.handleSort('yearDesc'),
                    hoverIndicator: 'accent-1'
                  },
                  {
                    label: 'Reset (Original Order)',
                    onClick: () => this.handleSort(''),
                    hoverIndicator: 'brand'
                  }
                ]}
              />
            )}
          </Box>
        )}
      </ResponsiveContext.Consumer>
    );
  }
}
