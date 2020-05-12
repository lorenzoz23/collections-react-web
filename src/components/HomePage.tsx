import React, { Component } from 'react';
import {
  Box,
  Heading,
  Anchor,
  TextInput,
  Button,
  ResponsiveContext
} from 'grommet';
import { Search, Menu as MenuIcon } from 'grommet-icons';
import AddTitle from './AddTitle';
import Collection from './Collection';
import SideMenuBar from './SideMenuBar';
import FooterComponent from './FooterComponent';
import {
  Redirect,
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import Login from './Login';

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
    movies: []
  };

  logOut = () => {
    this.setState({
      loggedIn: false
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
                          suggestions={["it's never too late to start"]}
                          placeholder={`search ${this.state.movies.length} films...`}
                          icon={<Search />}
                        />
                        <Box>
                          <AddTitle />
                        </Box>
                      </Box>
                    </Box>
                  ) : (
                    <Box direction="row" gap="none" align="center">
                      <TextInput
                        focusIndicator={false}
                        placeholder="my collection"
                        icon={<Search />}
                        suggestions={["it's never too late to start"]}
                      />
                    </Box>
                  )}
                  <Box
                    round
                    background={
                      size !== 'small'
                        ? this.state.showSidebar
                          ? 'brand'
                          : 'neutral-3'
                        : ''
                    }
                  >
                    <Button
                      focusIndicator={size === 'small' ? false : true}
                      title="menu"
                      icon={<MenuIcon />}
                      onClick={() =>
                        this.setState({ showSidebar: !this.state.showSidebar })
                      }
                    />
                  </Box>
                </AppBar>
                <Box
                  flex
                  direction="row"
                  overflow={{ horizontal: 'hidden' }}
                  background="home"
                >
                  <Collection />
                  <SideMenuBar
                    loggedIn={this.state.loggedIn}
                    showSidebar={this.state.showSidebar}
                    changeSideBar={(visibility) =>
                      this.setState({ showSidebar: visibility })
                    }
                    logOut={this.logOut}
                  />
                </Box>
                <FooterComponent />
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
