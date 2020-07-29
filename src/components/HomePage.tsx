import React, { Component } from 'react';
import {
  Box,
  Heading,
  TextInput,
  ResponsiveContext,
  Avatar,
  Layer,
  CheckBox,
  Paragraph,
  Button,
  Text
} from 'grommet';
import { Search, User, Next } from 'grommet-icons';
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
import Filters from './Filters';
import { searchResults } from './MovieSearchResult';
import Notification from './Notification';

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
  backDrop: string[];
  rating: string;
  runtime: number;
  genre: string[];
  id: string;
  key?: string;
  starCount: number;
  tags: string[];
};

export default class HomePage extends Component {
  state: {
    uid: string;
    name: string;
    invalidRoute: boolean;
    loggedIn: boolean;
    movies: movie[];
    tags: string[];
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
    sortBy: string;
    filterBy: string;
    parsed: boolean;
    imports: searchResults;
    goodNotification: boolean;
  } = {
    uid: '',
    name: '',
    invalidRoute: false,
    loggedIn: true,
    movies: [],
    tags: [],
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
    fetchedWishlist: false,
    sortBy: '',
    filterBy: '',
    parsed: false,
    imports: {
      movies: []
    },
    goodNotification: false
  };

  constructor(props: any) {
    super(props);
    this.state = {
      uid: props.location.state === undefined ? '' : props.location.state.id,
      name:
        props.location.state === undefined
          ? ''
          : props.location.state.name.toLowerCase(),
      invalidRoute: false,
      loggedIn: true,
      movies: [],
      tags: [],
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
      fetchedWishlist: false,
      sortBy: '',
      filterBy: '',
      parsed: false,
      imports: {
        movies: []
      },
      goodNotification: false
    };
    //console.log('uid: ' + this.state.uid);
    //console.log('name: ' + this.state.name);
  }

  componentDidMount = () => {
    console.log('component mounted');
    const remember = localStorage.getItem('rememberMe');
    if (this.state.uid === '' && !remember) {
      this.setState({ invalidRoute: true });
    } else {
      this.updateWindowDimensions();
      window.addEventListener('resize', this.updateWindowDimensions);

      let lot: movie[] = [];
      let tags: string[] = [];
      let uid =
        this.state.uid === ''
          ? firebase.auth().currentUser!.uid
          : this.state.uid;

      const greeting = localStorage.getItem('greeting') || 'show';
      const showGreeting = greeting === 'show' ? true : false;

      const userRef = firebase.database().ref('users/' + uid);
      const sort = localStorage.getItem('sortBy') || '';

      const collectionRef = userRef.child('collection');
      const tagsRef = userRef.child('tags');
      tagsRef.once('value', (snapshot) => {
        snapshot.forEach((childSnapshot) => {
          const title = childSnapshot.val().title;
          tags.push(title);
        });
      });
      collectionRef.once('value', (snapshot) => {
        snapshot.forEach((childSnapshot) => {
          const childKey = childSnapshot.key!;
          const movie = childSnapshot.val().movie;
          const entry: movie = {
            name: movie.name,
            plot: movie.plot,
            date: movie.date,
            poster: movie.poster,
            backDrop: movie.backDrop || [],
            rating: movie.rating,
            runtime: movie.runtime,
            genre: movie.genre,
            id: movie.id,
            key: childKey,
            starCount: movie.starCount || -1,
            tags: movie.tags || []
          };
          lot.push(entry);
        });
        this.setState({
          movies: lot,
          sortBy: sort,
          tags: tags,
          loading: false,
          greeting: showGreeting,
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

  getIDs = (movies: movie[]) => {
    let ids: string[] = movies.map((item) => {
      return item.id;
    });
    return ids;
  };

  moviesAdded = (lotMovies: movie[], wishlistMovies: movie[]) => {
    console.log(lotMovies.length, wishlistMovies.length);
    let newLot: movie[] = this.state.movies;
    let newWishlist: movie[] = this.state.wishlist;
    console.log(newLot);
    console.log(newWishlist);
    let notificationText: string = '';
    let lotRepeats = 0;
    let wishlistRepeats = 0;
    const userRef = firebase.database().ref('users/' + this.state.uid);
    if (lotMovies.length > 0) {
      const ids = this.getIDs(newLot);
      const collectionRef = userRef.child('collection');
      for (let i = 0; i < lotMovies.length; i++) {
        if (!ids.includes(lotMovies[i].id, 0)) {
          const newMovieRef = collectionRef.push();
          newMovieRef.set({ movie: lotMovies[i] });
          newLot.push(lotMovies[i]);
        } else lotRepeats++;
      }
    }
    if (wishlistMovies.length > 0) {
      const ids = this.getIDs(newWishlist);
      const wishlistRef = userRef.child('wishlist');
      for (let i = 0; i < wishlistMovies.length; i++) {
        if (!ids.includes(wishlistMovies[i].id, 0)) {
          const newMovieRef = wishlistRef.push();
          newMovieRef.set({ movie: wishlistMovies[i] });
          newWishlist.push(wishlistMovies[i]);
        } else wishlistRepeats++;
      }
    }

    const lotLen = lotMovies.length - lotRepeats;
    const wishlistLen = wishlistMovies.length - wishlistRepeats;
    notificationText =
      lotLen +
      ` ${lotLen === 1 ? 'movie' : 'movies'} added to your lot and ` +
      wishlistLen +
      ` ${wishlistLen === 1 ? 'movie' : 'movies'} added to your wishlist`;
    if (wishlistMovies.length === 0) {
      this.setState(
        {
          movies: newLot,
          notification: true,
          notificationText: notificationText,
          goodNotification: true
        },
        () => {
          setTimeout(this.onNotificationClose, 4000);
        }
      );
    } else if (lotMovies.length === 0) {
      this.setState(
        {
          wishlist: newWishlist,
          notification: true,
          notificationText: notificationText,
          goodNotification: true
        },
        () => {
          setTimeout(this.onNotificationClose, 4000);
        }
      );
    } else {
      this.setState(
        {
          movies: newLot,
          wishlist: newWishlist,
          notification: true,
          notificationText: notificationText,
          goodNotification: true
        },
        () => {
          setTimeout(this.onNotificationClose, 4000);
        }
      );
    }
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

  handleTagAdded = (tag: string) => {
    if (tag.length > 0) {
      let newTags: string[] = this.state.tags;
      newTags.push(tag);
      this.setState(
        {
          tags: newTags,
          notification: true,
          notificationText: 'new tag added',
          goodNotification: true
        },
        () => {
          setTimeout(this.onNotificationClose, 4000);
        }
      );
    }
  };

  handleSort = (sortBy: string, checked: boolean) => {
    let method: string = '';
    switch (sortBy) {
      case 'nameAsc':
        method = 'title (asc)';
        break;
      case 'runtimeAsc':
        method = 'runtime (asc)';
        break;
      case 'mpaaAsc':
        method = 'rating (asc)';
        break;
      case 'starCountAsc':
        method = 'star count (asc)';
        break;
      case 'nameDesc':
        method = 'title (desc)';
        break;
      case 'runtimeDesc':
        method = 'runtime (desc)';
        break;
      case 'mpaaDesc':
        method = 'rating (desc)';
        break;
      case 'starCountDesc':
        method = 'star count (desc)';
        break;
      default:
        method = 'original order';
        break;
    }

    const text: string = checked
      ? `your films will now be default sorted by ${method}`
      : `film ${
          this.state.showWishlist ? 'wishlist' : 'lot'
        } successfully sorted by ${method}`;
    this.setState(
      {
        sortBy: sortBy,
        notification: true,
        goodNotification: true,
        notificationText: text
      },
      () => {
        setTimeout(this.onNotificationClose, 4000);
      }
    );
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
            backDrop: movie.backDrop || [],
            rating: movie.rating,
            runtime: movie.runtime,
            genre: movie.genre,
            id: movie.id,
            starCount: movie.starCount || undefined,
            key: childKey,
            tags: movie.tags || []
          };
          wishlistMovies.push(entry);
        });
        this.setState(
          {
            showWishlist: checked,
            wishlist: wishlistMovies,
            fetchedWishlist: true,
            notification: true,
            notificationText: 'switched to wishlist view',
            goodNotification: true
          },
          () => {
            setTimeout(this.onNotificationClose, 4000);
          }
        );
      });
    } else {
      this.setState(
        {
          showWishlist: checked,
          notification: true,
          goodNotification: true,
          notificationText: checked
            ? 'switched to wishlist view'
            : 'switched to lot view'
        },
        () => {
          setTimeout(this.onNotificationClose, 4000);
        }
      );
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

    if (this.state.showWishlist) {
      this.setState(
        {
          wishlist: newMovies,
          notification: true,
          notificationText: 'film successfully deleted from wishlist',
          goodNotification: true
        },
        () => {
          setTimeout(this.onNotificationClose, 4000);
        }
      );
    } else {
      this.setState(
        {
          movies: newMovies,
          notification: true,
          notificationText: 'film successfully deleted from lot',
          goodNotification: true
        },
        () => {
          setTimeout(this.onNotificationClose, 4000);
        }
      );
    }
  };

  handleRate = (updatedMovie: movie) => {
    let newMovies: movie[] = [];
    const moviesToUpdate: movie[] = this.state.showWishlist
      ? this.state.wishlist
      : this.state.movies;

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
    for (let i = 0; i < moviesToUpdate.length; i++) {
      if (moviesToUpdate[i].id !== updatedMovie.id) {
        newMovies.push(moviesToUpdate[i]);
      } else {
        newMovies.push(updatedMovie);
      }
    }

    if (this.state.showWishlist) {
      this.setState(
        {
          wishlist: newMovies,
          notification: true,
          notificationText: 'wishlist film successfully rated',
          goodNotification: true
        },
        () => {
          setTimeout(this.onNotificationClose, 4000);
        }
      );
    } else {
      this.setState(
        {
          movies: newMovies,
          notification: true,
          notificationText: 'lot film successfully rated',
          goodNotification: true
        },
        () => {
          setTimeout(this.onNotificationClose, 4000);
        }
      );
    }
  };

  handleSelectedTags = (updatedMovie: movie, tags: number[]) => {
    let newMovies: movie[] = [];
    let newTags: string[] = [];
    tags.forEach((tagIndex) => {
      newTags.push(this.state.tags[tagIndex]);
    });
    updatedMovie.tags = newTags;
    const userRef = firebase.database().ref('users/' + this.state.uid);
    const collectionRef = userRef.child('collection');

    collectionRef.once('value', (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const childKey = childSnapshot.key!;
        const movie = childSnapshot.val().movie;

        if (movie.id === updatedMovie.id) {
          collectionRef.child(childKey).update({ movie: updatedMovie });
          return true;
        }
      });
    });
    for (let i = 0; i < this.state.movies.length; i++) {
      if (this.state.movies[i].id !== updatedMovie.id) {
        newMovies.push(this.state.movies[i]);
      } else {
        newMovies.push(updatedMovie);
      }
    }

    this.setState(
      {
        movies: newMovies,
        notification: true,
        notificationText: `${
          tags.length > 1 ? 'tags' : 'tag'
        } successfully added to ${updatedMovie.name}`,
        goodNotification: true
      },
      () => {
        setTimeout(this.onNotificationClose, 4000);
      }
    );
  };

  handleFilterByTag = (tag: string) => {
    if (tag.length > 0) {
      this.setState(
        {
          filterBy: tag,
          notification: true,
          notificationText: `movies successfully filtered by tag: ${tag}`,
          goodNotification: true
        },
        () => {
          setTimeout(this.onNotificationClose, 4000);
        }
      );
    } else {
      this.setState(
        {
          filterBy: tag,
          notification: true,
          notificationText: 'filter has been reset',
          goodNotification: true
        },
        () => {
          setTimeout(this.onNotificationClose, 4000);
        }
      );
    }
  };

  handleTransfer = (movie: movie) => {
    this.handleDeleteMovie(movie.id);
    this.moviesAdded([movie], []);
    console.log(this.state.wishlist);
    this.setState(
      {
        notification: true,
        notificationText: `${movie.name} has been transferred to your lot`,
        goodNotification: true,
        showWishlist: false
      },
      () => {
        setTimeout(this.onNotificationClose, 4000);
      }
    );
  };

  handleTagDelete = (tags: number[]) => {
    let newTags: string[] = [];
    let tagsToDelete: string[] = [];
    tags.forEach((tagIndex) => {
      tagsToDelete.push(this.state.tags[tagIndex]);
    });
    for (let i = 0; i < this.state.tags.length; i++) {
      if (i !== tags[i]) {
        newTags.push(this.state.tags[i]);
      }
    }

    const userRef = firebase.database().ref('users/' + this.state.uid);
    const tagsRef = userRef.child('tags');
    tagsRef.once('value', (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const childKey = childSnapshot.key!;
        const title = childSnapshot.val().title;

        if (tagsToDelete.includes(title, 0)) {
          tagsRef.child(childKey).remove();
        }
      });
    });

    this.setState(
      {
        tags: newTags,
        notification: true,
        notificationText: 'tag successfully deleted',
        goodNotification: true
      },
      () => {
        setTimeout(this.onNotificationClose, 4000);
      }
    );
  };

  handleAccountDelete = () => {
    const user = firebase.auth().currentUser!;
    user
      .delete()
      .then(() => {
        const userRef = firebase.database().ref('/users/' + this.state.uid);
        userRef
          .remove()
          .then(() => {
            console.log('user data deleted');
            localStorage.clear();
            this.logOut();
          })
          .catch((error) => {
            console.log('user data deletion unsuccessful: ' + error.message);
          });
      })
      .catch((error) => {
        this.setState(
          {
            notification: true,
            notificationText: error.message,
            goodNotification: false
          },
          () => {
            setTimeout(this.onNotificationClose, 8000);
          }
        );
        console.log(error);
      });
  };

  handleResetFilters = () => {
    this.setState(
      {
        filterBy: '',
        sortBy: '',
        notification: true,
        notificationText: 'filters have been reset',
        goodNotification: true
      },
      () => {
        setTimeout(this.onNotificationClose, 4000);
      }
    );
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

  handleParsed = (movieList: searchResults) => {
    console.log(movieList);
    this.setState({
      parsed: true,
      imports: movieList
    });
  };

  handleFinishedImport = () => {
    const emptyResults: searchResults = {
      movies: []
    };
    this.setState({ parsed: false, imports: emptyResults });
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
              <Box
                fill
                pad={{ horizontal: size === 'small' ? 'medium' : undefined }}
              >
                <AppBar
                  pad={
                    size !== 'small'
                      ? { right: 'small', left: 'small' }
                      : { vertical: 'xsmall' }
                  }
                >
                  {size !== 'small' ? (
                    <Box
                      direction="row"
                      gap="medium"
                      align="center"
                      justify="evenly"
                    >
                      <Heading
                        level="3"
                        margin="none"
                        alignSelf="center"
                        color="light-1"
                      >
                        {title}
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
                          {this.state.parsed ? (
                            <AddTitle
                              moviesAdded={(
                                lotMovies: movie[],
                                wishlistMovies: movie[]
                              ) => this.moviesAdded(lotMovies, wishlistMovies)}
                              parsed={true}
                              movieList={this.state.imports}
                              handleFinishedImport={this.handleFinishedImport}
                            />
                          ) : (
                            <AddTitle
                              moviesAdded={(
                                lotMovies: movie[],
                                wishlistMovies: movie[]
                              ) => this.moviesAdded(lotMovies, wishlistMovies)}
                            />
                          )}
                        </Box>
                        <Box>
                          <Filters
                            sort={this.state.sortBy}
                            uid={this.state.uid}
                            tags={this.state.tags}
                            handleSort={(sortBy, checked) =>
                              this.handleSort(sortBy, checked)
                            }
                            handleFilterByTag={(tag) =>
                              this.handleFilterByTag(tag)
                            }
                            handleTagDelete={(tags) =>
                              this.handleTagDelete(tags)
                            }
                            handleUpdatedTags={(updatedTags) =>
                              this.setState(
                                {
                                  tags: updatedTags,
                                  notification: true,
                                  notificationText: 'tag successfully updated',
                                  goodNotification: true
                                },
                                () => {
                                  setTimeout(this.onNotificationClose, 4000);
                                }
                              )
                            }
                            handleTagAdded={(tag) => this.handleTagAdded(tag)}
                            handleResetFilters={this.handleResetFilters}
                          />
                        </Box>
                      </Box>
                    </Box>
                  ) : (
                    <Box
                      direction="row"
                      align="center"
                      justify="evenly"
                      gap="small"
                    >
                      <Box width="medium">
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
                      <Box align="center" direction="row" gap="xsmall">
                        <Box>
                          <AddTitle
                            moviesAdded={(
                              lotMovies: movie[],
                              wishlistMovies: movie[]
                            ) => this.moviesAdded(lotMovies, wishlistMovies)}
                          />
                        </Box>
                        <Box>
                          <Filters
                            sort={this.state.sortBy}
                            uid={this.state.uid}
                            tags={this.state.tags}
                            handleSort={(sortBy, checked) =>
                              this.handleSort(sortBy, checked)
                            }
                            handleFilterByTag={(tag) =>
                              this.handleFilterByTag(tag)
                            }
                            handleTagDelete={(tags) =>
                              this.handleTagDelete(tags)
                            }
                            handleUpdatedTags={(updatedTags) =>
                              this.setState(
                                {
                                  tags: updatedTags,
                                  notification: true,
                                  notificationText: 'tag successfully updated',
                                  goodNotification: true
                                },
                                () => {
                                  setTimeout(this.onNotificationClose, 4000);
                                }
                              )
                            }
                            handleTagAdded={(tag) => this.handleTagAdded(tag)}
                            handleResetFilters={this.handleResetFilters}
                          />
                        </Box>
                      </Box>
                    </Box>
                  )}
                  <Box>
                    <Avatar
                      focusIndicator={false}
                      hoverIndicator={size !== 'small' ? 'brand' : undefined}
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
                    handleTransfer={(movie) => this.handleTransfer(movie)}
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
                    handleSelectedTags={(movie, tags) =>
                      this.handleSelectedTags(movie, tags)
                    }
                    loading={this.state.loading}
                    width={this.state.width}
                    sortBy={this.state.sortBy}
                    filterBy={this.state.filterBy}
                    tags={this.state.tags}
                  />
                </Box>
                <FooterComponent
                  uid={this.state.uid}
                  width={this.state.width}
                />
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
                    lot={this.state.movies}
                    wishlistFilms={this.state.wishlist}
                    name={this.state.name}
                    fetchedWishlist={this.state.fetchedWishlist}
                    handleParsed={(movieList) => this.handleParsed(movieList)}
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
                        size: 'medium'
                      }}
                    >
                      <Heading textAlign="center">{greeting}</Heading>
                      <Paragraph textAlign="center">
                        we at cinelot (it's just one person, actually), couldn't
                        bee happier that you chose us to help keep track of the
                        one thing that's most important to you: your film
                        collection!
                      </Paragraph>
                      <Text
                        weight="bold"
                        textAlign="center"
                        size="large"
                        color="accent-3"
                      >
                        getting started is as easy as clicking the + button to
                        add a film to your lot/wishlist, or trekking over to
                        settings to import a csv file of your film data!
                      </Text>
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
                          hoverIndicator="accent-1"
                          alignSelf="center"
                          style={{ borderRadius: 30 }}
                          icon={<Next />}
                          onClick={this.dismissGreeting}
                        />
                      </Box>
                    </Box>
                  </Layer>
                ) : null}
                {this.state.notification && (
                  <Notification
                    top={this.state.goodNotification ? false : true}
                    good={this.state.goodNotification}
                    onNotificationClose={this.onNotificationClose}
                    notificationText={this.state.notificationText}
                  />
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
