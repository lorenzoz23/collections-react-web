import React, { Component } from 'react';
import {
  Layer,
  Box,
  Heading,
  RadioButtonGroup,
  Button,
  Text,
  ResponsiveContext,
  CheckBox
  //Anchor
} from 'grommet';
import { CircleQuestion } from 'grommet-icons';

interface SettingsProps {
  logOut(): void;
  toggleSettings(): void;
  loggedIn: boolean;
  handleWishlist(): void;
}

export default class Settings extends Component<SettingsProps> {
  state = {
    loggedIn: this.props.loggedIn,
    showFileInfo: false,
    showViewInfo: false,
    wishlistChecked: false
  };

  logOut = async () => {
    await this.setState({
      loggedIn: false
    });
    this.props.logOut();
  };

  handleImport = () => {
    document.getElementById('fileSystem')?.click();
  };

  handleImportChange = (event: any) => {
    const fileUploaded = event.target.files[0];
    console.log('file ' + fileUploaded);
  };

  handleWishlist = (event: any) => {
    this.setState({
      wishlistChecked: event.target.checked
    });

    this.props.handleWishlist();
  };

  render() {
    return (
      <ResponsiveContext.Consumer>
        {(size) => (
          <Layer
            position="center"
            onClickOutside={this.props.toggleSettings}
            style={{ borderRadius: 30 }}
          >
            <Box
              justify="center"
              align="center"
              pad="small"
              round
              border={{ color: 'accent-1', side: 'all', size: 'medium' }}
            >
              <Heading level="2">settings</Heading>
              <Box gap="small" alignContent="center">
                <Box gap="xsmall" align="center">
                  <Text weight="bold">status</Text>
                  <RadioButtonGroup
                    name="status"
                    value={this.state.loggedIn ? 'logged in' : 'log out'}
                    onChange={this.logOut}
                    direction="row"
                    options={['logged in', 'log out']}
                  />
                </Box>
                <Box gap="xsmall" align="center">
                  <Box direction="row" align="center">
                    <Text weight="bold">wishlist view</Text>
                    <Button
                      onClick={() => {
                        this.setState({
                          showViewInfo: !this.state.showViewInfo
                        });
                      }}
                      title="click for a deeper understanding"
                      icon={<CircleQuestion color="brand" />}
                      focusIndicator={false}
                    />
                  </Box>
                  {this.state.showViewInfo ? (
                    <Box pad={{ bottom: 'small' }} gap="xsmall">
                      <Text size="small" textAlign="center">
                        toggle on to view your wishlist and toggle off to return
                        to your film lot
                      </Text>
                    </Box>
                  ) : null}
                  <CheckBox
                    checked={this.state.wishlistChecked}
                    toggle
                    reverse
                    onChange={(event) => this.handleWishlist(event)}
                  />
                </Box>
                <Box align="center" margin={{ bottom: 'medium' }}>
                  <Box direction="row" align="center">
                    <Text weight="bold">import/export data</Text>
                    <Button
                      onClick={() => {
                        this.setState({
                          showFileInfo: !this.state.showFileInfo
                        });
                      }}
                      title="click for a deeper understanding"
                      icon={<CircleQuestion color="brand" />}
                      focusIndicator={false}
                    />
                  </Box>
                  {this.state.showFileInfo ? (
                    <Box pad={{ bottom: 'small' }} gap="xsmall">
                      <Text size="small" textAlign="center">
                        click import to add films to your lot without going
                        through the hassle of manually added every film by hand
                        with the help of UTF-8 encoded CSV files that can be
                        generated from services like iMDB, Letterboxd, iTunes,
                        etc...
                      </Text>
                      <Text size="small" textAlign="center">
                        click export to generate a zip file of both your film
                        lot and wishlist
                      </Text>
                    </Box>
                  ) : null}
                  <Box gap="small" direction="row">
                    <Button
                      label="import"
                      size="small"
                      onClick={this.handleImport}
                    />
                    <Button label="export" size="small" />
                    <input
                      type="file"
                      style={{ display: 'none' }}
                      id="fileSystem"
                      onChange={this.handleImportChange}
                    />
                  </Box>
                </Box>
                <Box align="center">
                  <Button
                    label="delete account"
                    color="status-error"
                    hoverIndicator="status-error"
                  />
                </Box>
                {/* <Button
                  alignSelf="center"
                  size="small"
                  icon={<FormClose size="small" />}
                  primary
                  onClick={this.props.exitSettings}
                /> */}
              </Box>
            </Box>
          </Layer>
        )}
      </ResponsiveContext.Consumer>
    );
  }
}
