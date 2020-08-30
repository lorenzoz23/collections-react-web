import React, { Component } from 'react';
import { Box, Layer, Text, Button, ResponsiveContext } from 'grommet';
import { movie } from './HomePage';
import { Star, FormClose } from 'grommet-icons';

interface RateFilmProps {
  movie: movie;
  handleRate(updatedMovie: movie): void;
}

export default class RateFilm extends Component<RateFilmProps> {
  state: {
    showRate: boolean;
    stars: JSX.Element[];
    rateLabel: string;
    starCount: number;
  } = {
    showRate: false,
    stars: [],
    rateLabel:
      this.props.movie.starCount !== -1
        ? this.props.movie.starCount + '/10'
        : 'Rate',
    starCount:
      this.props.movie.starCount === -1 ? 0 : this.props.movie.starCount
  };

  componentDidMount = () => {
    this.getStars();
  };

  handleStarClick = (index: number) => {
    let stars = [];
    for (let i = 0; i < 10; i++) {
      stars.push(
        <Button
          icon={<Star color={i < index ? 'plain' : undefined} />}
          focusIndicator={false}
          key={i}
          onClick={() => this.handleStarClick(i + 1)}
          title={`${i + 1} ${i + 1 === 1 ? 'star' : 'stars'}`}
        />
      );
    }
    this.setState({
      stars: stars,
      starCount: index
    });
  };

  getStars = () => {
    let stars = [];
    const starCount =
      this.props.movie.starCount! > 0 ? this.props.movie.starCount : 0;
    for (let i = 0; i < 10; i++) {
      stars.push(
        <Button
          icon={<Star color={i < (starCount || 0) ? 'plain' : undefined} />}
          focusIndicator={false}
          key={i}
          onClick={() => this.handleStarClick(i + 1)}
          title={`${i + 1} ${i + 1 === 1 ? 'star' : 'stars'}`}
        />
      );
    }

    this.setState({
      stars: stars,
      showRate: false
    });
  };

  rateFilm = () => {
    this.setState({
      showRate: true
    });
  };

  handleRate = () => {
    const updatedMovie: movie = this.props.movie;
    updatedMovie.starCount = this.state.starCount;
    this.setState({
      rateLabel: this.state.starCount + '/10',
      showRate: false
    });
    this.props.handleRate(updatedMovie);
  };

  handleCancel = () => {
    this.setState({
      starCount:
        this.props.movie.starCount === -1 ? 0 : this.props.movie.starCount
    });
    this.getStars();
  };

  handleClearRating = () => {
    const updatedMovie: movie = this.props.movie;
    updatedMovie.starCount = -1;
    this.setState({
      showRate: false,
      rateLabel: 'Rate'
    });
    this.props.handleRate(updatedMovie);
  };

  render() {
    const mode = localStorage.getItem('visualMode') || 'wedding';
    return (
      <ResponsiveContext.Consumer>
        {(size) => (
          <Box>
            <Button
              icon={
                <Star
                  color={
                    (this.props.movie.starCount || 0) > 0 ? 'plain' : undefined
                  }
                />
              }
              title="Rate film"
              label={this.state.rateLabel}
              hoverIndicator={mode === 'solid' ? 'accent-1' : 'neutral-3'}
              onClick={this.rateFilm}
            />
            {this.state.showRate && (
              <Layer
                responsive={false}
                position={size === 'small' ? 'bottom' : 'top'}
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
                onClickOutside={this.handleCancel}
                margin={size !== 'small' ? { top: 'medium' } : undefined}
                color="light-2"
              >
                <Box
                  round={size === 'small' ? { corner: 'top' } : true}
                  margin={{ top: 'small', horizontal: 'small' }}
                  background={{ color: 'neutral-3', opacity: 0.7 }}
                  // style={{
                  //   background:
                  //     mode === 'solid'
                  //       ? 'linear-gradient(90deg, #e3ffe7 0%, #d9e7ff 100%)'
                  //       : 'linear-gradient(135deg, rgba(121,215,255,1) 0%, rgba(225,237,255,1) 75%)',
                  //   borderRadius: size !== 'small' ? 30 : 0
                  // }}
                  pad="small"
                  justify="center"
                  align="center"
                >
                  <Box align="center" pad="small">
                    <Text size="large">How would you rate</Text>
                    <Text weight="bold" size="large" textAlign="center">
                      {this.props.movie.name}?
                    </Text>
                  </Box>
                  <Box
                    justify="start"
                    align="center"
                    direction="row"
                    margin={{ bottom: 'small' }}
                    overflow="auto"
                    border={{
                      side: 'all',
                      color: 'accent-1',
                      size: 'medium',
                      style: 'outset'
                    }}
                    round
                  >
                    {this.state.stars}
                  </Box>
                  <Box align="center">
                    {this.state.starCount === 0 ||
                    this.state.starCount !== this.props.movie.starCount ? (
                      <Button
                        label={
                          this.state.starCount === 0
                            ? 'Rate'
                            : 'Rate ' + this.state.starCount + '/10'
                        }
                        onClick={this.handleRate}
                        color="#228BE6"
                        primary
                        disabled={this.state.starCount > 0 ? false : true}
                      />
                    ) : (
                      <Button
                        label={
                          'Clear ' + this.props.movie.starCount + '/10 rating'
                        }
                        onClick={this.handleClearRating}
                        color="#228BE6"
                        primary
                        disabled={this.state.starCount > 0 ? false : true}
                      />
                    )}
                    <Button
                      icon={<FormClose />}
                      title="Cancel"
                      focusIndicator={false}
                      onClick={this.handleCancel}
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
