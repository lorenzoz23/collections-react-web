import React, { Component } from "react";
import { Layer, Box, Heading, Button, Text } from "grommet";
import { FormClose } from "grommet-icons";

export default class MovieSearchResult extends Component {
  state = {
    visible: false
  };
  render() {
    return (
      <Box>
        <Button
          label="go"
          onClick={() => this.setState({ visible: !this.state.visible })}
        />
        {this.state.visible ? (
          <Layer
            position="center"
            onClickOutside={() =>
              this.setState({ visible: !this.state.visible })
            }
          >
            <Box justify="center" align="center" pad="medium">
              <Heading level="2">movie title</Heading>
              <Box gap="medium">
                <Text>plot synopsis</Text>
                <Button
                  title="close"
                  alignSelf="center"
                  size="small"
                  icon={<FormClose />}
                  primary
                  onClick={() =>
                    this.setState({ visible: !this.state.visible })
                  }
                />
              </Box>
            </Box>
          </Layer>
        ) : null}
      </Box>
    );
  }
}
