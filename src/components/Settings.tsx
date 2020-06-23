import React, { Component } from 'react';
import {
  Layer,
  Box,
  Heading,
  RadioButtonGroup,
  Button,
  Text,
  ResponsiveContext,
  CheckBox,
  Select,
  TextInput
} from 'grommet';
import { CircleQuestion, Magic } from 'grommet-icons';

interface SettingsProps {
  logOut(): void;
  toggleSettings(): void;
  loggedIn: boolean;
  handleWishlist(): void;
  wishlist: boolean;
  uid: string;
  handleAccountDelete(): void;
}

export default class Settings extends Component<SettingsProps> {
  state = {
    loggedIn: this.props.loggedIn,
    showFileInfo: false,
    showViewInfo: false,
    wishlistChecked: this.props.wishlist,
    theme: '',
    showDeleteAccountLayer: false,
    uid: ''
  };

  componentDidMount = () => {
    const mode = localStorage.getItem('visualModeValue') || 'gradient';
    this.setState({ theme: mode });
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

  handleThemeChange = (mode: string) => {
    localStorage.setItem('visualModeValue', mode);
    this.setState({
      theme: mode
    });
    window.location.reload();
  };

  handleDeleteAccount = () => {
    this.setState({ showDeleteAccountLayer: true });
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
            {this.state.showDeleteAccountLayer ? (
              <Layer
                position="bottom"
                onClickOutside={() =>
                  this.setState({ showDeleteAccountLayer: false })
                }
                style={{ borderRadius: 30 }}
              >
                <Box gap="small" pad="medium">
                  <Text textAlign="center" weight="bold">
                    please type in your auto-generated user-id to confirm
                    account deletion
                  </Text>
                  <Text textAlign="center">
                    <Text weight="bold">user-id: </Text>
                    {this.props.uid}
                  </Text>
                  <TextInput
                    placeholder="listen, we all know this is annoying and super extra but that's honestly the point..."
                    value={this.state.uid}
                    onChange={(event) =>
                      this.setState({ uid: event.target.value })
                    }
                  />
                  <Button
                    primary
                    color="status-error"
                    label="here's lookin' at you, kid"
                    disabled={this.state.uid === this.props.uid ? false : true}
                    onClick={this.props.handleAccountDelete}
                  />
                </Box>
              </Layer>
            ) : null}
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
                      disabled
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
                    disabled
                    checked={this.state.wishlistChecked}
                    toggle
                    reverse
                    onChange={(event) => this.handleWishlist(event)}
                  />
                </Box>
                <Box align="center">
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
                      disabled
                      label="import"
                      size="small"
                      onClick={this.handleImport}
                    />
                    <Button disabled label="export" size="small" />
                    <input
                      type="file"
                      style={{ display: 'none' }}
                      id="fileSystem"
                      onChange={this.handleImportChange}
                    />
                  </Box>
                </Box>
                <Box gap="xsmall" align="center" margin={{ bottom: 'medium' }}>
                  <Text weight="bold">theme</Text>
                  <Select
                    disabled={this.state.theme === 'gradient' ? [0] : [1]}
                    icon={<Magic />}
                    value={this.state.theme}
                    placeholder="choose your visual style"
                    options={['gradient', 'solid']}
                    onChange={({ option }) => this.handleThemeChange(option)}
                  />
                </Box>
                <Box align="center">
                  <Button
                    label="delete account"
                    color="status-error"
                    hoverIndicator="status-error"
                    onClick={this.handleDeleteAccount}
                  />
                </Box>
              </Box>
            </Box>
          </Layer>
        )}
      </ResponsiveContext.Consumer>
    );
  }
}
