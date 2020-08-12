import React, { Component } from 'react';
import { Box, Button, Layer, CheckBox, Text, ResponsiveContext } from 'grommet';
import { Configure } from 'grommet-icons';
import { sortLabels } from './HomePage';

interface PreferencesProps {
  allowedFilters: boolean[];
  saveSortedOrder: boolean;
  sortBy: string;
  handlePrefChange(index: number): void;
  handleSaveOrderChange(checked: boolean): void;
}

export default class Preferences extends Component<PreferencesProps> {
  state = {
    showPrefs: false
  };
  render() {
    return (
      <ResponsiveContext.Consumer>
        {(size) => (
          <Box>
            <Button
              primary
              icon={<Configure />}
              label="Preferences"
              reverse={size !== 'small'}
              onClick={() => this.setState({ showPrefs: true })}
            />
            {this.state.showPrefs && (
              <Layer
                position="center"
                responsive={false}
                style={{ borderRadius: 30 }}
                onClickOutside={() => this.setState({ showPrefs: false })}
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
                    size: 'medium',
                    color: 'accent-3',
                    style: 'outset'
                  }}
                >
                  <Text size="large" weight="bold" textAlign="center">
                    Filter/Sort Preferences
                  </Text>
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
                    </Box>
                  </Box>
                  <Box align="center" gap="small" border="between">
                    <Text weight="bold" textAlign="center">
                      Sort
                    </Text>
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
                  </Box>
                </Box>
              </Layer>
            )}
          </Box>
        )}
      </ResponsiveContext.Consumer>
    );
  }
}
