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
import { Multimedia, CircleQuestion } from 'grommet-icons';

export default class FooterComponent extends Component {
  state = {
    showAbout: false
  };

  render() {
    return (
      <ResponsiveContext.Consumer>
        {(size) => (
          <Footer
            pad="medium"
            gap="medium"
            background="footer"
            justify={size !== 'small' ? 'between' : 'center'}
            height="10px"
          >
            <Box direction="row" align="center" gap="small">
              {size !== 'small' ? (
                <Box
                  onClick={() => {
                    window.open(
                      'https://www.youtube.com/watch?v=JwYX52BP2Sk',
                      '_blank'
                    );
                  }}
                >
                  <Clock type="digital" alignSelf="center" size="small" />
                </Box>
              ) : null}
              <Button
                title="about"
                icon={<CircleQuestion />}
                focusIndicator={false}
                onClick={() => this.setState({ showAbout: true })}
              />
            </Box>
            {this.state.showAbout ? (
              <Layer
                position="center"
                onClickOutside={() => this.setState({ showAbout: false })}
                style={{ borderRadius: 30 }}
              >
                <Box
                  align="center"
                  pad="small"
                  background="addTitle"
                  style={{ borderRadius: 30 }}
                >
                  <Heading>about cinelot</Heading>
                  <Paragraph textAlign="center">
                    cinelot allows you to browse, search, and maintain your
                    physical film collection on the go. gone are the days of
                    double purchasing blu-rays due to unforseen lapses in
                    memory. cinelot is here for you, forever and always...
                  </Paragraph>
                  <Paragraph textAlign="center">
                    to add a film to your lot, click on the + button at the top
                    of the app and search by film title and year (year is an
                    optional field but is highly recommended for better, more
                    concise results.) once you've added so many movies that
                    lazily scrolling through them becomes a hassle, query the
                    search bar with a film title to quickly see if you own it or
                    not!
                  </Paragraph>
                </Box>
              </Layer>
            ) : null}
            <Box
              direction="row"
              align="center"
              gap={size !== 'small' ? 'small' : 'xsmall'}
            >
              <Multimedia size={size !== 'small' ? 'medium' : 'small'} />
              <Text size={size !== 'small' ? 'small' : 'xsmall'}>
                movie data provided by:
              </Text>
              <Anchor
                href="https://www.themoviedb.org/"
                target="_blank"
                size={size !== 'small' ? 'small' : 'xsmall'}
              >
                {size !== 'small' ? 'The Movie Database (tMDB)' : 'tMDB'}
              </Anchor>
            </Box>
          </Footer>
        )}
      </ResponsiveContext.Consumer>
    );
  }
}
