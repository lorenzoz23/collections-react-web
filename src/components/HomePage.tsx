import React, { Component } from 'react';
import { Box, Heading, Anchor, TextInput, Button } from 'grommet';
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
    pad={{ left: 'medium', right: 'medium', vertical: 'small' }}
    style={{ zIndex: '1' }}
    {...props}
  />
);

export default class HomePage extends Component {
  state = {
    showSidebar: true,
    loggedIn: true
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
          <Box fill>
            <AppBar>
              <Box direction="row" gap="medium" align="center">
                <Heading level="3" margin="none" alignSelf="center">
                  <Anchor title="home" color="light-1" href="/">
                    my collection
                  </Anchor>
                </Heading>
                <Box direction="row" align="center" gap="small">
                  <TextInput
                    suggestions={['click the + button to add a film!']}
                    placeholder="search 0 films..."
                    icon={<Search />}
                  />
                  <Box>
                    <AddTitle />
                  </Box>
                </Box>
              </Box>
              <Box
                round
                background={this.state.showSidebar ? 'brand' : 'neutral-3'}
              >
                <Button
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
        <Switch>
          <Route exact path="/" component={Login} />
        </Switch>
      </Router>
    );
  }
}
