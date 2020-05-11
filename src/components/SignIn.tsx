import React, { Component } from 'react';
import { Form, FormField, TextInput, Box, Button } from 'grommet';

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

  defaultState = {
    username: '',
    password: ''
  };

  render() {
    return (
      <Form
        value={this.state}
        onReset={() => this.setState(this.defaultState)}
        onSubmit={this.props.handleLogin}
        onChange={(nextFormValue: {}) => this.setState(nextFormValue)}
      >
        <FormField label="username" required name="username">
          <TextInput
            name="username"
            size="large"
            value={this.state.username}
            onChange={(e: any) => {
              this.setState({ username: e.target.value });
            }}
          />
        </FormField>
        <FormField label="password" required name="password">
          <TextInput
            name="password"
            size="large"
            type="password"
            value={this.state.password}
            onChange={(e: any) => {
              this.setState({ password: e.target.value });
            }}
          />
        </FormField>
        <Box direction="row" gap="small" justify="between">
          <Button label="continue" type="submit" primary />
          <Button label="reset" type="reset" />
        </Box>
      </Form>
    );
  }
}
