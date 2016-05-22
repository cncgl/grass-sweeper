import React, { Component } from 'react';
// import { connect } from 'react-redux';
import Radium from 'radium';

import styles from './style.scss';

class Grass extends Component {
  constructor(props) {
    super(props);
    // console.log('Grass: ' + JSON.stringify(props));
    this.state = {
      hasMine: props.cell.hasMine,
      hasFlag: props.cell.hasFlag,
      isOpened: props.cell.isOpend,
      count: 0
    };
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      isOpened: nextProps.cell.isOpend,
      hasMine: nextProps.cell.hasMine,
      hasFlag: nextProps.cell.hasFlag,
      count: nextProps.cell.count
    });
  }
  open() {
    this.props.open(this.props.cell);
  }
  mark(e) {
    e.preventDefault();
    if(!this.state.isOpend) {
      this.props.mark(this.props.cell);
    }
  }
  
  _handleHighlight() {}
  // _handleClick() {}
  
  render() {
    var _this = this;
    const width  = 11;
    const height = 11;
    const y = this.props.row * 13;
    var cell = () => {
      if(_this.state.isOpened) {
        if(_this.state.hasMine) {
          return (
            <rect className='day'
                  width={width}
                  height={height}
                  y={y}
                  fill='#ff0000'
                  onClick={this.open.bind(this)}
                  onContextMenu={this.mark.bind(this)}
                  onMouseEnter={this._handleHighlight.bind(this, null)}
                  onMouseLeave={this._handleHighlight.bind(this, null)}/>);
        } else {
          const colors = ['#eeeeee', '#d6e685', '#bfea95', '#aae272', '#8cc665', '6ab123', '44a340', '1e6823', '0b470e'];
          return (
            <rect className='day'
                  width={width}
                  height={height}
                  y={y}
                  fill='{colors[_this.state.count]}'
                  onClick={this.open.bind(this)}
                  onContextMenu={this.mark.bind(this)}
                  onMouseEnter={this._handleHighlight.bind(this, null)}
                  onMouseLeave={this._handleHighlight.bind(this, null)}/>);
        }
      } else if(_this.state.hasFlag) {
        return (
          <rect className='day'
              width={width}
              height={height}
              y={y}
              fill='#0000ff'
              onClick={this.open.bind(this)}
              onContextMenu={this.mark.bind(this)}
              onMouseEnter={this._handleHighlight.bind(this, null)}
              onMouseLeave={this._handleHighlight.bind(this, null)}/>);
      } else {
        return (
          <rect className='day'
                width={width}
                height={height}
                y={y}
                fill='#dfdfdf'
                onClick={this.open.bind(this)}
                onContextMenu={this.mark.bind(this)}
                onMouseEnter={this._handleHighlight.bind(this, null)}
                onMouseLeave={this._handleHighlight.bind(this, null)}/>);
      }
    };
    return cell();
  }
}  


class Turf extends Component {
  constructor(props) {
    super(props);
    console.log('Turf: '+ JSON.stringify(props));
    this.state = { cells: props.cells };
  }
  copmponentWillReceiveProps(nextProps) {
    this.setState({ cells: nextProps.cells });
  }
  render() {
    var _this = this;
    var Cells = this.state.cells.map((cell, index) => {
      // console.log('index: ' + index);
      const key = 'turf_' + index;
      return (
        <Grass
          key={key}
          cell={cell}
          row={index}
          open={this.props.open}
          mark={this.props.mark} />);
    });
    console.log('x: '+ JSON.stringify(this.state.cells));
    var trans_str = 'translate(' + (this.state.cells[0].x * 13) + ',0)';
    return (<g transform={trans_str}>{Cells}</g>);
  }
}

class Grasses extends Component {
  constructor(props) {
    super(props);
    this.state = {cols: this.createTable(props)};  
  }
  componentWillReceiveProps(nextProps) {
    if(this.props.openNum > nextProps.openNum || this.props.colNum !== nextProps.colNum) {
      this.setState({ cols: this.createTurf(nextProps) });
    }
  }
  createTable(props) {
    var mineTable = [];
    for(var col = 0; col < props.colNum; col++){
      mineTable.push([]);
      for(var row = 0; row < props.rowNum; row++){
        mineTable[col].push({
          x : col,
          y : row,
          count : 0,
          isOpened : false,
          hasMine : false,    // Mine があるか
          hasFlag : false　   // マークされているか 
        });
      }
    }
    for(var i = 0; i < props.mineNum; i++){
      var cell = mineTable[Math.floor(Math.random()*props.colNum)][Math.floor(Math.random()*props.rowNum)];
      if(cell.hasMine){
        i--;
      } else {
        cell.hasMine = true;
      }
    }
    console.log('Mines:' + JSON.stringify(mineTable));
    return mineTable;
  }
  open(cell) {
    var num = this.countMines(cell);
    var _cols = this.state.cols;
    if(!_cols[cell.x][cell.y].isOpened) { this.props.addOpenNum(); }
    _cols[cell.x][cell.y].isOpened = true;
    _cols[cell.x][cell.y].count = cell.hasMine ? 'b' : num;
    this.setState({ cols: _cols });
    if(_cols[cell.x][cell.y].hasFlag) {
      _cols[cell.x][cell.y].hasFlag = false;
      this.props.checkFlagNum(-1);
    }
    // Mine が無ければオープンにする。
    if(!cell.hasMine && num === 0) {
      this.openAround(cell);
    }
    if(cell.hasMine) {
      this.props.gameOver();
    }
  }
  // マークする
  mark(cell) {
    var _cols = this.state.cols;
    var _cell = _cols[cell.x][cell.y];
    _cell.hasFlag = !_cell.hasFlag;
    this.setState({ cols: _cols});
    this.props.checkFlagNum(_cell.hasFlag ? 1 : -1);
  }
  // 周囲８方向の mine を数える
  countMines(cell) {
    var around = 0;
    for(var col = -1; col <= 1; col++) {
      for(var row = -1; row <= 1; row++) {
        if ( cell.y + row >= 0 && cell.x + col >= 0
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
    var _cols = this.state.cols;
    for(var col = -1; col <= 1; col++) {
      for(var row = -1; row <= 1; row++) {
        if ( cell.y + row >= 0 && cell.x + col >= 0
          && cell.x + col < this.state.cols.length
          && cell.y + row < this.state.cols[0].length
          && !this.state.cols[cell.x + col][cell.y + row].hasMine
          && !this.state.cols[cell.x + col][cell.y + row].isOpened) {
            this.open(_cols[cell.x + col][cell.y + row]);          
        }
      }
    }
  }
    //
    // handleClick() {
    //   console.log('clicked');
    //  
    // }
  
  render() {
    var Turfs = this.state.cols.map((col, index) => {
      const key = col + '_' + index;
      return (<Turf
        key={key}
        cells={col}
        open={this.open.bind(this)}
        mark={this.mark.bind(this)} />);
    });
    return (          
      <svg width="721" height="110">
        <g transform="translate(20, 20)">
          {Turfs}
        </g>
      </svg>);
  }
}
 
class GrassSweeper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      level: 'easy',
      mineNum: 10,
      colNum: 73,
      rowNum: 7,
      flagNum: 0,
      openNum: 0,
      time: 0,
      status: 'playing'
    };
  }
  componentWillUpdate() {
    if(this.state.status === 'playing') {
      this.judge();
    }
  }
  componentWillMount() {
    
  }
  judge() {
    if(this.state.mineNum + this.state.openNum >= this.state.rowNum * this.state.colNum) {
      this.setState( {state: 'Clear'} );
    }
  }
  // ゲームオーバー状態にする
  gameOver() {
    this.setState({ state: 'gameover'});
  }
  
  // 設定されているフラグを増減する
  checkFlagNum(updateNum) {
    this.setState({ flagNum: this.state.flagNum + updateNum })
  }
  addOpenNum() {}
  
  render() {
    return (<Grasses
      openNum={this.state.openNum}
      mineNum={this.state.mineNum}
      rowNum ={this.state.rowNum}
      colNum ={this.state.colNum}
      gameOver={this.gameOver.bind(this)}
      addOpenNum={this.addOpenNum.bind(this)} />);
  }
  
}

export default Radium(GrassSweeper);
