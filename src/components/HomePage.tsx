import React, { Component } from 'react';
import {
  Box,
  Heading,
  TextInput,
  ResponsiveContext,
  Avatar,
  CheckBox,
  Button,
  Text,
  DropButton,
  Form
} from 'grommet';
import {
  Search,
  User,
  FormDown,
  FormUp,
  UserSettings,
  Logout,
  Add,
  Checkmark,
  Filter,
  Configure
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
import { searchResults } from './MovieSearchResult';
import Notification from './Notification';
import SortMoviesMenu from './SortMoviesMenu';
import FilterSearch, { filter } from './FilterSearch';
import AddMovieTemplate from './AddMovieTemplate';
import Preferences from './Preferences';
import MultipleAuthProviders from './MultipleAuthProviders';

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
  starCount: number;
  tags: number[];
  watched: number;
  key?: string;
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
  yearAsc: 'Year Released (Asc)',
  yearDesc: 'Year Released (Desc)',
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
    randAddFilmBackDrop: number;
    addFilmSearchVal: string;
    tmdbSearched: boolean;
    saveSortedOrder: boolean;
    showFilters: boolean;
    allGenres: string[];
    allowedFilters: boolean[];
    showPrefs: boolean;
    showAdvSearch: boolean;
    showAuthProviders: boolean;
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
    randAddFilmBackDrop: 0,
    addFilmSearchVal: '',
    tmdbSearched: false,
    saveSortedOrder: false,
    showFilters: false,
    allGenres: [''],
    allowedFilters: [true, true, true, true],
    showPrefs: false,
    showAdvSearch: false,
    showAuthProviders: false
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
      randAddFilmBackDrop: 0,
      addFilmSearchVal: '',
      tmdbSearched: false,
      saveSortedOrder: false,
      showFilters: false,
      allGenres: [''],
      allowedFilters: [true, true, true, true],
      showPrefs: false,
      showAdvSearch: false,
      showAuthProviders: false
    };
  }

  componentDidMount = async () => {
    console.log('home mounted');
    console.log(this.state.uid);
    if (this.state.uid === '') {
      this.setState({ invalidRoute: true });
    } else {
      document.title = 'Your Lot | Cinelot';
      this.updateWindowDimensions();
      window.addEventListener('resize', this.updateWindowDimensions);

      let lot: movie[] = [];
      let tags: string[] = [];
      let uid =
        this.state.uid === ''
          ? firebase.auth().currentUser!.uid
          : this.state.uid;

      const showAuthProviders = localStorage.getItem('isNew') || 'password-old';
      const userRef = firebase.database().ref('users/' + uid);
      const sort = localStorage.getItem('sortBy') || '';

      const showMedia =
        (localStorage.getItem('showMediaTags') || 'show') === 'show';
      const showGenre =
        (localStorage.getItem('showGenreTags') || 'show') === 'show';
      const showRatings =
        (localStorage.getItem('showRatingsTags') || 'show') === 'show';
      const showWatched =
        (localStorage.getItem('showWatchedTags') || 'show') === 'show';
      const allowed: boolean[] = [
        showMedia,
        showGenre,
        showRatings,
        showWatched
      ];

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
            tags: movie.tags || [],
            watched: movie.watched
          };
          lot.push(entry);
        });

        this.setState({
          movies: lot,
          sortBy: sort,
          saveSortedOrder: sort !== '',
          allowedFilters: allowed,
          tags: tags,
          loading: false,
          showAuthProviders: !showAuthProviders.includes('old') ? true : false,
          uid: uid,
          allGenres: genres,
          randAddFilmBackDrop: Math.floor(Math.random() * 60)
        });
        this.setState(
          {
            notification: true,
            notificationText: 'Welcome, ' + this.state.name.split(' ', 1) + '!',
            goodNotification: true
          },
          () => setTimeout(this.onNotificationClose, 2000)
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
        ` ${lotLen === 1 ? 'movie' : 'movies'} added to your Lot and ` +
        wishlistLen +
        ` ${wishlistLen === 1 ? 'movie' : 'movies'} added to your Wishlist!`;
    } else {
      if (lotRepeats === 0 && lotMovies.length === 1) {
        notificationText = `${
          lotMovies[0].name + ' has been added to your Lot!'
        } `;
        notificationType = true;
      }
      if (lotRepeats) {
        notificationText = `${
          lotMovies[0].name + ' already exists in your Lot'
        } `;
        notificationType = false;
      }
      if (wishlistRepeats === 0 && wishlistMovies.length === 1) {
        notificationText = `${
          wishlistMovies[0].name + ' has been added to your Wishlist!'
        } `;
        notificationType = true;
      }
      if (wishlistRepeats) {
        notificationText = `${
          wishlistMovies[0].name + ' already exists in your Wishlist'
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
    if (!this.state.tags.includes(tag, 0)) {
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
    } else {
      this.setState(
        {
          notification: true,
          notificationText: 'A tag with that name already exists',
          goodNotification: false
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
      ? `Your films will now be default sorted by ${
          sortLabels[sortBy || 'reset']
        }`
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
      document.title = 'Your Wishlist | Cinelot';
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
            tags: movie.tags || [],
            watched: movie.watched
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
            setTimeout(this.onNotificationClose, 2000);
          }
        );
      });
    } else {
      if (checked) {
        document.title = 'Your Wishlist | Cinelot';
      } else {
        document.title = 'Your Lot | Cinelot';
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
          setTimeout(this.onNotificationClose, 2000);
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
          notificationText: 'Film successfully deleted from Wishlist',
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
          notificationText: 'Film successfully deleted from Lot',
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
          updatedMovie.watched =
            updatedMovie.starCount > 0 ? 1 : updatedMovie.watched;
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
          notificationText:
            updatedMovie.starCount === -1
              ? 'Rating has been cleared'
              : `You just rated ${updatedMovie.name} ${updatedMovie.starCount}/10`,
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
          notificationText:
            updatedMovie.starCount === -1
              ? 'Rating has been cleared'
              : `You just rated ${updatedMovie.name} ${updatedMovie.starCount}/10`,
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
        notificationText: `${movie.name} has been transferred to your Lot!`,
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
        showFilters: false,
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
    switch (index) {
      case 0:
        localStorage.setItem(
          'showMediaTags',
          !allowed[index] === false ? 'noShow' : 'show'
        );
        break;
      case 1:
        localStorage.setItem(
          'showGenreTags',
          !allowed[index] === false ? 'noShow' : 'show'
        );
        break;
      case 2:
        localStorage.setItem(
          'showRatingsTags',
          !allowed[index] === false ? 'noShow' : 'show'
        );
        break;
      case 3:
        localStorage.setItem(
          'showWatchedTags',
          !allowed[index] === false ? 'noShow' : 'show'
        );
        break;
      default:
        break;
    }
    allowed[index] = !allowed[index];
    this.setState({
      allowedFilters: allowed
    });
  };

  handleSaveOrderChange = (checked: boolean) => {
    if (!checked) {
      localStorage.removeItem('sortBy');
      this.setState({
        saveSortedOrder: checked,
        sortBy: ''
      });
      this.handleSort('');
    } else {
      if (this.state.sortBy !== '') {
        localStorage.setItem('sortBy', this.state.sortBy);
      }
      this.setState({
        saveSortedOrder: checked
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

  handleWatched = (watchedMovie: movie) => {
    const m: movie = watchedMovie;
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

        if (movie.id === m.id) {
          m.watched = m.watched === 1 ? 0 : 1;
          movieRef.child(childKey).update({ movie: m });
          return true;
        }
      });
    });
    for (let i = 0; i < moviesToUpdate.length; i++) {
      if (moviesToUpdate[i].id !== watchedMovie.id) {
        newMovies.push(moviesToUpdate[i]);
      } else {
        newMovies.push(m);
      }
    }

    if (this.state.showWishlist) {
      this.setState({
        wishlist: newMovies
      });
    } else {
      this.setState({
        movies: newMovies
      });
    }
  };

  handleParsed = (movieList: searchResults) => {
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
    const title =
      'Cinelot | ' + (this.state.showWishlist ? 'Your Wishlist' : 'Your Lot');
    const mode = localStorage.getItem('visualMode') || 'wedding';
    return (
      <Router>
        {!this.state.loggedIn || this.state.invalidRoute ? (
          <Redirect exact to="/login" />
        ) : (
          <ResponsiveContext.Consumer>
            {(size) => (
              <Box
                fill
                pad={{
                  horizontal: this.state.width < 950 ? 'medium' : undefined
                }}
              >
                <AppBar
                  pad={
                    size !== 'small' && this.state.width > 950
                      ? {
                          bottom: mode === 'wedding' ? 'xsmall' : 'none',
                          left: 'small'
                        }
                      : { vertical: 'xsmall' }
                  }
                  //pad={{ vertical: 'xsmall', left: 'small' }}
                  border={{
                    side: 'bottom',
                    color: 'lotBorder',
                    size: 'small'
                  }}
                >
                  {size !== 'small' && this.state.width > 950 ? (
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
                            width={
                              size === 'medium' && this.state.width < 1200
                                ? 'medium'
                                : 'large'
                            }
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
                            <Button
                              disabled={
                                this.state.addFilmSearchVal.length === 0
                              }
                              hoverIndicator="accent-1"
                              alignSelf="center"
                              type="submit"
                              style={{ display: 'none' }}
                              icon={<Checkmark />}
                              reverse
                            />
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
                      justify="between"
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
                            level={3}
                            margin="none"
                            color="light-1"
                          >
                            {title}
                          </Heading>
                        }
                      />
                      <Text weight="bold">
                        {this.state.showWishlist
                          ? this.state.wishlist.length
                          : this.state.movies.length}{' '}
                        films
                      </Text>
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
                  )}
                  {this.state.width > 950 && (
                    <DropButton
                      style={{ borderRadius: 25 }}
                      plain
                      alignSelf={size !== 'small' ? 'end' : 'center'}
                      hoverIndicator="brand"
                      margin={{ right: size !== 'small' ? 'small' : 'none' }}
                      onMouseOver={() =>
                        this.setState({ userProfileClicked: true })
                      }
                      open={
                        this.state.userProfileClicked &&
                        !this.state.showSettings &&
                        !this.state.showPrefs
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
                              right: 'small'
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
                              right: 'small'
                            }}
                            hoverIndicator="accent-3"
                            onClick={() => this.setState({ showPrefs: true })}
                          >
                            <Text>Preferences</Text>
                            <Configure color="brand" />
                          </Box>
                          <Box
                            direction="row"
                            justify="between"
                            pad={{
                              left: 'small',
                              top: 'medium',
                              bottom: 'medium',
                              right: 'small'
                            }}
                            hoverIndicator="neutral-4"
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
                {this.state.width < 950 ? (
                  <Box
                    background="home"
                    pad="small"
                    style={{ zIndex: 10 }}
                    justify={this.state.width > 700 ? 'center' : undefined}
                    align={this.state.width > 700 ? 'center' : undefined}
                  >
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
                        <Button
                          disabled={this.state.addFilmSearchVal.length === 0}
                          alignSelf="center"
                          type="submit"
                          primary
                          style={{ borderRadius: 30, display: 'none' }}
                          icon={<Checkmark size="small" />}
                          reverse
                        />
                      </Box>
                    </Form>
                  </Box>
                ) : (
                  <Box
                    background="#314759"
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
                    <Box
                      align="center"
                      direction="row"
                      gap="small"
                      width={{ max: '35%' }}
                      style={{ zIndex: 10 }}
                      pad={{
                        left: 'medium',
                        right: 'medium',
                        top: 'xsmall',
                        bottom: 'xsmall'
                      }}
                    >
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
                        color={this.state.showFilters ? 'neutral-4' : undefined}
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
                    {this.state.showFilters && (
                      <Box
                        border={{
                          side: 'bottom',
                          color: 'lotBorder',
                          size: 'small'
                        }}
                        style={{ zIndex: 10 }}
                      >
                        <FilterSearch
                          filters={this.state.filterBy}
                          width={this.state.width}
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
                  background={{
                    color: '#1A252E',
                    image:
                      // https://coolbackgrounds.io/images/backgrounds/index/compute-ea4c57a4.png
                      // https://coolbackgrounds.io/images/backgrounds/black/black-trianglify-b6181ec2.jpg
                      'url(https://coolbackgrounds.io/images/backgrounds/index/gulf-dec0ccde.svg)',
                    opacity: 'medium'
                  }}
                  alignContent="center"
                  flex
                >
                  {this.state.width < 950 && (
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
                    handleWatched={(movie) => this.handleWatched(movie)}
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
                    showAdvSearch={() => this.setState({ showAdvSearch: true })}
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
                    handleTagDelete={(tags) => this.handleTagDelete(tags)}
                    handleUpdatedTags={(tags) => this.handleUpdatedTags(tags)}
                    handleTagAdded={(tag) => this.handleTagAdded(tag)}
                    handleSaveOrderChange={(checked) =>
                      this.handleSaveOrderChange(checked)
                    }
                    handlePrefChanged={(index) => this.handlePrefChanged(index)}
                    saveSortedOrder={this.state.saveSortedOrder}
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
                    advSearch={() => this.setState({ showAdvSearch: true })}
                    moviesAdded={(lotMovies, wishlistMovies) =>
                      this.moviesAdded(lotMovies, wishlistMovies)
                    }
                  />
                )}
                {this.state.showAdvSearch && (
                  <AddTitle
                    width={this.state.width}
                    handleClose={() =>
                      this.setState({
                        showAdvSearch: false
                      })
                    }
                    moviesAdded={(lotMovies, wishlistMovies) =>
                      this.moviesAdded(lotMovies, wishlistMovies)
                    }
                  />
                )}
                {this.state.showSettings && (
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
                )}
                {this.state.showPrefs && (
                  <Preferences
                    sortBy={this.state.sortBy}
                    saveSortedOrder={this.state.saveSortedOrder}
                    allowedFilters={this.state.allowedFilters}
                    handleSaveOrderChange={(checked) =>
                      this.handleSaveOrderChange(checked)
                    }
                    handlePrefChange={(index) => this.handlePrefChanged(index)}
                    onClose={() => this.setState({ showPrefs: false })}
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
                )}
                {this.state.showAuthProviders && (
                  <MultipleAuthProviders
                    user={firebase.auth().currentUser!}
                    close={() => this.setState({ showAuthProviders: false })}
                  />
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
