// React Hot Reload does not support stateless function components as of now
/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';

import Clicker from '../../components/clicker';
import Grass from '../../components/grass';

import styles from './style.scss';

export default class Start extends Component {
  render() {
    return (
      <div className={ styles.main }>
        <h1>Green Sweeper</h1>
        
        <div className="wrapper">
          <Grass/>
        </div>
      </div>
    );
  }
}
