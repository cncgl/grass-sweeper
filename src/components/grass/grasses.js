import React, { Component } from 'react';
import Turf from './turf';

export default class Grasses extends Component {
  constructor(props) {
    super(props);
    this.state = { cols: this.createTable(props) };
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.openNum > nextProps.openNum || this.props.colNum !== nextProps.colNum) {
      this.setState({ cols: this.createTurf(nextProps) });
    }
  }
  createTable(props) {
    const mineTable = [];
    for (let col = 0; col < props.colNum; col++) {
      mineTable.push([]);
      for (let row = 0; row < props.rowNum; row++) {
        mineTable[col].push({
          x: col,
          y: row,
          count: 0,
          isOpened: false,
          hasMine: false,
          hasFlag: false,
        });
      }
    }
    for (let i = 0; i < props.mineNum; i++) {
      const cell = mineTable[Math.floor(Math.random() * props.colNum)]
        [Math.floor(Math.random() * props.rowNum)];
      if (cell.hasMine) {
        i--;
      } else {
        cell.hasMine = true;
      }
    }
    // console.log('Mines:' + JSON.stringify(mineTable));
    return mineTable;
  }
  open(cell) {
    const num = this.countMines(cell);
    const _cols = this.state.cols;
    if (!_cols[cell.x][cell.y].isOpened) { this.props.addOpenNum(); }
    _cols[cell.x][cell.y].isOpened = true;
    _cols[cell.x][cell.y].count = cell.hasMine ? 'b' : num;
    this.setState({ cols: _cols });
    if (_cols[cell.x][cell.y].hasFlag) {
      _cols[cell.x][cell.y].hasFlag = false;
      this.props.checkFlagNum(-1);
    }
    // Mine が無ければオープンにする。
    if (!cell.hasMine && num === 0) {
      this.openAround(cell);
    }
    if (cell.hasMine) {
      this.props.gameOver();
    }
  }
  // マークする
  mark(cell) {
    const _cols = this.state.cols;
    const _cell = _cols[cell.x][cell.y];
    _cell.hasFlag = !_cell.hasFlag;
    this.setState({ cols: _cols });
    this.props.checkFlagNum(_cell.hasFlag ? 1 : -1);
  }
  // 周囲８方向の mine を数える
  countMines(cell) {
    let around = 0;
    for (let col = -1; col <= 1; col++) {
      for (let row = -1; row <= 1; row++) {
        if (cell.y + row >= 0 && cell.x + col >= 0
          && cell.x + col < this.state.cols.length
          && cell.y + row < this.state.cols[0].length
          && this.state.cols[cell.x + col][cell.y + row].hasMine
          && !(row === 0 && col === 0)) {
          around ++;
        }
      }
    }
    return around;
  }
  // 開いた周囲８方向を開ける
  openAround(cell) {
    const _cols = this.state.cols;
    for (let col = -1; col <= 1; col++) {
      for (let row = -1; row <= 1; row++) {
        if (cell.y + row >= 0 && cell.x + col >= 0
          && cell.x + col < this.state.cols.length
          && cell.y + row < this.state.cols[0].length
          && !this.state.cols[cell.x + col][cell.y + row].hasMine
          && !this.state.cols[cell.x + col][cell.y + row].isOpened) {
          this.open(_cols[cell.x + col][cell.y + row]);
        }
      }
    }
  }
  render() {
    const width = (11 + 2) * this.props.colNum + 20;
    const height = (11 + 2) * this.props.rowNum + 20;
    const Turfs = this.state.cols.map((col, index) => {
      const key = `${col}_${index}`;
      return (
        <Turf
          key={key}
          cells={col}
          open={this.open.bind(this)}
          mark={this.mark.bind(this)}
        />);
    });
    return (
      <svg width={width} height={height}>
        <g transform="translate(20, 20)">{Turfs}</g>
      </svg>);
  }
}
Grasses.propTypes = { openNum: React.PropTypes.number, mineNum: React.PropTypes.number,
  rowNum: React.PropTypes.number, colNum: React.PropTypes.number,
  gameOver: React.PropTypes.func, addOpenNum: React.PropTypes.func };
