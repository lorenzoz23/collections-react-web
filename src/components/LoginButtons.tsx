import React, { Component } from 'react';
import { ResponsiveContext, Box, Button, CheckBox } from 'grommet';
import { MailOption } from 'grommet-icons';
import LoginEmail from './LoginEmail';
import LoginGoogle from './LoginGoogle';
import LoginFacebook from './LoginFacebook';

interface LoginButtonProps {
  handleLogin(name?: string): void;
}

export default class LoginButtons extends Component<LoginButtonProps> {
  state = {
    show: false,
    rememberMe: false
  };

  componentDidMount = () => {
    const remember = this.getInitialState();
    this.setState({ rememberMe: remember === null ? false : true });
    if (remember) {
      this.props.handleLogin();
    }
  };

  getInitialState = () => {
    return localStorage.getItem('rememberMe');
  };

  goBack = () => {
    this.setState({
      show: false
    });
  };

  render() {
    return (
      <ResponsiveContext.Consumer>
        {(size) => (
          <Box>
            {this.state.show ? (
              <LoginEmail
                goBack={this.goBack}
                handleLogin={(name: string) => this.props.handleLogin(name)}
                rememberMe={this.state.rememberMe}
                handleRememberMe={(checked: boolean) =>
                  this.setState({ rememberMe: checked })
                }
              />
            ) : (
              <Box gap="medium">
                <Button
                  primary
                  size={size === 'small' ? 'medium' : 'large'}
                  label="continue with email"
                  icon={<MailOption />}
                  reverse
                  onClick={() => {
                    this.setState({ show: true });
                  }}
                />
                <LoginGoogle
                  handleLogin={this.props.handleLogin}
                  rememberMe={this.state.rememberMe}
                />
                <LoginFacebook
                  handleLogin={this.props.handleLogin}
                  rememberMe={this.state.rememberMe}
                />
                <Box align="center">
                  <CheckBox
                    label="remember me?"
                    checked={this.state.rememberMe}
                    onChange={(event) =>
                      this.setState({ rememberMe: event.target.checked })
                    }
                  />
                </Box>
              </Box>
            )}
          </Box>
        )}
      </ResponsiveContext.Consumer>
    );
  }
}
