import React, { useState, useRef, RefObject } from 'react';
import { Box, Drop, Text } from 'grommet';

export const Movie = (props: any) => {
  const [over, setOver] = useState(false);
  const ref = useRef() as RefObject<HTMLDivElement>;

  return (
    <Box
      ref={ref}
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
      {ref.current && over && (
        <Drop align={{ bottom: 'bottom' }} target={ref.current} plain>
          <Box
            margin="xsmall"
            pad="small"
            background="dark-2"
            elevation="small"
            round={{ size: 'medium' }}
          >
            <Text textAlign="center">
              {props.movie.name + ' (' + props.movie.date.substring(0, 4) + ')'}
            </Text>
          </Box>
        </Drop>
      )}
    </Box>
  );
};
