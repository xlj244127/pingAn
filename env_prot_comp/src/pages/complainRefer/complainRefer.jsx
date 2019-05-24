import React, { Component } from "react";
import { connect } from "react-redux";
import MyFetch from "utils/apiFetch";
import { ListView, PullToRefresh } from "antd-mobile";
import HeaderBar from "common/HeaderBar/HeaderBar";
import "./complainRefer.less";
import moment from "moment";
import { appId } from "../../config";

function ComplainListBody(props) {
  return (
    <div className="am-list-body comp-list-body">
      <span style={{ display: "none" }}>you can custom body wrap element</span>
      {props.children}
    </div>
  );
}

class ComplainRefer extends Component {
  constructor(props) {
    super(props);

    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });

    this.state = {
      dataSource,
      openId: "",
      pageSize: 10,
      listData: [],
      lastTimeStamp: "",
      hasMore: false,
      disappear: true,
    };

    this.data = [];
  }

  componentDidMount() {
    console.time("stat");
    this.getConfig();
    window.sc.ready(() => {
      // 隐藏自带toolbar
      window.sc.setToolBar({
        isHide: true
      });
      window.sc.userAuth({ appId: appId }, (res) => {
        console.log("得到openId", res);
        if (res.code === 0) {
          console.timeEnd("stat");
          this.setState({ openId: res.data.openId }, () => {
            const newTime = new Date().getTime();
            console.log("时间", newTime);
            this.getData(newTime);
          });
        }
      });
    });
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }
  timer2() {                      // 列表还有下一页的时候让其显示，三秒后再隐藏
    this.timer = setTimeout(() => {
      this.setState({ disappear: false });
    }, 2000);
  }
  getConfig = () => {
    MyFetch.post("/sz/esz/tpa/open/platform/getInitCode")
      .then(res => {
        console.log("成功回調", res);
        console.log("傳入的值", appId, res.data);
        window.sc.config({ debug: false, appId: appId, initCode: res.data, nativeApis: ["gps", "chooseImage", "openLocation"] });
      })
      .catch(err => {
        console.log(err);
      });
  };

  getData = (timeStamp) => {
    const params = {
      domainId: this.state.openId,
      pageSize: this.state.pageSize,
      startTimestamp: timeStamp
    };
    console.time("stat");
    MyFetch.post("/sz/esz/tpa/complain/platform/getUserComplainData", params)
      .then(res => {
        console.log("投诉列表数据", res);
        console.timeEnd("stat");
        const listData = res.data.dataBody;
        const last_length = res.data.dataBody.length - 1;
        if (last_length + 1 < this.state.pageSize) {  // 证明列表数据没有下一页了
          this.setState({ hasMore: true }, this.timer2);
        }
        const lastTimeStamp = res.data.dataBody[last_length].timestamp;
        this.setState({ refreshing: false, listData, lastTimeStamp, dataSource: this.state.dataSource.cloneWithRows(listData) }, () => {
          console.log("投诉列表2", this.state.lastTimeStamp, this.state.dataSource);
        });
      })
      .catch(err => {
        console.log(err);
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
      console.log("文本", text);
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
  isLogin = (cb) => {
    window.sc.userAuth({ appId: appId }, (res) => {
      if (res.code === 0) {
        cb();
      }
    });
  };
  onRefresh = () => {
    this.setState({ refreshing: true, hasMore: false }, () => {
      this.timer = setTimeout(() => {
        const newTime = new Date().getTime();
        this.isLogin(() => {
          this.getData(newTime);
        });
      }, 1000);
    });
  };

  onEndReached = (event) => {
    if (this.state.hasMore) {
      console.log("++++++++++++++++++++++++++++++++++++++++");
      return;
    }
    this.setState({ disappear: true });     // 列表还有下一页的时候让其显示
    this.timer = setTimeout(() => {
      const params = {
        domainId: this.state.openId,
        pageSize: this.state.pageSize,
        startTimestamp: this.state.lastTimeStamp,
      };
      console.log("下拉调接口参数", params);
      this.isLogin(() => {
        MyFetch.post("/sz/esz/tpa/complain/platform/getUserComplainData", params)
          .then(res => {
            console.log("下拉后投诉列表的数据", res);
            const last_length = res.data.dataBody.length - 1;
            console.log("数据长度", last_length);
            if (last_length + 1 < this.state.pageSize) {  // 证明列表数据没有下一页了
              this.setState({ hasMore: true }, this.timer2);
            }
            const lastTimeStamp = res.data.dataBody[last_length].timestamp;
            const dataBody = [...this.state.listData, ...res.data.dataBody];
            this.setState({ lastTimeStamp, listData: dataBody, dataSource: this.state.dataSource.cloneWithRows(dataBody) });
          })
          .catch(err => {
            console.log(err);
          });
      });
    }, 1000);
  };

  toDetail = (rowData) => {
    this.isLogin(() => {
      this.props.history.push("/complainRefer/reportDetail", { data: rowData });
    });
  }

  goBack = () => {
    window.sc.goback();
  };

  render() {
    console.log(this.state.openId);
    const row = (rowData, sectionID, rowID) => {
      const complainInfo = rowData.data.replace(/\{|\}/g, "").split(",").reduce((obj, value) => {
        let arr = value.split(":");
        obj[arr[0].replace(/\"/g, "")] = String(arr[1]).replace(/"/g, "");
        return obj;
      }, {});
      // console.log("complainInfo", complainInfo, "text", rowData);
      const time = moment(rowData.timestamp).format("YYYY-MM-DD HH:mm");
      let statusObj = {};
      if (rowData.status && rowData.status.indexOf("shutdownBy") !== -1) {
        statusObj = this.getStatusTrainslatate(rowData.status, JSON.parse(rowData.data).currentStatusID);
        console.log(rowData.currentStatusID);
      } else {
        statusObj = this.getStatusTrainslatate(rowData.status, "");
      }
      return (
        <div key={rowID} className="ali" onClick={() => this.toDetail(rowData)}>
          <div className="ali_left">
            <div className="left_top" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>[{complainInfo.pollutionTypeID}] &nbsp; {complainInfo.polllsName}</div>
            <div className="left_bottom">{time}</div>
          </div>
          <div className="ali_right">
            <div className={`statu ${statusObj.statusCode}`}>{statusObj.statusName}</div>
            <div className={`status-wrapper ${statusObj.statusCode}`}></div>
          </div>
        </div>
      );
    };

    return (
      <div className="complainRefer">
        <HeaderBar
          goBack={this.goBack}
          title="投诉查询"
        />
        <div className="page-content">
          <ListView
            ref={el => { this.lv = el }}
            dataSource={this.state.dataSource}
            renderHeader={null}
            renderFooter={() => (this.state.disappear ? <div style={{ padding: 30, textAlign: "center" }}>
              {this.state.hasMore ? "已无更多数据" : "加载中"}
            </div> : "")}
            renderBodyComponent={() => <ComplainListBody />}
            renderRow={row}
            style={{
              height: "100%",
              overflow: "auto",
            }}
            pageSize={this.state.pageSize}
            onScroll={() => { console.log("scroll") }}
            pullToRefresh={<PullToRefresh
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />}
            scrollRenderAheadDistance={500}
            onEndReached={this.onEndReached}
            onEndReachedThreshold={10}
            contentContainerStyle={{ width: "100%" }}
          />
        </div>
      </div>
    );
  }
}

export default connect(state => ({ openId: state.User.openId }))(ComplainRefer);