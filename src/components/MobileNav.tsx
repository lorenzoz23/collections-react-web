import React, { Component } from 'react';
import { Nav, Anchor, Box, Text, Layer } from 'grommet';
import { Filter, Search, UserSettings, Logout } from 'grommet-icons';
import Settings from './Settings';
import { searchResults } from './MovieSearchResult';
import { movie } from './HomePage';

interface MobileNavProps {
  handleParsed(movieList: searchResults): void;
  wishlist: boolean;
  uid: string;
  handleAccountDelete(): void;
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
    navClicked: ''
  };
  render() {
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
              this.setState({ show: false, navClicked: '' })
            }
          >
            <Box
              round={{ corner: 'top' }}
              align="center"
              pad="large"
              gap="small"
              border={{
                color: 'accent-3',
                side: 'top',
                size: 'xlarge',
                style: 'groove'
              }}
              background="light-2"
            >
              <Text size="large" weight="bold">
                {this.state.navClicked === 'Settings'
                  ? this.props.name
                  : this.state.navClicked}
              </Text>
              {this.state.navClicked === 'Settings' && (
                <Box fill="horizontal" gap="small">
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
                    <UserSettings color="brand" />
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
                    <Logout color="brand" />
                  </Box>
                </Box>
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
