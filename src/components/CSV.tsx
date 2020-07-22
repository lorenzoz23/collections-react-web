import React, { Component } from 'react';
import { Box } from 'grommet';
import 'firebase/database';

import { movie } from './HomePage';
import Import from './Import';
import Export from './Export';
import { searchResults } from './MovieSearchResult';

interface CSVProps {
  lot: movie[];
  wishlist: movie[];
  name: string;
  fetchedWishlist: boolean;
  uid: string;
  handleParsed(movieList: searchResults): void;
}

export default class CSV extends Component<CSVProps> {
  render() {
    return (
      <Box gap="xsmall" direction="row" align="center" justify="center">
        <Import
          handleParsed={(movieList) => this.props.handleParsed(movieList)}
        />
        <Export {...this.props} />
      </Box>
    );
  }
}
