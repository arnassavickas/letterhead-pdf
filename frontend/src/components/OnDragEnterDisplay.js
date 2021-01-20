import React from 'react';
import { Typography, Fade } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';

const OnDragEnterDisplay = ({ isOver }) => {
  const display = isOver ? { display: 'flex' } : { display: 'none' };
  return (
    <Fade in={isOver}>
      <div id='on-hover' style={display}>
        <Typography variant='h2'>galite paleisti</Typography>
        <CheckIcon style={{ fontSize: 100 }} />
      </div>
    </Fade>
  );
};

export default OnDragEnterDisplay;
