import React, { Component } from 'react';
import Grass from './grass';

export default class Turf extends Component {
  constructor(props) {
    super(props);
    // console.log('Turf: '+ JSON.stringify(props));
    this.state = { cells: props.cells };
  }
  copmponentWillReceiveProps(nextProps) {
    this.setState({ cells: nextProps.cells });
  }
  render() {
    const _this = this;
    let Cells = this.state.cells.map((cell, index) => {
      // console.log('index: ' + index);
      const key = `turf_${index}`;
      return (
        <Grass
          key={key}
          cell={cell}
          row={index}
          open={_this.props.open}
          mark={_this.props.mark}
        />);
    });
    // console.log('x: '+ JSON.stringify(this.state.cells));
    let transStr = `translate(${this.state.cells[0].x * 13}, 0)`;
    return (<g transform={transStr}>{Cells}</g>);
  }
}
Turf.propTypes = { cells: React.PropTypes.array,
  open: React.PropTypes.func, mark: React.PropTypes.func };
