import React, { useState, useRef, RefObject } from 'react';
import { Box, Drop, Text, ResponsiveContext } from 'grommet';

export const Movie = (props: any) => {
  const [over, setOver] = useState(false);
  const ref = useRef() as RefObject<HTMLDivElement>;

  return (
    <ResponsiveContext.Consumer>
      {(size) => (
        <Box
          ref={ref}
          title={
            size === 'small'
              ? props.movie.name + ' (' + props.movie.date.substring(0, 4) + ')'
              : undefined
          }
          background={{
            image: `url(${props.movie.poster})`,
            color: 'header',
            size: 'cover',
            position: 'center'
          }}
          border={{ size: 'small', color: 'lotBorder', side: 'all' }}
          round={{ corner: 'bottom', size: 'xlarge' }}
          onClick={props.showMovie}
          onMouseOver={() => setOver(true)}
          onMouseOut={() => setOver(false)}
        >
          {ref.current && over && size !== 'small' && (
            <Drop
              align={{ bottom: 'bottom' }}
              target={ref.current}
              plain
              overflow="hidden"
            >
              <Box
                margin="xsmall"
                animation={{ type: 'slideDown', duration: 1000 }}
                pad="small"
                background="dark-2"
                elevation="small"
                round={{ size: 'medium' }}
              >
                <Text textAlign="center">
                  {props.movie.name +
                    ' (' +
                    props.movie.date.substring(0, 4) +
                    ')'}
                </Text>
              </Box>
            </Drop>
          )}
        </Box>
      )}
    </ResponsiveContext.Consumer>
  );
};
