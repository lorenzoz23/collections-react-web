import React, { Component } from 'react';
import { ResponsiveContext, Box, Button, CheckBox } from 'grommet';
import { motion } from 'framer-motion';
import { MailOption } from 'grommet-icons';

import LoginEmail from './LoginEmail';
import LoginGoogle from './LoginGoogle';
import LoginFacebook from './LoginFacebook';

interface LoginButtonProps {
  handleLogin(): void;
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
                handleLogin={this.props.handleLogin}
                rememberMe={this.state.rememberMe}
                handleRememberMe={(checked: boolean) =>
                  this.setState({ rememberMe: checked })
                }
              />
            ) : (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ rotate: 360, scale: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 100
                }}
              >
                <Box gap="medium">
                  <motion.div whileTap={{ scale: 0.9 }}>
                    <Box>
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
                    </Box>
                  </motion.div>
                  <LoginGoogle
                    size={size}
                    handleLogin={this.props.handleLogin}
                    rememberMe={this.state.rememberMe}
                  />
                  <LoginFacebook
                    size={size}
                    handleLogin={this.props.handleLogin}
                    rememberMe={this.state.rememberMe}
                  />
                  <motion.div whileTap={{ scale: 0.9 }}>
                    <Box align="center">
                      <CheckBox
                        label="remember me?"
                        checked={this.state.rememberMe}
                        onChange={(event) =>
                          this.setState({ rememberMe: event.target.checked })
                        }
                      />
                    </Box>
                  </motion.div>
                </Box>
              </motion.div>
            )}
          </Box>
        )}
      </ResponsiveContext.Consumer>
    );
  }
}
