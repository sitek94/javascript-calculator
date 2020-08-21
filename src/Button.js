import React from 'react';
import classes from './Button.module.scss';


export function Button({ className, ...props}) {
  return (
    <input
      type="button"
      className={[classes.Button, className].join(' ')}
      {...props}
    />
  );
}

export function LargeButton(props) {
  return (
    <Button className={classes.LargeButton} {...props} />
  )
}