import React, { Component } from 'react';
import {
  Form,
  FormField,
  TextInput,
  Box,
  Button,
  ResponsiveContext
} from 'grommet';
import { Next } from 'grommet-icons';

interface SignInProps {
  handleLogin(): void;
  username: string;
  password: string;
}
export default class SignIn extends Component<SignInProps> {
  state = {
    username: this.props.username,
    password: this.props.password
  };

  render() {
    return (
      <ResponsiveContext.Consumer>
        {(size) => (
          <Box pad="medium">
            <Form
              value={this.state}
              onSubmit={this.props.handleLogin}
              onChange={(nextFormValue: {}) => this.setState(nextFormValue)}
            >
              <FormField label="username" required name="username">
                <TextInput
                  name="username"
                  size={size === 'small' ? 'medium' : 'xlarge'}
                  value={this.state.username}
                  onChange={(e: any) => {
                    this.setState({ username: e.target.value });
                  }}
                />
              </FormField>
              <FormField label="password" required name="password">
                <TextInput
                  name="password"
                  size={size === 'small' ? 'medium' : 'xlarge'}
                  type="password"
                  value={this.state.password}
                  onChange={(e: any) => {
                    this.setState({ password: e.target.value });
                  }}
                />
              </FormField>
              <Box
                direction="row"
                justify="center"
                pad="medium"
                align="center"
                round
              >
                <Button
                  //label="log in"
                  icon={<Next />}
                  type="submit"
                  size={size === 'small' ? 'small' : 'medium'}
                />
              </Box>
            </Form>
          </Box>
        )}
      </ResponsiveContext.Consumer>
    );
  }
}
