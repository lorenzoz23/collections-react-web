import React, { Component } from 'react';
import { ResponsiveContext, Box, Button } from 'grommet';
import { MailOption } from 'grommet-icons';
import LoginEmail from './LoginEmail';
import LoginGoogle from './LoginGoogle';
import firebase from 'firebase';
import LoginFacebook from './LoginFacebook';

interface LoginButtonProps {
  firebase: any;
  handleLogin(): void;
}

export default class LoginButtons extends Component<LoginButtonProps> {
  state = {
    email: '',
    password: '',
    name: '',
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
                firebase={firebase}
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
                <LoginGoogle firebase={firebase} />
                <LoginFacebook firebase={firebase} />
              </Box>
            )}
          </Box>
        )}
      </ResponsiveContext.Consumer>
    );
  }
}
