import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import TakePhotos from "./takePhotos/takePhotos";
import ReportPlace from "./reportPlace/reportPlace";
import { Checkbox, Flex, Toast, TextareaItem, ActivityIndicator } from "antd-mobile";
import MyFetch from "utils/apiFetch";
import "./home.less";
import { appId } from "../../config";

const AgreeItem = Checkbox.AgreeItem;
class Home extends Component {
  constructor() {
    super();
    this.state = {
      isPage: true,
      list: [],     // 污染类型列表
      active: 0,
      address: "",
      mapData: {},
      isShowPopUp: false,
      openId: "",
      attaInfos: [],          // 存放要上传的图片信息
      latitude: "",
      longitude: "",
      complainContent: "",  // 投诉类容
      polllsName: "",       // 投诉对象名称
      pollutionTypeID: "",  // 选中的污染类型
      complainPerson: "",  // 投诉人姓名
      realName: "",        // 投诉人姓名
      complainPhone: "",   // 投诉人电话
      anonymous: 0,  // 是否匿名(1)是(0)否
      isAvalaible: true,
      animating: false
    };
  }
  componentDidMount() {
    this.polluteType();
    this.getConfig();
    this.onReady();
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

  onReady = () => {
    window.sc.ready(() => {
      window.sc.userAuth({ appId: appId }, (res) => {
        console.log("得到openId", res);
        if (res.code === 0) {
          this.setupAccessToken(res.data.requestCode);
          this.setState({ openId: res.data.openId });
        }
      });
      // 隐藏自带toolbar
      window.sc.setToolBar({
        isHide: true
      });
      // 得到定位信息
      window.sc.gps((res) => {
        if (res.code === 0) {
          console.log("得到定位信息", res);
          this.setState({ mapData: res.data, address: res.data.address, latitude: res.data.latitude, longitude: res.data.longitude });
        }
      });
    });
  };
  // 得到userAccessToken
  setupAccessToken = (params) => {
    MyFetch.post("/sz/esz/tpa/open/platform/checkRequestCode", params)
      .then(res => {
        console.log("得到token值", res);
        this.info(res.data.userAccessToken);
      });
  };
  // 得到个人信息
  info = (param) => {
    MyFetch.post("/sz/esz/tpa/open/platform/getUserInfo", param)
      .then(res => {
        console.log("用户信息", res);
        if (res.data.data.userName) {
          this.setState({ realName: res.data.data.userName });
        }
        this.setState({ complainPerson: res.data.data.loginName, complainPhone: res.data.data.mobileNo });
      });
  };
  // 得到污染类型
  polluteType = () => {
    MyFetch.post("/sz/esz/tpa/complain/platform/getPollutionTypes")
      .then(res => {
        console.log("污染类型", res);
        this.setState({ list: res.data, pollutionTypeID: res.data[0] });
      });
  };

  selectedStatu = (index) => {
    console.log(index);
    this.setState({ active: index, pollutionTypeID: this.state.list[index] }, () => {
      console.log(this.state.pollutionTypeID);
    });
  };
  configAction = () => {
    this.state.isSuccess && this.props.history.push("/complainRefer");
    this.setState({ isShowPopUp: false });
  };
  submitValidate = () => {
    console.log("openId", this.state.openId);
    this.isLogin(() => {
      if (this.state.complainContent === "") {
        Toast.info("请输入投诉内容 !", 2);
        return;
      }
      if (this.state.polllsName === "") {
        Toast.info("请输入投诉对象名称 !", 2);
        return;
      }
      if (this.state.anonymous === 0) {  // 不匿名的情况
        if (this.state.complainPerson === "" && this.state.realName === "") {
          Toast.info("请输入举报人姓名 !", 2);
          return;
        }
        if (this.state.complainPhone === "") {
          Toast.info("请输入举报人电话 !", 2);
          return;
        }
        const phonetest = /^\d{7,11}$/;
        if (!phonetest.test(this.state.complainPhone)) {
          Toast.info("电话号码输入错误，请重新输入 !", 2);
          return;
        }
      }
      this.uploadImage();
    });
  };

  uploadImage = () => {
    this.setState({ animating: true });
    if (!this.state.attaInfos || this.state.attaInfos.length === 0) {
      this.submitAction();
      return;
    }
    const imageHash = this.state.attaInfos.map(item => item.hash);
    MyFetch.post("/sz/esz/tpa/complain/platform/uploadImages", imageHash.join(","))
      .then(res => {
        this.submitAction(res.data);
      });
  }

  submitAction = (attaInfos = []) => {
    const params = {
      attaInfos,
      domainId: this.state.openId,
      dataObject: {
        address: this.state.address,
        latitude: this.state.latitude,
        longitude: this.state.longitude,
        anonymous: this.state.anonymous, // 是否匿名
        complainContent: this.state.complainContent, // 投诉人类容
        complainPerson: this.state.realName !== "" ? this.state.realName : this.state.complainPerson,  // 投诉人姓名
        complainPhone: this.state.complainPhone,   // 投诉人电话
        polllsName: this.state.polllsName, // 投诉对象名称
        pollutionTypeID: this.state.pollutionTypeID, // 污染类型
      }
    };
    console.log("得到参数", params);
    if (!this.state.isAvalaible) return;
    this.setState({ isAvalaible: false });
    MyFetch.post("/sz/esz/tpa/complain/platform/complaint", params)
      .then(res => {
        console.log("请求返回值", res);
        this.setState({ isSuccess: res._success, message: res.message, isShowPopUp: true, isAvalaible: true, animating: false });
      });
  }

  complainContent = (val) => {
    const complainContent = val;
    this.setState({ complainContent });
  };
  addDate = (params) => {
    this.setState({ attaInfos: params });
  };
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
    console.log("触发了这个滚动事件");
    window.scroll(0, document.documentElement.clientHeight);
  };
  getComppanyName = (e) => {
    const polllsName = e.target.value;
    this.setState({ polllsName });
  };
  getPersonName = (e) => {
    const complainPerson = e.target.value;
    this.setState({ realName: complainPerson, complainPerson });
  };
  getPhone = (e) => {
    const complainPhone = e.target.value;
    this.setState({ complainPhone });
  };
  isCheck = () => {
    if (this.state.anonymous === 0) {
      this.setState({ anonymous: 1 });
    } else {
      this.setState({ anonymous: 0 });
    }
  };
  changeIsPage = () => {
    this.setState({ isPage: false });
  };
  getNewMapData = (param) => {
    console.log("得到了地图组件传过来的值", param);
    if (param === 1) {
      this.setState({ isPage: true });
    } else {
      this.setState({ isPage: true, mapData: param, polllsName: param.name, address: param.address, longitude: param.longitude, latitude: param.latitude });
    }
  };
  goBack = () => {
    window.sc.close();
  }
  isLogin = (cb) => {
    window.sc.userAuth({ appId: appId }, (res) => {
      if (res.code === 0) {
        cb();
      }
    });
  }

  render() {
    console.log("render", this.state.attaInfos);
    const homePage = <div className="home">
      <div className="head">
        <div className="left">
          <i className="iconfont paicon-return" onClick={this.goBack}></i>
        </div>
        <div className="center">投诉举报</div>
        <div className="right" onClick={this.submitValidate}>提交</div>
      </div>
      <div className="page-content">
        <div className="input">
          <TextareaItem
            value={this.state.complainContent}
            onChange={this.complainContent}
            placeholder="请输入投诉内容(500字)"
            rows={5}
            count={500}
          />
        </div>
        <div className="phone_title">图片(选填，最多上传6张)</div>
        <div className="phone">
          <TakePhotos attaInfos={this.state.attaInfos} getDate={this.addDate} />
        </div>
        <div className="phone_title">选择类型</div>
        <div className="tagList">
          <div className="tag-container">
            {
              this.state.list.map((item, index) => {
                return <div refs="tag" className={`tag ${this.state.active === index ? "active" : ""}`} key={index} onClick={() => { this.selectedStatu(index) }}>{item}</div>;
              })
            }
          </div>
        </div>
        <div className="line"></div>
        <div className="info">
          <ul className="aul">
            <li className="ali">
              <div className="ali_left">投诉对象地址</div>
              <div className="ali_right3" onClick={this.changeIsPage}>
                <span className="address">{this.state.address}</span>
                <div className="gps">
                  <i className="iconfont paicon-positioning"></i>
                </div>
              </div>
            </li>
            <li className="ali">
              <div className="ali_left">投诉对象名称</div>
              <div className="ali_right">
                <input type="text" maxLength={30} value={this.state.polllsName} onChange={this.getComppanyName} onClick={this.scrollTopAction} onBlur={this.losefocusAction} placeholder="请输入投诉对象名称" />
              </div>
            </li>
            {
              this.state.anonymous === 0 ? <li className="ali">
                <div className="ali_left">举报人姓名</div>
                <div className="ali_right">
                  <input type="text" maxLength={20} value={this.state.realName === "" ? this.state.complainPerson : this.state.realName} onChange={this.getPersonName} onClick={this.scrollTopAction} onBlur={this.losefocusAction} placeholder="请输入举报人姓名" />
                </div>
              </li> : <li className="ali">
                <div className="ali_left2">举报人姓名</div>
                <div className="ali_right2">{this.state.realName === "" ? this.state.complainPerson : this.state.realName}</div>
              </li>
            }
            {
              this.state.anonymous === 0 ? <li className="ali">
                <div className="ali_left">举报人电话</div>
                <div className="ali_right">
                  <input type="tel" maxLength={11} value={this.state.complainPhone} onChange={this.getPhone} onClick={this.scrollTopAction} onBlur={this.losefocusAction} placeholder="请输入举报人电话" />
                </div>
              </li> : <li className="ali">
                <div className="ali_left2">举报人电话</div>
                <div className="ali_right2">{this.state.complainPhone}</div>
              </li>
            }
          </ul>
        </div>
        <div className="bottom df aic">
          <Flex>
            <Flex.Item>
              <AgreeItem onClick={this.isCheck}>
                匿名举报
              </AgreeItem>
            </Flex.Item>
          </Flex>
        </div>
      </div>
      {
        this.state.isShowPopUp && <div className="side">
          <div>
            <div className="mengchen"></div>
            <div className="popout fcn">
              <div className="top fm df jcc">{this.state.isSuccess ? <div className="top_box"><div className="top_shan">您的投诉已提交</div><div className="top_xia">请通过投诉查询关注进展</div></div> : (this.state.message || "投诉失败")}</div>
              <div className="bottom df jcc aic" onClick={this.configAction}>确定</div>
            </div>
          </div>
        </div>
      }
      <ActivityIndicator toast text="提交中...." animating={this.state.animating} />
    </div>;
    return (
      <div>
        {
          this.state.isPage ? homePage : <ReportPlace mapData={this.state.mapData} getNewMapData={this.getNewMapData} />
        }
      </div>
    );
  }
}

export default connect(state => ({ openId: state.User.openId, info: state.User.info }))(withRouter(Home));