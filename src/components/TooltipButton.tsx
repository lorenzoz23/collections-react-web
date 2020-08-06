import React, { useState, useRef, RefObject } from 'react';
import { Box, Button, Drop, ResponsiveContext, Text, Layer } from 'grommet';
import { FormClose } from 'grommet-icons';

export const TooltipButton = (props: any) => {
  const [over, setOver] = useState(false);
  const [show, setShow] = useState(false);
  const ref = useRef() as RefObject<HTMLButtonElement>;

  const handleClick = (size: string) => {
    if (size === 'small' && props.width < 700) {
      setShow(!show);
    }
  };

  return (
    <ResponsiveContext.Consumer>
      {(size) => (
        <Box align="center" justify="center">
          <Button
            label={props.title}
            icon={props.icon}
            ref={ref}
            focusIndicator={props.focus}
            onMouseOver={() => setOver(true)}
            onMouseOut={() => setOver(false)}
            onClick={() => handleClick(size)}
          />

          {ref.current && over && (size !== 'small' || props.width > 700) && (
            <Drop align={{ top: 'bottom' }} target={ref.current} plain>
              <Box
                animation="slideDown"
                margin="small"
                pad="medium"
                width="medium"
                background={{ color: 'accent-1' }}
                round="medium"
              >
                <Text size="small">
                  We only support searching a film through its title and year.
                  However, if you wanted to search/add films based on a wider
                  range of criteria, we recommend creating a csv file containing
                  all the films you wish to add along with the relevant
                  information required to add films from a csv file. For more
                  information on adding films from a csv file, go to settings!
                </Text>
              </Box>
            </Drop>
          )}
          {show && (
            <Layer
              position="top"
              responsive={false}
              onClickOutside={() => setShow(false)}
              style={{ width: '100%' }}
            >
              <Box
                background="accent-1"
                pad="medium"
                align="center"
                overflow={{ vertical: 'auto', horizontal: 'hidden' }}
              >
                <Text textAlign="center" size="small">
                  We only support searching a film through its title and year.
                  However, if you wanted to search/add films based on a wider
                  range of criteria, we recommend creating a csv file containing
                  all the films you wish to add along with the relevant
                  information required to add films from a csv file. For more
                  information on adding films from a csv file, go to settings!
                </Text>
                <Button
                  icon={<FormClose color="brand" />}
                  onClick={() => setShow(false)}
                />
              </Box>
            </Layer>
          )}
        </Box>
      )}
    </ResponsiveContext.Consumer>
  );
};
