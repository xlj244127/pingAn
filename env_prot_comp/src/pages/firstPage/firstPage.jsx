import React, { Component } from "react";
import "./firstPage.less";
import logo from "../../asset/image/firstPage/logo.png";
import surrounding from "../../asset/image/firstPage/surrounding.png";
import air from "../../asset/image/firstPage/air.png";
import water from "../../asset/image/firstPage/water.png";
import noise from "../../asset/image/firstPage/noise.png";
import environment from "../../asset/image/firstPage/environment.png";
import vehicle from "../../asset/image/firstPage/vehicle.png";
import subsidies from "../../asset/image/firstPage/subsidies.png";
import information from "../../asset/image/firstPage/information.png";
import waste from "../../asset/image/firstPage/waste.png";

const navList = [
  { url: surrounding, title: "我的周边" }, { url: air, title: "空气质量" }, { url: water, title: "水质状况" }, { url: noise, title: "环境噪音" }
];

export default class FirstPage extends Component {
  state = {
  }

  componentDidMount() {
    if (window.sc.isSZSMT()) {
      // ｉ深圳平台
      window.sc.setToolBar({
        isHide: true,
        // isWebImmersive: true  // 开启沉降式
      });
    }
    else {
      // 其他平台
      this.props.history.push("/tpa/notFound", { text: "用户未登陆" });
    }
  }

  render() {
    return (
      <div className="firstPage">
        <div className="header">
          <div className="logo"><img src={logo} /></div>
          <div className="deparment">深圳市生态环境局</div>
          <div className="slogan">绿水青山救赎金山银山</div>
        </div>
        <div className="navBox">
          <div className="navList">
            {
              navList.map((item, index) => {
                return <div className="navOne" key={index}>
                  <img className="navImg" src={item.url} />
                  <div className="navTitle">{item.title}</div>
                </div>;
              })
            }
          </div>
        </div>
        <div className="allPart">
          <div className="onePart">
            <div className="partNav">
              <img className="partImg" src={environment} /> <span className="partTitle">环境投诉</span>
            </div>
            <div className="partContent">
              <div className="partBtn" onClick={() => this.props.history.push("/tpa/inform")}>
                <div className="btnName">随手拍投诉</div>
                <div className="btnTitle">在线投诉环境污染问题</div>
              </div>
              <div className="partBtn" onClick={() => this.props.history.push("/tpa/complainRefer")}>
                <div className="btnName">投诉事件查询</div>
                <div className="btnTitle">查询历史投诉记录</div>
              </div>
            </div>
          </div>
          <div className="line"></div>
          <div className="twoPart">
            <div className="partNav partNavTwo">
              <img className="partImg" src={vehicle} /> <span className="partTitle">机动车排放查询</span>
            </div>
            <div className="partContentTwo">
              <div className="partBtnTwo">
                <div className="btnNameTwo">机动车排放标准查询</div>
                <div className="btnTitleTwo">机动车排放标准查询</div>
              </div>
              <div className="partBtnTwo">
                <div className="btnNameTwo">黄绿标查询</div>
                <div className="btnTitleTwo">机动车环保标志记录</div>
              </div>
            </div>
          </div>
          <div className="line"></div>
          <div className="threePart">
            <div className="partNav partNavTwo">
              <img className="partImg" src={subsidies} /> <span className="partTitle">老旧车淘汰补贴</span>
            </div>
            <div className="partContentThree">
              <div className="partBtnThree">
                <div className="btnNameThree">补贴金额查询</div>
                <div className="btnTitleThree">老旧车淘汰可补贴金额查询</div>
              </div>
              <div className="partBtnThree">
                <div className="btnNameThree">在线预约</div>
                <div className="btnTitleThree">老旧车淘汰预约办理</div>
              </div>
            </div>
            <div className="partContentThree">
              <div className="partBtnThree">
                <div className="btnNameThree">预约查询</div>
                <div className="btnTitleThree">老旧车淘汰预约查询</div>
              </div>
              <div className="partBtnThree">
                <div className="btnNameThree">业务进度查询</div>
                <div className="btnTitleThree">老旧车淘汰办理进步记录</div>
              </div>
            </div>
          </div>
          <div className="line"></div>
          <div className="fourPart">
            <div className="partNav partNavTwo">
              <img className="partImg" src={information} /> <span className="partTitle">信息公开</span>
            </div>
            <div className="partContentFour">
              <div className="partBtnFour">
                <div className="btnNameFour">污染源分布</div>
              </div>
              <div className="partBtnFour partBtnFourTwo">
                <div className="btnNameFour">行政许可信息公开</div>
              </div>
            </div>
            <div className="partContentFour">
              <div className="partBtnFour">
                <div className="btnNameFour">污染源分布</div>
              </div>
            </div>
          </div>
          <div className="line"></div>
          <div className="fivePart">
            <div className="partNav partNavTwo">
              <img className="partImg" src={waste} /> <span className="partTitle">危险废物查询</span>
            </div>
            <div className="partContentFive">
              <div className="partBtnFive">
                <div className="btnNameFive">污染源分布</div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer">深圳市生态环境局提供服务</div>
      </div>
    );
  }
}
