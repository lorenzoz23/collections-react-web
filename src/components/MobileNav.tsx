import React, { Component } from 'react';
import { Nav, Anchor, Box, Text, Layer, TextInput } from 'grommet';
import { Filter, Search, UserSettings, Logout, Gremlin } from 'grommet-icons';
import Settings from './Settings';
import { searchResults } from './MovieSearchResult';
import { movie } from './HomePage';

interface MobileNavProps {
  handleParsed(movieList: searchResults): void;
  wishlist: boolean;
  uid: string;
  handleAccountDelete(): void;
  handleSearch(event: any): void;
  lot: movie[];
  wishlistFilms: movie[];
  name: string;
  fetchedWishlist: boolean;
  logOut(): void;
}

export default class MobileNav extends Component<MobileNavProps> {
  state = {
    show: false,
    showSettings: false,
    navClicked: '',
    searchVal: ''
  };
  render() {
    const headerText: string =
      this.state.navClicked === 'Settings'
        ? this.props.name
        : this.state.navClicked === 'Search'
        ? `Search Your ${this.props.wishlist ? 'Wishlist' : 'Lot'}`
        : this.state.navClicked;
    return (
      <Box>
        <Nav round direction="row" align="center" justify="center">
          <Box align="center" pad="xsmall">
            <Anchor
              icon={<Filter />}
              onClick={() =>
                this.setState({ show: true, navClicked: 'Filters' })
              }
            />
            <Text weight="normal" size="small" textAlign="center">
              Filters
            </Text>
          </Box>
          <Box align="center" pad="xsmall">
            <Anchor
              icon={<Search size="medium" />}
              onClick={() =>
                this.setState({ show: true, navClicked: 'Search' })
              }
            />
            <Text weight="bold" textAlign="center">
              {this.props.wishlist ? 'Wishlist' : 'Lot'}
            </Text>
          </Box>
          <Box align="center" pad="xsmall">
            <Anchor
              icon={<UserSettings />}
              onClick={() =>
                this.setState({ show: true, navClicked: 'Settings' })
              }
            />
            <Text weight="normal" size="small" textAlign="center">
              Settings
            </Text>
          </Box>
        </Nav>
        {this.state.show && (
          <Layer
            position="bottom"
            responsive={false}
            style={{
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              width: '100%'
            }}
            onClickOutside={() =>
              this.setState({ show: false, navClicked: '', searchVal: '' })
            }
          >
            <Box
              round={{ corner: 'top' }}
              align="center"
              pad="large"
              gap="small"
              border={{
                color: 'accent-3',
                side: 'bottom',
                size: 'xlarge',
                style: 'groove'
              }}
              background="light-2"
            >
              <Text size="large" weight="bold">
                {headerText}
              </Text>
              {this.state.navClicked === 'Settings' && (
                <Box fill="horizontal" gap="small">
                  <Box alignSelf="center" pad="small">
                    <Gremlin size="large" />
                  </Box>
                  <Box
                    direction="row"
                    justify="between"
                    pad={{
                      left: 'small',
                      top: 'medium',
                      bottom: 'medium',
                      right: 'medium'
                    }}
                    round
                    background={{ color: 'accent-1', opacity: 'medium' }}
                    onClick={() => this.setState({ showSettings: true })}
                  >
                    <Text>Settings</Text>
                    <UserSettings color="dark-2" />
                  </Box>
                  <Box
                    direction="row"
                    justify="between"
                    pad={{
                      left: 'small',
                      top: 'medium',
                      bottom: 'medium',
                      right: 'medium'
                    }}
                    round
                    background={{ color: 'status-error', opacity: 'medium' }}
                    onClick={this.props.logOut}
                  >
                    <Text>Sign out</Text>
                    <Logout color="dark-2" />
                  </Box>
                </Box>
              )}
              {this.state.navClicked === 'Search' && (
                <TextInput
                  value={this.state.searchVal}
                  placeholder={`Search your ${
                    this.props.wishlist
                      ? this.props.wishlistFilms.length
                      : this.props.lot.length
                  } ${this.props.lot.length === 1 ? 'film' : 'films'}...`}
                  icon={<Search />}
                  onChange={(event) => {
                    this.setState({ searchVal: event.target.value });
                    this.props.handleSearch(event);
                  }}
                />
              )}
            </Box>
          </Layer>
        )}
        {this.state.showSettings && (
          <Settings
            toggleSettings={() => this.setState({ showSettings: false })}
            wishlist={this.props.wishlist}
            uid={this.props.uid}
            handleAccountDelete={this.props.handleAccountDelete}
            lot={this.props.lot}
            wishlistFilms={this.props.wishlistFilms}
            name={this.props.name}
            fetchedWishlist={this.props.fetchedWishlist}
            handleParsed={(movieList) => this.props.handleParsed(movieList)}
          />
        )}
      </Box>
    );
  }
}
