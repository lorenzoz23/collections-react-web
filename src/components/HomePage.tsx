import React, { Component } from 'react';
import {
  Box,
  Heading,
  Anchor,
  TextInput,
  ResponsiveContext,
  Menu,
  Avatar,
  Layer,
  CheckBox,
  Paragraph,
  Button,
  Text
} from 'grommet';
import {
  Search,
  Filter,
  User,
  Sort,
  Next,
  StatusGood,
  FormClose
} from 'grommet-icons';
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
  rating: string;
  runtime: number;
  genre: string[];
  id: string;
  key?: string;
  starCount?: number;
};

export default class HomePage extends Component {
  state: {
    uid: string;
    name: string;
    invalidRoute: boolean;
    loggedIn: boolean;
    movies: movie[];
    showSettings: boolean;
    wishlist: movie[];
    showWishlist: boolean;
    searchVal: string;
    searchList: movie[];
    loading: boolean;
    greeting: boolean;
    greetingChecked: boolean;
    notification: boolean;
    notificationText: string;
    width: number;
    fetchedWishlist: boolean;
  } = {
    uid: '',
    name: '',
    invalidRoute: false,
    loggedIn: true,
    movies: [],
    showSettings: false,
    wishlist: [],
    showWishlist: false,
    searchVal: '',
    searchList: [],
    loading: true,
    greeting: false,
    greetingChecked: false,
    notification: false,
    notificationText: '',
    width: 0,
    fetchedWishlist: false
  };

  constructor(props: any) {
    super(props);
    this.state = {
      uid: props.location.state === undefined ? '' : props.location.state.id,
      name: '',
      invalidRoute: false,
      loggedIn: true,
      movies: [],
      showSettings: false,
      wishlist: [],
      showWishlist: false,
      searchVal: '',
      searchList: [],
      loading: true,
      greeting: false,
      greetingChecked: false,
      notification: false,
      notificationText: '',
      width: 0,
      fetchedWishlist: false
    };
    console.log('uid: ' + this.state.uid);
    console.log('name: ' + this.state.name);
  }

  componentDidMount = () => {
    const remember = localStorage.getItem('rememberMe');
    if (this.state.uid === '' && !remember) {
      this.setState({ invalidRoute: true });
    } else {
      this.updateWindowDimensions();
      window.addEventListener('resize', this.updateWindowDimensions);

      let lot: movie[] = [];
      let name: string = '';
      let uid =
        this.state.uid === ''
          ? firebase.auth().currentUser!.uid
          : this.state.uid;

      const greeting = localStorage.getItem('greeting') || 'show';
      const showGreeting = greeting === 'show' ? true : false;

      const userRef = firebase.database().ref('users/' + uid);
      const nameRef = userRef.child('name');
      nameRef.once('value').then((snapshot) => {
        const displayName =
          firebase.auth().currentUser!.displayName || 'stranger';
        name = (snapshot.val() && snapshot.val().name) || displayName;
      });

      const collectionRef = userRef.child('collection');
      collectionRef.once('value', (snapshot) => {
        snapshot.forEach((childSnapshot) => {
          const childKey = childSnapshot.key!;
          const movie = childSnapshot.val().movie;
          const entry: movie = {
            name: movie.name,
            plot: movie.plot,
            date: movie.date,
            poster: movie.poster,
            rating: movie.rating,
            runtime: movie.runtime,
            genre: movie.genre,
            id: movie.id,
            key: childKey,
            starCount: movie.starCount || undefined
          };
          lot.push(entry);
        });
        this.setState({
          movies: lot,
          loading: false,
          greeting: showGreeting,
          name: name.toLowerCase(),
          uid: uid
        });
      });
    }
  };

  componentWillUnmount = () => {
    window.removeEventListener('resize', this.updateWindowDimensions);
  };

  updateWindowDimensions = () => {
    this.setState({ width: window.innerWidth });
  };

  moviesAdded = (lotMovies: movie[], wishlistMovies: movie[]) => {
    let newLot: movie[] = this.state.movies;
    let newWishlist: movie[] = this.state.wishlist;
    let notificationText: string = '';
    const userRef = firebase.database().ref('users/' + this.state.uid);
    if (lotMovies) {
      const collectionRef = userRef.child('collection');
      for (let i = 0; i < lotMovies.length; i++) {
        const newMovieRef = collectionRef.push();
        newMovieRef.set({ movie: lotMovies[i] });
        newLot.push(lotMovies[i]);
      }
    }
    if (wishlistMovies) {
      const wishlistRef = userRef.child('wishlist');
      for (let i = 0; i < wishlistMovies.length; i++) {
        const newMovieRef = wishlistRef.push();
        newMovieRef.set({ movie: wishlistMovies[i] });
        newWishlist.push(wishlistMovies[i]);
      }
    }

    notificationText =
      lotMovies.length +
      ` ${lotMovies.length === 1 ? 'movie' : 'movies'} added to your lot and ` +
      wishlistMovies.length +
      ` ${
        wishlistMovies.length === 1 ? 'movie' : 'movies'
      } added to your wishlist!`;
    this.setState({
      movies: newLot,
      wishlist: newWishlist,
      notification: true,
      notificationText: notificationText
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

  handleWishlist = (checked: boolean) => {
    if (checked && !this.state.fetchedWishlist) {
      const wishlistMovies: movie[] = [];
      const userRef = firebase.database().ref('users/' + this.state.uid);
      const wishlistRef = userRef.child('wishlist');
      wishlistRef.once('value', (snapshot) => {
        snapshot.forEach((childSnapshot) => {
          const childKey = childSnapshot.key!;
          const movie = childSnapshot.val().movie;
          const entry: movie = {
            name: movie.name,
            plot: movie.plot,
            date: movie.date,
            poster: movie.poster,
            rating: movie.rating,
            runtime: movie.runtime,
            genre: movie.genre,
            id: movie.id,
            key: childKey
          };
          wishlistMovies.push(entry);
        });
        this.setState({
          showWishlist: checked,
          wishlist: wishlistMovies,
          fetchedWishlist: true,
          notification: true,
          notificationText: 'switched to wishlist view!'
        });
      });
    } else {
      this.setState({
        showWishlist: checked,
        notification: true,
        notificationText: checked
          ? 'switched to wishlist view!'
          : 'switched to lot view!'
      });
    }
  };

  handleSearch = (event: any) => {
    let searchList: movie[] = [];
    const moviesToSearch: movie[] = this.state.showWishlist
      ? this.state.wishlist
      : this.state.movies;
    for (let i = 0; i < moviesToSearch.length; i++) {
      if (
        moviesToSearch[i].name
          .toLowerCase()
          .includes(event.target.value.toLowerCase())
      ) {
        searchList.push(moviesToSearch[i]);
      }
    }
    this.setState({
      searchVal: event.target.value,
      searchList: searchList
    });
  };

  handleDeleteMovie = (id: string) => {
    let newMovies: movie[] = [];
    const moviesToDelete: movie[] = this.state.showWishlist
      ? this.state.wishlist
      : this.state.movies;
    for (let i = 0; i < moviesToDelete.length; i++) {
      if (moviesToDelete[i].id !== id) {
        newMovies.push(moviesToDelete[i]);
      }
    }

    const userRef = firebase.database().ref('users/' + this.state.uid);
    const movieRef = this.state.showWishlist
      ? userRef.child('wishlist')
      : userRef.child('collection');
    movieRef.once('value', (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const childKey = childSnapshot.key!;
        const movie = childSnapshot.val().movie;

        if (movie.id === id) {
          movieRef.child(childKey).remove();
          return true;
        }
      });
    });

    this.setState({
      wishlist: newMovies,
      notification: true,
      notificationText:
        'film successfully deleted from ' + this.state.showWishlist
          ? 'wishlist'
          : 'lot'
    });
  };

  handleRate = (updatedMovie: movie) => {
    let newMovies: movie[] = [];
    const moviesToUpdate: movie[] = this.state.showWishlist
      ? this.state.wishlist
      : this.state.movies;
    for (let i = 0; i < moviesToUpdate.length; i++) {
      if (moviesToUpdate[i].id !== updatedMovie.id) {
        newMovies.push(moviesToUpdate[i]);
      }
    }

    const userRef = firebase.database().ref('users/' + this.state.uid);
    const movieRef = this.state.showWishlist
      ? userRef.child('wishlist')
      : userRef.child('collection');
    movieRef.once('value', (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const childKey = childSnapshot.key!;
        const movie = childSnapshot.val().movie;

        if (movie.id === updatedMovie.id) {
          movieRef.child(childKey).update({ movie: updatedMovie });
          return true;
        }
      });
    });

    const text = `${
      this.state.showWishlist ? 'wishlist' : 'lot'
    } film successfully updated`;
    this.setState({
      wishlist: newMovies,
      notification: true,
      notificationText: text
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

  dismissGreeting = () => {
    localStorage.setItem(
      'greeting',
      this.state.greetingChecked ? 'noShow' : 'show'
    );
    this.setState({
      greeting: false
    });
  };

  onNotificationClose = () => {
    this.setState({
      notification: false,
      notificationText: ''
    });
  };

  render() {
    const title = this.state.showWishlist ? 'my wishlist' : 'my lot';
    const greeting =
      this.state.name !== ''
        ? 'greetings ' + this.state.name.split(' ', 1) + '!'
        : 'greetings!';
    return (
      <Router>
        {!this.state.loggedIn || this.state.invalidRoute ? (
          <Redirect exact to="/login" />
        ) : (
          <ResponsiveContext.Consumer>
            {(size) => (
              <Box fill>
                <AppBar
                  pad={
                    size !== 'small'
                      ? { right: 'small', left: 'small' }
                      : { vertical: 'xsmall', left: 'small', right: 'small' }
                  }
                >
                  {size !== 'small' ? (
                    <Box
                      direction="row"
                      gap="medium"
                      align="center"
                      justify="evenly"
                    >
                      <Heading level="3" margin="none" alignSelf="center">
                        <Anchor title="home" color="light-1" href="/">
                          {title}
                        </Anchor>
                      </Heading>
                      <Box direction="row" align="center" gap="small">
                        <TextInput
                          value={this.state.searchVal}
                          title="search your film lot!"
                          placeholder={`search ${
                            this.state.showWishlist
                              ? this.state.wishlist.length
                              : this.state.movies.length
                          } ${
                            this.state.movies.length === 1 ? 'film' : 'films'
                          }...`}
                          icon={<Search />}
                          onChange={(event) => this.handleSearch(event)}
                        />
                        <Box>
                          <AddTitle
                            moviesAdded={(
                              lotMovies: movie[],
                              wishlistMovies: movie[]
                            ) => this.moviesAdded(lotMovies, wishlistMovies)}
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
                            {
                              label: 'blu ray',
                              onClick: () => {},
                              hoverIndicator: 'accent-1'
                            },
                            {
                              label: 'dvd',
                              onClick: () => {},
                              hoverIndicator: 'accent-1'
                            },
                            {
                              label: '4k',
                              onClick: () => {},
                              hoverIndicator: 'accent-1'
                            }
                          ]}
                        />
                        <Menu
                          //disabled
                          hoverIndicator="accent-1"
                          title="sort films by..."
                          focusIndicator={false}
                          dropAlign={{ top: 'bottom', left: 'right' }}
                          icon={<Sort />}
                          items={[
                            {
                              label: 'title',
                              onClick: () => {
                                this.setState({
                                  notification: true,
                                  notificationText:
                                    'film lot successfully sorted by title'
                                });
                              },
                              hoverIndicator: 'accent-1'
                            },
                            {
                              label: 'runtime',
                              onClick: () => {
                                this.setState({
                                  notification: true,
                                  notificationText:
                                    'film lot successfully sorted by runtime'
                                });
                              },
                              hoverIndicator: 'accent-1'
                            },
                            {
                              label: 'genre',
                              onClick: () => {
                                this.setState({
                                  notification: true,
                                  notificationText:
                                    'film lot successfully sorted by genre'
                                });
                              },
                              hoverIndicator: 'accent-1'
                            },
                            {
                              label: 'mpaa rating',
                              onClick: () => {
                                this.setState({
                                  notification: true,
                                  notificationText:
                                    'film lot successfully sorted by mpaa rating'
                                });
                              },
                              hoverIndicator: 'accent-1'
                            },
                            {
                              label: 'reset',
                              onClick: () => {
                                this.setState({
                                  notification: true,
                                  notificationText:
                                    'film lot successfully reset to original order'
                                });
                              },
                              hoverIndicator: 'brand'
                            }
                          ]}
                        />
                      </Box>
                    </Box>
                  ) : (
                    <Box direction="row" align="center" justify="evenly">
                      <Box>
                        <TextInput
                          value={this.state.searchVal}
                          focusIndicator={false}
                          placeholder={
                            this.state.showWishlist ? 'my wishlist' : 'my lot'
                          }
                          icon={<Search />}
                          suggestions={[
                            `search ${this.state.movies.length} films...`
                          ]}
                          onChange={(event) => this.handleSearch(event)}
                        />
                      </Box>
                      <Box align="center" direction="row" justify="evenly">
                        <Box>
                          <AddTitle
                            moviesAdded={(
                              lotMovies: movie[],
                              wishlistMovies: movie[]
                            ) => this.moviesAdded(lotMovies, wishlistMovies)}
                          />
                        </Box>
                        <Menu
                          title="filter by tags"
                          focusIndicator={false}
                          dropAlign={{ top: 'bottom', right: 'left' }}
                          icon={<Filter />}
                          items={[
                            {
                              label: 'blu ray',
                              onClick: () => {},
                              hoverIndicator: 'accent-1'
                            },
                            {
                              label: 'dvd',
                              onClick: () => {},
                              hoverIndicator: 'accent-1'
                            },
                            {
                              label: '4k',
                              onClick: () => {},
                              hoverIndicator: 'accent-1'
                            }
                          ]}
                        />
                        <Menu
                          //disabled
                          hoverIndicator="accent-1"
                          title="sort films by..."
                          focusIndicator={false}
                          dropAlign={{ top: 'bottom', right: 'left' }}
                          icon={<Sort />}
                          items={[
                            {
                              label: 'title',
                              onClick: () => {
                                this.setState({
                                  notification: true,
                                  notificationText:
                                    'film lot successfully sorted by title'
                                });
                              },
                              hoverIndicator: 'accent-1'
                            },
                            {
                              label: 'runtime',
                              onClick: () => {
                                this.setState({
                                  notification: true,
                                  notificationText:
                                    'film lot successfully sorted by runtime'
                                });
                              },
                              hoverIndicator: 'accent-1'
                            },
                            {
                              label: 'genre',
                              onClick: () => {
                                this.setState({
                                  notification: true,
                                  notificationText:
                                    'film lot successfully sorted by genre'
                                });
                              },
                              hoverIndicator: 'accent-1'
                            },
                            {
                              label: 'mpaa rating',
                              onClick: () => {
                                this.setState({
                                  notification: true,
                                  notificationText:
                                    'film lot successfully sorted by mpaa rating'
                                });
                              },
                              hoverIndicator: 'accent-1'
                            },
                            {
                              label: 'reset',
                              onClick: () => {
                                this.setState({
                                  notification: true,
                                  notificationText:
                                    'film lot successfully reset to original order'
                                });
                              },
                              hoverIndicator: 'brand'
                            }
                          ]}
                        />
                      </Box>
                    </Box>
                  )}
                  <Box>
                    <Avatar
                      focusIndicator={false}
                      hoverIndicator="brand"
                      onClick={this.toggleSettings}
                      title="settings"
                      align="center"
                    >
                      <User color="accent-1" />
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
                    wishlist={this.state.showWishlist}
                    movies={
                      this.state.showWishlist
                        ? this.state.wishlist
                        : this.state.movies
                    }
                    searchList={this.state.searchList}
                    searchVal={this.state.searchVal}
                    handleDelete={(id: string) => this.handleDeleteMovie(id)}
                    handleRate={(updatedMovie: movie) =>
                      this.handleRate(updatedMovie)
                    }
                    loading={this.state.loading}
                    width={this.state.width}
                  />
                </Box>
                <FooterComponent />
                {this.state.showSettings ? (
                  <Settings
                    loggedIn={this.state.loggedIn}
                    logOut={this.logOut}
                    toggleSettings={this.toggleSettings}
                    handleWishlist={(checked: boolean) =>
                      this.handleWishlist(checked)
                    }
                    wishlist={this.state.showWishlist}
                    uid={this.state.uid}
                    handleAccountDelete={this.handleAccountDelete}
                  />
                ) : null}
                {this.state.greeting ? (
                  <Layer position="center" style={{ borderRadius: 30 }}>
                    <Box
                      flex
                      background="layer"
                      justify="center"
                      align="center"
                      pad="small"
                      round={size !== 'small' ? true : false}
                      border={{
                        color: 'accent-1',
                        side: 'all',
                        size: size !== 'small' ? 'small' : 'medium'
                      }}
                    >
                      <Heading textAlign="center">{greeting}</Heading>
                      <Paragraph textAlign="center">
                        we at cinelot (it's just one person, actually), couldn't
                        bee happier that you chose us to help you keep track of
                        the one thing that's most important to you: your film
                        collection!
                      </Paragraph>
                      <Paragraph textAlign="center">
                        if you ever have any questions or are confused on what
                        to do/where to start, just click the question mark at
                        the bottom of the page for some useful info and tips!
                      </Paragraph>
                      <Box gap="small">
                        <CheckBox
                          checked={this.state.greetingChecked}
                          label="never show this message again"
                          onChange={(event) =>
                            this.setState({
                              greetingChecked: event.target.checked
                            })
                          }
                        />
                        <Button
                          hoverIndicator="neutral-3"
                          alignSelf="center"
                          style={{ borderRadius: 30 }}
                          icon={<Next />}
                          primary
                          onClick={this.dismissGreeting}
                        />
                      </Box>
                    </Box>
                  </Layer>
                ) : null}
                {this.state.notification && (
                  <Layer
                    position="bottom"
                    modal={false}
                    margin={{ bottom: 'small' }}
                    responsive={false}
                    style={{ borderRadius: 30 }}
                  >
                    <Box
                      align="center"
                      direction="row"
                      gap="small"
                      justify="between"
                      flex
                      round
                      elevation="medium"
                      pad={{ vertical: 'xsmall', horizontal: 'small' }}
                      background="accent-1"
                    >
                      <Box align="center" direction="row" gap="xsmall">
                        <StatusGood
                          size={size !== 'small' ? 'medium' : 'small'}
                        />
                        <Text size={size !== 'small' ? 'medium' : 'xsmall'}>
                          {this.state.notificationText}
                        </Text>
                      </Box>
                      <Button
                        focusIndicator={false}
                        icon={
                          <FormClose
                            size={size !== 'small' ? 'medium' : 'small'}
                          />
                        }
                        onClick={this.onNotificationClose}
                      />
                    </Box>
                  </Layer>
                )}
              </Box>
            )}
          </ResponsiveContext.Consumer>
        )}
        <Switch>
          <Route exact path="/login" component={Login} />
        </Switch>
      </Router>
    );
  }
}
