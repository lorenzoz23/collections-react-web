import React, { Component } from 'react';
import { Nav, Anchor, Box, Text, Layer, TextInput, Button } from 'grommet';
import {
  Filter,
  Search,
  UserSettings,
  Logout,
  Gremlin,
  ClearOption,
  Tag,
  FormNext,
  Configure,
  View,
  PowerReset,
  Multimedia
} from 'grommet-icons';
import Settings from './Settings';
import { searchResults } from './MovieSearchResult';
import { movie } from './HomePage';
import Preferences from './Preferences';
import EditFilters from './EditFilters';
import { filter } from './FilterSearch';
import SortMoviesMenu from './SortMoviesMenu';
import MobileMediaTags from './MobileMediaTags';
import MobileGenreTags from './MobileGenreTags';
import MobileRatingsTags from './MobileRatingsTags';
import MobileWatchedTags from './MobileWatchedTags';
import ReportBug from './ReportBug';
import About from './About';

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
    mediaOpen: false,
    genreOpen: false,
    ratingsOpen: false,
    showPrefs: false,
    watchedOpen: false,
    showBug: false,
    showAbout: false
  };

  render() {
    const headerText: string =
      this.state.navClicked === 'Settings'
        ? this.props.name
        : this.state.navClicked === 'Search'
        ? `Search Your ${this.props.wishlist ? 'Wishlist' : 'Lot'}`
        : this.state.navClicked;
    return (
      <Box fill>
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
              Account
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
                  <Box gap="large" border="between">
                    <Box gap="small">
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
                          color: 'accent-1',
                          side: 'all',
                          size: 'small'
                        }}
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
                        background={{
                          color: 'status-error',
                          opacity: 'medium'
                        }}
                        onClick={this.props.logOut}
                      >
                        <Text>Sign out</Text>
                        <Logout color="dark-2" />
                      </Box>
                    </Box>
                    <Box
                      direction="row"
                      gap="medium"
                      justify="center"
                      alignSelf="center"
                      margin={{
                        top: this.props.width < 700 ? 'large' : 'none'
                      }}
                    >
                      <ReportBug
                        uid={this.props.uid}
                        width={this.props.width}
                      />
                      <About width={this.props.width} />
                    </Box>
                    <Box
                      direction="row"
                      align="center"
                      gap="small"
                      margin={{ top: 'large' }}
                      justify="center"
                    >
                      <Text textAlign="center" size="small">
                        Movie data provided by:
                      </Text>
                      <Anchor
                        alignSelf="center"
                        size="small"
                        icon={<Multimedia />}
                        reverse
                        href="https://www.themoviedb.org/"
                        target="_blank"
                        label="TMDB"
                      />
                    </Box>
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
              {this.state.navClicked === 'Filters' &&
                (!this.state.genreOpen &&
                !this.state.mediaOpen &&
                !this.state.ratingsOpen &&
                !this.state.watchedOpen &&
                !this.state.sortOpen ? (
                  <Box gap="large" fill="horizontal">
                    <SortMoviesMenu
                      width={this.props.width}
                      sortBy={this.props.sortBy}
                      handleSort={(sortBy) => {
                        this.setState({ show: false, navClicked: '' });
                        this.props.handleSort(sortBy);
                      }}
                      onOpen={(open) =>
                        this.setState({
                          sortOpen: open,
                          mediaOpen: false,
                          genreOpen: false,
                          ratingsOpen: false
                        })
                      }
                    />
                    <Box gap="small">
                      <Box
                        round
                        background={{ color: 'accent-3', opacity: 'medium' }}
                        direction="row"
                        justify="between"
                        border={{
                          color: 'accent-3',
                          side: 'all',
                          size: 'small'
                        }}
                        pad={{
                          left: 'small',
                          top: 'medium',
                          bottom: 'medium',
                          right: 'medium'
                        }}
                        onClick={() => {
                          this.setState({
                            mediaOpen: true,
                            genreOpen: false,
                            ratingsOpen: false,
                            sortOpen: false
                          });
                        }}
                      >
                        <Box direction="row" gap="small">
                          <Text weight="bold">Your Media Tags</Text>
                          <Tag color="dark-2" />
                        </Box>
                        <FormNext color="dark-2" />
                      </Box>
                      <Box
                        round
                        background={{ color: 'accent-3', opacity: 'medium' }}
                        direction="row"
                        justify="between"
                        border={{
                          color: 'accent-3',
                          side: 'all',
                          size: 'small'
                        }}
                        pad={{
                          left: 'small',
                          top: 'medium',
                          bottom: 'medium',
                          right: 'medium'
                        }}
                        onClick={() => {
                          this.setState({
                            mediaOpen: false,
                            genreOpen: true,
                            ratingsOpen: false,
                            sortOpen: false
                          });
                        }}
                      >
                        <Box direction="row" gap="small">
                          <Text weight="bold">Genre</Text>
                          <Tag color="dark-2" />
                        </Box>
                        <FormNext color="dark-2" />
                      </Box>
                      <Box
                        round
                        background={{ color: 'accent-3', opacity: 'medium' }}
                        direction="row"
                        justify="between"
                        border={{
                          color: 'accent-3',
                          side: 'all',
                          size: 'small'
                        }}
                        pad={{
                          left: 'small',
                          top: 'medium',
                          bottom: 'medium',
                          right: 'medium'
                        }}
                        onClick={() => {
                          this.setState({
                            mediaOpen: false,
                            genreOpen: false,
                            ratingsOpen: true,
                            sortOpen: false
                          });
                        }}
                      >
                        <Box direction="row" gap="small">
                          <Text weight="bold">Your Ratings</Text>
                          <Tag color="dark-2" />
                        </Box>
                        <FormNext color="dark-2" />
                      </Box>
                      <Box
                        round
                        background={{ color: 'accent-3', opacity: 'medium' }}
                        direction="row"
                        justify="between"
                        border={{
                          color: 'accent-3',
                          side: 'all',
                          size: 'small'
                        }}
                        pad={{
                          left: 'small',
                          top: 'medium',
                          bottom: 'medium',
                          right: 'medium'
                        }}
                        onClick={() => {
                          this.setState({
                            mediaOpen: false,
                            genreOpen: false,
                            ratingsOpen: false,
                            sortOpen: false,
                            watchedOpen: true
                          });
                        }}
                      >
                        <Box direction="row" gap="small">
                          <Text weight="bold">Watched</Text>
                          <View color="dark-2" />
                        </Box>
                        <FormNext color="dark-2" />
                      </Box>
                      <Button
                        margin="xsmall"
                        alignSelf="center"
                        onClick={() => {
                          this.setState({ show: false });
                          this.props.handleResetFilters();
                        }}
                        label="Reset filters/sort"
                        primary
                        color="neutral-3"
                        icon={<PowerReset />}
                        reverse
                      />
                    </Box>
                    <Box
                      align="center"
                      gap="medium"
                      direction="row"
                      border="between"
                      justify="center"
                    >
                      <Button
                        primary
                        icon={<Configure />}
                        label="Preferences"
                        reverse
                        onClick={() => {
                          this.setState({ showPrefs: true, show: false });
                        }}
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
                ) : (
                  <Box fill="horizontal">
                    {this.state.sortOpen && (
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
                    {this.state.mediaOpen && (
                      <MobileMediaTags
                        mediaTags={this.props.mediaTags}
                        onOpen={(open) => this.setState({ mediaOpen: open })}
                        handleFilterByTag={(filters) =>
                          this.props.handleFilterByTag(filters)
                        }
                      />
                    )}
                    {this.state.genreOpen && (
                      <MobileGenreTags
                        genreTags={this.props.genreTags}
                        onOpen={(open) => this.setState({ genreOpen: open })}
                        handleFilterByTag={(filters) =>
                          this.props.handleFilterByTag(filters)
                        }
                      />
                    )}
                    {this.state.ratingsOpen && (
                      <MobileRatingsTags
                        ratingsTags={this.props.ratings}
                        onOpen={(open) => this.setState({ ratingsOpen: open })}
                        handleFilterByTag={(filters) =>
                          this.props.handleFilterByTag(filters)
                        }
                      />
                    )}
                    {this.state.watchedOpen && (
                      <MobileWatchedTags
                        watchedOptions={['Watched', 'Unwatched']}
                        onOpen={(open) => this.setState({ watchedOpen: open })}
                        handleFilterByTag={(filters) =>
                          this.props.handleFilterByTag(filters)
                        }
                      />
                    )}
                  </Box>
                ))}
            </Box>
          </Layer>
        )}
        {this.state.showSettings && (
          <Settings
            toggleSettings={() =>
              this.setState({ showSettings: false, show: false })
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
        {this.state.showPrefs && (
          <Preferences
            sortBy={this.props.sortBy}
            saveSortedOrder={this.props.saveSortedOrder}
            allowedFilters={this.props.allowedFilters}
            handleSaveOrderChange={(checked) =>
              this.props.handleSaveOrderChange(checked)
            }
            handlePrefChange={(index) => this.props.handlePrefChanged(index)}
            onClose={() =>
              this.setState({
                show: true,
                showPrefs: false
              })
            }
          />
        )}
      </Box>
    );
  }
}
