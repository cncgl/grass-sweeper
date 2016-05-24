// React Hot Reload does not support stateless function components as of now
/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';

// import Clicker from '../../components/clicker';
import GrassSweeper from '../../components/grass';

import styles from './style.scss';

export default class Start extends Component {
  render() {
    return (
      <div className={ styles.main }>
        <div className="wrapper"><GrassSweeper /></div>
      </div>
    );
  }
}
