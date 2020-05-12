import React, { Component } from "react";
import { Footer, Box, Clock, Text, Anchor, ResponsiveContext } from "grommet";
import { Multimedia } from "grommet-icons";

export default class FooterComponent extends Component {
  render() {
    return (
      <ResponsiveContext.Consumer>
        {(size) => (
          <Footer
            pad="medium"
            gap="medium"
            background="brand"
            justify={size !== "small" ? "between" : "center"}
            height="10px"
          >
            {size !== "small" ? (
              <Box>
                <Clock type="digital" alignSelf="center" size="small" />
              </Box>
            ) : null}
            <Box
              direction="row"
              align="center"
              gap={size !== "small" ? "small" : "xsmall"}
            >
              <Multimedia size={size !== "small" ? "medium" : "small"} />
              <Text size={size !== "small" ? "small" : "xsmall"}>
                movie data provided by:
              </Text>
              <Anchor
                href="https://www.themoviedb.org/"
                target="_blank"
                size={size !== "small" ? "small" : "xsmall"}
              >
                {size !== "small" ? "The Movie Database (tMDB)" : "tMDB"}
              </Anchor>
            </Box>
          </Footer>
        )}
      </ResponsiveContext.Consumer>
    );
  }
}
