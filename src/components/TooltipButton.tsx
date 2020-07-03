import React, { useState, useRef, RefObject } from 'react';
import { Box, Button, Drop, ResponsiveContext, Text, Layer } from 'grommet';
import { FormClose } from 'grommet-icons';

export const TooltipButton = (props: any) => {
  const [over, setOver] = useState(false);
  const [show, setShow] = useState(false);
  const ref = useRef() as RefObject<HTMLButtonElement>;

  const handleClick = (size: string) => {
    if (size === 'small') {
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

          {ref.current && over && size !== 'small' && (
            <Drop align={{ left: 'right' }} target={ref.current} plain>
              <Box
                animation="slideRight"
                margin="xsmall"
                pad="small"
                width="medium"
                background={{ color: 'accent-1' }}
                round={{ size: 'medium', corner: 'right' }}
              >
                <Text size="small">
                  as of now, we only support searching a film through its title
                  and year. however, if you wanted to search/add films based on
                  a particular cast or crew member(lead actor, director, writer,
                  etc), we recommend creating a csv file containing all the
                  films you wish to add along with the relevant information
                  required to add films from a csv file. for more information on
                  adding films from a csv file, go to settings!
                </Text>
              </Box>
            </Drop>
          )}
          {show && (
            <Layer
              position="top"
              responsive={false}
              style={{ borderRadius: 30 }}
            >
              <Box
                background="accent-1"
                pad="medium"
                round={{ corner: 'bottom' }}
                align="center"
                overflow={{ vertical: 'auto', horizontal: 'hidden' }}
              >
                <Text textAlign="center" size="small">
                  as of now, we only support searching a film through its title
                  and year. however, if you wanted to search/add films based on
                  a particular cast or crew member(lead actor, director, writer,
                  etc), we recommend creating a csv file containing all the
                  films you wish to add along with the relevant information
                  required to add films from a csv file. for more information on
                  adding films from a csv file, go to settings!
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
