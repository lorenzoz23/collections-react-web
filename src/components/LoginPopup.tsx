import React, { Component } from 'react';
import { ResponsiveContext, Box, Button, Layer } from 'grommet';
import LoginButtons from './LoginButtons';
import { PlayFill } from 'grommet-icons';
import { motion } from 'framer-motion';

interface LoginPopupProps {
  handleLogin(): void;
}

const variants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 }
};

export default class LoginPopup extends Component<LoginPopupProps> {
  state = {
    show: false
  };

  render() {
    return (
      <ResponsiveContext.Consumer>
        {(size) => (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={variants}
            transition={{ ease: 'easeOut', duration: 2 }}
          >
            <Box align="center" justify="center" gap="medium">
              <Button
                label="Start my collection"
                size="large"
                primary
                color="accent-1"
                icon={<PlayFill />}
                onClick={() => this.setState({ show: true })}
              />
            </Box>
            {this.state.show && (
              <Layer
                position="center"
                style={{ borderRadius: 30 }}
                onClickOutside={() => this.setState({ show: false })}
              >
                <Box
                  align="center"
                  gap="medium"
                  round
                  background={{ color: 'home' }}
                  pad="large"
                  border={{ side: 'all', size: 'small', color: 'neutral-4' }}
                >
                  <LoginButtons handleLogin={this.props.handleLogin} />
                </Box>
              </Layer>
            )}
          </motion.div>
        )}
      </ResponsiveContext.Consumer>
    );
  }
}
