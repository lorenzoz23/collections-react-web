import React, { Component } from 'react';
import { Layer, Box, Button, Text, ResponsiveContext } from 'grommet';
import { StatusGood, FormClose, StatusCritical, Emoji } from 'grommet-icons';

interface NotificationProps {
  notificationText: string;
  onNotificationClose(): void;
  good: boolean;
  top?: boolean;
}

export default class Notification extends Component<NotificationProps> {
  render() {
    return (
      <ResponsiveContext.Consumer>
        {(size) => (
          <Layer
            position={this.props.top || size === 'small' ? 'top' : 'bottom'}
            modal={false}
            margin={
              !this.props.top
                ? { bottom: 'medium' }
                : { top: size !== 'small' ? 'medium' : 'none' }
            }
            responsive={false}
            style={{
              borderRadius: 30,
              width: size === 'small' ? '100%' : undefined
            }}
          >
            <Box
              align="center"
              direction="row"
              gap="small"
              justify="between"
              flex
              round={size === 'small' ? false : true}
              elevation="medium"
              pad={{ vertical: 'xsmall', horizontal: 'small' }}
              background={this.props.good ? 'accent-1' : 'status-error'}
            >
              <Box align="center" direction="row" gap="xsmall">
                {this.props.good ? (
                  this.props.notificationText.includes('Welcome') ? (
                    <Emoji />
                  ) : (
                    <StatusGood size="medium" />
                  )
                ) : (
                  <StatusCritical size="medium" />
                )}
                <Text size="medium">{this.props.notificationText}</Text>
              </Box>
              <Button
                focusIndicator={false}
                icon={<FormClose size="medium" />}
                onClick={this.props.onNotificationClose}
              />
            </Box>
          </Layer>
        )}
      </ResponsiveContext.Consumer>
    );
  }
}
