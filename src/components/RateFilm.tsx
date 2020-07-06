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
    rateLabel: this.props.movie.starCount
      ? this.props.movie.starCount + '/10'
      : 'rate',
    starCount: this.props.movie.starCount || 0
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
      starCount: 0
    });
    this.getStars();
  };

  render() {
    const mode = localStorage.getItem('visualModeValue') || 'gradient';
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
              title="rate film"
              label={this.state.rateLabel}
              hoverIndicator={mode === 'solid' ? 'accent-1' : 'neutral-3'}
              onClick={this.rateFilm}
            />
            {this.state.showRate && (
              <Layer
                responsive={false}
                position={size === 'small' ? 'bottom' : 'top'}
                style={{
                  borderRadius: size !== 'small' ? 30 : 0,
                  width: size === 'small' ? '100%' : undefined
                }}
                //onClickOutside={() => this.setState({ showRate: false })}
                margin={size !== 'small' ? { top: 'medium' } : undefined}
              >
                <Box
                  round={size !== 'small' ? true : false}
                  background="rateFilm"
                  pad="small"
                  fill
                  flex
                  align="center"
                >
                  <Box align="center" pad="small">
                    <Text size="large">how would you rate</Text>
                    <Text weight="bold" size="large">
                      {this.props.movie.name}?
                    </Text>
                  </Box>
                  <Box
                    justify="center"
                    align="center"
                    direction="row"
                    margin={{ bottom: 'small' }}
                    overflow="auto"
                    border={{
                      side: 'all',
                      color: 'movieBorder',
                      size: 'medium',
                      style: 'outset'
                    }}
                    round
                  >
                    {this.state.stars}
                  </Box>
                  <Box align="center">
                    <Button
                      label={
                        this.state.starCount === 0
                          ? 'rate'
                          : 'rate ' + this.state.starCount + '/10'
                      }
                      onClick={this.handleRate}
                      color="#228BE6"
                      primary
                      disabled={this.state.starCount > 0 ? false : true}
                    />
                    <Button
                      icon={<FormClose />}
                      title="cancel"
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
