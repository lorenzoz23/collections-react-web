import React, { Component } from "react";
import { Box, Text, ResponsiveContext } from "grommet";
import AddTitle from "./AddTitle";

export default class Collection extends Component {
  state = {
    movies: []
  };

  render() {
    return (
      <ResponsiveContext.Consumer>
        {(size) => (
          <Box direction="row" flex justify="center">
            <Box align="center" justify="center" flex>
              <Text>there is nothing</Text>
              <Text>in your collection.</Text>
            </Box>
            {size !== "small" ? (
              <Box justify="end" pad="small">
                <AddTitle />
              </Box>
            ) : null}
          </Box>
        )}
      </ResponsiveContext.Consumer>
    );
  }
}
