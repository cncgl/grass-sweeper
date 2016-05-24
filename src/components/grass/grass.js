import React, { Component } from 'react';

export default class Grass extends Component {
  constructor(props) {
    super(props);
    // console.log('Grass: ' + JSON.stringify(props));
    this.state = {
      hasMine: props.cell.hasMine,
      hasFlag: props.cell.hasFlag,
      isOpened: props.cell.isOpened,
      count: 0,
    };
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      isOpened: nextProps.cell.isOpened,
      hasMine: nextProps.cell.hasMine,
      hasFlag: nextProps.cell.hasFlag,
      count: nextProps.cell.count,
    });
  }
  open() {
    this.props.open(this.props.cell);
  }
  mark(e) {
    e.preventDefault();
    if (!this.state.isOpened) {
      this.props.mark(this.props.cell);
    }
  }
  _handleHighlight() {}
  // _handleClick() {}
  render() {
    const _this = this;
    const width = 11;
    const height = 11;
    const y = this.props.row * 13;
    const colors = ['#eeeeee', '#d6e685', '#bfea95', '#aae272', '#8cc665',
      '6ab123', '44a340', '1e6823', '0b470e'];
    let color = '#dfdfdf';
    if (_this.state.isOpened) {
      color = _this.state.hasMine ? '#ff0000' : colors[_this.state.count];
    } else if (_this.state.hasFlag) {
      color = '#0000ff';
    }
    return (
      <rect className="day"
        width={width}
        height={height}
        y={y}
        fill={color}
        onClick={this.open.bind(this)}
        onContextMenu={this.mark.bind(this)}
        onMouseEnter={this._handleHighlight.bind(this, null)}
        onMouseLeave={this._handleHighlight.bind(this, null)}
      />);
  }
}
Grass.propTypes = { cell: React.PropTypes.object, row: React.PropTypes.number,
  open: React.PropTypes.func, mark: React.PropTypes.func };
