import React, { Component } from 'react';
import {
  Footer,
  Box,
  Clock,
  Text,
  Anchor,
  ResponsiveContext,
  Button,
  Layer,
  Heading,
  Paragraph
} from 'grommet';
import { Multimedia, FormClose, CircleInformation } from 'grommet-icons';
import ReportBug from './ReportBug';
import MobileNav from './MobileNav';
import { searchResults } from './MovieSearchResult';
import { movie } from './HomePage';

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
}

export default class FooterComponent extends Component<FooterComponentProps> {
  state = {
    showAbout: false
  };

  render() {
    const mode = localStorage.getItem('visualModeValue') || 'wedding';
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
                    horizontal:
                      size === 'small' && this.props.width < 700
                        ? 'xlarge'
                        : 'medium',
                    bottom:
                      size !== 'small'
                        ? 'xsmall'
                        : this.props.width < 700
                        ? 'large'
                        : 'small'
                  }
                : 'none'
            }
            justify={
              size === 'small' && this.props.width < 700 ? 'center' : 'between'
            }
            background={{
              color:
                size === 'small' && this.props.width < 700 ? 'home' : 'footer',
              opacity: 0.9
            }}
            border={
              size === 'small' && this.props.width < 700
                ? { color: 'accent-1', size: 'small', side: 'all' }
                : undefined
            }
          >
            {(size === 'small' && this.props.width > 700) ||
              (size !== 'small' && (
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
                  <Button
                    style={{ borderRadius: 30 }}
                    hoverIndicator={{ color: 'accent-3', opacity: 'strong' }}
                    title="about"
                    icon={<CircleInformation />}
                    onClick={() => this.setState({ showAbout: true })}
                  />
                  <ReportBug {...this.props} />
                </Box>
              ))}
            {(size === 'small' && this.props.width > 700) ||
              (size !== 'small' && (
                <Box
                  direction="row"
                  align="center"
                  alignContent="center"
                  gap="small"
                >
                  <Multimedia />
                  <Text textAlign="center">Movie data provided by:</Text>
                  <Anchor
                    alignSelf="center"
                    href="https://www.themoviedb.org/"
                    target="_blank"
                    label="The Movie Database (TMDB)"
                  />
                </Box>
              ))}
            {size === 'small' && this.props.width < 700 && (
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
              />
            )}
            {this.state.showAbout && (
              <Layer
                position="center"
                onClickOutside={() => this.setState({ showAbout: false })}
                style={{ borderRadius: 30 }}
              >
                <Box
                  align="center"
                  flex
                  pad="small"
                  background="layer"
                  justify="center"
                  round={size !== 'small' ? true : false}
                  overflow="auto"
                  border={{ size: 'medium', side: 'all', color: 'accent-1' }}
                >
                  <Heading textAlign="center">About Cinelot</Heading>
                  <Paragraph textAlign="center">
                    Cinelot allows you to browse, search, and maintain your
                    physical film collection on the go. gone are the days of
                    double purchasing blu-rays due to unforseen lapses in
                    memory.
                  </Paragraph>
                  <Text textAlign="center" weight="bold">
                    How to Use:
                  </Text>
                  <Paragraph textAlign="center">
                    Looking to add a film to your lot or wishlist? Click on the
                    + button at the top of the app and search by film title and
                    year (year is an optional field but is highly recommended
                    for better, more concise results.) Once you've added so many
                    movies that lazily scrolling through them becomes a hassle,
                    query the search bar with a film title to quickly see
                    whether you own it; if you don't, make sure to add it to
                    your wishlist!
                  </Paragraph>

                  {size === 'small' && (
                    <Box round>
                      <Button
                        style={{ borderRadius: 30 }}
                        primary
                        icon={<FormClose />}
                        onClick={() => this.setState({ showAbout: false })}
                      />
                    </Box>
                  )}
                </Box>
              </Layer>
            )}
          </Footer>
        )}
      </ResponsiveContext.Consumer>
    );
  }
}
