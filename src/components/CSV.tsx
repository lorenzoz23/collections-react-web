import React, { Component } from 'react';
import { Box } from 'grommet';
import 'firebase/database';

import { movie } from './HomePage';
import Import from './Import';
import Export from './Export';

interface CSVProps {
  lot: movie[];
  wishlist: movie[];
  name: string;
  fetchedWishlist: boolean;
  uid: string;
}

export default class CSV extends Component<CSVProps> {
  render() {
    return (
      <Box gap="xxsmall" direction="row" align="center" justify="center">
        <Import />
        <Export {...this.props} />
      </Box>
    );
  }
}
