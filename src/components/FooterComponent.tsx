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

interface FooterComponentProps {
  uid: string;
  width: number;
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
              mode === 'wedding' ? (size === 'small' ? 'large' : true) : false
            }
            margin={
              mode === 'wedding'
                ? {
                    horizontal: 'small',
                    bottom: size !== 'small' ? 'xsmall' : 'small'
                  }
                : 'none'
            }
            background={{ color: 'footer' }}
            justify="between"
          >
            <Box
              direction="row"
              align="center"
              gap={size !== 'small' ? 'small' : 'xsmall'}
            >
              {size !== 'small' && (
                <Box
                  onClick={() => {
                    window.open(
                      'https://www.youtube.com/watch?v=JwYX52BP2Sk',
                      '_blank'
                    );
                  }}
                >
                  <Clock type="digital" alignSelf="center" />
                </Box>
              )}
              <Button
                style={{ borderRadius: 30 }}
                hoverIndicator={{ color: 'accent-3', opacity: 'strong' }}
                title="about"
                size={size === 'small' ? 'small' : undefined}
                icon={
                  <CircleInformation
                    size={this.props.width < 400 ? 'small' : undefined}
                  />
                }
                onClick={() => this.setState({ showAbout: true })}
              />
              <ReportBug {...this.props} />
            </Box>
            {this.state.showAbout ? (
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
                  <Heading textAlign="center">about cinelot</Heading>
                  <Paragraph textAlign="center">
                    cinelot allows you to browse, search, and maintain your
                    physical film collection on the go. gone are the days of
                    double purchasing blu-rays due to unforseen lapses in
                    memory.
                  </Paragraph>
                  <Paragraph textAlign="center">
                    cinelot is here for you, forever and always...
                  </Paragraph>
                  <Paragraph textAlign="center">
                    looking to add a film to your lot or wishlist? click on the
                    + button at the top of the app and search by film title and
                    year (year is an optional field but is highly recommended
                    for better, more concise results.) once you've added so many
                    movies that lazily scrolling through them becomes a hassle,
                    query the search bar with a film title to quickly see
                    whether you own it; if you don't, make sure to add it to
                    your wishlist!
                  </Paragraph>

                  {size === 'small' ? (
                    <Box round>
                      <Button
                        style={{ borderRadius: 30 }}
                        primary
                        icon={<FormClose />}
                        onClick={() => this.setState({ showAbout: false })}
                      />
                    </Box>
                  ) : null}
                </Box>
              </Layer>
            ) : null}
            <Box
              direction="row"
              align="center"
              gap={size !== 'small' ? 'small' : 'xsmall'}
            >
              <Multimedia size={this.props.width < 400 ? 'small' : undefined} />
              <Text
                size={size === 'small' ? 'size' : undefined}
                textAlign="center"
              >
                {this.props.width < 400
                  ? 'movie data:'
                  : 'movie data provided by:'}
              </Text>
              <Anchor
                alignSelf="center"
                size={size !== 'small' ? 'medium' : 'xsmall'}
                href="https://www.themoviedb.org/"
                target="_blank"
                label={size !== 'small' ? 'The Movie Database (TMDB)' : 'TMDB'}
              />
            </Box>
          </Footer>
        )}
      </ResponsiveContext.Consumer>
    );
  }
}
