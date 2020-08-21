import React from 'react';

export default function Display({ topValue, bottomValue }) {
  return (
    <div className="display">
      <div className="display__top">{topValue}</div>
      <div id="display" className="display__bottom">
        {bottomValue}
      </div>
    </div>
  );
}
