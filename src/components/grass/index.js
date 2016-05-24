import React, { Component } from 'react';
import Radium from 'radium';
import Grasses from './grasses';

class GrassSweeper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      level: 'easy',
      mineNum: 10,
      colNum: 50,
      rowNum: 7,
      flagNum: 0,
      openNum: 0,
      time: 0,
      status: 'playing',
    };
  }
  componentWillMount() {
    if (this.state.status === 'playing') {
      this.judge();
    }
  }
  judge() {
    if (this.state.mineNum + this.state.openNum >= this.state.rowNum * this.state.colNum) {
      this.setState({ state: 'Clear' });
    }
  }
  // ゲームオーバー状態にする
  gameOver() {
    this.setState({ state: 'gameover' });
  }
  // 設定されているフラグを増減する
  checkFlagNum(updateNum) {
    this.setState({ flagNum: this.state.flagNum + updateNum });
  }
  addOpenNum() {}
  render() {
    return (
      <div className="app">
        <Grasses
          openNum={this.state.openNum}
          mineNum={this.state.mineNum}
          rowNum ={this.state.rowNum}
          colNum ={this.state.colNum}
          gameOver={this.gameOver.bind(this)}
          addOpenNum={this.addOpenNum.bind(this)}
        />
        <div className="operation-container">
          <button>New Game</button>
        </div>
      </div>);
  }
}

export default Radium(GrassSweeper);
