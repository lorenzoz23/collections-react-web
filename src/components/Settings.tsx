import React, { Component } from 'react';
import {
  Layer,
  Box,
  Heading,
  RadioButtonGroup,
  Button,
  Select,
  Text,
  ResponsiveContext,
  Anchor
} from 'grommet';
import { CircleQuestion, FormClose } from 'grommet-icons';

interface SettingsProps {
  logOut(): void;
  exitSettings(): void;
  loggedIn: boolean;
}

export default class Settings extends Component<SettingsProps> {
  state = {
    loggedIn: this.props.loggedIn
  };

  logOut = async () => {
    await this.setState({
      loggedIn: false
    });
    this.props.logOut();
  };
  render() {
    return (
      <ResponsiveContext.Consumer>
        {(size) => (
          <Layer position="center" onClickOutside={this.props.exitSettings}>
            <Box justify="center" align="center" pad="small">
              <Heading level="2">settings</Heading>
              <Box gap="medium" align="center">
                <Box gap="xsmall" align="center">
                  <Text>status</Text>
                  <RadioButtonGroup
                    name="status"
                    value={this.state.loggedIn ? 'logged in' : 'log out'}
                    onChange={this.logOut}
                    direction="row"
                    options={['logged in', 'log out']}
                  />
                </Box>
                <Box align="center">
                  <Box direction="row" align="center">
                    <Text>import/export data</Text>
                    <Button
                      title="click for a deeper understanding"
                      icon={<CircleQuestion color="brand" />}
                      focusIndicator={false}
                    />
                  </Box>
                  <Box gap="small" direction="row">
                    <Button label="import" size="small" />
                    <Button label="export" size="small" />
                  </Box>
                </Box>
                <Box align="center" gap="xsmall">
                  <Text>choose your own style</Text>
                  <Select
                    focusIndicator={size === 'small' ? false : true}
                    options={['mystic river blue']}
                    placeholder="select a visual theme..."
                    onChange={() => {}}
                  />
                </Box>
                <Box align="center">
                  <Anchor label="refresh app" href="/home" />
                </Box>
                <Button
                  alignSelf="center"
                  size="small"
                  icon={<FormClose size="small" />}
                  primary
                  onClick={this.props.exitSettings}
                />
              </Box>
            </Box>
          </Layer>
        )}
      </ResponsiveContext.Consumer>
    );
  }
}
