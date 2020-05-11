import React, { Component } from 'react';
import { Box, Button } from 'grommet';
import { Add } from 'grommet-icons';

export default class AddTitle extends Component {
  state = {};

  render() {
    return (
      <Box title="add a film!" align="center">
        <Button onClick={() => {}} icon={<Add />} />
      </Box>
    );
  }
}
