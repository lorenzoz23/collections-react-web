import React, { Component } from 'react';
import { ResponsiveContext, Box, Tabs, Tab, CheckBox } from 'grommet';

import SignIn from './SignIn';
import SignUp from './SignUp';
import { motion } from 'framer-motion';

interface LoginEmailProps {
  handleLogin(): void;
  handleRememberMe(checked: boolean): void;
  goBack(): void;
  rememberMe: boolean;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.5
    }
  }
};

export default class LoginEmail extends Component<LoginEmailProps> {
  state = {
    email: '',
    password: '',
    activeIndex: 0,
    created: false,
    rememberMe: this.props.rememberMe
  };

  handleUserSignUp = (email: string, password: string) => {
    this.setState({
      email: email,
      password: password,
      activeIndex: 0,
      created: true
    });
    this.props.handleLogin();
  };

  render() {
    return (
      <ResponsiveContext.Consumer>
        {(size) => (
          <Box alignSelf="center">
            <Tabs
              activeIndex={this.state.activeIndex}
              onActive={(index) => {
                this.setState({ activeIndex: index });
              }}
            >
              <Tab title="Sign In">
                <SignIn
                  goBack={this.props.goBack}
                  email={this.state.email}
                  handleRememberMe={(checked: boolean) =>
                    this.props.handleRememberMe(checked)
                  }
                  password={this.state.password}
                  handleLogin={this.props.handleLogin}
                  created={this.state.created}
                  rememberMe={this.state.rememberMe}
                />
              </Tab>
              <Tab title="Sign Up">
                <SignUp
                  handleUserSignUp={(email: string, password: string) =>
                    this.handleUserSignUp(email, password)
                  }
                  rememberMe={this.state.rememberMe}
                />
              </Tab>
            </Tabs>
            <Box align="center" pad="small">
              <motion.div
                whileTap={{ scale: 0.9 }}
                variants={container}
                initial="hidden"
                animate="show"
                transition={{ ease: 'easeOut', duration: 2 }}
              >
                <CheckBox
                  label="Remember me?"
                  checked={this.state.rememberMe}
                  onChange={(event) => {
                    this.setState({ rememberMe: event.target.checked });
                    this.props.handleRememberMe(event.target.checked);
                  }}
                />
              </motion.div>
            </Box>
          </Box>
        )}
      </ResponsiveContext.Consumer>
    );
  }
}
