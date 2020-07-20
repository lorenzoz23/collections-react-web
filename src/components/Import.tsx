import React, { Component } from 'react';
import { Box, Button, Layer, Text, Anchor } from 'grommet';
//import { movie } from './HomePage';

import CSV from '../component-assets/WATCHLIST.csv';

export default class Import extends Component {
  state = {
    visible: false,
    continueImportVisible: false,
    fileName: ''
  };

  openFileSystem = () => {
    this.setState({ visible: false });
    document.getElementById('fileSystem')?.click();
  };

  handleImport = () => {
    this.setState({
      visible: true
    });
  };

  handleImportChange = (event: any) => {
    const fileUploaded = event.target.files[0];
    console.log(fileUploaded.name);
    this.setState({ fileName: fileUploaded.name, continueImportVisible: true });
  };

  downloadCSV = () => {
    window.open(CSV, '_blank');
  };

  render() {
    return (
      <Box gap="xxsmall" direction="row" align="center" justify="center">
        <Button
          label="import"
          onClick={this.handleImport}
          hoverIndicator="accent-1"
        />
        <input
          type="file"
          style={{ display: 'none' }}
          id="fileSystem"
          onChange={this.handleImportChange}
        />
        {this.state.continueImportVisible && (
          <Layer
            position="top"
            style={{ borderRadius: 30 }}
            margin={{ top: 'medium' }}
            responsive={false}
          >
            <Box
              justify="center"
              align="center"
              background="smallLayer"
              pad="medium"
              round
              width="medium"
              margin="small"
              gap="medium"
            >
              <Box align="center">
                <Text>you selected the following file: </Text>
                <Text weight="bold">{this.state.fileName}</Text>
              </Box>
              <Box gap="xsmall">
                <Button label="continue with import" primary />
                <Button
                  onClick={() =>
                    this.setState({ continueImportVisible: false })
                  }
                  label="cancel"
                  hoverIndicator="status-error"
                  color="status-error"
                />
              </Box>
            </Box>
          </Layer>
        )}
        {this.state.visible && (
          <Layer
            position="bottom"
            onClickOutside={() => this.setState({ visible: false })}
            style={{ borderRadius: 30 }}
            margin={{ bottom: 'medium' }}
            responsive={false}
          >
            <Box
              gap="small"
              pad="medium"
              round
              align="center"
              background="smallLayer"
            >
              <Text weight="bold" textAlign="center">
                if it's good enough for{' '}
                <Anchor
                  label="Letterboxd"
                  href="https://letterboxd.com/about/importing-data/"
                  target="_blank"
                />{' '}
                or{' '}
                <Anchor
                  label="TMDB"
                  href="https://www.themoviedb.org/settings/import-list"
                  target="_blank"
                />
                , then it's good enough for cinelot!
              </Text>
              <Text textAlign="center">
                also, be sure to check out the following example csv file to get
                a better understanding of the minimum requirements for cinelot
                when importing your csv files
              </Text>
              <Anchor label="example csv file" onClick={this.downloadCSV} />
              <Button
                label="continue with export"
                onClick={this.openFileSystem}
                primary
                hoverIndicator="accent-1"
              />
            </Box>
          </Layer>
        )}
      </Box>
    );
  }
}
