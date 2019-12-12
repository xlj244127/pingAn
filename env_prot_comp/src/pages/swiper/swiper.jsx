import React, { Component } from "react";
import { WingBlank, Carousel } from "antd-mobile";
import "./swiper.less";

export default class Swipe extends Component {
  constructor({ location }) {
    super();
    this.state = {
      data: location.state.imageArray || [],
      selectedIndex: location.state.index,
      isLone: true
    };
  }
  componentDidMount() {
    // console.log("得到的值", this.props.location);
    if (this.props.location.state.imageArray.length === 1) {
      this.setState({ isLone: false });
    } else {
      this.setState({ isLone: true });
    }
  }
  render() {
    // console.log("进入了这里33333", this.state.isLone, this.state.data, this.state.selectedIndex);
    return (
      <WingBlank
        style={{ width: "100%", height: "100%", margin: 0, padding: 0, background: "#000", overflow: "hidden" }}
      >
        {
          this.state.isLone ? <Carousel
            autoplay={false}
            infinite
            selectedIndex={this.state.selectedIndex}
          >
            {this.state.data.map((val, index) => (
              <a
                onClick={() => this.props.history.goBack()}
                key={index}
                style={{ display: "inline-block", width: "100%", height: window.innerHeight, position: "relative" }}
              >
                <img
                  src={val.path}
                  alt=""
                  style={{ width: "100%", top: "50%", position: "absolute", transform: "translateY(-50%)" }}
                />
              </a>
            ))}
          </Carousel> : <a
            onClick={() => this.props.history.goBack()}
            style={{ display: "inline-block", width: "100%", height: window.innerHeight, position: "relative" }}
          >
            <img
              src={this.state.data[0].path}
              alt=""
              style={{ width: "100%", top: "50%", position: "absolute", transform: "translateY(-50%)" }}
            />
          </a>
        }
      </WingBlank>
    );
  }
}
