import React, { Component } from 'react';
import { Collapsible, Box, Menu, Avatar } from 'grommet';
import { Filter, User } from 'grommet-icons';
import Settings from './Settings';

interface SideMenuBarProps {
  loggedIn: boolean;
  showSidebar: boolean;
  changeSideBar(visibility: boolean): void;
  logOut(): void;
}

export default class SideMenuBar extends Component<SideMenuBarProps> {
  state = {
    showSettings: false
  };

  exitSettings = () => {
    this.props.changeSideBar(true);
    this.setState({
      showSettings: false
    });
  };

  enterSettings = () => {
    this.props.changeSideBar(false);
    this.setState({
      showSettings: true
    });
  };

  render() {
    return (
      <Collapsible direction="horizontal" open={this.props.showSidebar}>
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
            <Avatar background="accent-2" onClick={this.enterSettings}>
              <User color="accent-1" />
            </Avatar>
          </Box>
        </Box>
        {this.state.showSettings && (
          <Settings
            loggedIn={this.props.loggedIn}
            exitSettings={this.exitSettings}
            logOut={this.props.logOut}
          />
        )}
      </Collapsible>
    );
  }
}
