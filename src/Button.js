import React, { useEffect } from 'react';
import classes from './Button.module.scss';


function ButtonBase({ className, keyCodes, value, onClick, ...props}) {

  const handleClick = (e) => {
    onClick(value)
  }

  const handleKeyDown = (e) => {
    if (keyCodes.includes(e.keyCode)) {
      console.log(e);
      onClick(value);
      console.log(value);
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    }
  })



  return (
    <input
      type="button"
      value={value}
      className={[classes.Base, className].join(' ')}
      onClick={handleClick}
      {...props}
    />
  );
}

ButtonBase.defaultProps = {
  keyCodes: []
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