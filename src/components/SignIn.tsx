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

  render() {
    return (
      <Box pad="medium">
        <Form
          value={this.state}
          onSubmit={this.props.handleLogin}
          onChange={(nextFormValue: {}) => this.setState(nextFormValue)}
        >
          <FormField label="username" required name="username">
            <TextInput
              name="username"
              size="xlarge"
              value={this.state.username}
              onChange={(e: any) => {
                this.setState({ username: e.target.value });
              }}
            />
          </FormField>
          <FormField label="password" required name="password">
            <TextInput
              name="password"
              size="xlarge"
              type="password"
              value={this.state.password}
              onChange={(e: any) => {
                this.setState({ password: e.target.value });
              }}
            />
          </FormField>
          <Box direction="row" justify="center" pad="small">
            <Button label="log in" type="submit" primary />
          </Box>
        </Form>
      </Box>
    );
  }
}
