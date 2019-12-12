import React, { Component } from "react";
import "./notFound.less";

export default class NotFound extends Component {
  constructor({ location, history }) {
    super(location, history);
    // console.log("传的值", location, history);
    this.state = {
      text: location.state && location.state.text ? location.state.text : "未找到此页面",
    };
  }

  render() {
    return (
      <div className="not-found">
        <div>{this.state.text}</div>
      </div>
    );
  }
}

