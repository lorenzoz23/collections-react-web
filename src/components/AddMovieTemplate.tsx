import React, { RefObject, Component, createRef } from 'react';
import { Box, Drop, Text, ResponsiveContext, Button } from 'grommet';
import AddTitle from './AddTitle';
import { movie } from './HomePage';
import { Add } from 'grommet-icons';

const randomMovieBackDrops = [
  // new films
  'https://image.tmdb.org/t/p/original/n6bUvigpRFqSwmPp1m2YADdbRBc.jpg',
  'https://image.tmdb.org/t/p/original/ApiBzeaa95TNYliSbQ8pJv4Fje7.jpg',
  'https://image.tmdb.org/t/p/original/yB2hTgz9CTVYjlMWPSl3LPx5nWj.jpg',
  'https://image.tmdb.org/t/p/original/g6GtOfXtzDpY73ef7wludoorTti.jpg',
  'https://image.tmdb.org/t/p/original/qtgkNOIsFjbqdikd5npGO2Cqsqb.jpg',
  'https://image.tmdb.org/t/p/original/5qTZGBHJNq6riBliYtOnH4yUN6x.jpg',
  'https://image.tmdb.org/t/p/original/vVpEOvdxVBP2aV166j5Xlvb5Cdc.jpg',
  'https://image.tmdb.org/t/p/original/AbRYlvwAKHs0YuyNO6NX9ofq4l6.jpg',
  'https://image.tmdb.org/t/p/original/wcAqndL2MkIjPrCrYeuE794weNE.jpg',
  'https://image.tmdb.org/t/p/original/n0FzDpOvVhkj3uN7WHXXnAXOKFi.jpg',
  // classic films
  'https://image.tmdb.org/t/p/original/xFuRZtuTbTY3S1QLY8Y9XYH1JCk.jpg',
  'https://image.tmdb.org/t/p/original/a58oc5qGNazb3QOxEH8eG5S7gjr.jpg',
  'https://image.tmdb.org/t/p/original/8iVyhmjzUbvAGppkdCZPiyEHSoF.jpg',
  'https://image.tmdb.org/t/p/original/hkBaDkMWbLaf8B1lsWsKX7Ew3Xq.jpg',
  'https://image.tmdb.org/t/p/original/77ElMccPnTMPouRxSdbJ4nEjf69.jpg',
  'https://image.tmdb.org/t/p/original/uo2uaD6vNi62gyf13UMQ3cp7z4O.jpg',
  'https://image.tmdb.org/t/p/original/AdKA2F1SzYPhSZdEbjH1Zh75UVQ.jpg',
  'https://image.tmdb.org/t/p/original/kCiMExsYuNhYluHxPP2OTmWw7hp.jpg',
  'https://image.tmdb.org/t/p/original/azIbQpeKKNF9r85lBSRrNnMK0Si.jpg',
  'https://image.tmdb.org/t/p/original/qqHQsStV6exghCM7zbObuYBiYxw.jpg'
];

interface AddMovieTemplateProps {
  rand: number;
  moviesAdded(lotMovies: movie[], wishlistMovies: movie[]): void;
}

export default class AddMovieTemplate extends Component<AddMovieTemplateProps> {
  state: {
    ref: RefObject<HTMLDivElement>;
    rand?: number;
    visible: boolean;
  } = {
    ref: createRef(),
    rand: undefined,
    visible: false
  };

  getRandom = () => {
    let r = this.props.rand;
    while (r === this.props.rand) {
      r = Math.floor(Math.random() * 20);
    }
    return r;
  };

  render() {
    return (
      <ResponsiveContext.Consumer>
        {(size) => (
          <Box
            ref={this.state.ref}
            background={{
              image: `url(${
                randomMovieBackDrops[
                  this.state.rand ? this.state.rand : this.props.rand
                ]
              })`,
              color: 'header',
              size: 'cover',
              position: 'center'
            }}
            border={{
              size: 'medium',
              color: 'accent-1',
              side: 'all'
            }}
            round={{ corner: 'bottom', size: 'xlarge' }}
          >
            <Drop
              align={{ bottom: 'bottom' }}
              target={this.state.ref.current!}
              plain
              overflow="hidden"
              style={{ zIndex: 1 }}
            >
              <Box
                margin="xsmall"
                animation={{ type: 'slideDown', duration: 1000 }}
                pad="small"
                background={{ color: 'brand', opacity: 'strong' }}
                elevation="medium"
                round={{ size: 'large' }}
                gap="xsmall"
                onClick={() => {
                  this.setState({ rand: this.getRandom() });
                }}
              >
                <Text textAlign="center" weight="bold" size="xlarge">
                  Add a film!
                </Text>
                <Button
                  style={{ borderRadius: 50 }}
                  focusIndicator={false}
                  hoverIndicator="accent-1"
                  onClick={() => {
                    this.setState({ visible: true, rand: this.getRandom() });
                  }}
                  icon={<Add size="large" />}
                  alignSelf="center"
                />
              </Box>
            </Drop>
            {this.state.visible && (
              <AddTitle
                handleClose={() => this.setState({ visible: false })}
                moviesAdded={(lotMovies, wishlistMovies) =>
                  this.props.moviesAdded(lotMovies, wishlistMovies)
                }
              />
            )}
          </Box>
        )}
      </ResponsiveContext.Consumer>
    );
  }
}
