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
import { Magic, Baby } from 'grommet-icons';
import CSV from './CSV';
import { movie } from './HomePage';
import { searchResults } from './MovieSearchResult';

interface SettingsProps {
  logOut(): void;
  toggleSettings(): void;
  loggedIn: boolean;
  handleWishlist(checked: boolean): void;
  handleParsed(movieList: searchResults): void;
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
    wishlistChecked: this.props.wishlist,
    theme: '',
    showDeleteAccountLayer: false,
    uid: ''
  };

  componentDidMount = () => {
    const mode = localStorage.getItem('visualModeValue') || 'wedding';
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
    const newMode = mode === 'wedding on a tuesday' ? 'wedding' : mode;
    localStorage.setItem('visualModeValue', newMode);
    this.setState({
      theme: newMode
    });
    window.location.reload();
  };

  handleDeleteAccount = () => {
    this.setState({ showDeleteAccountLayer: true });
  };

  handleResetCache = () => {
    localStorage.clear();
    window.location.reload();
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
                <Box gap="small" pad="medium" round background="smallLayer">
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
                  <Text weight="bold">wishlist view</Text>
                  <CheckBox
                    checked={this.state.wishlistChecked}
                    toggle
                    reverse
                    onChange={(event) => this.handleWishlist(event)}
                  />
                </Box>
                <Box align="center" gap="xsmall">
                  <Text weight="bold">import/export data</Text>
                  <CSV
                    lot={this.props.lot}
                    wishlist={this.props.wishlistFilms}
                    name={this.props.name}
                    fetchedWishlist={this.props.fetchedWishlist}
                    uid={this.props.uid}
                    handleParsed={(movieList) => {
                      console.log(movieList);
                      this.props.toggleSettings();
                      this.props.handleParsed(movieList);
                    }}
                  />
                </Box>
                <Box gap="xsmall" align="center">
                  <Text weight="bold">theme</Text>
                  <Select
                    disabled={
                      this.state.theme === 'gradient'
                        ? [0]
                        : this.state.theme === 'solid'
                        ? [1]
                        : [2]
                    }
                    icon={<Magic />}
                    value={
                      this.state.theme === 'wedding'
                        ? 'wedding on a tuesday'
                        : this.state.theme
                    }
                    placeholder="choose your visual style"
                    options={['gradient', 'solid', 'wedding on a tuesday']}
                    onChange={({ option }) => this.handleThemeChange(option)}
                  />
                </Box>
                <Box align="center" gap="xsmall" margin={{ bottom: 'small' }}>
                  <Text weight="bold">clear cache</Text>
                  <Button
                    icon={<Baby />}
                    label="reset"
                    reverse
                    onClick={this.handleResetCache}
                  />
                </Box>
                <Box align="center" gap="xsmall">
                  <Text weight="bold">danger zone!</Text>
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
