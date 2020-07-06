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
import CSV from './CSV';
import { movie } from './HomePage';

interface SettingsProps {
  logOut(): void;
  toggleSettings(): void;
  loggedIn: boolean;
  handleWishlist(checked: boolean): void;
  wishlist: boolean;
  uid: string;
  handleAccountDelete(): void;
  lot: movie[];
  wishlistFilms: movie[];
  name: string;
  fetchedWishlist: boolean;
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

  logOut = () => {
    this.setState({
      loggedIn: false
    });
    this.props.logOut();
  };

  handleWishlist = (event: any) => {
    this.setState({
      wishlistChecked: event.target.checked
    });

    this.props.handleWishlist(event.target.checked);
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
            responsive={false}
            position="center"
            onClickOutside={this.props.toggleSettings}
            style={{ borderRadius: 30 }}
          >
            {this.state.showDeleteAccountLayer ? (
              <Layer
                responsive={false}
                position="bottom"
                onClickOutside={() =>
                  this.setState({ showDeleteAccountLayer: false })
                }
                style={{ borderRadius: 30 }}
                margin={{ bottom: 'medium' }}
              >
                <Box gap="small" pad="medium" round>
                  <Text textAlign="center" weight="bold">
                    please type in your auto-generated user-id to confirm
                    account deletion
                  </Text>
                  <Text textAlign="center">
                    <Text weight="bold">user-id: </Text>
                    {this.props.uid}
                  </Text>
                  <TextInput
                    placeholder="user-id"
                    value={this.state.uid}
                    onChange={(event) =>
                      this.setState({ uid: event.target.value })
                    }
                  />
                  <Button
                    primary
                    color="status-error"
                    label="delete account"
                    disabled={this.state.uid === this.props.uid ? false : true}
                    onClick={this.props.handleAccountDelete}
                  />
                </Box>
              </Layer>
            ) : null}
            <Box
              background="layer"
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
                      icon={<CircleQuestion />}
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
                      icon={<CircleQuestion />}
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
                  <CSV
                    lot={this.props.lot}
                    wishlist={this.props.wishlistFilms}
                    name={this.props.name}
                    fetchedWishlist={this.props.fetchedWishlist}
                    uid={this.props.uid}
                  />
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
                    primary={size !== 'small' ? false : true}
                    label="delete account"
                    color="status-error"
                    hoverIndicator={size !== 'small' ? 'status-error' : false}
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
