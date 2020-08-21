import React from 'react';
import './Display.scss';

export default function Display({ topValue, bottomValue }) {
  return (
    <div className="Display">
      <div className="top">{topValue}</div>
      <div id="display" className="bottom">
        {bottomValue}
      </div>
    </div>
  );
}
