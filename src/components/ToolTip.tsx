import React, { Component } from 'react';
import { Drop, Box } from 'grommet';

interface ToolTipProps {
  title: string;
}

export default class ToolTip extends Component<ToolTipProps> {
  render() {
    return (
      <Drop align={{ left: 'right' }} plain>
        <Box
          margin="xsmall"
          pad="small"
          background="dark-3"
          round={{ size: 'medium', corner: 'left' }}
        >
          {this.props.title}
        </Box>
      </Drop>
    );
  }
}
