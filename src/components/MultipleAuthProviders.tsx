import React, { Component } from 'react';
import {
  ResponsiveContext,
  Layer,
  Box,
  Text,
  CheckBox,
  Button,
  TextInput
} from 'grommet';
import {
  MailOption,
  Facebook,
  Google,
  Next,
  Login,
  UserAdmin,
  UserNew,
  Checkmark,
  Close
} from 'grommet-icons';
import firebase from 'firebase/app';
import Notification from './Notification';

interface MultipleAuthProvidersProps {
  user: firebase.User;
  close(): void;
}

type NotificationObject = {
  good: boolean;
  text: string;
};

export default class MultipleAuthProviders extends Component<
  MultipleAuthProvidersProps
> {
  state: {
    emailPassword: string;
    emailChecked: boolean;
    googleChecked: boolean;
    fbChecked: boolean;
    providers: string[];
    showNotification: boolean;
    notification: NotificationObject;
    baseAccount: string;
    showEmailPasswordLayer: boolean;
  } = {
    emailPassword: '',
    emailChecked: false,
    googleChecked: false,
    fbChecked: false,
    providers: [],
    showNotification: false,
    notification: {
      good: true,
      text: ''
    },
    baseAccount: '',
    showEmailPasswordLayer: false
  };

  componentDidMount = () => {
    let base: string = localStorage.getItem('isNew') || 'password-old';
    console.log(base);
    if (base.includes('old')) {
      base = base.substring(0, base.length - 4);
    }
    const provs: string[] = [];
    this.props.user.providerData.forEach((profile) =>
      provs.push(profile!.providerId!)
    );
    console.log(provs);
    this.setState({
      providers: provs,
      emailChecked: provs.includes('password', 0),
      googleChecked: provs.includes('google.com', 0),
      fbChecked: provs.includes('facebook.com', 0),
      baseAccount: base
    });
  };

  email = (checked: boolean) => {
    if (this.props.user.email) {
      if (checked) {
        this.props.user
          .linkWithCredential(
            firebase.auth.EmailAuthProvider.credential(
              this.props.user.email,
              this.state.emailPassword
            )
          )
          .then(() => {
            const n: NotificationObject = {
              good: true,
              text:
                'Linking successful: You can now sign in with an Email/Password!'
            };
            this.setState(
              {
                showNotification: true,
                notification: n,
                emailChecked: checked
              },
              () => {
                setTimeout(
                  () =>
                    this.setState({
                      showNotification: false,
                      notification: { good: true, text: '' }
                    }),
                  4000
                );
              }
            );
          })
          .catch((error) => {
            console.log(error);
            const n: NotificationObject = {
              good: false,
              text: 'Linking unsuccessful: ' + error.code
            };
            this.setState(
              {
                showNotification: true,
                notification: n,
                emailChecked: !checked
              },
              () => {
                setTimeout(
                  () =>
                    this.setState({
                      showNotification: false,
                      notification: { good: true, text: '' }
                    }),
                  4000
                );
              }
            );
          });
      } else {
        this.props.user.providerData.forEach((profile) => {
          if (profile?.providerId === 'password') {
            this.props.user
              .unlink(profile.providerId)
              .then(() => {
                const n: NotificationObject = {
                  good: true,
                  text:
                    'Unlinking successful: You can no longer sign in with Email/Password'
                };
                this.setState(
                  {
                    showNotification: true,
                    notification: n,
                    emailChecked: checked
                  },
                  () => {
                    setTimeout(
                      () =>
                        this.setState({
                          showNotification: false,
                          notification: { good: true, text: '' }
                        }),
                      4000
                    );
                  }
                );
              })
              .catch((error) => {
                console.log(error);
                const n: NotificationObject = {
                  good: false,
                  text: 'Unlinking unsuccessful: ' + error.code
                };
                this.setState(
                  {
                    showNotification: true,
                    notification: n,
                    emailChecked: !checked
                  },
                  () => {
                    setTimeout(
                      () =>
                        this.setState({
                          showNotification: false,
                          notification: { good: true, text: '' }
                        }),
                      4000
                    );
                  }
                );
              });
          }
        });
      }
    }
  };

  google = (checked: boolean) => {
    const providerGoogle = new firebase.auth.GoogleAuthProvider();
    if (checked) {
      this.props.user
        .linkWithPopup(providerGoogle)
        .then(() => {
          const n: NotificationObject = {
            good: true,
            text: 'Linking successful: You can now sign in with Google!'
          };
          this.setState(
            { showNotification: true, notification: n, googleChecked: checked },
            () => {
              setTimeout(
                () =>
                  this.setState({
                    showNotification: false,
                    notification: { good: true, text: '' }
                  }),
                4000
              );
            }
          );
        })
        .catch((error) => {
          console.log(error);
          const n: NotificationObject = {
            good: false,
            text: 'Linking unsuccessful: ' + error.code
          };
          this.setState(
            {
              showNotification: true,
              notification: n,
              googleChecked: !checked
            },
            () => {
              setTimeout(
                () =>
                  this.setState({
                    showNotification: false,
                    notification: { good: true, text: '' }
                  }),
                4000
              );
            }
          );
        });
    } else {
      this.props.user
        .unlink(providerGoogle.providerId)
        .then(() => {
          const n: NotificationObject = {
            good: true,
            text: 'Unlinking successful: You can no longer sign in with Google'
          };
          this.setState(
            { showNotification: true, notification: n, googleChecked: checked },
            () => {
              setTimeout(
                () =>
                  this.setState({
                    showNotification: false,
                    notification: { good: true, text: '' }
                  }),
                4000
              );
            }
          );
        })
        .catch((error) => {
          console.log(error);
          const n: NotificationObject = {
            good: false,
            text: 'Unlink unsuccessful: ' + error.code
          };
          this.setState(
            {
              showNotification: true,
              notification: n,
              googleChecked: !checked
            },
            () => {
              setTimeout(
                () =>
                  this.setState({
                    showNotification: false,
                    notification: { good: true, text: '' }
                  }),
                4000
              );
            }
          );
        });
    }
  };

  facebook = (checked: boolean) => {
    const providerFb = new firebase.auth.FacebookAuthProvider();
    if (checked) {
      this.props.user
        .linkWithPopup(providerFb)
        .then(() => {
          const n: NotificationObject = {
            good: true,
            text: 'Linking successful: You can now sign in with Facebook!'
          };
          this.setState(
            { showNotification: true, notification: n, fbChecked: checked },
            () => {
              setTimeout(
                () =>
                  this.setState({
                    showNotification: false,
                    notification: { good: true, text: '' }
                  }),
                4000
              );
            }
          );
        })
        .catch((error) => {
          console.log(error);
          const n: NotificationObject = {
            good: false,
            text: 'Linking unsuccessful: ' + error.code
          };
          this.setState(
            { showNotification: true, notification: n, fbChecked: !checked },
            () => {
              setTimeout(
                () =>
                  this.setState({
                    showNotification: false,
                    notification: { good: true, text: '' }
                  }),
                4000
              );
            }
          );
        });
    } else {
      this.props.user
        .unlink(providerFb.providerId)
        .then(() => {
          const n: NotificationObject = {
            good: true,
            text:
              'Unlinking successful: You can no longer sign in with Facebook'
          };
          this.setState(
            { showNotification: true, notification: n, fbChecked: checked },
            () => {
              setTimeout(
                () =>
                  this.setState({
                    showNotification: false,
                    notification: { good: true, text: '' }
                  }),
                4000
              );
            }
          );
        })
        .catch((error) => {
          console.log(error);
          const n: NotificationObject = {
            good: false,
            text: 'Unlink unsuccessful: ' + error.code
          };
          this.setState(
            { showNotification: true, notification: n, fbChecked: !checked },
            () => {
              setTimeout(
                () =>
                  this.setState({
                    showNotification: false,
                    notification: { good: true, text: '' }
                  }),
                4000
              );
            }
          );
        });
    }
  };

  render() {
    const showAuthProviders = localStorage.getItem('isNew') || 'password-old';
    return (
      <ResponsiveContext.Consumer>
        {(size) => (
          <Box>
            <Layer
              position="bottom"
              style={
                size !== 'small'
                  ? {
                      borderRadius: 30
                    }
                  : {
                      width: '100%',
                      borderTopLeftRadius: 30,
                      borderTopRightRadius: 30
                    }
              }
              margin={size !== 'small' ? { bottom: 'medium' } : undefined}
              responsive={false}
              onClickOutside={
                showAuthProviders.includes('old') ? this.props.close : undefined
              }
            >
              <Box
                round={size === 'small' ? { corner: 'top' } : true}
                align="center"
                pad="large"
                gap="medium"
                background="#213444"
                border={{ side: 'top', size: 'small', color: 'light-2' }}
              >
                <Text weight="bold" textAlign="center" size="large">
                  Link your account with multiple authentification providers
                </Text>
                <Box direction="row" gap="xsmall" align="center">
                  {!showAuthProviders.includes('old') ? (
                    <UserNew size="large" color="accent-3" />
                  ) : (
                    <UserAdmin size="large" color="accent-3" />
                  )}
                  <Login size="large" color="accent-1" />
                </Box>
                {!showAuthProviders.includes('old') ? (
                  <Text textAlign="center">
                    If you would like the option to sign in to your account
                    multiple ways for better ease of access, enable the other
                    various sign-in methods that you would like to use
                  </Text>
                ) : (
                  <Text textAlign="center">
                    You can not change the sign-in method for your base account
                    (the method you chose to sign in with when you first made an
                    account), but you can link/unlink other authentification
                    providers to your base account so you aren't stuck with only
                    one means of signing into Cinelot
                  </Text>
                )}
                <Box align="center" gap="small">
                  <Box direction="row" gap="xsmall" align="center">
                    <Text textAlign="center" weight="bold">
                      Base account:
                    </Text>
                    <Box direction="row" gap="small">
                      <Text textAlign="center">
                        {this.state.baseAccount === 'password'
                          ? 'Email/Password'
                          : this.state.baseAccount === 'google.com'
                          ? 'Google'
                          : 'Facebook'}
                      </Text>
                      {this.state.baseAccount === 'password' ? (
                        <MailOption />
                      ) : this.state.baseAccount === 'google.com' ? (
                        <Google color="plain" />
                      ) : (
                        <Facebook color="#00E0FF" />
                      )}
                    </Box>
                  </Box>
                  <Text color="accent-1">{this.props.user.email}</Text>
                </Box>
                <Box pad="medium" gap="medium" align="center">
                  {this.state.baseAccount !== 'password' && (
                    <CheckBox
                      onChange={(event) => {
                        if (event.target.checked) {
                          this.setState({
                            showEmailPasswordLayer: true
                          });
                        } else {
                          this.email(false);
                        }
                      }}
                      label={
                        <Box gap="small" direction="row">
                          <Text>Email</Text>
                          <MailOption />
                        </Box>
                      }
                      checked={this.state.emailChecked}
                    />
                  )}
                  <Box direction="row" gap="small">
                    {this.state.baseAccount !== 'google.com' && (
                      <CheckBox
                        onChange={(event) => this.google(event.target.checked)}
                        label={
                          <Box gap="small" direction="row">
                            <Text>Google</Text>
                            <Google color="plain" />
                          </Box>
                        }
                        checked={this.state.googleChecked}
                      />
                    )}
                    {this.state.baseAccount !== 'facebook.com' && (
                      <CheckBox
                        onChange={(event) =>
                          this.facebook(event.target.checked)
                        }
                        label={
                          <Box gap="small" direction="row">
                            <Text>Facebook</Text>
                            <Facebook color="#00E0FF" />
                          </Box>
                        }
                        checked={this.state.fbChecked}
                      />
                    )}
                  </Box>
                </Box>
                {!showAuthProviders.includes('old') && (
                  <Button
                    style={{ borderRadius: 30 }}
                    primary
                    label="Continue to Cinelot"
                    icon={<Next />}
                    reverse
                    onClick={() => {
                      localStorage.setItem('isNew', showAuthProviders + '-old');
                      this.props.close();
                    }}
                  />
                )}
                {!showAuthProviders.includes('old') && (
                  <Text size="small" textAlign="center">
                    Note: You can always link/unlink providers at any time
                    within settings
                  </Text>
                )}
              </Box>
            </Layer>
            {this.state.showNotification && (
              <Notification
                good={this.state.notification.good}
                notificationText={this.state.notification.text}
                onNotificationClose={() =>
                  this.setState({
                    showNotification: false,
                    notification: { good: true, text: '' }
                  })
                }
              />
            )}
            {this.state.showEmailPasswordLayer && (
              <Layer
                position="bottom"
                onClickOutside={() =>
                  this.setState({
                    emailPassword: '',
                    emailChecked: false,
                    showEmailPasswordLayer: false
                  })
                }
                style={
                  size !== 'small'
                    ? {
                        borderRadius: 30
                      }
                    : {
                        width: '100%',
                        borderTopLeftRadius: 30,
                        borderTopRightRadius: 30
                      }
                }
                margin="small"
                responsive={false}
              >
                <Box
                  align="center"
                  gap="medium"
                  round={size === 'small' ? { corner: 'top' } : true}
                  pad="large"
                >
                  <Text textAlign="center" size="large" weight="bold">
                    Enter in a new password
                  </Text>
                  <Text textAlign="center" size="small">
                    This is the password you'll use whenever you decide to
                    sign-in to Cinelot with an email/password combination (the
                    email being {this.props.user.email}) instead of with Google
                    or Facebook
                  </Text>
                  <TextInput
                    placeholder="Type password here"
                    type="password"
                    value={this.state.emailPassword}
                    onChange={(event) =>
                      this.setState({ emailPassword: event.target.value })
                    }
                  />
                  <Box direction="row" gap="small">
                    <Button
                      disabled={this.state.emailPassword.length === 0}
                      style={{ borderRadius: 30 }}
                      icon={<Checkmark />}
                      primary
                      onClick={() => {
                        this.setState({ showEmailPasswordLayer: false });
                        this.email(true);
                      }}
                    />
                    <Button
                      style={{ borderRadius: 30 }}
                      icon={<Close />}
                      primary
                      color="status-error"
                      onClick={() =>
                        this.setState({
                          emailPassword: '',
                          emailChecked: false,
                          showEmailPasswordLayer: false
                        })
                      }
                    />
                  </Box>
                </Box>
              </Layer>
            )}
          </Box>
        )}
      </ResponsiveContext.Consumer>
    );
  }
}
