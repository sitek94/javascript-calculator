import React from 'react';
import classes from './Button.module.scss';


function ButtonBase({ className, ...props}) {
  return (
    <input
      type="button"
      className={[classes.Base, className].join(' ')}
      {...props}
    />
  );
}

export function GridButton(props) {
  return (
    <ButtonBase className={classes.Grid} {...props} />
  )
}

export function LargeButton(props) {
  return (
    <ButtonBase className={classes.Large} {...props} />
  )
}