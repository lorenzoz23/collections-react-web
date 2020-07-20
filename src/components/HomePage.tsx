import React, { Component } from 'react';
import {
  Box,
  Heading,
  Anchor,
  TextInput,
  ResponsiveContext,
  Avatar,
  Layer,
  CheckBox,
  Paragraph,
  Button,
  Text
} from 'grommet';
import { Search, User, Next, StatusGood, FormClose } from 'grommet-icons';
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
  backDrop?: string[];
  rating: string;
  runtime: number;
  genre: string[];
  id: string;
  key?: string;
  starCount: number;
  tags?: string[];
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
    filterBy: ''
  };

  constructor(props: any) {
    super(props);
    this.state = {
      uid: props.location.state === undefined ? '' : props.location.state.id,
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
      filterBy: ''
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
      let tags: string[] = [];
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
          tags: tags,
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

  handleTagAdded = (tag: string) => {
    if (tag.length > 0) {
      let newTags: string[] = this.state.tags;
      newTags.push(tag);
      this.setState({
        tags: newTags,
        notification: true,
        notificationText: 'new tag added!'
      });
    }
  };

  handleSort = (sortBy: string) => {
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
    this.setState({
      sortBy: sortBy,
      notification: true,
      notificationText: `film ${
        this.state.showWishlist ? 'wishlist' : 'lot'
      } successfully sorted by ${method}`
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
            backDrop: movie.backDrop || [],
            rating: movie.rating,
            runtime: movie.runtime,
            genre: movie.genre,
            id: movie.id,
            starCount: movie.starCount || undefined,
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

    if (this.state.showWishlist) {
      this.setState({
        wishlist: newMovies,
        notification: true,
        notificationText: 'film successfully deleted from wishlist'
      });
    } else {
      this.setState({
        movies: newMovies,
        notification: true,
        notificationText: 'film successfully deleted from lot'
      });
    }
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
          newMovies.push(updatedMovie);
          return true;
        }
      });
    });

    if (this.state.showWishlist) {
      this.setState({
        wishlist: newMovies,
        notification: true,
        notificationText: 'wishlist film successfully updated'
      });
    } else {
      this.setState({
        movies: newMovies,
        notification: true,
        notificationText: 'lot film successfully updated'
      });
    }
  };

  handleSelectedTags = (updatedMovie: movie, tags: number[]) => {
    let newMovies: movie[] = [];
    let newTags: string[] = [];
    for (let i = 0; i < this.state.movies.length; i++) {
      if (this.state.movies[i].id !== updatedMovie.id) {
        newMovies.push(this.state.movies[i]);
      }
    }
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
          newMovies.push(updatedMovie);
          return true;
        }
      });
    });
  };

  handleFilterByTag = (tag: string) => {
    if (tag.length > 0) {
      this.setState({
        filterBy: tag,
        notification: true,
        notificationText: `movies successfully filtered by tag: ${tag}`
      });
    } else {
      this.setState({
        filterBy: tag,
        notification: true,
        notificationText: 'filter has been reset'
      });
    }
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

    this.setState({
      tags: newTags,
      notification: true,
      notificationText: 'tag successfully deleted'
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

  handleResetFilters = () => {
    this.setState({
      filterBy: '',
      sortBy: '',
      notification: true,
      notificationText: 'filters have been reset'
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
                        <Box>
                          <Filters
                            uid={this.state.uid}
                            tags={this.state.tags}
                            handleSort={(sortBy: string) =>
                              this.handleSort(sortBy)
                            }
                            handleFilterByTag={(tag) =>
                              this.handleFilterByTag(tag)
                            }
                            handleTagDelete={(tags) =>
                              this.handleTagDelete(tags)
                            }
                            handleUpdatedTags={(updatedTags) =>
                              this.setState({
                                tags: updatedTags,
                                notification: true,
                                notificationText: 'tag successfully updated'
                              })
                            }
                            handleTagAdded={(tag) => this.handleTagAdded(tag)}
                            handleResetFilters={this.handleResetFilters}
                          />
                        </Box>
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
                        <Box>
                          <Filters
                            uid={this.state.uid}
                            tags={this.state.tags}
                            handleSort={(sortBy: string) =>
                              this.handleSort(sortBy)
                            }
                            handleFilterByTag={(tag) =>
                              this.handleFilterByTag(tag)
                            }
                            handleTagDelete={(tags) =>
                              this.handleTagDelete(tags)
                            }
                            handleUpdatedTags={(updatedTags) =>
                              this.setState({
                                tags: updatedTags,
                                notification: true,
                                notificationText: 'tag successfully updated'
                              })
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
                    lot={this.state.movies}
                    wishlistFilms={this.state.wishlist}
                    name={this.state.name}
                    fetchedWishlist={this.state.fetchedWishlist}
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
