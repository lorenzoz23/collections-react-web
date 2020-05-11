import React, { Component } from 'react';
import {
  Box,
  Button,
  Collapsible,
  Heading,
  Grommet,
  Layer,
  ResponsiveContext,
  Footer,
  Text,
  Anchor,
  Clock,
  Avatar,
  Menu,
  TextInput,
  RadioButtonGroup,
  Select
} from 'grommet';
import {
  FormClose,
  Menu as MenuIcon,
  Multimedia,
  User,
  Filter,
  Search,
  CircleQuestion
} from 'grommet-icons';

import AddTitle from './components/AddTitle';

const theme = {
  global: {
    colors: {
      header: '#228BE6',
      home: '#213444',
      sidebar: 'neutral-3' //"#1766A8"
    },
    font: {
      family: 'Roboto',
      size: '14px',
      height: '20px'
    }
  }
};

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

export default class App extends Component {
  state = {
    showSidebar: true,
    showNotification: false,
    loggedIn: true,
    visualTheme: 'dark blue'
  };
  render() {
    const { showSidebar } = this.state;
    return (
      <Grommet theme={theme} full>
        <ResponsiveContext.Consumer>
          {(size) => (
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
                direction="row"
                flex
                overflow={{ horizontal: 'hidden' }}
                background="home"
              >
                <Box flex align="center" justify="center">
                  <Text>there is nothing</Text>
                  <Text>in your collection.</Text>
                </Box>
                <Box justify="end" pad="small">
                  <AddTitle />
                </Box>
                <Collapsible direction="horizontal" open={showSidebar}>
                  <Box
                    flex
                    width="xsmall"
                    background="sidebar"
                    align="center"
                    justify="between"
                    pad="small"
                  >
                    <Box>
                      <Menu
                        title="filter by tags"
                        dropAlign={{ right: 'left', top: 'bottom' }}
                        icon={<Filter />}
                        items={[
                          { label: 'blu ray', onClick: () => {} },
                          { label: 'dvd', onClick: () => {} }
                        ]}
                      />
                    </Box>
                    <Box>
                      <Avatar
                        background="accent-2"
                        onClick={() =>
                          this.setState({
                            showNotification: true,
                            showSidebar: false
                          })
                        }
                      >
                        <User color="accent-1" />
                      </Avatar>
                    </Box>
                  </Box>
                </Collapsible>
                {this.state.showNotification && (
                  <Layer
                    position="center"
                    onClickOutside={() =>
                      this.setState({
                        showNotification: !this.state.showNotification,
                        showSidebar: true
                      })
                    }
                  >
                    <Box justify="center" align="center" pad="medium">
                      <Heading level="2">settings</Heading>
                      <Box gap="medium" align="center">
                        <Box gap="xsmall" align="center">
                          <Text>status</Text>
                          <RadioButtonGroup
                            name="status"
                            value={
                              this.state.loggedIn ? 'logged in' : 'log out'
                            }
                            onChange={() =>
                              this.setState({ loggedIn: !this.state.loggedIn })
                            }
                            direction="row"
                            options={['logged in', 'log out']}
                          />
                        </Box>
                        <Box align="center">
                          <Box direction="row" align="center">
                            <Text>import data</Text>
                            <Button
                              title="click for a deeper understanding"
                              icon={<CircleQuestion color="brand" />}
                              focusIndicator={false}
                            />
                          </Box>
                          <Button label="select a file" size="small" />
                        </Box>
                        <Box align="center">
                          <Select
                            options={['under construction']}
                            placeholder="select a visual theme..."
                            onChange={(option: string) => {
                              this.setState({ visualTheme: option });
                            }}
                          />
                        </Box>
                        <Button
                          alignSelf="center"
                          size="small"
                          icon={<FormClose size="small" />}
                          primary
                          onClick={() =>
                            this.setState({
                              showNotification: !this.state.showNotification,
                              showSidebar: true
                            })
                          }
                        />
                      </Box>
                    </Box>
                  </Layer>
                )}
              </Box>
              <Footer
                pad="medium"
                gap="medium"
                background="brand"
                justify="between"
                height="10px"
              >
                <Box>
                  <Clock type="digital" alignSelf="center" size="small" />
                </Box>
                <Box direction="row" gap="small" align="center">
                  <Multimedia />
                  <Text size="small">
                    Movie data provided by The Movie Database (tMDB)
                  </Text>
                </Box>
              </Footer>
            </Box>
          )}
        </ResponsiveContext.Consumer>
      </Grommet>
    );
  }
}
