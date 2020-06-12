import React, { Component } from 'react';
import {
  Form,
  FormField,
  TextInput,
  Box,
  Button,
  ResponsiveContext
} from 'grommet';

interface SignUpProps {
  handleSignUp(email: string, password: string, name: string): void;
}
export default class SignUp extends Component<SignUpProps> {
  state = {
    name: '',
    email: '',
    password: ''
  };

  defaultState = {
    name: '',
    email: '',
    password: ''
  };

  render() {
    return (
      <ResponsiveContext.Consumer>
        {(size) => (
          <Box>
            <Form
              onReset={() => this.setState(this.defaultState)}
              onSubmit={() =>
                this.props.handleSignUp(
                  this.state.email,
                  this.state.password,
                  this.state.name
                )
              }
              onChange={(nextFormValue: {}) => this.setState(nextFormValue)}
            >
              <FormField label="name" name="name">
                <TextInput
                  name="name"
                  size={size === 'small' ? 'medium' : 'xlarge'}
                  value={this.state.name}
                  onChange={(e: any) => {
                    this.setState({ name: e.target.value });
                  }}
                />
              </FormField>
              <FormField label="email" required name="email">
                <TextInput
                  name="email"
                  size={size === 'small' ? 'medium' : 'xlarge'}
                  value={this.state.email}
                  onChange={(e: any) => {
                    this.setState({ email: e.target.value });
                  }}
                />
              </FormField>
              <FormField label="password" required name="password">
                <TextInput
                  name="password"
                  type="password"
                  size={size === 'small' ? 'medium' : 'xlarge'}
                  value={this.state.password}
                  onChange={(e: any) => {
                    this.setState({ password: e.target.value });
                  }}
                />
              </FormField>
              <Box pad="small" justify="between" align="center" direction="row">
                <Button
                  label="submit"
                  type="submit"
                  primary
                  size={size === 'small' ? 'small' : 'medium'}
                />
                <Button
                  label="reset"
                  type="reset"
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
