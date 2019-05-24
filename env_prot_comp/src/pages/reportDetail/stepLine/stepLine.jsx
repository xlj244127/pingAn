import React, { Component } from "react";
import { Steps, WingBlank, WhiteSpace } from "antd-mobile";
import "./stepLine.less";

const Step = Steps.Step;
export default class StepLine extends Component {
  state = {
    isShow: false,      // 判断是否文本是否超出高度
    showTime: false,    // 判断文本状态是展开还是收起
    attendFlow: this.props.attendFlow,
  };

  componentDidMount() {
    // const textHeight = document.getElementsByClassName("text_Height")[0];
    // console.log("高度9", textHeight.clientHeight);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (JSON.stringify(this.props.attendFlow) !== nextProps.attendFlow) {
      this.setState({ attendFlow: nextProps.attendFlow }, () => {
        const fatherHeight = document.getElementsByClassName("father_height")[0];
        const childHeight = document.getElementsByClassName("child_height")[0];
        if (fatherHeight.clientHeight < childHeight.clientHeight) {
          this.setState({ isShow: true });
        }
        console.log("高度9", fatherHeight.clientHeight, childHeight.clientHeight);
      });
    }
  }
  showOrHid = () => {
    const showTime = !this.state.showTime;
    this.setState({ showTime });
  };
  render() {
    console.log("父组件传过来的值", this.props.attendFlow);
    return (
      <div>
        <div className="father_height" style={{ maxHeight: this.state.showTime ? "initial" : "1.4rem" }}>
          <WingBlank className="child_height" size="lg">
            <WhiteSpace />
            <Steps size="small" current={this.props.attendFlow.length}>
              {
                this.props.attendFlow.map((item, index) => {
                  return (
                    <Step
                      key={index}
                      status="progress"
                      title={
                        <div className="elm">
                          <div className="elm_left">
                            <div className="month">{item.dataMap.resultReplyTime.substr(5, 5)}</div>
                            <div className="day">{item.dataMap.resultReplyTime.substr(10, 6)}</div>
                          </div>
                          <div className="elm_right">{item.dataMap.currentStatusID}</div>
                        </div>
                      }
                      description={item.dataMap.illegalDesc}
                    />
                  );
                })
              }
            </Steps>
          </WingBlank>
        </div>
        {
          this.state.isShow ? <div className="showOrHid" onClick={this.showOrHid}>{this.state.showTime ? "收起" : "点击查看更多办理过程"}</div> : ""
        }
      </div>
    );
  }
}