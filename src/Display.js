import React from 'react';
import './Display.scss';

export default function Display({ topValue, bottomValue }) {

  // Decrease bottom font size
  let fontSize, bn = bottomValue.length, tn = topValue.length;
  if (bn > 8) fontSize = '4.5rem';
  if (bn > 10) fontSize = '3.5rem';
  if (bn > 13) fontSize = '2.5rem';
  if (bn > 19 || tn > 40) fontSize = '2rem';

  return (
    <div className="Display">
      <div className="top">{topValue}</div>
      <div id="display" className="bottom" style={{ fontSize }}>
        {bottomValue}
      </div>
    </div>
  );
}
