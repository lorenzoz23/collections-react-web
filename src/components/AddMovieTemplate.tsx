import React, { RefObject, Component, createRef } from 'react';
import { Box, Drop, Text, ResponsiveContext, Button } from 'grommet';
import AddTitle from './AddTitle';
import { movie } from './HomePage';
import { SearchAdvanced } from 'grommet-icons';

const randomMovieBackDrops = [
  // new films
  'https://image.tmdb.org/t/p/original/n6bUvigpRFqSwmPp1m2YADdbRBc.jpg', // joker
  'https://image.tmdb.org/t/p/original/ApiBzeaa95TNYliSbQ8pJv4Fje7.jpg', // parasite
  'https://image.tmdb.org/t/p/original/yB2hTgz9CTVYjlMWPSl3LPx5nWj.jpg', // once upon
  'https://image.tmdb.org/t/p/original/g6GtOfXtzDpY73ef7wludoorTti.jpg', // midsommar
  'https://image.tmdb.org/t/p/original/oUVd42KgJWW6YnZLfzI7SDTdcPL.jpg', // frances ha
  'https://image.tmdb.org/t/p/original/5qTZGBHJNq6riBliYtOnH4yUN6x.jpg', // uncut gems
  'https://image.tmdb.org/t/p/original/vVpEOvdxVBP2aV166j5Xlvb5Cdc.jpg', // john wick 3
  'https://image.tmdb.org/t/p/original/AbRYlvwAKHs0YuyNO6NX9ofq4l6.jpg', // knives out
  'https://image.tmdb.org/t/p/original/wcAqndL2MkIjPrCrYeuE794weNE.jpg', // booksmart
  'https://image.tmdb.org/t/p/original/vZ7EVk7FaNEWYqlVWbFLHP8Z0LU.jpg', // get out
  'https://image.tmdb.org/t/p/original/aUVCJ0HkcJIBrTJYPnTXta8h9Co.jpg', // spiderverse
  'https://image.tmdb.org/t/p/original/pDqwUJJSaHIv2sxyRYfmYBFeU9C.jpg', // birdman
  'https://image.tmdb.org/t/p/original/zl9uqCl5iUSb50sTk2BPzw6bJnU.jpg', // roma
  'https://image.tmdb.org/t/p/original/hVYhrKuQNFro6jXHZMn60uYjrIP.jpg', // shape of water
  'https://image.tmdb.org/t/p/original/sAtoMqDVhNDQBc3QJL3RF6hlhGq.jpg', // blade runner 2049
  'https://image.tmdb.org/t/p/original/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg', // avengers: endgame
  'https://image.tmdb.org/t/p/original/foFq1RZWQIgFuCQ0nyYccywjFyX.jpg', // portrait of a lady on fire
  'https://image.tmdb.org/t/p/original/hrMbAi9fPTmc6EtpyyAgDKznptu.jpg', // call me by your name
  'https://image.tmdb.org/t/p/original/bJLJAtGjBj836UjJZNOwgrfe5Ps.jpg', // 3 billboards
  'https://image.tmdb.org/t/p/original/cqa3sa4c4jevgnEJwq3CMF8UfTG.jpg', // 1917
  'https://image.tmdb.org/t/p/original/A9KPbYTQvWsp51Lgz85ukVkFrKf.jpg', // moonlight
  'https://image.tmdb.org/t/p/original/7cDZkagW1YTnT4nP1BYrLPSd04B.jpg', // 8th grade
  'https://image.tmdb.org/t/p/original/uqOuJ50EtTj7kkDIXP8LCg7G45D.jpg', // ex machina
  'https://image.tmdb.org/t/p/original/jrudoaXcoLyHRPdolyOGemXgPEs.jpg', // first man
  'https://image.tmdb.org/t/p/original/tNE9HGcFOH8EpCmzO7XCYwqguI0.jpg', // the lighthouse
  'https://image.tmdb.org/t/p/original/5n2jz145P1CRdPfA296MmEZF1sQ.jpg', // honey boy
  'https://image.tmdb.org/t/p/original/rqMvkc7P5yYfomhYXDmteWQoUeK.jpg', // lobster
  'https://image.tmdb.org/t/p/original/v6eOq707lwWFIG96Rv9sSR6lnnT.jpg', // burning
  'https://image.tmdb.org/t/p/original/nhPwBswiKPAULsMYooP66Bk0e3x.jpg', // thunder road
  'https://image.tmdb.org/t/p/original/fgffluhvdOv79SkYaKrfRA0xkf4.jpg', // lion
  // classic films
  'https://image.tmdb.org/t/p/original/xFuRZtuTbTY3S1QLY8Y9XYH1JCk.jpg', // there will be blood
  'https://image.tmdb.org/t/p/original/a58oc5qGNazb3QOxEH8eG5S7gjr.jpg', // taxi driver
  'https://image.tmdb.org/t/p/original/spoZUN4X1KiOc5S0plOyGAXLNtb.jpg', // 2001
  'https://image.tmdb.org/t/p/original/hkBaDkMWbLaf8B1lsWsKX7Ew3Xq.jpg', // dark knight
  'https://image.tmdb.org/t/p/original/77ElMccPnTMPouRxSdbJ4nEjf69.jpg', // big lebowski
  'https://image.tmdb.org/t/p/original/jP2htGBHE7vKq4MLeC75UeC0sZH.jpg', // zodiac
  'https://image.tmdb.org/t/p/original/AdKA2F1SzYPhSZdEbjH1Zh75UVQ.jpg', // shining
  'https://image.tmdb.org/t/p/original/kCiMExsYuNhYluHxPP2OTmWw7hp.jpg', // indiana jones
  'https://image.tmdb.org/t/p/original/azIbQpeKKNF9r85lBSRrNnMK0Si.jpg', // empire strikes back
  'https://image.tmdb.org/t/p/original/qqHQsStV6exghCM7zbObuYBiYxw.jpg', // 12 angry men
  'https://image.tmdb.org/t/p/original/kZGaVeXSkkvrpMYvD97sxHj291k.jpg', // psycho
  'https://image.tmdb.org/t/p/original/x4biAVdPVCghBlsVIzB6NmbghIz.jpg', // the good, bad, and ugly
  'https://image.tmdb.org/t/p/original/fbvjEAgPwhs9I3pzuaKmw5ZZuEZ.jpg', // misery
  'https://image.tmdb.org/t/p/original/7c9UVPPiTPltouxRVY6N9uugaVA.jpg', // forrest gump
  'https://image.tmdb.org/t/p/original/jsQDdrsGJSrqqetrJBZWomvJCOl.jpg', // training day
  'https://image.tmdb.org/t/p/original/ByDf0zjLSumz1MP1cDEo2JWVtU.jpg', // the matrix
  'https://image.tmdb.org/t/p/original/fq3wyOs1RHyz2yfzsb4sck7aWRG.jpg', // back to the future
  'https://image.tmdb.org/t/p/original/AmR3JG1VQVxU8TfAvljUhfSFUOx.jpg', // alien
  'https://image.tmdb.org/t/p/original/lxD5ak7BOoinRNehOCA85CQ8ubr.jpg', // toy story
  'https://image.tmdb.org/t/p/original/xLjgy6mjefWzNzMKxfwfrKgoVTq.jpg', // mrs doubtfire
  'https://image.tmdb.org/t/p/original/wh4ze6klUbeichAj603OKZwY1W5.jpg', // terminator
  'https://image.tmdb.org/t/p/original/loNjs84HrviWIyHNYMNfLKHkon0.jpg', // bicycle thieves
  'https://image.tmdb.org/t/p/original/n4GJFGzsc7NinI1VeGDXIcQjtU2.jpg', // in the mood for love
  'https://image.tmdb.org/t/p/original/8apZe1cW55VTLvegseIpuEwAVZq.jpg', // holy grail
  'https://image.tmdb.org/t/p/original/3nYlM34QhzdtAvWRV5bN4nLtnTc.jpg', // jaws
  'https://image.tmdb.org/t/p/original/6t4jqCok1yGBn7z7CKlCsWsjoNX.jpg', // raging bull
  'https://image.tmdb.org/t/p/original/bxY7ve1LP8atCIuvr4jeeJMmU4w.jpg', // truman show
  'https://image.tmdb.org/t/p/original/lVy5Zqcty2NfemqKYbVJfdg44rK.jpg', // kill bill
  'https://image.tmdb.org/t/p/original/jYCI4dsx9NS15T1bXMqptfYbUvi.jpg', // charlie bartlett
  'https://image.tmdb.org/t/p/original/gBn3af5QvQARNZEFlvYjFO268I7.jpg' // capote
];

interface AddMovieTemplateProps {
  rand: number;
  width: number;
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
      r = Math.floor(Math.random() * 60);
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
            height={this.props.width < 950 ? 'small' : undefined}
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
                pad={size !== 'small' ? 'small' : 'medium'}
                background={{ color: 'brand', opacity: 'strong' }}
                elevation="medium"
                round={{ size: size !== 'small' ? 'large' : 'xlarge' }}
                gap="xsmall"
                onClick={() => {
                  this.setState({ rand: this.getRandom() });
                }}
                border={
                  size === 'small'
                    ? { size: 'small', color: 'accent-1', side: 'all' }
                    : undefined
                }
              >
                <Text textAlign="center" weight="bold" size="xlarge">
                  Add a film!
                </Text>
                <Button
                  style={{ borderRadius: 50 }}
                  hoverIndicator="accent-3"
                  primary
                  onClick={() => {
                    this.setState({ visible: true });
                  }}
                  icon={
                    <SearchAdvanced
                      size={this.props.width < 950 ? 'medium' : 'large'}
                    />
                  }
                  alignSelf="center"
                />
              </Box>
            </Drop>
            {this.state.visible && (
              <AddTitle
                width={this.props.width}
                handleClose={() =>
                  this.setState({ visible: false, rand: this.getRandom() })
                }
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
