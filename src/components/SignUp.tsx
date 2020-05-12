import React, { Component } from "react";
import {
  Form,
  FormField,
  TextInput,
  Box,
  Button,
  ResponsiveContext
} from "grommet";

interface SignUpProps {
  handleSignUp(username: string, password: string): void;
}
export default class SignUp extends Component<SignUpProps> {
  state = {
    name: "",
    username: "",
    password: ""
  };

  defaultState = {
    name: "",
    username: "",
    password: ""
  };

  render() {
    return (
      <ResponsiveContext.Consumer>
        {(size) => (
          <Box pad="medium">
            <Form
              onReset={() => this.setState(this.defaultState)}
              onSubmit={() =>
                this.props.handleSignUp(
                  this.state.username,
                  this.state.password
                )
              }
              onChange={(nextFormValue: {}) => this.setState(nextFormValue)}
            >
              <FormField label="name" name="name">
                <TextInput
                  name="name"
                  size={size === "small" ? "small" : "large"}
                  value={this.state.name}
                  onChange={(e: any) => {
                    this.setState({ name: e.target.value });
                  }}
                />
              </FormField>
              <FormField label="username" required name="username">
                <TextInput
                  name="username"
                  size={size === "small" ? "small" : "large"}
                  value={this.state.username}
                  onChange={(e: any) => {
                    this.setState({ username: e.target.value });
                  }}
                />
              </FormField>
              <FormField label="password" required name="password">
                <TextInput
                  name="password"
                  type="password"
                  size={size === "small" ? "small" : "large"}
                  value={this.state.password}
                  onChange={(e: any) => {
                    this.setState({ password: e.target.value });
                  }}
                />
              </FormField>
              <Box pad="medium" justify="center" gap="small" align="center">
                <Button
                  label="submit"
                  type="submit"
                  primary
                  size={size === "small" ? "small" : "medium"}
                />
                <Button
                  label="reset"
                  type="reset"
                  size={size === "small" ? "small" : "medium"}
                />
              </Box>
            </Form>
          </Box>
        )}
      </ResponsiveContext.Consumer>
    );
  }
}
