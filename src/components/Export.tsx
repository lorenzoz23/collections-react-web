import React, { Component } from 'react';
import { CSVLink } from 'react-csv';
import { Box, Button, Layer, Text, ResponsiveContext } from 'grommet';
import firebase from 'firebase';
import 'firebase/database';

import { movie } from './HomePage';

interface ExportProps {
  lot: movie[];
  wishlist: movie[];
  name: string;
  fetchedWishlist: boolean;
  uid: string;
}

const movieCsvData = [
  [
    'TMDBID',
    'Name',
    'Plot',
    'Date',
    'Rating',
    'Runtime',
    'Genre',
    'StarCount',
    'Poster',
    'Backdrops',
    'Wishlist'
  ]
];

export default class Export extends Component<ExportProps> {
  state = {
    visible: false
  };

  handleLotExport = () => {
    for (let i = 0; i < this.props.lot.length; i++) {
      let newMovieArr: any[] = [];

      newMovieArr.push(this.props.lot[i].id);
      newMovieArr.push(this.props.lot[i].name);
      newMovieArr.push(this.props.lot[i].plot);
      newMovieArr.push(this.props.lot[i].date);
      newMovieArr.push(this.props.lot[i].rating);
      newMovieArr.push(this.props.lot[i].runtime);
      newMovieArr.push(this.props.lot[i].genre);
      newMovieArr.push(this.props.lot[i].starCount);
      newMovieArr.push(this.props.lot[i].poster);
      newMovieArr.push(this.props.lot[i].backDrop);
      newMovieArr.push('false');

      movieCsvData.push(newMovieArr);
    }
  };

  handleWishlistExport = async () => {
    if (!this.props.fetchedWishlist && this.props.wishlist.length === 0) {
      if (this.props.uid) {
        const userRef = firebase.database().ref('users/' + this.props.uid);
        const wishlistRef = userRef.child('wishlist');
        const snapshot = await wishlistRef.once('value');
        snapshot.forEach((childSnapshot) => {
          const movie = childSnapshot.val().movie;
          let newMovieArr: any[] = [];

          newMovieArr.push(movie.id);
          newMovieArr.push(movie.name);
          newMovieArr.push(movie.plot);
          newMovieArr.push(movie.date);
          newMovieArr.push(movie.rating);
          newMovieArr.push(movie.runtime);
          newMovieArr.push(movie.genre);
          newMovieArr.push(movie.starCount);
          newMovieArr.push(movie.poster);
          newMovieArr.push(movie.backDrop);
          newMovieArr.push('true');

          movieCsvData.push(newMovieArr);
        });
      }
    } else {
      for (let i = 0; i < this.props.wishlist.length; i++) {
        let newMovieArr: any[] = [];

        newMovieArr.push(this.props.wishlist[i].id);
        newMovieArr.push(this.props.wishlist[i].name);
        newMovieArr.push(this.props.wishlist[i].plot);
        newMovieArr.push(this.props.wishlist[i].date);
        newMovieArr.push(this.props.wishlist[i].rating);
        newMovieArr.push(this.props.wishlist[i].runtime);
        newMovieArr.push(this.props.wishlist[i].genre);
        newMovieArr.push(this.props.wishlist[i].starCount);
        newMovieArr.push(this.props.wishlist[i].poster);
        newMovieArr.push(this.props.wishlist[i].backDrop);
        newMovieArr.push('true');

        movieCsvData.push(newMovieArr);
      }
    }
    console.log(movieCsvData);
  };

  handleExport = async () => {
    this.handleLotExport();
    await this.handleWishlistExport();
    this.setState({ visible: true });
  };

  render() {
    const name: string = this.props.name.replace(' ', '-');
    return (
      <ResponsiveContext.Consumer>
        {(size) => (
          <Box align="center" justify="center">
            <Button
              label="Export"
              hoverIndicator="accent-1"
              onClick={async () => {
                await this.handleExport();
              }}
            />
            {this.state.visible && (
              <Layer
                position="bottom"
                onClickOutside={() => this.setState({ visible: false })}
                style={{
                  borderRadius: size !== 'small' ? 30 : undefined,
                  width: size === 'small' ? '100%' : undefined
                }}
                margin={{ bottom: size !== 'small' ? 'medium' : 'none' }}
                responsive={false}
              >
                <Box
                  gap="small"
                  pad="medium"
                  round={size !== 'small'}
                  align="center"
                  background="smallLayer"
                  flex
                >
                  <Text weight="bold" textAlign="center">
                    Pressing continue will export a single csv file encompassing
                    all the films in both your lot and wishlist
                  </Text>
                  <Text textAlign="center">is this ok?</Text>
                  <CSVLink
                    data={movieCsvData}
                    filename={'Cinelot-Movie-Data-' + name + '.csv'}
                  >
                    <Button
                      label="Continue with export"
                      onClick={() => this.setState({ visible: false })}
                      primary
                      hoverIndicator="accent-1"
                    />
                  </CSVLink>
                </Box>
              </Layer>
            )}
          </Box>
        )}
      </ResponsiveContext.Consumer>
    );
  }
}
