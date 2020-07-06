import React, { Component } from 'react';
import { CSVLink } from 'react-csv';
import { Box, Button } from 'grommet';
import { movie } from './HomePage';

const movieCsvData = [
  ['name', 'plot', 'date', 'rating', 'runtime', 'genre', 'tMDBID', 'starCount'],
  ['Her', 'something...', '01/01/1970', 'R', '120', 'Drama/Romance', 1234, 5],
  [
    'Call Me By Your Name',
    'something...',
    '01/01/1970',
    'R',
    '130',
    'Drama/Romance',
    1235,
    5
  ],
  [
    'Arrival',
    'something...',
    '01/01/1970',
    'R',
    '140',
    'Science Fiction/Thriller/Drama',
    1236,
    5
  ]
];

interface CSVProps {
  lot: movie[];
  wishlist: movie[];
  name: string;
}

export default class CSV extends Component<CSVProps> {
  handleImport = () => {
    document.getElementById('fileSystem')?.click();
  };

  handleImportChange = (event: any) => {
    const fileUploaded = event.target.files[0];
    console.log('file ' + fileUploaded);
  };

  render() {
    const name: string = this.props.name.replace(' ', '-');
    return (
      <Box gap="small" direction="row">
        <Button
          label="import"
          onClick={this.handleImport}
          hoverIndicator="accent-1"
        />
        <CSVLink
          data={movieCsvData}
          filename={'cinelot-movie-data-' + name + '.csv'}
        >
          <Button label="export" hoverIndicator="accent-1" />
        </CSVLink>
        <input
          type="file"
          style={{ display: 'none' }}
          id="fileSystem"
          onChange={this.handleImportChange}
        />
      </Box>
    );
  }
}
