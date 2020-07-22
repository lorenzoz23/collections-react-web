import React, { Component } from 'react';
import {
  Layer,
  Box,
  Heading,
  Menu,
  Button,
  Text,
  TextInput,
  CheckBox
} from 'grommet';
import {
  Sort,
  Filter,
  FormTrash,
  FormRefresh,
  Edit,
  Rewind,
  PowerReset
} from 'grommet-icons';
import firebase from 'firebase';
import 'firebase/database';
import FilterViewTags from './FilterViewTags';

interface FiltersProps {
  tags: string[];
  uid: string;
  sort: string;
  handleSort(sortBy: string): void;
  handleFilterByTag(tag: string): void;
  handleTagDelete(tags: number[]): void;
  handleUpdatedTags(tags: string[]): void;
  handleTagAdded(tag: string): void;
  handleResetFilters(): void;
}

export default class Filters extends Component<FiltersProps> {
  state: {
    showFilters: boolean;
    editMode: boolean;
    selectedFilter: string;
    selectedTagsToUpdate: number[];
    updatedText: string;
    showUpdateBox: boolean;
    sort: string;
    checked: boolean;
  } = {
    showFilters: false,
    editMode: false,
    selectedFilter: '',
    selectedTagsToUpdate: [],
    updatedText: '',
    showUpdateBox: false,
    sort: '',
    checked: false
  };

  componentDidMount = () => {
    const sortBy = localStorage.getItem('sortBy') || '';
    this.setState({ sort: sortBy });
  };

  handleUpdateTag = () => {
    this.setState({ showFilters: false });
    if (this.state.selectedTagsToUpdate.length === 1) {
      let newTags: string[] = [];
      for (let i = 0; i < this.props.tags.length; i++) {
        if (this.props.tags[i] !== this.state.updatedText) {
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
    this.setState({
      showFilters: false
    });
    this.props.handleTagDelete(this.state.selectedTagsToUpdate);
  };

  handleSelectedTagToFilter = (tag: string, created: boolean) => {
    this.setState({
      selectedFilter: tag
    });
    if (created) {
      const userRef = firebase.database().ref('users/' + this.props.uid);
      const tagsRef = userRef.child('tags');
      const newTagRef = tagsRef.push();
      newTagRef.set({ title: tag });
      this.props.handleTagAdded(tag);
    }
    this.props.handleFilterByTag(tag);
  };

  handleSort = (sortBy: string) => {
    if (this.state.checked) {
      const userRef = firebase.database().ref('users/' + this.props.uid);
      const sortRef = userRef.child('sortMoviesBy');
      localStorage.setItem('sortBy', sortBy);
      sortRef.once('value', (snapshot) => {
        snapshot.forEach((childSnapshot) => {
          const childKey = childSnapshot.key!;

          sortRef.child(childKey).update({ sortBy: sortBy });
        });
      });
    }
    this.setState({ sort: sortBy });
    this.props.handleSort(sortBy);
  };

  handleResetFilters = () => {
    this.setState({
      selectedFilter: '',
      sort: '',
      showFilters: false
    });
    this.props.handleResetFilters();
  };

  handleOrderChange = (checked: boolean) => {
    if (!checked) {
      localStorage.removeItem('sortBy');
      const userRef = firebase.database().ref('users/' + this.props.uid);
      const sortRef = userRef.child('sortMoviesBy');
      sortRef.once('value', (snapshot) => {
        snapshot.forEach((childSnapshot) => {
          const childKey = childSnapshot.key!;

          sortRef.child(childKey).update({ sortBy: '' });
        });
      });
    }
    this.setState({
      checked: checked
    });
  };

  render() {
    return (
      <Box align="center">
        <Box direction="row" align="center" gap="xsmall" width="medium">
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
          {this.state.selectedFilter.length > 0 && (
            <Text
              color="status-ok"
              weight="bold"
              textAlign="center"
              wordBreak="keep-all"
            >
              active filter
            </Text>
          )}
          {this.state.sort.length > 0 && !this.state.checked && (
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
            responsive={false}
            style={{ height: '100%', borderRadius: 15 }}
            margin="small"
            onClickOutside={() => this.setState({ showFilters: false })}
          >
            <Box
              flex
              pad="small"
              align="center"
              background="filters"
              round="small"
              width="medium"
            >
              <Heading textAlign="center">filters</Heading>
              <Box gap="medium">
                <Box
                  pad="small"
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
                        }
                      ]}
                    />
                    <CheckBox
                      toggle
                      checked={this.state.checked}
                      label="save sorted order"
                      reverse
                      onChange={(event) =>
                        this.handleOrderChange(event.target.checked)
                      }
                    />
                  </Box>
                </Box>
                <Box
                  pad="small"
                  gap="small"
                  justify="between"
                  align="center"
                  round
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
                  <FilterViewTags
                    tags={this.props.tags}
                    handleSelectedFilter={(selected, created) =>
                      this.handleSelectedTagToFilter(selected, created)
                    }
                    handleSelectedTagsToUpdate={(tags) =>
                      this.setState({ selectedTagsToUpdate: tags })
                    }
                    selectedFilter={this.state.selectedFilter}
                    createTagSearch={!this.state.editMode ? true : false}
                  />
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
                        {this.state.showUpdateBox && (
                          <TextInput
                            placeholder={`update '${
                              this.props.tags[
                                this.state.selectedTagsToUpdate[0]
                              ]
                            }' here`}
                            value={this.state.updatedText}
                            onChange={(event) =>
                              this.setState({ updatedText: event.target.value })
                            }
                          />
                        )}
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
                              this.state.selectedTagsToUpdate.length === 1
                                ? false
                                : true
                            }
                            style={{ borderRadius: 30 }}
                            title="update selected tag"
                            onClick={() =>
                              this.state.showUpdateBox
                                ? this.handleUpdateTag()
                                : this.setState({ showUpdateBox: true })
                            }
                            icon={<FormRefresh />}
                            primary
                            color="accent-4"
                          />
                        </Box>
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
          </Layer>
        )}
      </Box>
    );
  }
}
