import React, { useEffect, useRef } from 'react';
import classes from './Button.module.scss';



function ButtonBase({ className, keyCodes, value, onClick, ...props}) {

  const inputEl = useRef();

  // Click
  const handleClick = () => {
    onClick(value)
  }

  // Key down
  const handleKeyDown = (e) => {
    if (keyCodes.includes(e.keyCode) || e.key === value) {
      console.log(e, e.key, value, keyCodes.includes(e.keyCode));
      onClick(value);

      // Imitate hover and active state when pressing button
      setTimeout(() => {
        console.log(inputEl);
        inputEl.current.classList.toggle(classes.keydown);
      }, 100)
      inputEl.current.classList.toggle(classes.keydown);
    }
  }

  // Add/remove event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    }
  })

  return (
    <input
      ref={inputEl}
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