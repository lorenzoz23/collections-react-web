import React, { Component } from 'react';
import { ResponsiveContext, Box, Button } from 'grommet';
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
                <LoginGoogle handleLogin={this.props.handleLogin} />
                <LoginFacebook handleLogin={this.props.handleLogin} />
              </Box>
            )}
          </Box>
        )}
      </ResponsiveContext.Consumer>
    );
  }
}
