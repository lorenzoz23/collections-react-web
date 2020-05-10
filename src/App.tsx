import React, { Component } from "react";
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
  TextInput
} from "grommet";
import {
  FormClose,
  Menu as MenuIcon,
  Multimedia,
  User,
  Filter,
  Search
} from "grommet-icons";

const theme = {
  global: {
    colors: {
      header: "#228BE6",
      home: "#213444",
      sidebar: "neutral-3" //"#1766A8"
    },
    font: {
      family: "Roboto",
      size: "14px",
      height: "20px"
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
    pad={{ left: "medium", right: "medium", vertical: "small" }}
    style={{ zIndex: "1" }}
    {...props}
  />
);

class App extends Component {
  state = {
    showSidebar: true
  };
  render() {
    const { showSidebar } = this.state;
    return (
      <Grommet theme={theme} full>
        <ResponsiveContext.Consumer>
          {(size) => (
            <Box fill>
              <AppBar>
                <Box direction="row" gap="medium">
                  <Heading level="3" margin="none">
                    <Anchor title="home" color="light-1" href="/">
                      my collection
                    </Anchor>
                  </Heading>
                  <Box alignSelf="center">
                    <TextInput
                      suggestions={["portrait of a lady on fire", "parasite"]}
                      placeholder="search your collection"
                      icon={<Search />}
                    />
                  </Box>
                </Box>

                <Box
                  round
                  background={this.state.showSidebar ? "brand" : "neutral-3"}
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
                overflow={{ horizontal: "hidden" }}
                background="home"
              >
                <Box flex align="center" justify="center">
                  app body
                </Box>

                {!showSidebar || size !== "small" ? (
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
                          dropAlign={{ right: "left", top: "bottom" }}
                          icon={<Filter />}
                          items={[
                            { label: "blu ray", onClick: () => {} },
                            { label: "dvd", onClick: () => {} }
                          ]}
                        />
                      </Box>
                      <Box>
                        <Avatar background="accent-2">
                          <User color="accent-1" />
                        </Avatar>
                      </Box>
                    </Box>
                  </Collapsible>
                ) : (
                  <Layer>
                    <Box
                      background="light-2"
                      tag="header"
                      justify="end"
                      align="center"
                      direction="row"
                    >
                      <Button
                        icon={<FormClose />}
                        onClick={() => this.setState({ showSidebar: false })}
                      />
                    </Box>
                    <Box
                      fill
                      background="sidebar"
                      align="center"
                      justify="center"
                    >
                      sidebar
                    </Box>
                  </Layer>
                )}
              </Box>
              <Footer
                pad="medium"
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

export default App;
