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

export const AppBar = (props: any) => (
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
  state: {
    uid: string;
    invalidRoute: boolean;
    loggedIn: boolean;
    movies: movie[];
    showSettings: boolean;
    wishlist: boolean;
    searchVal: string;
    searchList: movie[];
  } = {
    uid: '',
    invalidRoute: false,
    loggedIn: true,
    movies: [],
    showSettings: false,
    wishlist: false,
    searchVal: '',
    searchList: []
  };

  constructor(props: any) {
    super(props);
    this.state = {
      uid: props.location.state === undefined ? '' : props.location.state.id,
      invalidRoute: false,
      loggedIn: true,
      movies: [],
      showSettings: false,
      wishlist: false,
      searchVal: '',
      searchList: []
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
          if (userCollection) {
            lot = userCollection.map((movie) => {
              const entry: movie = {
                name: movie.name,
                plot: movie.plot,
                date: movie.date,
                poster: movie.poster,
                id: movie.id
              };
              return entry;
            });

            this.setState({
              movies: lot
            });
          }
        });
    }
  };

  moviesAdded = (movies: movie[]) => {
    let collection: movie[] = this.state.movies;

    for (let i = 0; i < movies.length; i++) {
      collection.push(movies[i]);
    }
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
        localStorage.removeItem('rememberMe');
        this.setState({
          loggedIn: false
        });
      })
      .catch((error: any) => {
        console.log(error);
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

  handleSearch = (event: any) => {
    let searchList: movie[] = [];
    for (let i = 0; i < this.state.movies.length; i++) {
      if (
        this.state.movies[i].name
          .toLowerCase()
          .includes(event.target.value.toLowerCase())
      ) {
        searchList.push(this.state.movies[i]);
      }
    }
    this.setState({
      searchVal: event.target.value,
      searchList: searchList
    });
  };

  handleDeleteMovie = (id: string) => {
    let newLot: movie[] = [];
    for (let i = 0; i < this.state.movies.length; i++) {
      if (this.state.movies[i].id !== id) {
        newLot.push(this.state.movies[i]);
      }
    }

    const userRef = firebase.database().ref('/users/' + this.state.uid);
    userRef.set({
      collection: newLot
    });
    this.setState({
      movies: newLot
    });
  };

  handleAccountDelete = () => {
    const userRef = firebase.database().ref('/users/' + this.state.uid);
    userRef
      .remove()
      .then(() => {
        console.log('user deleted');
        localStorage.clear();
        this.logOut();
      })
      .catch((error) => {
        console.log('account deletion unsuccessful: ' + error.message);
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
                          value={this.state.searchVal}
                          title="search your film lot!"
                          placeholder={`search ${this.state.movies.length} films...`}
                          icon={<Search />}
                          onChange={(event) => this.handleSearch(event)}
                        />
                        <Box>
                          <AddTitle
                            uid={this.state.uid}
                            moviesAdded={(movies: movie[]) =>
                              this.moviesAdded(movies)
                            }
                          />
                        </Box>
                        <Menu
                          disabled
                          hoverIndicator="accent-1"
                          title="filter by tags"
                          focusIndicator={false}
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
                        value={this.state.searchVal}
                        focusIndicator={false}
                        placeholder="my collection"
                        icon={<Search />}
                        suggestions={[
                          `search ${this.state.movies.length} films...`
                        ]}
                        onChange={(event) => this.handleSearch(event)}
                      />
                      <AddTitle
                        uid={this.state.uid}
                        moviesAdded={(movies: movie[]) =>
                          this.moviesAdded(movies)
                        }
                      />
                      <Menu
                        disabled
                        title="filter by tags"
                        focusIndicator={false}
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
                      focusIndicator={false}
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
                    searchList={this.state.searchList}
                    searchVal={this.state.searchVal}
                    handleDelete={(id: string) => this.handleDeleteMovie(id)}
                  />
                </Box>
                <FooterComponent />
                {this.state.showSettings ? (
                  <Settings
                    loggedIn={this.state.loggedIn}
                    logOut={this.logOut}
                    toggleSettings={this.toggleSettings}
                    handleWishlist={this.handleWishlist}
                    wishlist={this.state.wishlist}
                    uid={this.state.uid}
                    handleAccountDelete={this.handleAccountDelete}
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
