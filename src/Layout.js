import React from 'react';
import classes from './Layout.module.scss';

export default function Layout({ top, middle, bottom }) {
  return (
    <div className={classes.Layout}>
    <div className={classes.container}>
      <div className={classes.top}>
        {top}
      </div>
      <div className={classes.middle}>
        {middle}
      </div>
      <div className={classes.bottom}>
        {bottom}
      </div>
    </div>
    </div>
  )
}