import React from 'react';
import * as styles from '../styles/loader.module.scss';

function Loader(props) {

  return (
    <div className={ props.center ? [styles.loader, styles.center].join(' ') : styles.loader }></div>
  )
}

export default Loader;