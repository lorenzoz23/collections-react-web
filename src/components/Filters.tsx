import React, { Component } from 'react';
import {
  Layer,
  Box,
  Heading,
  Menu,
  Button,
  Text,
  TextInput,
  CheckBox,
  ResponsiveContext
} from 'grommet';
import {
  Sort,
  Filter,
  FormTrash,
  FormRefresh,
  Edit,
  Rewind,
  PowerReset,
  Previous,
  FormClose
} from 'grommet-icons';
import firebase from 'firebase';
import 'firebase/database';
import FilterViewTags from './FilterViewTags';

interface FiltersProps {
  tags: string[];
  uid: string;
  sort: string;
  filter: string;
  width: number;
  handleSort(sortBy: string, checked: boolean): void;
  handleFilterByTag(tag: string): void;
  handleTagDelete(tags: number[]): void;
  handleUpdatedTags(tags: string[]): void;
  handleTagAdded(tag: string): void;
  handleResetFilters(): void;
}

const labels: Record<string, string> = {
  nameAsc: 'title (asc)',
  nameDesc: 'title (desc)',
  runtimeAsc: 'runtime (asc)',
  runtimeDesc: 'runtime (desc)',
  mpaaAsc: 'mpaa rating (g - nc17)',
  mpaaDesc: 'mpaa rating (nc17 - g)',
  starCountAsc: 'star count (0 - 10)',
  starCountDesc: 'star count (10 - 0)'
};

export default class Filters extends Component<FiltersProps> {
  state: {
    showFilters: boolean;
    editMode: boolean;
    selectedFilter: string;
    selectedTagsToUpdate: number[];
    updatedText: string;
    showUpdateBox: boolean;
    sort: string;
    sortLabel: string;
    checked: boolean;
  } = {
    showFilters: false,
    editMode: false,
    selectedFilter: this.props.filter,
    selectedTagsToUpdate: [],
    updatedText: '',
    showUpdateBox: false,
    sort: '',
    sortLabel: 'time added',
    checked: false
  };

  componentDidMount = () => {
    const sortBy = localStorage.getItem('sortBy') || '';
    if (sortBy) {
      this.setState({ sort: sortBy, checked: true, sortLabel: labels[sortBy] });
    } else {
      this.setState({ sort: sortBy });
    }
  };

  handleUpdateTag = () => {
    const empty: number[] = [];
    this.setState({
      showFilters: false,
      showUpdateBox: false,
      editMode: false,
      selectedTagsToUpdate: empty,
      updatedText: ''
    });
    if (this.state.selectedTagsToUpdate.length === 1) {
      let newTags: string[] = [];
      for (let i = 0; i < this.props.tags.length; i++) {
        if (
          this.props.tags[i] !==
          this.props.tags[this.state.selectedTagsToUpdate[0]]
        ) {
          newTags.push(this.props.tags[i]);
        } else {
          newTags.push(this.state.updatedText);
        }
      }
      const userRef = firebase.database().ref('users/' + this.props.uid);
      const tagsRef = userRef.child('tags');
      tagsRef.once('value', (snapshot) => {
        snapshot.forEach((childSnapshot) => {
          const childKey = childSnapshot.key!;
          const title = childSnapshot.val().title;

          if (title === this.props.tags[this.state.selectedTagsToUpdate[0]]) {
            tagsRef.child(childKey).update({ title: this.state.updatedText });
            return true;
          }
        });
      });
      this.props.handleUpdatedTags(newTags);
    }
  };

  handleDeleteTags = () => {
    const empty: number[] = [];
    this.setState({
      showFilters: false,
      showUpdateBox: false,
      editMode: false,
      selectedTagsToUpdate: empty,
      updatedText: ''
    });
    this.props.handleTagDelete(this.state.selectedTagsToUpdate);
  };

  handleSelectedTagToFilter = (tag: string, created: boolean, size: string) => {
    if (created) {
      const userRef = firebase.database().ref('users/' + this.props.uid);
      const tagsRef = userRef.child('tags');
      const newTagRef = tagsRef.push();
      newTagRef.set({ title: tag });
      this.props.handleTagAdded(tag);
    } else {
      this.setState({
        selectedFilter: tag,
        showFilters: size === 'small' && this.props.width < 750 ? false : true
      });
      this.props.handleFilterByTag(tag);
    }
  };

  handleSort = (sortBy: string) => {
    if (this.state.checked) {
      localStorage.setItem('sortBy', sortBy);
    }
    this.setState({ sort: sortBy, sortLabel: labels[sortBy] });
    this.props.handleSort(sortBy, this.state.checked);
  };

  handleResetFilters = () => {
    localStorage.removeItem('sortBy');
    this.setState({
      selectedFilter: '',
      sort: '',
      showFilters: false,
      checked: false,
      showUpdateBox: false,
      editMode: false
    });
    this.props.handleResetFilters();
  };

  handleOrderChange = (checked: boolean) => {
    if (!checked) {
      localStorage.removeItem('sortBy');
      this.setState({
        checked: checked,
        sort: '',
        sortLabel: 'time added'
      });
      this.props.handleSort('', this.state.checked);
    } else {
      if (this.state.sort !== '') {
        localStorage.setItem('sortBy', this.state.sort);
      }
      this.setState({
        checked: checked
      });
    }
  };

  render() {
    return (
      <ResponsiveContext.Consumer>
        {(size) => (
          <Box align="center">
            <Box
              direction="row"
              align="center"
              gap="xsmall"
              width={size !== 'small' ? 'medium' : 'small'}
            >
              <Button
                icon={
                  <Filter
                    color={
                      this.state.selectedFilter.length > 0 ||
                      this.state.sort.length > 0
                        ? 'status-ok'
                        : undefined
                    }
                  />
                }
                hoverIndicator="accent-1"
                focusIndicator={false}
                title="filters"
                onClick={() => this.setState({ showFilters: true })}
              />
              {this.state.selectedFilter.length > 0 && this.props.width > 750 && (
                <Text
                  color="status-ok"
                  weight="bold"
                  textAlign="center"
                  wordBreak="keep-all"
                >
                  active filter
                </Text>
              )}
              {this.state.sort.length > 0 &&
                !this.state.checked &&
                this.props.width > 750 && (
                  <Text
                    color="status-ok"
                    weight="bold"
                    textAlign="center"
                    wordBreak="keep-all"
                  >
                    active sort
                  </Text>
                )}
            </Box>
            {this.state.showFilters && (
              <Layer
                position="right"
                responsive={
                  this.props.width < 750 && size === 'small' ? true : false
                }
                style={{ height: '100%', borderRadius: 15 }}
                margin="small"
                onClickOutside={() =>
                  this.setState({
                    showFilters: false,
                    editMode: false,
                    showUpdateBox: false
                  })
                }
              >
                <Box
                  fill={size === 'small' ? true : false}
                  flex
                  pad="medium"
                  align="center"
                  background="filters"
                  round="small"
                  width="medium"
                  justify="between"
                >
                  <Box>
                    <Heading textAlign="center">filters</Heading>
                    <Box gap="medium">
                      <Box
                        pad={size === 'small' ? 'medium' : 'small'}
                        round
                        fill="horizontal"
                        border={{
                          side: 'all',
                          color: 'accent-3',
                          size: 'medium',
                          style: 'outset'
                        }}
                      >
                        <Box border="between" gap="small" align="center">
                          <Text textAlign="center" weight="bold">
                            sort by
                          </Text>
                          <Menu
                            margin="xsmall"
                            style={{ borderRadius: 10 }}
                            alignSelf="center"
                            hoverIndicator="accent-1"
                            title="sort films by..."
                            focusIndicator={false}
                            dropAlign={{ top: 'bottom', right: 'left' }}
                            icon={<Sort />}
                            items={[
                              {
                                label: 'title (asc)',
                                onClick: () => this.handleSort('nameAsc'),
                                hoverIndicator: 'accent-1'
                              },
                              {
                                label: 'title (desc)',
                                onClick: () => this.handleSort('nameDesc'),
                                hoverIndicator: 'accent-1'
                              },
                              {
                                label: 'runtime (asc)',
                                onClick: () => this.handleSort('runtimeAsc'),
                                hoverIndicator: 'accent-1'
                              },
                              {
                                label: 'runtime (desc)',
                                onClick: () => this.handleSort('runtimeDesc'),
                                hoverIndicator: 'accent-1'
                              },
                              {
                                label: 'mpaa rating (g - nc17)',
                                onClick: () => this.handleSort('mpaaAsc'),
                                hoverIndicator: 'accent-1'
                              },
                              {
                                label: 'mpaa rating (nc17 - g)',
                                onClick: () => this.handleSort('mpaaDesc'),
                                hoverIndicator: 'accent-1'
                              },
                              {
                                label: 'star count (0 - 10)',
                                onClick: () => this.handleSort('starCountAsc'),
                                hoverIndicator: 'accent-1'
                              },
                              {
                                label: 'star count (10 - 0)',
                                onClick: () => this.handleSort('starCountDesc'),
                                hoverIndicator: 'accent-1'
                              }
                            ]}
                          />
                          <Box align="center" gap="small" pad="small">
                            <CheckBox
                              toggle
                              checked={this.state.checked}
                              label="save sorted order"
                              reverse
                              onChange={(event) =>
                                this.handleOrderChange(event.target.checked)
                              }
                            />
                            <Box direction="row" gap="xsmall" align="center">
                              <Text size="small" weight="bold">
                                default:
                              </Text>
                              <Text size="small">
                                {this.state.checked
                                  ? this.state.sortLabel
                                  : 'time added'}
                              </Text>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                      <Box
                        pad={size !== 'small' ? 'small' : 'medium'}
                        overflow="auto"
                        gap="small"
                        justify="between"
                        align="center"
                        round
                        flex
                        fill="horizontal"
                        border={{
                          side: 'all',
                          color: 'accent-3',
                          size: 'medium',
                          style: 'inset'
                        }}
                      >
                        <Text textAlign="center" weight="bold">
                          tags
                        </Text>
                        {this.state.showUpdateBox ? (
                          <TextInput
                            placeholder={`update '${
                              this.props.tags[
                                this.state.selectedTagsToUpdate[0]
                              ]
                            }' here`}
                            value={this.state.updatedText}
                            onChange={(event) =>
                              this.setState({
                                updatedText: event.target.value
                              })
                            }
                          />
                        ) : (
                          <FilterViewTags
                            tags={this.props.tags}
                            handleSelectedFilter={(selected, created) =>
                              this.handleSelectedTagToFilter(
                                selected,
                                created,
                                size
                              )
                            }
                            handleSelectedTagsToUpdate={(tags) =>
                              this.setState({ selectedTagsToUpdate: tags })
                            }
                            selectedFilter={
                              !this.state.editMode && this.props.filter.length
                                ? this.props.filter
                                : undefined
                            }
                            selectedFilters={
                              this.state.editMode &&
                              this.state.selectedTagsToUpdate.length
                                ? this.state.selectedTagsToUpdate
                                : undefined
                            }
                            createTagSearch={
                              !this.state.editMode ? true : false
                            }
                          />
                        )}
                        <Box>
                          {!this.state.editMode ? (
                            <Button
                              icon={<Edit />}
                              title="edit tags"
                              style={{ borderRadius: 30 }}
                              primary
                              hoverIndicator="accent-1"
                              onClick={() =>
                                this.setState({
                                  editMode: true
                                })
                              }
                            />
                          ) : (
                            <Box gap="small" align="center">
                              {this.state.showUpdateBox ? (
                                <Button
                                  disabled={
                                    this.state.updatedText.length < 1
                                      ? true
                                      : false
                                  }
                                  primary
                                  label="done"
                                  onClick={this.handleUpdateTag}
                                  title="finish tag update"
                                />
                              ) : (
                                <Box direction="row" gap="small">
                                  <Button
                                    disabled={
                                      this.state.selectedTagsToUpdate.length > 0
                                        ? false
                                        : true
                                    }
                                    style={{ borderRadius: 30 }}
                                    primary
                                    title="delete selected tag(s)"
                                    color="neutral-4"
                                    onClick={this.handleDeleteTags}
                                    icon={<FormTrash />}
                                  />
                                  <Button
                                    disabled={
                                      this.state.selectedTagsToUpdate.length ===
                                      1
                                        ? false
                                        : true
                                    }
                                    style={{ borderRadius: 30 }}
                                    title="update selected tag"
                                    onClick={() =>
                                      this.setState({ showUpdateBox: true })
                                    }
                                    icon={<FormRefresh />}
                                    primary
                                    color="accent-4"
                                  />
                                </Box>
                              )}
                              {this.state.showUpdateBox ? (
                                <Button
                                  icon={<FormClose />}
                                  title="cancel update"
                                  onClick={() =>
                                    this.setState({ showUpdateBox: false })
                                  }
                                />
                              ) : (
                                <Button
                                  icon={<Rewind />}
                                  title="back"
                                  style={{ borderRadius: 30 }}
                                  primary
                                  hoverIndicator="accent-1"
                                  onClick={() => {
                                    this.setState({
                                      editMode: false,
                                      selectedFilter: ''
                                    });
                                  }}
                                />
                              )}
                            </Box>
                          )}
                        </Box>
                      </Box>
                      <Button
                        alignSelf="center"
                        onClick={this.handleResetFilters}
                        label="reset filters"
                        hoverIndicator="accent-1"
                        icon={<PowerReset />}
                        reverse
                      />
                    </Box>
                  </Box>
                  {size === 'small' && (
                    <Button
                      alignSelf="center"
                      title="back"
                      icon={<Previous />}
                      onClick={() =>
                        this.setState({
                          showFilters: false,
                          editMode: false,
                          showUpdateBox: false
                        })
                      }
                    />
                  )}
                </Box>
              </Layer>
            )}
          </Box>
        )}
      </ResponsiveContext.Consumer>
    );
  }
}
