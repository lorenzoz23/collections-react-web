import React, { Component } from 'react';
import { Box, Text, Button } from 'grommet';
import { FormAdd } from 'grommet-icons';

interface TagProps {
  title: string;
}

export default class Tag extends Component<TagProps> {
  render() {
    const mode = localStorage.getItem('visualModeValue') || 'gradient';
    return (
      <Box direction="row" gap="xsmall">
        <Box
          direction="row"
          border={{
            size: 'xsmall',
            side: 'all',
            color: 'neutral-3'
          }}
          pad={{ horizontal: 'small' }}
          margin={{ vertical: 'small' }}
          background={{
            color: 'neutral-3',
            opacity: mode === 'solid' ? 'medium' : 'weak'
          }}
          align="center"
          justify="center"
          round
        >
          <Text
            size="small"
            textAlign="center"
            weight={mode === 'solid' ? 'bold' : 'normal'}
          >
            blu-ray
          </Text>
        </Box>
        <Box
          direction="row"
          border={{
            size: 'xsmall',
            side: 'all',
            color: 'status-error'
          }}
          pad={{ horizontal: 'small' }}
          margin={{ vertical: 'small' }}
          background={{
            color: 'status-error',
            opacity: mode === 'solid' ? 'medium' : 'weak'
          }}
          align="center"
          justify="center"
          round
        >
          <Text
            size="small"
            textAlign="center"
            weight={mode === 'solid' ? 'bold' : 'normal'}
          >
            dvd
          </Text>
        </Box>
        <Button icon={<FormAdd />} title="add a tag!" focusIndicator={false} />
      </Box>
    );
  }
}
