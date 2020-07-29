import React, { Component } from 'react';
import {
  Button,
  Box,
  Form,
  FormField,
  TextInput,
  TextArea,
  ResponsiveContext,
  Layer,
  Heading
} from 'grommet';
import { FormClose, Mail, Refresh, Bug } from 'grommet-icons';
import firebase from 'firebase';
import 'firebase/database';
import Notification from './Notification';

type formValues = {
  title: string;
  desc: string;
  stepsToFind: string;
};
const defaultFormValues: formValues = {
  title: '',
  desc: '',
  stepsToFind: ''
};

interface ReportBugProps {
  uid: string;
  width: number;
}

export default class ReportBug extends Component<ReportBugProps> {
  state: {
    formValue: formValues;
    showLayer: boolean;
    showNotification: boolean;
  } = {
    formValue: defaultFormValues,
    showLayer: false,
    showNotification: false
  };

  formChange = (value: any) => {
    this.setState({
      formValue: value
    });
  };

  saveBugReport = () => {
    const userRef = firebase.database().ref('users/' + this.props.uid);
    const bugReportRef = userRef.child('bugReports');
    const newBugReportRef = bugReportRef.push();
    newBugReportRef.set({
      title: this.state.formValue.title || 'insert clever bug title here',
      desc: this.state.formValue.desc,
      stepsToFind: this.state.formValue.stepsToFind,
      bugKey: newBugReportRef.key
    });
  };

  submitEmailForm = () => {
    this.saveBugReport();
    this.setState(
      {
        formValue: defaultFormValues,
        showNotification: true,
        showLayer: false
      },
      () => {
        setTimeout(() => this.setState({ showNotification: false }), 4000);
      }
    );
  };

  render() {
    return (
      <ResponsiveContext.Consumer>
        {(size) => (
          <Box direction="row">
            <Button
              size={size === 'small' ? 'small' : undefined}
              hoverIndicator={{ color: 'accent-1', opacity: 'strong' }}
              style={{ borderRadius: 30 }}
              title="report a bug"
              icon={<Bug size={this.props.width < 400 ? 'small' : undefined} />}
              onClick={() => this.setState({ showLayer: true })}
            />
            {this.state.showLayer && (
              <Layer
                position="center"
                onClickOutside={() =>
                  this.setState({
                    showLayer: false
                  })
                }
                responsive
              >
                <Box
                  margin="xsmall"
                  pad="large"
                  flex
                  background="home"
                  align="center"
                  justify="center"
                  overflow="auto"
                >
                  <Heading margin="small" textAlign="center">
                    report a bug
                  </Heading>
                  <Bug size="large" />
                  <Form
                    value={this.state.formValue}
                    onChange={(nextValue: React.SetStateAction<{}>) =>
                      this.formChange(nextValue)
                    }
                    onReset={() =>
                      this.setState({ formValue: defaultFormValues })
                    }
                    onSubmit={this.submitEmailForm}
                  >
                    <FormField
                      name="title"
                      htmlFor="title-input-id"
                      margin="small"
                    >
                      <TextInput
                        id="title-input-id"
                        title="c'mon, get clever"
                        name="title"
                        size="large"
                        placeholder="title (optional)"
                      />
                    </FormField>
                    <FormField
                      margin="small"
                      name="desc"
                      required
                      htmlFor="description-input-id"
                    >
                      <TextArea
                        name="desc"
                        size="large"
                        focusIndicator
                        id="description-input-id"
                        placeholder="description of bug"
                      />
                    </FormField>
                    <FormField
                      margin="small"
                      name="stepsToFind"
                      htmlFor="message-input-id"
                      required
                    >
                      <TextArea
                        name="stepsToFind"
                        size="large"
                        focusIndicator
                        id="message-input-id"
                        placeholder="how can we reproduce this bug?"
                      />
                    </FormField>
                    <Box
                      direction="row"
                      justify="between"
                      margin="medium"
                      gap="small"
                    >
                      <Button
                        primary
                        title="send"
                        type="submit"
                        color="status-ok"
                        size="small"
                        icon={<Mail />}
                        reverse
                      />
                      <Button
                        primary
                        title="reset fields"
                        type="reset"
                        color="status-warning"
                        size="small"
                        icon={<Refresh />}
                        reverse
                      />
                      <Button
                        primary
                        title="cancel"
                        color="status-critical"
                        size="small"
                        icon={<FormClose />}
                        reverse
                        onClick={() => this.setState({ showLayer: false })}
                      />
                    </Box>
                  </Form>
                </Box>
              </Layer>
            )}
            {this.state.showNotification && (
              <Notification
                notificationText="bug report sent - thank you!"
                onNotificationClose={() =>
                  this.setState({ showNotification: false })
                }
                good={true}
              />
            )}
          </Box>
        )}
      </ResponsiveContext.Consumer>
    );
  }
}
