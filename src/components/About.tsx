import React, { Component } from 'react';
import {
  Layer,
  Box,
  Heading,
  Paragraph,
  Button,
  Text,
  ResponsiveContext
} from 'grommet';
import { FormClose, CircleInformation } from 'grommet-icons';

interface AboutProps {
  width: number;
}

export default class About extends Component<AboutProps> {
  state = {
    showAbout: false
  };
  render() {
    return (
      <ResponsiveContext.Consumer>
        {(size) => (
          <Box>
            <Button
              hoverIndicator={{ color: 'accent-3', opacity: 'strong' }}
              style={{ borderRadius: 30 }}
              title="About Cinelot"
              label={this.props.width < 950 ? 'About Cinelot' : undefined}
              color="neutral-3"
              primary={this.props.width < 950}
              icon={<CircleInformation />}
              reverse
              onClick={() => this.setState({ showAbout: true })}
            />
            {this.state.showAbout && (
              <Layer
                position="center"
                responsive={this.props.width < 950 ? true : false}
                onClickOutside={() => this.setState({ showAbout: false })}
                style={{
                  borderRadius: 30,
                  width: this.props.width < 950 ? '100%' : undefined,
                  height: this.props.width < 950 ? '100%' : undefined
                }}
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

                  {this.props.width < 950 && (
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
          </Box>
        )}
      </ResponsiveContext.Consumer>
    );
  }
}
