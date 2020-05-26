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
import AddTitle from './AddTitle';
import Collection from './Collection';
import FooterComponent from './FooterComponent';
import {
  Redirect,
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import { Scrollbars } from 'react-custom-scrollbars';

import Login from './Login';
import Settings from './Settings';

const AppBar = (props: any) => (
  <Box
    tag="header"
    direction="row"
    align="center"
    justify="between"
    background="header"
    style={{ zIndex: '1' }}
    {...props}
  />
);

export default class HomePage extends Component {
  state = {
    showSidebar: true,
    loggedIn: true,
    movies: [],
    showSettings: false
  };

  logOut = () => {
    this.setState({
      loggedIn: false
    });
  };

  exitSettings = () => {
    this.setState({
      showSettings: false
    });
  };

  enterSettings = () => {
    this.setState({
      showSettings: true
    });
  };

  render() {
    return (
      <Router>
        {!this.state.loggedIn ? (
          <Redirect exact to="/" />
        ) : (
          <ResponsiveContext.Consumer>
            {(size) => (
              <Box fill>
                <AppBar
                  pad={
                    size === 'small'
                      ? { right: 'small', left: 'medium', vertical: 'small' }
                      : { left: 'medium', right: 'medium', vertical: 'small' }
                  }
                >
                  {size !== 'small' ? (
                    <Box direction="row" gap="medium" align="center">
                      <Heading level="3" margin="none" alignSelf="center">
                        <Anchor title="home" color="light-1" href="/home">
                          my collection
                        </Anchor>
                      </Heading>
                      <Box direction="row" align="center" gap="small">
                        <TextInput
                          title="search your collection!"
                          placeholder={`search ${this.state.movies.length} films...`}
                          icon={<Search />}
                        />
                        <Box>
                          <AddTitle />
                        </Box>
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
                      <AddTitle />
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
                      background="accent-2"
                      onClick={this.enterSettings}
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
                <Scrollbars
                  style={{
                    width: '100%',
                    height: '100%',
                    overflowX: 'hidden',
                    flex: 1
                  }}
                  autoHide
                >
                  <Box
                    flex
                    direction="row"
                    overflow={{ horizontal: 'hidden' }}
                    background="home"
                  >
                    <Collection />
                  </Box>
                </Scrollbars>
                <FooterComponent />
                {this.state.showSettings ? (
                  <Settings
                    loggedIn={this.state.loggedIn}
                    logOut={this.logOut}
                    exitSettings={this.exitSettings}
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
