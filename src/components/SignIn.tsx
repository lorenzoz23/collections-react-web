import React, { Component } from 'react';
import {
  Form,
  FormField,
  TextInput,
  Box,
  Button,
  ResponsiveContext
} from 'grommet';
import { Next, Previous } from 'grommet-icons';

interface SignInProps {
  handleLogin(email: string, password: string): void;
  goBack(): void;
  email: string;
  password: string;
}
export default class SignIn extends Component<SignInProps> {
  state = {
    email: this.props.email,
    password: this.props.password
  };

  render() {
    return (
      <ResponsiveContext.Consumer>
        {(size) => (
          <Box>
            <Form
              value={this.state}
              onSubmit={() =>
                this.props.handleLogin(this.state.email, this.state.password)
              }
              onChange={(nextFormValue: {}) => this.setState(nextFormValue)}
            >
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
                  size={size === 'small' ? 'medium' : 'xlarge'}
                  type="password"
                  value={this.state.password}
                  onChange={(e: any) => {
                    this.setState({ password: e.target.value });
                  }}
                />
              </FormField>
              <Box direction="row" justify="between" pad="small" align="center">
                <Button
                  onClick={() => this.props.goBack()}
                  icon={<Previous />}
                  title="back"
                  style={{ borderRadius: 30 }}
                  hoverIndicator="accent-1"
                  size={size === 'small' ? 'small' : 'medium'}
                />
                <Button
                  icon={<Next />}
                  type="submit"
                  style={{ borderRadius: 30 }}
                  title="continue"
                  hoverIndicator="accent-1"
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
