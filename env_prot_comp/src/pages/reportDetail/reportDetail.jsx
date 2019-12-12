import React, { Component } from "react";
import StepLine from "./stepLine/stepLine";
import moment from "moment";
import { Toast } from "antd-mobile";
import MyFetch from "utils/apiFetch";
import HeaderBar from "common/HeaderBar/HeaderBar";
import "./reportDetail.less";
import { appId } from "../../config";

const starMapping = { 1: "满意", 2: "基本满意", 3: "不满意" };

export default class ReportDetail extends Component {
  constructor({ location, history }) {
    super();
    // console.log("数据", location, history);
    this.state = {
      isShowSwiper: false,     // 点击图片放大功能
      isShowEvaluate: false,  // 是否显示评价功能
      isRemark: false, // false(评价),true(展示评价类容)
      dataId: location.state.data.dataId,
      basicInfo: JSON.parse(location.state.data.data),
      timestamp: location.state.data.timestamp,
      status: "",  // 判断管理部门处理到了哪一步
      statusItem: {},
      attaInfoArray: [],
      firstReport: {},     // 如果判断用户以评价则会附值评价信息
      star: [0, 0, 0],
      starCount: 4,  // 3(不满意),2(基本满意),1(满意)
      content: "",     // 评论的类容
      reportTime: "",        // 评论的时间
      isExist: false,  // 判断投诉类容是否超出限定文本框
      isShowText: false,
      reportBasicInfo: { data: "{}" },
      attendFlow: [],             // 部门处理所以步骤
      polllsName: "",              // 投诉对象
      pollutionTypeID: "",        // 污染类型
      imageArray: [],             // 传给图片轮播页面数据
      isAvalaible: true,          // 防止多次点击产生多条数据
      height: document.documentElement.clientHeight,
    };
  }
  componentDidMount() {
    // const dataId = this.props.location.state.data;
    window.sc.userAuth({ appId: appId }, (res) => {
      if (res.code === 0) {
        this.getReportData(this.state.dataId);
      }
    });
  }
  componentWillUnmount() {
    clearTimeout(this.timer);
  }
  isLogin = (cb) => {
    window.sc.userAuth({ appId: appId }, (res) => {
      if (res.code === 0) {
        cb();
      }
    });
  };

  getReportData = (dataId) => {
    let params = { dataId: dataId };
    MyFetch.post("/sz/esz/tpa/complain/platform/getUserComplainDetails", params)
      .then(res => {
        if (res.data.data) {
          const last_data = res.data.data.length - 1;
          const firstReport = res.data.data[last_data];  // 管理部门现已处理的最后一步
          const reportBasicInfo = res.data.data[0];              // 管理部门现已处理的第一步（展示评价的信息）
          // console.log("第一条数据", reportBasicInfo);
          // console.log("最后一条数据", firstReport);
          const basicInfo = reportBasicInfo.dataMap;
          if (!reportBasicInfo.attaInfoArray) {
            reportBasicInfo.attaInfoArray = [];
          }
          const imageArray = reportBasicInfo.attaInfoArray;
          const { attaInfoArray } = reportBasicInfo;
          const { status } = firstReport;
          let statusItem = {};
          if (status.indexOf("shutdownBy") !== -1) {
            statusItem = this.getStatusTrainslatate(status, firstReport.dataMap.currentStatusID);
            if (statusItem.statusCode === "shutdownYes") {
              this.setState({ isShowEvaluate: true, isRemark: false });
            }
          } else {
            statusItem = this.getStatusTrainslatate(status, 0);
          }
          if (status.indexOf("evaluateBy") !== -1) {
            if (firstReport.dataMap.status === 1) {
              this.setState({ star: [1, 1, 1] });
            }
            if (firstReport.dataMap.status === 2) {
              this.setState({ star: [1, 1, 0] });
            }
            if (firstReport.dataMap.status === 3) {
              this.setState({ star: [1, 0, 0] });
            }
            res.data.data.splice(last_data, 1);
            const starCount = firstReport.dataMap.status;
            const content = firstReport.dataMap.content;
            const reportTime = firstReport.timestamp * 1000;
            this.setState({ starCount, content, reportTime, firstReport, isShowEvaluate: true, isRemark: true });
          }
          res.data.data && res.data.data.splice(0, 1);
          const attendFlow = res.data.data;
          console.log("部门处理循序", attendFlow, attendFlow.length);
          const polllsName = reportBasicInfo.dataMap.polllsName;
          const pollutionTypeID = reportBasicInfo.dataMap.pollutionTypeID;
          this.setState({ basicInfo, refreshing: false, imageArray, polllsName, pollutionTypeID, reportBasicInfo, attendFlow: attendFlow.reverse(), statusItem, attaInfoArray }, () => {
            // console.log("是否进入了这里2", this.state.attendFlow);
            const fatherDom = document.getElementsByClassName("text")[0];
            const childDom = document.getElementsByClassName("text_height")[0];
            if (fatherDom.clientHeight + 1 < childDom.clientHeight) {
              this.setState({ isExist: true });
            }
            // console.log(fatherDom.clientHeight, childDom.clientHeight);
            // console.log(this.state.attaInfoArray, typeof this.state.attaInfoArray);
          });
        }
      });
  };

  // 获取状态的翻译
  getStatusTrainslatate = (status, text) => {
    if (status.indexOf("uploadBy") !== -1) {
      return { statusCode: "upload", statusName: "待受理" };
    }
    if (status.indexOf("handlerBy") !== -1) {
      return { statusCode: "handling", statusName: "办理中" };
    }
    if (status.indexOf("shutdownBy") !== -1) {
      // console.log("文本2", text);
      if (text === "办理完成") {
        return { statusCode: "shutdownYes", statusName: "已办结" };
      } else {
        return { statusCode: "shutdownNo", statusName: "不受理" };
      }
    }
    if (status.indexOf("evaluateBy") !== -1) {
      return { statusCode: "shutdownYes", statusName: "已办结" };
    }
  };

  btnShow = () => {
    // const fatherDom = document.getElementsByClassName("text");
    if (this.state.isExist) {
      this.setState({ isShowText: !this.state.isShowText }, () => {
        // console.log(this.state.isShowText, fatherDom);
      });
    }
  };
  changeStyle(index) {
    if (index === 0) {
      if (this.state.star[0] === 0) {
        this.setState({ star: [1, 0, 0], starCount: 3 }, () => {
          // console.log("下标值", this.state.star, this.state.starCount);
        });
      }
      if (this.state.star[0] === 1) {
        this.setState({ star: [0, 0, 0], starCount: 4 }, () => {
          // console.log("下标值s", this.state.star, this.state.starCount);
        });
      }
    }
    if (index === 1) {
      if (this.state.star[1] === 0) {
        this.setState({ star: [1, 1, 0], starCount: 2 }, () => {
          // console.log("下标值2", this.state.star, this.state.starCount);
        });
      }
      if (this.state.star[1] === 1) {
        this.setState({ star: [0, 0, 0], starCount: 4 }, () => {
          // console.log("下标值2", this.state.star, this.state.starCount);
        });
      }
    }
    if (index === 2) {
      if (this.state.star[2] === 0) {
        this.setState({ star: [1, 1, 1], starCount: 1 }, () => {
          // console.log("下标值3", this.state.star, this.state.starCount);
        });
      }
      if (this.state.star[2] === 1) {
        this.setState({ star: [0, 0, 0], starCount: 4 }, () => {
          // console.log("下标值3", this.state.star, this.state.starCount);
        });
      }
    }
  }
  scrollTopAction = () => {                    // android手机软键盘遮盖
    if (/Android/i.test(navigator.appVersion)) {
      window.addEventListener("resize", function () {
        if (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA") {
          window.setTimeout(function () {
            document.activeElement.scrollIntoViewIfNeeded();
          }, 0);
        }
      });
    }
  };
  losefocusAction = () => {
    // console.log("触发了这个滚动事件");
    window.scroll(0, document.documentElement.clientHeight);
  };
  getTextAction = (e) => {
    const content = e.target.value;
    this.setState({ content });
  };
  upDateAction = () => {
    if (this.state.starCount === 4) {
      Toast.info("请选择满意程度 !", 2);
      return;
    }
    let params = {
      dataId: this.state.dataId,
      dataObject: {
        content: this.state.content,
        status: this.state.starCount,
        polllsName: this.state.polllsName,
        pollutionTypeID: this.state.pollutionTypeID
      }
    };
    // console.log("参数2", params);
    if (!this.state.isAvalaible) return;
    this.setState({ isAvalaible: false }, () => {
      this.isLogin(() => {
        MyFetch.post("/sz/esz/tpa/complain/platform/evaluate", params)
          .then(res => {
            // console.log(2222, res);
            if (res._success) {
              // console.log("评论结果", res);
              const reportTime = new Date();
              this.setState({ reportTime, starCount: this.state.starCount, isRemark: true });
            }
          });
      });
    });
  };
  goImagePage(index) {
    this.props.history.push("/tpa/complainRefer/reportDetail/image", { imageArray: this.state.imageArray, index: index });
  }

  goBack = () => {
    this.props.history.goBack();
  }

  render() {
    return (
      <div className="reportDetail">
        <HeaderBar
          goBack={this.goBack}
          title="投诉详情"
        />
        <div className="page-content">
          <div className="info">
            <div className="info_left">{`[${this.state.basicInfo.pollutionTypeID}]`}&nbsp;{this.state.basicInfo.polllsName}</div>&nbsp; &nbsp;
            <div className="info_right">
              <div className={`statu ${this.state.statusItem.statusCode}`}>{this.state.statusItem.statusName}</div>
              <div className={`status-wrapper ${this.state.statusItem.statusCode}`}></div>
            </div>
          </div>
          <div className="detail">
            <div className="title">投诉详情</div>
            <div className="other">
              <div className="time marg">
                <div className="timeKey">投诉时间</div>
                <div className="timeVal">{moment(this.state.timestamp).format("YYYY-MM-DD HH:mm")}</div>
              </div>
              <div className="time marg2">
                <div className="timeKey">投诉地址</div>
                <div className="timeVal">{this.state.basicInfo.address}</div>
              </div>
              <div className="showtext">
                <div className="textleft">投诉内容</div>
                <div className="text" style={{ maxHeight: this.state.isShowText ? "initial" : ".66rem" }}>
                  <div className="text_height">{this.state.basicInfo.complainContent}</div>
                  {
                    this.state.isExist ? <div>
                      {
                        !this.state.isShowText ? <div className="show">
                          <div className="show_left"></div>
                          <div className="show_right" onClick={this.btnShow}>
                            <div className="one"></div>
                            <div className="two">展开</div>
                          </div>
                        </div> : ""
                      }
                    </div> : ""
                  }
                  {
                    this.state.isExist ? <div>
                      {
                        this.state.isShowText ? <div className="show2" onClick={this.btnShow}>收起</div> : ""
                      }
                    </div> : ""
                  }
                </div>
              </div>
            </div>
          </div>
          <div className="showPhoto">
            <ul className="aul">
              {
                this.state.attaInfoArray && this.state.attaInfoArray.map((item, index) => {
                  return (
                    <li key={index} className="ali" onClick={() => this.goImagePage(index)}>
                      <img src={item.path} />
                    </li>
                  );
                })
              }
            </ul>
          </div>
          {
            this.state.attendFlow.length > 0 ? <div className="flow">
              <div className="title2">办理过程</div>
              <StepLine attendFlow={this.state.attendFlow} />
            </div> : ""
          }
          {
            this.state.isShowEvaluate ? <div className="rat">
              <div className="title">评价</div>
              {
                this.state.isRemark ? <div>
                  <div className="rating">
                    <div className="rating_left">
                      <div className="rating_name">评价</div>
                      {
                        this.state.star.map((item, index) => {
                          return (
                            <div key={index} className="star">
                              <i className={`iconfont ${item ? "paicon-selected_star" : "paicon-normal_star"}`}></i>
                            </div>
                          );
                        })
                      }
                    </div>
                    <div className="rating_right">{starMapping[this.state.starCount]}</div>
                  </div>
                  <div className="rating_time">{moment(this.state.reportTime).format("YYYY-MM-DD日 HH:mm")}</div>
                  <div className="rating_tent">{this.state.content}</div>
                </div> : <div>
                  <div className="rating">
                    <div className="rating_left">
                      <div className="rating_name">评价</div>
                      {
                        this.state.star.map((item, index) => {
                          return (
                            <div key={index} className="star" onClick={() => this.changeStyle(index)}>
                              <i className={`iconfont ${item ? "paicon-selected_star" : "paicon-normal_star"}`}></i>
                            </div>
                          );
                        })
                      }
                    </div>
                    <div className="rating_right"></div>
                  </div>
                  <div className="input">
                    <textarea type="text" maxLength={100} value={this.state.content} onChange={this.getTextAction} onClick={this.scrollTopAction} onBlur={this.losefocusAction} placeholder="请输入评价" />
                  </div>
                  <div className="butt" onClick={this.upDateAction}>提交</div>
                </div>
              }
            </div> : ""
          }
        </div>
      </div>
    );
  }
}
