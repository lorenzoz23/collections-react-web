import React, { Component } from 'react';
import {
  Box,
  Button,
  Layer,
  Text,
  Anchor,
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
  ResponsiveContext
} from 'grommet';
import BeatLoader from 'react-spinners/BeatLoader';

import { movie } from './HomePage';
import CSV from '../component-assets/example-csv-file-cinelot.csv';
import { searchResults, searchResultMovie } from './MovieSearchResult';

interface ImportProps {
  handleParsed(movieList: searchResults): void;
}

export default class Import extends Component<ImportProps> {
  state: {
    visible: boolean;
    continueImportVisible: boolean;
    file: any;
    loading: boolean;
    parsed: boolean;
  } = {
    visible: false,
    continueImportVisible: false,
    file: {},
    loading: false,
    parsed: false
  };

  parseFile = () => {
    this.setState({
      loading: true
    });
    const r = new FileReader();
    r.readAsText(this.state.file);
    r.onload = async () => {
      const ct: any = r.result!;
      const entries: string[] = ct.split('\n');
      const header: string[] = entries[0].split(',');
      if (!header.includes('imdbID')) {
        if (!header.includes('title')) {
          console.log('error: incorrectly formatted csv file');
          return;
        }
      }
      let newMovies: movie[] = [];
      const imdbIndex: number = header.indexOf('imdbID');
      for (let i = 1; i < entries.length; i++) {
        const entry: string[] = entries[i].split(',');
        if (imdbIndex > -1) {
          const id = entry[imdbIndex];
          if (id.substring(0, 2) === 'tt' && id.length > 2) {
            const response = await fetch(
              `https://api.themoviedb.org/3/find/${entry[imdbIndex]}?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US&external_source=imdb_id`
            );
            const data = await response.json();
            const results = data.movie_results;
            const image: string = results[0].backdrop_path
              ? 'https://image.tmdb.org/t/p/original' + results[0].backdrop_path
              : '';
            const movieResult: movie = {
              name: results[0].title || results[0].original_title,
              plot: results[0].overview || '',
              date: results[0].release_date || '',
              poster: results[0].poster_path
                ? 'https://image.tmdb.org/t/p/w500' + results[0].poster_path
                : '',
              backDrop: [image],
              rating: '',
              runtime: 0,
              genre: [],
              id: results[0].id || '',
              starCount: -1,
              tags: [],
              watched: 0
            };
            newMovies.push(movieResult);
          }
        }
      }

      const results = this.convertMoviesToSearchResults(newMovies);
      this.setState({
        loading: false,
        continueImportVisible: false,
        parsed: true
      });
      this.props.handleParsed(results);
    };
  };

  convertMoviesToSearchResults = (movies: movie[]) => {
    const movieResults: searchResultMovie[] = movies.map((item) => {
      const newSearchResultMovie: searchResultMovie = {
        movie: item,
        checkedLot: true,
        checkedWishlist: false
      };
      return newSearchResultMovie;
    });
    const newMovieList: searchResults = {
      movies: movieResults
    };
    return newMovieList;
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
    const periodIndex: number = (fileUploaded.name as string).lastIndexOf('.');
    const ext: string = (fileUploaded.name as string).substring(
      periodIndex + 1
    );
    console.log(ext);
    if (ext === 'csv') {
      this.setState({ file: fileUploaded, continueImportVisible: true });
    }
  };

  downloadCSV = () => {
    window.open(CSV, '_blank');
  };

  render() {
    return (
      <ResponsiveContext.Consumer>
        {(size) => (
          <Box align="center" justify="center">
            <Button
              label="Import"
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
                  width={size === 'small' ? 'small' : 'medium'}
                  round
                  margin="small"
                  gap="medium"
                  flex
                >
                  <Box align="center">
                    <Text textAlign="center">
                      You selected the following file:{' '}
                    </Text>
                    <Text weight="bold" textAlign="center">
                      {this.state.file.name}
                    </Text>
                  </Box>
                  {!this.state.loading ? (
                    <Box gap="small">
                      <Button
                        label="Continue with import"
                        primary
                        onClick={this.parseFile}
                      />
                      <Button
                        onClick={() =>
                          this.setState({ continueImportVisible: false })
                        }
                        alignSelf="center"
                        label="Cancel"
                        hoverIndicator="status-error"
                        color="status-error"
                        primary={size === 'small'}
                      />
                    </Box>
                  ) : (
                    <Box align="center" justify="center">
                      <BeatLoader
                        size={45}
                        margin={5}
                        color={'#6FFFB0'}
                        loading={this.state.loading}
                      />
                    </Box>
                  )}
                </Box>
              </Layer>
            )}
            {this.state.visible && (
              <Layer
                position="center"
                onClickOutside={() => this.setState({ visible: false })}
                style={{ borderRadius: size === 'small' ? 0 : 30 }}
                margin={{ bottom: 'medium' }}
                responsive
              >
                <Box
                  gap="small"
                  pad="medium"
                  round={size === 'small' ? false : true}
                  align="center"
                  justify={size === 'small' ? 'center' : 'start'}
                  background="smallLayer"
                  flex
                >
                  <Text weight="bold" textAlign="center" size="large">
                    Importing your film data
                  </Text>
                  <Anchor label="example csv file" onClick={this.downloadCSV} />
                  <Text textAlign="center">
                    {/* the above file is a good example of the cinelot import format: a
                csv file that supports the following column titles, in any order
                (other column titles will be ignored), where, even though all
                column titles are optional, at least one of the first two column
                titles must be included on the first line of your file */}
                    The above file is a good example of the cinelot import
                    format: a csv file that includes a column title for imdbIDs
                    (support for more column titles is coming)
                  </Text>
                  <Table alignSelf="center">
                    <TableHeader>
                      <TableRow>
                        <TableCell scope="col" border="bottom">
                          Column title
                        </TableCell>
                        <TableCell scope="col" border="bottom">
                          Column value
                        </TableCell>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell scope="row">
                          <Text weight="bold">imdbID</Text>
                        </TableCell>
                        <TableCell>
                          Example: tt0449089 (taken from{' '}
                          <Anchor
                            label="https://www.imdb.com/title/tt0449089"
                            href="https://www.imdb.com/title/tt0449089"
                            target="_blank"
                          />
                          )
                        </TableCell>
                      </TableRow>
                      {/* <TableRow>
                    <TableCell scope="row">
                      <Text weight="bold">title</Text>
                    </TableCell>
                    <TableCell>
                      example: rv (used for matching when no ID is provided)
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell scope="row">
                      <Text weight="bold">year</Text>
                    </TableCell>
                    <TableCell>
                      example: 2006 (used for matching when no ID is provided)
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell scope="row">
                      <Text weight="bold">directors</Text>
                    </TableCell>
                    <TableCell>
                      example: barry sonnenfeld (used for matching when no ID is
                      provided)
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell scope="row">
                      <Text weight="bold">rating</Text>
                    </TableCell>
                    <TableCell>
                      example: 4.5 (rating out of 5 including 0.5 increments)
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell scope="row">
                      <Text weight="bold">rating10</Text>
                    </TableCell>
                    <TableCell>example: 9 (rating out of 10)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell scope="row">
                      <Text weight="bold">tags</Text>
                    </TableCell>
                    <TableCell>
                      example: "blu-ray, dvd, digital" (the various mediums in
                      which you own a title)
                    </TableCell>
                  </TableRow> */}
                    </TableBody>
                  </Table>
                  {/* <Box align="center">
                <Text weight="bold" size="small" textAlign="center">
                  note:
                </Text>
                <Text size="small" textAlign="center">
                  entries containing commas (such as director/tag lists) must be
                  placed inside quotes, eg: "Josh Safdie, Benny Safdie" (for
                  directors) or "blu-ray, dvd, 4k-uhd" (for tags)
                </Text>
              </Box> */}
                  <Button
                    label="Select CSV file"
                    primary={size === 'small'}
                    onClick={this.openFileSystem}
                    hoverIndicator="brand"
                  />
                </Box>
              </Layer>
            )}
          </Box>
        )}
      </ResponsiveContext.Consumer>
    );
  }
}
