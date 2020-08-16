import React, { Component } from 'react';
import {
  Layer,
  Box,
  Heading,
  Button,
  TextInput,
  ResponsiveContext,
  Anchor,
  Text
} from 'grommet';
import { Trash, Update, Previous, FormClose, Tag, Like } from 'grommet-icons';
import firebase from 'firebase';
import 'firebase/database';
import FilterViewTags from './FilterViewTags';

interface FiltersProps {
  tags: string[];
  uid: string;
  width: number;
  wishlist: boolean;
  handleTagDelete(tags: number[]): void;
  handleUpdatedTags(tags: string[]): void;
  handleTagAdded(tag: string): void;
  handleResetFilters(): void;
}

export default class EditFilters extends Component<FiltersProps> {
  state: {
    showFilters: boolean;
    editMode: boolean;
    selectedTagsToUpdate: number[];
    updatedText: string;
    createText: string;
    showUpdateBox: boolean;
  } = {
    showFilters: false,
    editMode: false,
    selectedTagsToUpdate: [],
    updatedText: '',
    createText: '',
    showUpdateBox: false
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

  handleCreatedTag = (tag: string) => {
    const userRef = firebase.database().ref('users/' + this.props.uid);
    const tagsRef = userRef.child('tags');
    const newTagRef = tagsRef.push();
    newTagRef.set({ title: tag });

    this.setState({ createText: '' });
    this.props.handleTagAdded(tag);
  };

  render() {
    return (
      <ResponsiveContext.Consumer>
        {(size) => (
          <Box align="center">
            <Anchor
              label="Edit media tags"
              onClick={() => this.setState({ showFilters: true })}
            />
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
                  justify="between"
                >
                  <Box>
                    <Heading textAlign="center">Media Tag Editor</Heading>
                    <Box
                      pad="medium"
                      overflow="auto"
                      gap="large"
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
                      <Box align="center" gap="small">
                        <Text weight="bold" textAlign="center" size="large">
                          Create
                        </Text>
                        <TextInput
                          style={{ borderRadius: 10 }}
                          size="large"
                          value={this.state.createText}
                          placeholder="Create a new media tag"
                          icon={<Tag />}
                          onChange={(event) =>
                            this.setState({ createText: event.target.value })
                          }
                        />
                        <Button
                          label="Done"
                          primary
                          disabled={this.state.createText.length === 0}
                          icon={<Like />}
                          reverse
                          onClick={() =>
                            this.handleCreatedTag(this.state.createText)
                          }
                        />
                      </Box>
                      <Box align="center" gap="small">
                        <Text weight="bold" textAlign="center" size="large">
                          Delete/Update
                        </Text>
                        <FilterViewTags
                          tags={this.props.tags}
                          handleSelectedFilter={(selected) =>
                            this.handleCreatedTag(selected)
                          }
                          handleSelectedTagsToUpdate={(tags) =>
                            this.setState({ selectedTagsToUpdate: tags })
                          }
                          createTagSearch={false}
                        />
                        <Box direction="row" gap="small">
                          <Button
                            disabled={
                              this.state.selectedTagsToUpdate.length > 0
                                ? false
                                : true
                            }
                            style={{ borderRadius: 30 }}
                            primary
                            title="Delete selected tag(s)"
                            color="neutral-4"
                            onClick={this.handleDeleteTags}
                            icon={<Trash />}
                          />
                          <Button
                            disabled={
                              this.state.selectedTagsToUpdate.length === 1
                                ? false
                                : true
                            }
                            style={{ borderRadius: 30 }}
                            title="Update selected tag"
                            onClick={() =>
                              this.setState({ showUpdateBox: true })
                            }
                            icon={<Update />}
                            primary
                            color="accent-4"
                          />
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                  {size === 'small' && (
                    <Button
                      alignSelf="center"
                      title="Back"
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
                {this.state.showUpdateBox && (
                  <Layer
                    position={
                      size === 'large' || size === 'xlarge'
                        ? 'bottom-right'
                        : 'right'
                    }
                    onClickOutside={() =>
                      this.setState({ showUpdateBox: false })
                    }
                    style={{ borderRadius: 30 }}
                    margin="large"
                    responsive={false}
                  >
                    <Box
                      pad="medium"
                      align="center"
                      round
                      gap="medium"
                      background="home"
                      border={{
                        side: 'all',
                        size: 'small',
                        color: 'light-2'
                      }}
                    >
                      <Text weight="bold" textAlign="center">
                        Give a new name to your media tag
                      </Text>
                      <TextInput
                        autoFocus
                        placeholder={`Update '${
                          this.props.tags[this.state.selectedTagsToUpdate[0]]
                        }' here`}
                        value={this.state.updatedText}
                        onChange={(event) =>
                          this.setState({
                            updatedText: event.target.value
                          })
                        }
                      />
                      <Box align="center" gap="small">
                        <Button
                          disabled={
                            this.state.updatedText.length < 1 ? true : false
                          }
                          primary
                          label="Done"
                          onClick={this.handleUpdateTag}
                          title="Finish tag update"
                        />
                        <Button
                          icon={<FormClose />}
                          title="Cancel update"
                          onClick={() =>
                            this.setState({ showUpdateBox: false })
                          }
                        />
                      </Box>
                    </Box>
                  </Layer>
                )}
              </Layer>
            )}
          </Box>
        )}
      </ResponsiveContext.Consumer>
    );
  }
}
