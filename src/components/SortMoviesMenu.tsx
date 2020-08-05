import React, { Component } from 'react';
import { Menu } from 'grommet';
import { Sort } from 'grommet-icons';

interface SortMoviesMenuProps {
  handleSort(sortBy: string): void;
  sortBy: string;
}

export default class SortMoviesMenu extends Component<SortMoviesMenuProps> {
  handleSort = (sortBy: string) => {
    this.props.handleSort(sortBy);
  };

  render() {
    return (
      <Menu
        color={this.props.sortBy.length > 0 ? 'accent-1' : undefined}
        label="Sort"
        style={{ borderRadius: 10 }}
        alignSelf="center"
        justifyContent="center"
        hoverIndicator="accent-1"
        title="Sort films by..."
        dropAlign={{ top: 'bottom', left: 'right' }}
        icon={
          <Sort
            color={this.props.sortBy.length > 0 ? 'status-ok' : undefined}
          />
        }
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
            label: 'Reset (Original Order)',
            onClick: () => this.handleSort(''),
            hoverIndicator: 'brand'
          }
        ]}
      />
    );
  }
}
