import React, { Component } from 'react';
import { Nav, Anchor, Box, Text, Layer, TextInput, Button } from 'grommet';
import {
  Filter,
  Search,
  UserSettings,
  Logout,
  Gremlin,
  ClearOption
} from 'grommet-icons';
import Settings from './Settings';
import { searchResults } from './MovieSearchResult';
import { movie } from './HomePage';
import Preferences from './Preferences';
import EditFilters from './EditFilters';
import FilterSearch, { filter } from './FilterSearch';
import SortMoviesMenu from './SortMoviesMenu';

interface MobileNavProps {
  handleParsed(movieList: searchResults): void;
  wishlist: boolean;
  uid: string;
  handleAccountDelete(): void;
  handleSort(sortBy: string): void;
  handleSearch(searchVal: string): void;
  lot: movie[];
  wishlistFilms: movie[];
  name: string;
  sortBy: string;
  fetchedWishlist: boolean;
  logOut(): void;
  width: number;
  mediaTags: string[];
  genreTags: string[];
  ratings: string[];
  handleResetFilters(): void;
  handleFilterByTag(filters: filter[]): void;
  allowedFilters: boolean[];
  handleTagDelete(tags: number[]): void;
  handleUpdatedTags(tags: string[]): void;
  handleTagAdded(tag: string): void;
  handleSaveOrderChange(checked: boolean): void;
  handlePrefChanged(index: number): void;
  saveSortedOrder: boolean;
}

export default class MobileNav extends Component<MobileNavProps> {
  state = {
    show: false,
    showSettings: false,
    navClicked: '',
    searchVal: '',
    sortOpen: false,
    filterOpen: false
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
              height={{ max: 'large' }}
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
                    border={{ color: 'accent-1', side: 'all', size: 'small' }}
                    background={{ color: 'accent-1', opacity: 'medium' }}
                    onClick={() =>
                      this.setState({ showSettings: true, show: false })
                    }
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
                    border={{
                      color: 'status-error',
                      side: 'all',
                      size: 'small'
                    }}
                    background={{ color: 'status-error', opacity: 'medium' }}
                    onClick={this.props.logOut}
                  >
                    <Text>Sign out</Text>
                    <Logout color="dark-2" />
                  </Box>
                </Box>
              )}
              {this.state.navClicked === 'Search' && (
                <Box gap="medium" fill="horizontal">
                  <TextInput
                    value={this.state.searchVal}
                    placeholder={`Search your ${
                      this.props.wishlist
                        ? this.props.wishlistFilms.length
                        : this.props.lot.length
                    } ${this.props.lot.length === 1 ? 'film' : 'films'}...`}
                    icon={<Search />}
                    onChange={(event) => {
                      this.props.handleSearch(event.target.value);
                      this.setState({ searchVal: event.target.value });
                    }}
                  />
                  <Button
                    disabled={this.state.searchVal.length === 0}
                    primary
                    size="small"
                    label="Clear Search"
                    icon={<ClearOption />}
                    reverse
                    margin={{ top: 'xsmall' }}
                    alignSelf="center"
                    onClick={() => {
                      this.props.handleSearch('');
                      this.setState({ searchVal: '' });
                    }}
                  />
                </Box>
              )}
              {this.state.navClicked === 'Filters' && (
                <Box gap="large" fill="horizontal">
                  {!this.state.filterOpen && (
                    <SortMoviesMenu
                      width={this.props.width}
                      sortBy={this.props.sortBy}
                      handleSort={(sortBy) => {
                        this.setState({ show: false, navClicked: '' });
                        this.props.handleSort(sortBy);
                      }}
                      onOpen={(open) => this.setState({ sortOpen: open })}
                    />
                  )}
                  {!this.state.sortOpen && (
                    <FilterSearch
                      onOpen={(open) => this.setState({ filterOpen: open })}
                      width={this.props.width}
                      allowedFilters={this.props.allowedFilters}
                      handleFilterByTag={(filters) =>
                        this.props.handleFilterByTag(filters)
                      }
                      mediaTags={this.props.mediaTags}
                      genreTags={this.props.genreTags}
                      ratings={[
                        '1',
                        '2',
                        '3',
                        '4',
                        '5',
                        '6',
                        '7',
                        '8',
                        '9',
                        '10'
                      ]}
                      handleResetFilters={this.props.handleResetFilters}
                    />
                  )}
                  <Box
                    align="center"
                    gap="medium"
                    direction="row"
                    border="between"
                  >
                    <Preferences
                      sortBy={this.props.sortBy}
                      saveSortedOrder={this.props.saveSortedOrder}
                      allowedFilters={this.props.allowedFilters}
                      handleSaveOrderChange={(checked) =>
                        this.props.handleSaveOrderChange(checked)
                      }
                      handlePrefChange={(index) =>
                        this.props.handlePrefChanged(index)
                      }
                    />
                    <EditFilters
                      wishlist={this.props.wishlist}
                      width={this.props.width}
                      uid={this.props.uid}
                      tags={this.props.mediaTags}
                      handleTagDelete={(tags) =>
                        this.props.handleTagDelete(tags)
                      }
                      handleUpdatedTags={(updatedTags) =>
                        this.props.handleUpdatedTags(updatedTags)
                      }
                      handleTagAdded={(tag) => this.props.handleTagAdded(tag)}
                      handleResetFilters={this.props.handleResetFilters}
                    />
                  </Box>
                </Box>
              )}
            </Box>
          </Layer>
        )}
        {this.state.showSettings && (
          <Settings
            toggleSettings={() =>
              this.setState({ showSettings: false, show: true })
            }
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
