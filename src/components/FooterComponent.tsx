import React, { Component } from 'react';
import { Footer, Box, Clock, Text, Anchor, ResponsiveContext } from 'grommet';
import { Multimedia } from 'grommet-icons';
import ReportBug from './ReportBug';
import MobileNav from './MobileNav';
import { searchResults } from './MovieSearchResult';
import { movie } from './HomePage';
import { filter } from './FilterSearch';
import About from './About';

interface FooterComponentProps {
  width: number;
  handleParsed(movieList: searchResults): void;
  wishlist: boolean;
  uid: string;
  handleAccountDelete(): void;
  lot: movie[];
  wishlistFilms: movie[];
  name: string;
  fetchedWishlist: boolean;
  logOut(): void;
  handleSearch(searchVal: string): void;
  sortBy: string;
  handleSort(sortBy: string): void;
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

export default class FooterComponent extends Component<FooterComponentProps> {
  state = {
    showAbout: false
  };

  render() {
    const mode = localStorage.getItem('visualMode') || 'wedding';
    return (
      <ResponsiveContext.Consumer>
        {(size) => (
          <Footer
            pad={{
              horizontal: size !== 'small' ? 'small' : 'medium',
              vertical: 'xxsmall'
            }}
            gap="medium"
            round={
              mode === 'wedding' ? (size === 'small' ? 'xlarge' : true) : false
            }
            margin={
              mode === 'wedding'
                ? {
                    horizontal: this.props.width < 950 ? 'xlarge' : 'medium',
                    bottom:
                      size !== 'small' && this.props.width > 950
                        ? 'xsmall'
                        : 'large'
                  }
                : 'none'
            }
            justify={this.props.width < 950 ? 'center' : 'between'}
            background={{
              color: this.props.width < 950 ? 'home' : 'footer',
              opacity: 0.9
            }}
            border={
              this.props.width < 950
                ? { color: 'accent-1', size: 'small', side: 'all' }
                : undefined
            }
          >
            {this.props.width > 950 && (
              <Box direction="row" align="center" gap="small">
                <Box
                  onClick={() => {
                    window.open(
                      'https://www.youtube.com/watch?v=JwYX52BP2Sk',
                      '_blank'
                    );
                  }}
                >
                  <Clock
                    type="digital"
                    alignSelf="center"
                    precision="minutes"
                  />
                </Box>
                <About width={this.props.width} />
                <ReportBug uid={this.props.uid} width={this.props.width} />
              </Box>
            )}
            {size !== 'small' && this.props.width > 950 && (
              <Box
                direction="row"
                align="center"
                alignContent="center"
                gap="small"
              >
                <Multimedia />
                <Text textAlign="center">Movie data provided by:</Text>
                <Anchor
                  size="medium"
                  alignSelf="end"
                  href="https://www.themoviedb.org/"
                  target="_blank"
                  label="The Movie Database (TMDB)"
                />
              </Box>
            )}
            {this.props.width < 950 && (
              <MobileNav
                width={this.props.width}
                handleSort={(sortBy) => this.props.handleSort(sortBy)}
                sortBy={this.props.sortBy}
                handleSearch={(searchVal) => this.props.handleSearch(searchVal)}
                logOut={this.props.logOut}
                wishlist={this.props.wishlist}
                uid={this.props.uid}
                handleAccountDelete={this.props.handleAccountDelete}
                lot={this.props.lot}
                wishlistFilms={this.props.wishlistFilms}
                name={this.props.name}
                fetchedWishlist={this.props.fetchedWishlist}
                handleParsed={(movieList) => this.props.handleParsed(movieList)}
                allowedFilters={this.props.allowedFilters}
                handleFilterByTag={(filters) =>
                  this.props.handleFilterByTag(filters)
                }
                mediaTags={this.props.mediaTags}
                genreTags={this.props.genreTags}
                ratings={['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']}
                handleResetFilters={this.props.handleResetFilters}
                handleTagDelete={(tags) => this.props.handleTagDelete(tags)}
                handleUpdatedTags={(tags) => this.props.handleUpdatedTags(tags)}
                handleTagAdded={(tag) => this.props.handleTagAdded(tag)}
                handleSaveOrderChange={(checked) =>
                  this.props.handleSaveOrderChange(checked)
                }
                handlePrefChanged={(index) =>
                  this.props.handlePrefChanged(index)
                }
                saveSortedOrder={this.props.saveSortedOrder}
              />
            )}
          </Footer>
        )}
      </ResponsiveContext.Consumer>
    );
  }
}
