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
  Text,
  DropButton,
  Form,
  Anchor
} from 'grommet';
import {
  Search,
  User,
  Next,
  CircleInformation,
  FormDown,
  FormUp,
  UserSettings,
  Logout,
  Down,
  Add,
  Checkmark,
  Filter,
  SearchAdvanced
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
import EditFilters from './EditFilters';
import { searchResults } from './MovieSearchResult';
import Notification from './Notification';
import { motion } from 'framer-motion';
import SortMoviesMenu from './SortMoviesMenu';
import FilterSearch, { filter } from './FilterSearch';
import AddMovieTemplate from './AddMovieTemplate';
import Preferences from './Preferences';

export const AppBar = (props: any) => (
  <Box
    direction="row"
    align="center"
    justify="between"
    background="header"
    style={{ zIndex: 10 }}
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
  tags: number[];
};

export const sortLabels: Record<string, string> = {
  nameAsc: 'Title (Asc)',
  nameDesc: 'Title (Desc)',
  runtimeAsc: 'Runtime (Asc)',
  runtimeDesc: 'Runtime (Desc)',
  mpaaAsc: 'MPAA Rating (G - NC17)',
  mpaaDesc: 'MPAA Rating (NC17 - G)',
  starCountAsc: 'Star Count (Asc)',
  starCountDesc: 'Star Count (Desc)',
  reset: 'Original Order'
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
    filterBy: filter[];
    parsed: boolean;
    imports: searchResults;
    goodNotification: boolean;
    userProfileClicked: boolean;
    welcomeBack: boolean;
    randAddFilmBackDrop: number;
    addFilmSearchVal: string;
    tmdbSearched: boolean;
    showAdvancedSearch: boolean;
    saveSortedOrder: boolean;
    showFilters: boolean;
    allGenres: string[];
    allowedFilters: boolean[];
    showPrefs: boolean;
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
    filterBy: [],
    parsed: false,
    imports: {
      movies: []
    },
    goodNotification: false,
    userProfileClicked: false,
    welcomeBack: false,
    randAddFilmBackDrop: 0,
    addFilmSearchVal: '',
    tmdbSearched: false,
    showAdvancedSearch: false,
    saveSortedOrder: false,
    showFilters: false,
    allGenres: [''],
    allowedFilters: [true, true, true],
    showPrefs: false
  };

  constructor(props: any) {
    super(props);
    this.state = {
      uid: props.location.state === undefined ? '' : props.location.state.id,
      name: props.location.state === undefined ? '' : props.location.state.name,
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
      filterBy: [],
      parsed: false,
      imports: {
        movies: []
      },
      goodNotification: false,
      userProfileClicked: false,
      welcomeBack: false,
      randAddFilmBackDrop: 0,
      addFilmSearchVal: '',
      tmdbSearched: false,
      showAdvancedSearch: false,
      saveSortedOrder: false,
      showFilters: false,
      allGenres: [''],
      allowedFilters: [true, true, true],
      showPrefs: false
    };
  }

  componentDidMount = async () => {
    console.log('home mounted');
    const remember = localStorage.getItem('rememberMe');
    if (this.state.uid === '' && !remember) {
      this.setState({ invalidRoute: true });
    } else {
      document.title = 'Cinelot | Your film lot on the go';
      this.updateWindowDimensions();
      window.addEventListener('resize', this.updateWindowDimensions);

      let lot: movie[] = [];
      let tags: string[] = [];
      let uid =
        this.state.uid === ''
          ? firebase.auth().currentUser!.uid
          : this.state.uid;

      const greeting = localStorage.getItem('greeting') || 'show';
      let showGreeting = greeting === 'show' ? true : false;

      const welcome = localStorage.getItem('welcomeBack');
      let showWelcome =
        welcome === null ? false : welcome === 'show' ? true : false;

      const userRef = firebase.database().ref('users/' + uid);
      const sort = localStorage.getItem('sortBy') || '';

      const genres = await this.getAllGenres();

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

        if (lot.length > 0 && showGreeting) {
          localStorage.setItem('greeting', 'noShow');
          localStorage.setItem('welcomeBack', 'show');
          showGreeting = false;
          showWelcome = true;
        }
        if (!showGreeting && lot.length > 0 && welcome === null) {
          localStorage.setItem('welcomeBack', 'show');
          showWelcome = true;
        }
        this.setState({
          movies: lot,
          sortBy: sort,
          tags: tags,
          loading: false,
          greeting: showGreeting,
          uid: uid,
          allGenres: genres,
          randAddFilmBackDrop: Math.floor(Math.random() * 60)
        });
        this.setState({ welcomeBack: showWelcome }, () =>
          setTimeout(() => this.setState({ welcomeBack: false }), 4000)
        );
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

    let notificationType: boolean = false;
    if (this.state.parsed) {
      notificationType = true;
      const lotLen = lotMovies.length - lotRepeats;
      const wishlistLen = wishlistMovies.length - wishlistRepeats;
      notificationText =
        lotLen +
        ` ${lotLen === 1 ? 'movie' : 'movies'} added to your lot and ` +
        wishlistLen +
        ` ${wishlistLen === 1 ? 'movie' : 'movies'} added to your wishlist!`;
    } else {
      if (lotRepeats === 0 && lotMovies.length === 1) {
        notificationText = `${
          lotMovies[0].name + ' has been added to your lot!'
        } `;
        notificationType = true;
      }
      if (lotRepeats) {
        notificationText = `${
          lotMovies[0].name + ' already exists in your lot'
        } `;
        notificationType = false;
      }
      if (wishlistRepeats === 0 && wishlistMovies.length === 1) {
        notificationText = `${
          wishlistMovies[0].name + ' has been added to your wishlist!'
        } `;
        notificationType = true;
      }
      if (wishlistRepeats) {
        notificationText = `${
          wishlistMovies[0].name + ' already exists in your wishlist'
        } `;
        notificationType = false;
      }
    }

    if (wishlistMovies.length === 0) {
      this.setState(
        {
          movies: newLot,
          notification: true,
          notificationText: notificationText,
          goodNotification: notificationType
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
          goodNotification: notificationType
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
          goodNotification: notificationType
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
          notificationText: 'New tag added!',
          goodNotification: true
        },
        () => {
          setTimeout(this.onNotificationClose, 4000);
        }
      );
    }
  };

  handleSort = (sortBy: string) => {
    if (this.state.saveSortedOrder) {
      localStorage.setItem('sortBy', sortBy);
    }
    const text: string = this.state.saveSortedOrder
      ? `Your films will now be default sorted by ${sortLabels[sortBy]}`
      : `Your films have been successfully sorted by ${
          sortLabels[sortBy || 'reset']
        }`;
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
      document.title = 'Cinelot | Your wishlist on the go';
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
            notificationText: 'Switched to Wishlist View',
            goodNotification: true
          },
          () => {
            setTimeout(this.onNotificationClose, 4000);
          }
        );
      });
    } else {
      if (checked) {
        document.title = 'Cinelot | Your film wishlist on the go';
      } else {
        document.title = 'Cinelot | Your film lot on the go';
      }
      this.setState(
        {
          showWishlist: checked,
          notification: true,
          goodNotification: true,
          notificationText: checked
            ? 'Switched to Wishlist View'
            : 'Switched to Lot View'
        },
        () => {
          setTimeout(this.onNotificationClose, 4000);
        }
      );
    }
  };

  handleSearch = (searchVal: string) => {
    let searchList: movie[] = [];
    const moviesToSearch: movie[] = this.state.showWishlist
      ? this.state.wishlist
      : this.state.movies;
    for (let i = 0; i < moviesToSearch.length; i++) {
      if (
        moviesToSearch[i].name.toLowerCase().includes(searchVal.toLowerCase())
      ) {
        searchList.push(moviesToSearch[i]);
      }
    }
    this.setState({
      searchVal: searchVal,
      searchList: searchList
    });
  };

  handleSearchToAdd = () => {
    this.setState({ tmdbSearched: this.state.addFilmSearchVal.length > 0 });
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
          notificationText: 'Film successfully deleted from wishlist',
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
          notificationText: 'Film successfully deleted from lot',
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
          notificationText: 'Wishlist film successfully rated',
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
          notificationText: 'Lot film successfully rated',
          goodNotification: true
        },
        () => {
          setTimeout(this.onNotificationClose, 4000);
        }
      );
    }
  };

  handleSelectedTags = (updatedMovie: movie, tags: number[]) => {
    const moviesToUpdate: movie[] = this.state.showWishlist
      ? this.state.wishlist
      : this.state.movies;
    let newMovies: movie[] = [];
    updatedMovie.tags = tags;
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
          notificationText: `${
            tags.length > 1 ? 'tags' : 'tag'
          } successfully added to ${updatedMovie.name}!`,
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
          notificationText: `${
            tags.length > 1 ? 'tags' : 'tag'
          } successfully added to ${updatedMovie.name}!`,
          goodNotification: true
        },
        () => {
          setTimeout(this.onNotificationClose, 4000);
        }
      );
    }
  };

  handleFilterByTag = (filters: filter[]) => {
    if (filters.length > 0) {
      this.setState(
        {
          filterBy: filters,
          notification: true,
          notificationText: `The ${
            filters[filters.length - 1].name
          } filter has been activated`,
          goodNotification: true
        },
        () => {
          setTimeout(this.onNotificationClose, 4000);
        }
      );
    } else {
      const empty: filter[] = [];
      this.setState(
        {
          filterBy: empty,
          notification: true,
          notificationText: 'Filters have been reset',
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
        notificationText: `${movie.name} has been transferred to your lot!`,
        goodNotification: true,
        showWishlist: false
      },
      () => {
        setTimeout(this.onNotificationClose, 4000);
      }
    );
  };

  handleTagDelete = async (tags: number[]) => {
    this.setState({
      loading: true
    });
    let newTags: string[] = [];
    let tagsToDelete: string[] = [];
    tags.forEach((tagIndex) => {
      tagsToDelete.push(this.state.tags[tagIndex]);
    });
    for (let i = 0; i < this.state.tags.length; i++) {
      if (!tags.includes(i, 0)) {
        newTags.push(this.state.tags[i]);
      }
    }

    const userRef = firebase.database().ref('users/' + this.state.uid);
    const tagsRef = userRef.child('tags');
    await tagsRef.once('value', (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const childKey = childSnapshot.key!;
        const title = childSnapshot.val().title;

        if (tagsToDelete.includes(title, 0)) {
          tagsRef.child(childKey).remove();
        }
      });
    });
    const collectionRef = userRef.child('collection');
    let newLot: movie[] = [];
    await collectionRef.once('value', (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const childKey = childSnapshot.key!;
        const movie = childSnapshot.val().movie;
        const movieTags: number[] = movie.tags || [];
        let newMovieTags: number[] = movieTags.filter(
          (tag) => !tags.includes(tag, 0)
        );
        newMovieTags = newMovieTags.map((tagIndex) => {
          const title = this.state.tags[tagIndex];
          return newTags.indexOf(title);
        });
        const newMovie: movie = movie;
        newMovie.tags = newMovieTags;
        newLot.push(newMovie);
        collectionRef.child(childKey).update({ movie: newMovie });
      });
    });
    const wishlistRef = userRef.child('wishlist');
    let newWishlist: movie[] = [];
    await wishlistRef.once('value', (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const childKey = childSnapshot.key!;
        const wishlistMovie = childSnapshot.val().movie;
        const movieTags: number[] = wishlistMovie.tags || [];
        let newMovieTags: number[] = movieTags.filter(
          (tag) => !tags.includes(tag, 0)
        );
        newMovieTags = newMovieTags.map((tagIndex) => {
          const title = this.state.tags[tagIndex];
          return newTags.indexOf(title);
        });
        const newWishlistMovie: movie = wishlistMovie;
        newWishlistMovie.tags = newMovieTags;
        newWishlist.push(newWishlistMovie);
        wishlistRef.child(childKey).update({ movie: newWishlistMovie });
      });
    });

    this.setState({
      movies: newLot,
      wishlist: newWishlist,
      tags: newTags,
      loading: false
    });
    this.setState(
      {
        notification: true,
        notificationText: `${
          tags.length > 1 ? 'tags' : 'tag'
        } successfully deleted`,
        goodNotification: true
      },
      () => setTimeout(this.onNotificationClose, 4000)
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
    const empty: filter[] = [];
    this.setState(
      {
        filterBy: empty,
        notification: true,
        notificationText: 'Filters have been reset',
        goodNotification: true
      },
      () => {
        setTimeout(this.onNotificationClose, 4000);
      }
    );
  };

  handlePrefChanged = (index: number) => {
    const allowed = this.state.allowedFilters;
    allowed[index] = !allowed[index];
    this.setState({
      allowedFilters: allowed
    });
  };

  handleSaveOrderChange = (checked: boolean) => {
    if (!checked) {
      localStorage.removeItem('sortBy');
      this.setState({
        checked: checked,
        sort: '',
        sortLabel: 'Time added'
      });
      this.handleSort('');
    } else {
      if (this.state.sortBy !== '') {
        localStorage.setItem('sortBy', this.state.sortBy);
      }
      this.setState({
        checked: checked
      });
    }
  };

  handleUpdatedTags = (updatedTags: string[]) => {
    this.setState(
      {
        tags: updatedTags,
        notification: true,
        notificationText: 'Tag successfully updated',
        goodNotification: true
      },
      () => {
        setTimeout(this.onNotificationClose, 4000);
      }
    );
  };

  getAllGenres = async () => {
    const response = await fetch(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US`
    );
    const data = await response.json();
    let genres: string[] = [];
    for (let i = 0; i < data.genres.length; i++) {
      genres.push(data.genres[i].name);
    }

    return genres;
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

  dismissWelcomeBack = (checked: boolean) => {
    localStorage.setItem('welcomeBack', checked ? 'noShow' : 'show');
    this.setState({
      welcomeBack: false
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
    const title = this.state.showWishlist ? 'Your Wishlist' : 'Your Lot';
    const welcome = 'Welcome, ' + this.state.name.split(' ', 1) + '!';
    const mode = localStorage.getItem('visualModeValue') || 'wedding';
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
                      ? {
                          bottom: mode === 'wedding' ? 'xsmall' : 'none',
                          left: 'small'
                        }
                      : { vertical: 'xsmall' }
                  }
                  border={{
                    side: 'bottom',
                    color: 'lotBorder',
                    size: 'small'
                  }}
                >
                  {size !== 'small' ? (
                    <Box
                      direction="row"
                      gap={size === 'medium' ? 'small' : 'medium'}
                      align="center"
                      alignSelf="end"
                      justify="evenly"
                    >
                      <CheckBox
                        checked={this.state.showWishlist}
                        toggle
                        reverse
                        onChange={(event) =>
                          this.handleWishlist(event.target.checked)
                        }
                        label={
                          <Heading
                            textAlign="center"
                            level="3"
                            margin="none"
                            color="light-1"
                          >
                            {title}
                          </Heading>
                        }
                      />
                      <Box>
                        <Form onSubmit={this.handleSearchToAdd}>
                          <Box
                            direction="row"
                            gap={size === 'medium' ? 'small' : 'medium'}
                            width={size === 'medium' ? undefined : 'large'}
                          >
                            <TextInput
                              value={this.state.addFilmSearchVal}
                              placeholder="Search a film to add by title!"
                              icon={<Add />}
                              onChange={(event) =>
                                this.setState({
                                  addFilmSearchVal: event.target.value
                                })
                              }
                            />
                            <Box
                              direction="row"
                              align="center"
                              gap={size === 'medium' ? 'small' : 'medium'}
                            >
                              <Button
                                disabled={
                                  this.state.addFilmSearchVal.length === 0
                                }
                                hoverIndicator="accent-1"
                                label="Done"
                                alignSelf="center"
                                type="submit"
                                icon={<Checkmark />}
                                reverse
                              />
                              <Anchor
                                icon={<SearchAdvanced />}
                                label="Advanced Search"
                                alignSelf="center"
                                onClick={() =>
                                  this.setState({ showAdvancedSearch: true })
                                }
                              />
                            </Box>
                          </Box>
                        </Form>
                      </Box>
                      {this.state.parsed && (
                        <Box>
                          <AddTitle
                            width={this.state.width}
                            moviesAdded={(
                              lotMovies: movie[],
                              wishlistMovies: movie[]
                            ) => this.moviesAdded(lotMovies, wishlistMovies)}
                            parsed={true}
                            movieList={this.state.imports}
                            handleFinishedImport={this.handleFinishedImport}
                          />
                        </Box>
                      )}
                    </Box>
                  ) : (
                    <Box
                      direction="row"
                      align="center"
                      gap="small"
                      flex
                      justify={this.state.width < 700 ? 'between' : undefined}
                    >
                      <CheckBox
                        checked={this.state.showWishlist}
                        toggle
                        reverse
                        onChange={(event) =>
                          this.handleWishlist(event.target.checked)
                        }
                        label={
                          <Heading
                            textAlign="center"
                            level={this.state.width > 700 ? 3 : 2}
                            margin="none"
                            color="light-1"
                          >
                            {title}
                          </Heading>
                        }
                      />
                      {this.state.width < 700 && (
                        <Text weight="bold">
                          {this.state.showWishlist
                            ? this.state.wishlist.length
                            : this.state.movies.length}{' '}
                          films
                        </Text>
                      )}
                      {this.state.width > 700 && (
                        <Box>
                          <Form onSubmit={this.handleSearchToAdd}>
                            <Box direction="row" gap="small" align="center">
                              <TextInput
                                value={this.state.addFilmSearchVal}
                                placeholder="Search a film to add by title!"
                                icon={<Add />}
                                onChange={(event) =>
                                  this.setState({
                                    addFilmSearchVal: event.target.value
                                  })
                                }
                              />
                              <Box direction="row" align="center" gap="xsmall">
                                <Button
                                  disabled={
                                    this.state.addFilmSearchVal.length === 0
                                  }
                                  alignSelf="center"
                                  type="submit"
                                  primary
                                  style={{ borderRadius: 30 }}
                                  icon={<Checkmark size="small" />}
                                  reverse
                                />
                                <Anchor
                                  icon={<SearchAdvanced />}
                                  alignSelf="center"
                                  onClick={() =>
                                    this.setState({ showAdvancedSearch: true })
                                  }
                                />
                              </Box>
                            </Box>
                          </Form>
                        </Box>
                      )}
                    </Box>
                  )}
                  {this.state.width > 700 && (
                    <DropButton
                      style={{ borderRadius: 25 }}
                      plain
                      alignSelf={size !== 'small' ? 'end' : 'center'}
                      hoverIndicator="brand"
                      margin={{ right: size !== 'small' ? 'small' : 'none' }}
                      open={
                        this.state.userProfileClicked &&
                        !this.state.showSettings
                      }
                      onClose={() =>
                        this.setState({ userProfileClicked: false })
                      }
                      onOpen={() => this.setState({ userProfileClicked: true })}
                      label={
                        <Box direction="row" align="center">
                          <Avatar align="center">
                            <User color="accent-1" />
                          </Avatar>
                          <Text weight="bold">
                            {this.state.name.split(' ', 1)}
                          </Text>
                          <Avatar align="center">
                            {this.state.userProfileClicked ? (
                              <FormUp />
                            ) : (
                              <FormDown />
                            )}
                          </Avatar>
                        </Box>
                      }
                      dropAlign={{ top: 'bottom', right: 'left' }}
                      dropContent={
                        <Box background="light-2">
                          <Box
                            direction="row"
                            justify="between"
                            pad={{
                              left: 'small',
                              top: 'medium',
                              bottom: 'medium',
                              right: 'medium'
                            }}
                            hoverIndicator="accent-1"
                            onClick={this.toggleSettings}
                          >
                            <Text>Settings</Text>
                            <UserSettings color="brand" />
                          </Box>
                          <Box
                            direction="row"
                            justify="between"
                            pad={{
                              left: 'small',
                              top: 'medium',
                              bottom: 'medium',
                              right: 'medium'
                            }}
                            hoverIndicator="accent-1"
                            onClick={this.logOut}
                          >
                            <Text>Sign out</Text>
                            <Logout color="brand" />
                          </Box>
                        </Box>
                      }
                    />
                  )}
                </AppBar>
                {size === 'small' && this.state.width < 700 ? (
                  <Box background="home" pad="small" style={{ zIndex: 10 }}>
                    <Form onSubmit={this.handleSearchToAdd}>
                      <Box
                        direction="row"
                        gap="none"
                        align="center"
                        width="medium"
                      >
                        <TextInput
                          value={this.state.addFilmSearchVal}
                          placeholder="Search a film to add by title!"
                          icon={<Add />}
                          onChange={(event) =>
                            this.setState({
                              addFilmSearchVal: event.target.value
                            })
                          }
                        />
                        <Box direction="row" align="center" gap="xsmall">
                          <Button
                            disabled={this.state.addFilmSearchVal.length === 0}
                            alignSelf="center"
                            type="submit"
                            primary
                            style={{ borderRadius: 30, display: 'none' }}
                            icon={<Checkmark size="small" />}
                            reverse
                          />
                          <Anchor
                            icon={<SearchAdvanced />}
                            alignSelf="center"
                            onClick={() =>
                              this.setState({ showAdvancedSearch: true })
                            }
                          />
                        </Box>
                      </Box>
                    </Form>
                  </Box>
                ) : (
                  <Box>
                    <Box
                      direction="row"
                      justify="between"
                      align="center"
                      background="#314759"
                      style={{ zIndex: 10 }}
                      pad={{
                        left: 'medium',
                        right: 'medium',
                        top: 'xsmall',
                        bottom: 'xsmall'
                      }}
                      border={
                        !this.state.showFilters
                          ? {
                              side: 'bottom',
                              color: 'lotBorder',
                              size: 'small'
                            }
                          : undefined
                      }
                    >
                      <Box align="center" direction="row" gap="small">
                        <TextInput
                          value={this.state.searchVal}
                          placeholder={
                            size !== 'small'
                              ? `Search your ${
                                  this.state.showWishlist
                                    ? this.state.wishlist.length
                                    : this.state.movies.length
                                } ${
                                  this.state.movies.length === 1
                                    ? 'film'
                                    : 'films'
                                }...`
                              : this.state.showWishlist
                              ? 'Your Wishlist'
                              : 'Your Lot'
                          }
                          icon={<Search />}
                          onChange={(event) =>
                            this.handleSearch(event.target.value)
                          }
                        />
                        <Button
                          alignSelf="center"
                          icon={<Filter />}
                          color={
                            this.state.showFilters ? 'neutral-4' : undefined
                          }
                          label={this.state.showFilters ? 'Hide' : 'Filters'}
                          reverse
                          hoverIndicator={
                            this.state.showFilters ? 'neutral-4' : 'layer'
                          }
                          primary={this.state.showFilters}
                          focusIndicator={false}
                          title="Filter your search"
                          onClick={() =>
                            this.setState({
                              showFilters: !this.state.showFilters
                            })
                          }
                        />
                        <SortMoviesMenu
                          width={this.state.width}
                          sortBy={this.state.sortBy}
                          handleSort={(sortBy) => this.handleSort(sortBy)}
                        />
                      </Box>
                      <Box
                        direction="row"
                        align="center"
                        gap="medium"
                        border="between"
                      >
                        <Preferences
                          sortBy={this.state.sortBy}
                          saveSortedOrder={this.state.saveSortedOrder}
                          allowedFilters={this.state.allowedFilters}
                          handleSaveOrderChange={(checked) =>
                            this.handleSaveOrderChange(checked)
                          }
                          handlePrefChange={(index) =>
                            this.handlePrefChanged(index)
                          }
                        />
                        <EditFilters
                          wishlist={this.state.showWishlist}
                          width={this.state.width}
                          uid={this.state.uid}
                          tags={this.state.tags}
                          handleTagDelete={(tags) => this.handleTagDelete(tags)}
                          handleUpdatedTags={(updatedTags) =>
                            this.handleUpdatedTags(updatedTags)
                          }
                          handleTagAdded={(tag) => this.handleTagAdded(tag)}
                          handleResetFilters={this.handleResetFilters}
                        />
                      </Box>
                    </Box>
                    {this.state.showFilters && (
                      <Box
                        border={{
                          side: 'bottom',
                          color: 'lotBorder',
                          size: 'small'
                        }}
                        background="#314759"
                        style={{ zIndex: 10 }}
                      >
                        <FilterSearch
                          allowedFilters={this.state.allowedFilters}
                          handleFilterByTag={(filters) =>
                            this.handleFilterByTag(filters)
                          }
                          mediaTags={this.state.tags}
                          genreTags={this.state.allGenres}
                          ratings={[
                            '1',
                            '2',
                            '3',
                            '4',
                            '5',
                            '6',
                            '7',
                            '8',
                            '9',
                            '10'
                          ]}
                          handleResetFilters={this.handleResetFilters}
                        />
                      </Box>
                    )}
                  </Box>
                )}
                <Box
                  overflow={{ horizontal: 'hidden' }}
                  background="home"
                  alignContent="center"
                  flex
                >
                  {size === 'small' && this.state.width < 700 && (
                    <Box margin={{ top: 'small', bottom: 'small' }}>
                      <AddMovieTemplate
                        width={this.state.width}
                        key={0}
                        moviesAdded={(
                          lotMovies: movie[],
                          wishlistMovies: movie[]
                        ) => this.moviesAdded(lotMovies, wishlistMovies)}
                        rand={this.state.randAddFilmBackDrop}
                      />
                    </Box>
                  )}
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
                    moviesAdded={(lotMovies, wishlistMovies) =>
                      this.moviesAdded(lotMovies, wishlistMovies)
                    }
                    loading={this.state.loading}
                    width={this.state.width}
                    sortBy={this.state.sortBy}
                    filterBy={this.state.filterBy}
                    tags={this.state.tags}
                    rand={this.state.randAddFilmBackDrop}
                  />
                </Box>
                <Box
                  style={{
                    position: 'fixed',
                    zIndex: 10,
                    bottom: 0,
                    right: 0,
                    left: 0
                  }}
                >
                  <FooterComponent
                    handleSearch={(searchVal) => this.handleSearch(searchVal)}
                    wishlist={this.state.showWishlist}
                    uid={this.state.uid}
                    handleAccountDelete={this.handleAccountDelete}
                    lot={this.state.movies}
                    wishlistFilms={this.state.wishlist}
                    name={this.state.name}
                    fetchedWishlist={this.state.fetchedWishlist}
                    handleParsed={(movieList) => this.handleParsed(movieList)}
                    width={this.state.width}
                    logOut={this.logOut}
                    sortBy={this.state.sortBy}
                    handleSort={(sortBy) => this.handleSort(sortBy)}
                  />
                </Box>
                {this.state.tmdbSearched && (
                  <AddTitle
                    width={this.state.width}
                    title={this.state.addFilmSearchVal}
                    handleClose={() =>
                      this.setState({
                        tmdbSearched: false,
                        addFilmSearchVal: ''
                      })
                    }
                    moviesAdded={(lotMovies, wishlistMovies) =>
                      this.moviesAdded(lotMovies, wishlistMovies)
                    }
                  />
                )}
                {this.state.showAdvancedSearch && (
                  <AddTitle
                    width={this.state.width}
                    handleClose={() =>
                      this.setState({
                        showAdvancedSearch: false
                      })
                    }
                    moviesAdded={(lotMovies, wishlistMovies) =>
                      this.moviesAdded(lotMovies, wishlistMovies)
                    }
                  />
                )}
                {this.state.showSettings ? (
                  <Settings
                    toggleSettings={this.toggleSettings}
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
                  <Layer
                    position="center"
                    style={{ borderRadius: 30 }}
                    onClickOutside={this.dismissGreeting}
                  >
                    <Box
                      flex
                      background="layer"
                      overflow="auto"
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
                      <Heading textAlign="center">{welcome}</Heading>
                      <Paragraph textAlign="center">
                        We at Cinelot (it's just one person, actually), couldn't
                        be happier that you chose us to help keep track of the
                        one thing that's most important to you: your film
                        collection!
                      </Paragraph>
                      <Paragraph
                        textAlign="center"
                        size="large"
                        color="accent-3"
                      >
                        Getting started is as easy as clicking the + button next
                        to the search bar to add a film to your lot/wishlist, or
                        trekking over to settings to import a csv file of your
                        film data!
                      </Paragraph>
                      <Paragraph textAlign="center">
                        If you ever have any questions, or are confused on what
                        to do/where to start, just click the{' '}
                        <CircleInformation /> at the bottom of the page for some
                        useful info!
                      </Paragraph>
                      <Box gap="small">
                        <motion.div whileTap={{ scale: 0.9 }}>
                          <CheckBox
                            checked={this.state.greetingChecked}
                            label="Never show this message again"
                            onChange={(event) =>
                              this.setState({
                                greetingChecked: event.target.checked
                              })
                            }
                          />
                        </motion.div>
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
                ) : (
                  this.state.welcomeBack && (
                    <Layer
                      color="layer"
                      responsive={false}
                      position={size !== 'small' ? 'bottom-right' : 'bottom'}
                      style={{ borderRadius: 30, zIndex: 1000 }}
                      modal={false}
                      margin={{ bottom: 'medium', right: 'medium' }}
                    >
                      <Box
                        flex
                        direction="row"
                        animation={{ duration: 500, type: 'pulse' }}
                        justify="between"
                        background="accent-1"
                        align="center"
                        pad={{ horizontal: 'medium', bottom: 'medium' }}
                        round={size === 'small' ? 'large' : true}
                      >
                        <Box>
                          <Heading
                            level={4}
                            textAlign={size !== 'small' ? 'start' : 'center'}
                          >
                            Welcome back to your{' '}
                            <Text color="brand" size="large" weight="bold">
                              {this.state.movies.length}
                            </Text>
                            {this.state.movies.length === 1
                              ? ' film'
                              : ' films'}
                            , {this.state.name.split(' ', 1)}!
                          </Heading>
                          <Box
                            direction={size !== 'small' ? 'row' : 'column'}
                            gap="small"
                            align="center"
                          >
                            <motion.div
                              whileTap={{ scale: 0.9 }}
                              style={{ flexDirection: 'row' }}
                            >
                              <CheckBox
                                label="Stop welcoming me back"
                                onChange={(event) =>
                                  this.dismissWelcomeBack(event.target.checked)
                                }
                              />
                            </motion.div>
                            <Button
                              hoverIndicator="accent-1"
                              alignSelf="center"
                              style={{ borderRadius: 30 }}
                              icon={<Down />}
                              onClick={() =>
                                this.setState({ welcomeBack: false })
                              }
                            />
                          </Box>
                        </Box>
                      </Box>
                    </Layer>
                  )
                )}
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
