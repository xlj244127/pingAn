import React, { Component } from "react";
// import { Tag } from "antd-mobile";
import "./tagList.less";

function onChange(selected) {
  console.log(`tag selected: ${selected}`);
}
export default class TagList extends Component {
  state = {
    list: []
  };
  componentDidMount() {

  }

  render() {
    return (
      <div className="tag-container">
        {
          this.state.list.map((item, index) => {
            return <div className="tag" key={index} onChange={onChange}>{item}</div>;
          })
        }
      </div>
    );
  }

}