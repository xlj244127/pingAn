import React, { Component } from "react";
import PropTypes from "prop-types";
import "./HeaderBar.less";

class HeaderBar extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};
  }


  render() {
    return (
      <div className="head">
        <div className="left" onClick={this.props.goBack}>
          <i className="iconfont paicon-return"></i>
        </div>
        <div className="center">{this.props.title}</div>
        <div className="right" onClick={this.props.rightEdit}>{this.props.rightVl}</div>
      </div>
    );
  }
}

HeaderBar.propTypes = {
  goBack: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  rightVl: PropTypes.string,
  rightEdit: PropTypes.func
};

HeaderBar.defaultProps = {
  rightVl: "",
  rightEdit: () => {}
};

export default HeaderBar;