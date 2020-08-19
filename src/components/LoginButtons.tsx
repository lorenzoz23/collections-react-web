import React, { Component } from 'react';
import { ResponsiveContext, Box, Button } from 'grommet';
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
    show: false
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
                  <Box>
                    <Button
                      primary
                      size={size === 'small' ? 'medium' : 'large'}
                      label="Continue with Email"
                      icon={<MailOption />}
                      reverse
                      onClick={() => {
                        this.setState({ show: true });
                      }}
                    />
                  </Box>
                  <LoginGoogle handleLogin={this.props.handleLogin} />
                  <LoginFacebook handleLogin={this.props.handleLogin} />
                </Box>
              </motion.div>
            )}
          </Box>
        )}
      </ResponsiveContext.Consumer>
    );
  }
}
