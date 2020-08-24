import React, { useEffect, useRef } from 'react';
import classes from './Button.module.scss';

function ButtonBase({ className, keyCodes, value, onClick, ...props }) {
  const inputEl = useRef();

  // Click
  const handleClick = () => {
    onClick(value);
  };

  // Add/remove event listeners
  useEffect(() => {
    
    // Key down
    const handleKeyDown = (e) => {
      e.preventDefault();

      if (keyCodes.includes(e.keyCode) || e.key === value) {
        onClick(value);

        // Imitate hover and active state when pressing button
        setTimeout(() => {
          inputEl.current.classList.toggle(classes.keydown);
        }, 100);
        inputEl.current.classList.toggle(classes.keydown);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [keyCodes, value, onClick]);

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
  keyCodes: [],
};

// I'm taking id out and assign it to each button as class name
// to have easy access to each individual button
export function GridButton({ id, ...props }) {
  return (
    <ButtonBase id={id} className={[id, classes.Grid].join(' ')} {...props} />
  );
}

export function LargeButton(props) {
  return <ButtonBase className={classes.Large} {...props} />;
}
