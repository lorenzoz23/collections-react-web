import React, { Component } from 'react';
import { Form, FormField, TextInput, Box, Button } from 'grommet';

interface SignUpProps {
  handleSignUp(username: string, password: string): void;
}
export default class SignUp extends Component<SignUpProps> {
  state = {
    name: '',
    username: '',
    password: '',
    secondPassword: ''
  };

  defaultState = {
    name: '',
    username: '',
    password: '',
    secondPassword: ''
  };

  render() {
    return (
      <Box pad="medium">
        <Form
          onReset={() => this.setState(this.defaultState)}
          onSubmit={() =>
            this.props.handleSignUp(this.state.username, this.state.password)
          }
          onChange={(nextFormValue: {}) => this.setState(nextFormValue)}
        >
          <FormField label="name" name="name">
            <TextInput
              name="name"
              size="large"
              value={this.state.name}
              onChange={(e: any) => {
                this.setState({ name: e.target.value });
              }}
            />
          </FormField>
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
          <Box direction="row" gap="medium">
            <FormField label="password" required name="password">
              <TextInput
                name="password"
                type="password"
                size="large"
                value={this.state.password}
                onChange={(e: any) => {
                  this.setState({ password: e.target.value });
                }}
              />
            </FormField>
            <FormField label="confirm password" required name="secondPassword">
              <TextInput
                name="secondPassword"
                type="password"
                size="large"
                value={this.state.secondPassword}
                onChange={(e: any) => {
                  this.setState({ secondPassword: e.target.value });
                }}
              />
            </FormField>
          </Box>
          <Box direction="row" pad="small" justify="evenly" gap="small">
            <Button label="submit" type="submit" primary />
            <Button label="reset" type="reset" />
          </Box>
        </Form>
      </Box>
    );
  }
}
