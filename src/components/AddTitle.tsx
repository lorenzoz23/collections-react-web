import React, { Component } from "react";
import { Box, Button, Heading, Collapsible, TextInput } from "grommet";
import { Add, FormClose } from "grommet-icons";
import MovieSearchResult from "./MovieSearchResult";

export default class AddTitle extends Component {
  state = {
    visible: false
  };

  render() {
    return (
      <Box title="add a film!" align="center">
        <Button
          onClick={() => {
            this.setState({ visible: !this.state.visible });
          }}
          icon={<Add />}
        />
        {this.state.visible ? (
          <Collapsible direction="horizontal" open={this.state.visible}>
            <Button
              focusIndicator={false}
              icon={<FormClose color="brand" />}
              onClick={() => this.setState({ visible: !this.state.visible })}
            />
            <Box
              flex
              pad={{ bottom: "medium", left: "medium", right: "medium" }}
              width="large"
              background="light-1"
              align="center"
              justify="center"
              overflow="auto"
              gap="small"
            >
              <Heading>search a film to add!</Heading>
              <TextInput placeholder="type the title of the film here..." />
              <MovieSearchResult />
            </Box>
          </Collapsible>
        ) : null}
      </Box>
    );
  }
}
