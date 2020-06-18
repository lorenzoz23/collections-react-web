import React, { Component } from 'react';
import {
  Box,
  Heading,
  Anchor,
  TextInput,
  ResponsiveContext,
  Menu,
  Avatar
} from 'grommet';
import { Search, Filter, User } from 'grommet-icons';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import {
  Redirect,
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';

import Login from './Login';
import Settings from './Settings';
import AddTitle from './AddTitle';
import Collection from './Collection';
import FooterComponent from './FooterComponent';

const AppBar = (props: any) => (
  <Box
    direction="row"
    align="center"
    justify="between"
    background="header"
    style={{ zIndex: '1' }}
    {...props}
  />
);

export type movie = {
  name: string;
  plot: string;
  date: string;
  poster: string;
  id: string;
};

export default class HomePage extends Component {
  state = {
    uid: '',
    invalidRoute: false,
    loggedIn: true,
    movies: [],
    showSettings: false,
    wishlist: false
  };

  constructor(props: any) {
    super(props);
    this.state = {
      uid: props.location.state === undefined ? '' : props.location.state.id,
      invalidRoute: false,
      loggedIn: true,
      movies: [],
      showSettings: false,
      wishlist: false
    };
    console.log('uid: ' + this.state.uid);
  }

  componentDidMount = () => {
    if (this.state.uid === '') {
      this.setState({ invalidRoute: true });
    } else {
      let userCollection: any[] = [];
      let lot: movie[] = [];

      firebase
        .database()
        .ref('/users/' + this.state.uid)
        .once('value')
        .then((snapshot) => {
          userCollection = snapshot.val() && snapshot.val().collection;
        });

      userCollection.map((movie) => {
        return lot.push({
          name: movie.name,
          plot: movie.plot,
          date: movie.date,
          poster: movie.poster,
          id: movie.id
        });
      });
      console.log(lot);
      this.setState({
        movies: lot
      });
    }
  };

  movieAdded = (movie: movie) => {
    let collection: movie[] = this.state.movies;
    collection.push(movie);
    this.setState({
      movies: collection
    });
  };

  logOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        // Sign-out successful.
        console.log('success');
      })
      .catch((error: any) => {
        console.log(error);
      });
    this.setState({
      loggedIn: false
    });
  };

  toggleSettings = () => {
    this.setState({
      showSettings: !this.state.showSettings
    });
  };

  handleWishlist = () => {
    this.setState({
      wishlist: !this.state.wishlist
    });
  };

  render() {
    const home = '/home/' + this.state.uid;
    const title = this.state.wishlist ? 'my wishlist' : 'my lot';
    return (
      <Router>
        {!this.state.loggedIn || this.state.invalidRoute ? (
          <Redirect exact to="/" />
        ) : (
          <ResponsiveContext.Consumer>
            {(size) => (
              <Box fill>
                <AppBar
                  pad={
                    size === 'small'
                      ? { right: 'small', left: 'medium', vertical: 'small' }
                      : { left: 'medium', right: 'medium' }
                  }
                >
                  {size !== 'small' ? (
                    <Box direction="row" gap="medium" align="center">
                      <Heading level="3" margin="none" alignSelf="center">
                        <Anchor title="home" color="light-1" href={home}>
                          {title}
                        </Anchor>
                      </Heading>
                      <Box direction="row" align="center" gap="small">
                        <TextInput
                          title="search your film lot!"
                          placeholder={`search ${this.state.movies.length} films...`}
                          icon={<Search />}
                        />
                        <Box>
                          <AddTitle movieAdded={this.movieAdded} />
                        </Box>
                        <Menu
                          style={{ borderRadius: 100 }}
                          hoverIndicator="accent-1"
                          title="filter by tags"
                          dropAlign={{ top: 'bottom', left: 'right' }}
                          icon={<Filter />}
                          items={[
                            { label: 'blu ray', onClick: () => {} },
                            { label: 'dvd', onClick: () => {} },
                            { label: '4k', onClick: () => {} }
                          ]}
                        />
                      </Box>
                    </Box>
                  ) : (
                    <Box direction="row" gap="small" align="center">
                      <TextInput
                        focusIndicator={false}
                        placeholder="my collection"
                        icon={<Search />}
                        suggestions={[
                          `search ${this.state.movies.length} films...`
                        ]}
                      />
                      <AddTitle movieAdded={this.movieAdded} />
                      <Menu
                        title="filter by tags"
                        dropAlign={{ top: 'bottom', left: 'right' }}
                        icon={<Filter />}
                        items={[
                          { label: 'blu ray', onClick: () => {} },
                          { label: 'dvd', onClick: () => {} },
                          { label: '4k', onClick: () => {} }
                        ]}
                      />
                    </Box>
                  )}
                  <Box>
                    <Avatar
                      hoverIndicator="brand"
                      onClick={this.toggleSettings}
                      title="settings"
                      align="center"
                      size={size === 'small' ? '40px' : 'medium'}
                    >
                      <User
                        color="accent-1"
                        size={size === 'small' ? '20px' : 'medium'}
                      />
                    </Avatar>
                  </Box>
                </AppBar>
                <Box
                  overflow={{ horizontal: 'hidden' }}
                  background="home"
                  alignContent="center"
                  flex
                >
                  <Collection
                    wishlist={this.state.wishlist}
                    movies={this.state.movies}
                  />
                </Box>
                <FooterComponent />
                {this.state.showSettings ? (
                  <Settings
                    loggedIn={this.state.loggedIn}
                    logOut={this.logOut}
                    toggleSettings={this.toggleSettings}
                    handleWishlist={this.handleWishlist}
                  />
                ) : null}
              </Box>
            )}
          </ResponsiveContext.Consumer>
        )}
        <Switch>
          <Route exact path="/" component={Login} />
        </Switch>
      </Router>
    );
  }
}
