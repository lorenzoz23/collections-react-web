import React, { Component } from 'react';
import { Box, Text, Button } from 'grommet';
import { FormAdd } from 'grommet-icons';

interface TagProps {
  title: string;
}

export default class Tag extends Component<TagProps> {
  state: { tags: string[] } = {
    tags: []
  };

  componentDidMount = () => {
    const tags: string[] = ['blu-ray', 'dvd', '4k-uhd'];
    this.setState({
      tags: tags
    });
  };

  render() {
    return (
      <Box
        direction="row"
        pad={{ horizontal: 'xsmall' }}
        border={{
          size: 'xsmall',
          side: 'all',
          color: 'neutral-3'
        }}
        background={{ color: 'neutral-3', opacity: 'weak' }}
        gap="xsmall"
      >
        <Box>
          {this.state.tags.map((tag) => (
            <Text size="small">{tag}</Text>
          ))}
        </Box>
        <Button icon={<FormAdd size="small" />} size="small" />
      </Box>
    );
  }
}
