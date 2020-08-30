import React, { Component } from 'react';
import { Box, Layer, CheckBox, Text, ResponsiveContext } from 'grommet';
import { sortLabels } from './HomePage';
import EditFilters from './EditFilters';

interface PreferencesProps {
  allowedFilters: boolean[];
  saveSortedOrder: boolean;
  sortBy: string;
  handlePrefChange(index: number): void;
  handleSaveOrderChange(checked: boolean): void;
  onClose(): void;
  tags: string[];
  uid: string;
  width: number;
  wishlist: boolean;
  handleTagDelete(tags: number[]): void;
  handleUpdatedTags(tags: string[]): void;
  handleTagAdded(tag: string): void;
  handleResetFilters(): void;
}

export default class Preferences extends Component<PreferencesProps> {
  render() {
    return (
      <ResponsiveContext.Consumer>
        {(size) => (
          <Layer
            position="center"
            responsive={false}
            style={{ borderRadius: 30 }}
            onClickOutside={this.props.onClose}
          >
            <Box
              pad="large"
              align="center"
              justify="center"
              round
              gap="medium"
              background="light-2"
              border={{
                side: 'all',
                size: 'large',
                color: 'accent-3',
                style: 'outset'
              }}
            >
              <Text size="large" weight="bold" textAlign="center">
                Preferences
              </Text>
              <Box align="center" gap="small" border="between">
                <Text weight="bold" textAlign="center">
                  Movies
                </Text>
                <Box align="center" gap="xsmall" pad="small">
                  <Text size="small" textAlign="start">
                    Default watched attribute for new movies:
                  </Text>
                  <CheckBox
                    toggle
                    checked={this.props.allowedFilters[0]}
                    label="Watched"
                    reverse
                    onChange={() => this.props.handlePrefChange(0)}
                  />
                </Box>
              </Box>
              <Box align="center" gap="small" border="between">
                <Text weight="bold" textAlign="center">
                  Tags
                </Text>
                <Box pad="small">
                  <EditFilters
                    wishlist={this.props.wishlist}
                    width={this.props.width}
                    uid={this.props.uid}
                    tags={this.props.tags}
                    handleTagDelete={(tags) => this.props.handleTagDelete(tags)}
                    handleUpdatedTags={(updatedTags) =>
                      this.props.handleUpdatedTags(updatedTags)
                    }
                    handleTagAdded={(tag) => this.props.handleTagAdded(tag)}
                    handleResetFilters={this.props.handleResetFilters}
                  />
                </Box>
              </Box>
              <Box align="center" gap="small" border="between">
                <Text weight="bold" textAlign="center">
                  Filter by...
                </Text>
                <Box align="center" gap="small" pad="small">
                  <CheckBox
                    toggle
                    checked={this.props.allowedFilters[0]}
                    label="Your media tags"
                    reverse
                    onChange={() => this.props.handlePrefChange(0)}
                  />
                  <CheckBox
                    toggle
                    checked={this.props.allowedFilters[1]}
                    label="Genre"
                    reverse
                    onChange={() => this.props.handlePrefChange(1)}
                  />
                  <CheckBox
                    toggle
                    checked={this.props.allowedFilters[2]}
                    label="Your ratings"
                    reverse
                    onChange={() => this.props.handlePrefChange(2)}
                  />
                  <CheckBox
                    toggle
                    checked={this.props.allowedFilters[3]}
                    label="Watched"
                    reverse
                    onChange={() => this.props.handlePrefChange(3)}
                  />
                </Box>
              </Box>
              <Box align="center" gap="small" border="between">
                <Text weight="bold" textAlign="center">
                  Sort
                </Text>
                <Box align="center">
                  <Box align="center" gap="small" direction="row" pad="small">
                    <CheckBox
                      disabled={this.props.sortBy === ''}
                      toggle
                      checked={this.props.saveSortedOrder}
                      label="Save sorted order"
                      reverse
                      onChange={(event) =>
                        this.props.handleSaveOrderChange(event.target.checked)
                      }
                    />
                    <Box direction="row" gap="xsmall" align="center">
                      <Text size="small" weight="bold">
                        Default:
                      </Text>
                      <Text size="small">
                        {this.props.saveSortedOrder
                          ? sortLabels[this.props.sortBy]
                          : 'Original Order'}
                      </Text>
                    </Box>
                  </Box>
                  <Text textAlign="center" size="small">
                    Note: There must be a sort active to change the default
                  </Text>
                </Box>
              </Box>
            </Box>
          </Layer>
        )}
      </ResponsiveContext.Consumer>
    );
  }
}
