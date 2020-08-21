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

// I'm taking id out and assign it to each button as class name
// to have easy access to each individual button 
export function GridButton({ id, ...props }) {
  return (
    <ButtonBase id={id} className={[id, classes.Grid].join(" ")} {...props} />
  )
}

export function LargeButton(props) {
  return (
    <ButtonBase className={classes.Large} {...props} />
  )
}