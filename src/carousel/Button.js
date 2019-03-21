import React, { Component } from 'react';

export default class Button extends Component {
  render() {
    const props = {
      className: `${this.props.className} ${this.props.isSliding ? ' disabled' : ''}`,
      onClick: this.props.onClick
    };
    return <div {...props} />;
  }
}
