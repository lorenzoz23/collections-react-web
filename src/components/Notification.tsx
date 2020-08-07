import React, { Component } from 'react';
import { Layer, Box, Button, Text, ResponsiveContext } from 'grommet';
import { StatusGood, FormClose, StatusCritical } from 'grommet-icons';

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
              !this.props.top && size !== 'small'
                ? { bottom: 'medium' }
                : { top: 'medium' }
            }
            responsive={false}
            style={{ borderRadius: 30 }}
          >
            <Box
              align="center"
              direction="row"
              gap="small"
              justify="between"
              flex
              width={size === 'small' ? 'medium' : undefined}
              round={size === 'small' ? 'large' : true}
              elevation="medium"
              pad={{ vertical: 'xsmall', horizontal: 'small' }}
              background={this.props.good ? 'accent-1' : 'status-error'}
            >
              <Box align="center" direction="row" gap="xsmall">
                {this.props.good ? (
                  <StatusGood size="medium" />
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
