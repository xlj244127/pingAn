import React, { Component } from "react";
import HeaderBar from "common/HeaderBar/HeaderBar";
import "./inform.less";

export default class Inform extends Component {
  state = {
    textList: [
      "环保投诉举报主要受理公众对环境污染问题的举报。受理的举报事项将由深圳市环境保护主管部门处理。",
      "一、对企事业单位和其他生产经营者，在生产建设或其他活动中产生废水、废气、固废、粉尘、恶臭、噪声等对环境造成污染的行为，公众可通过本举报平台进行举报。",
      "二、对不属于环境保护主管部门处理的事项；依法应通过诉讼、仲裁、行政复议等法定途径解决或已经进入上述程序的事项；申请行政机关履行法定职责的请求，不予受理。",
      "三、公众举报环境污染问题时，需提交图片，并附文字说明举报对象及污染情况，以便环保部门人员到达现场处理。",
      "四、需要通过语言描述反映污染问题的，对环境保护政策、法律、法规等有关问题进行咨询的，对所反映污染问题处理结果有疑问的，可拨打12369环保举报热线。",
      "五、为提高环保网络举报平台的运行效率，请不要重复提交相同的举报信息。",
      "六、提倡实名举报。",
      "七、请使用文明用语举报，对上传不良信息恶意举报的用户，将交当地公安机关依法处理"
    ],
    isShow: false,
    changeTime: 5,
  }

  componentDidMount() {
    if (window.sc.isSZSMT()) {
      // ｉ深圳平台
      // console.log("ｉ深圳平台");
      // 隐藏自带toolbar
      window.sc.setToolBar({
        isHide: true
      });
      this.changeTime();
    }
    else {
      // 其他平台
      // console.log("其他平台");
      this.props.history.push("/tpa/notFound", { text: "用户未登陆" });
    }
  }

  changeTime = () => {
    let s = 5;
    this.timer = setInterval(() => {
      if (s > 0 && s <= 5) {
        s--;
        this.setState({ changeTime: s });
      } else {
        this.setState({ isShow: true });
        clearInterval(this.timer);
      }
    }, 1000);
  }

  toHomeAction = () => {
    this.props.history.push("/tpa/home");
  }

  goBack = () => {
    window.sc.close();
  }

  render() {
    return (
      <div className="inform">
        <HeaderBar
          goBack={this.goBack}
          title="投诉告知说明"
        />
        <div className="inform-content">
          <div className="text-box">
            {
              this.state.textList.map((item, index) => {
                return <div className="text" key={index}>{item}</div>;
              })
            }
          </div>
          {
            this.state.isShow ? <div className="footerBottom2" onClick={this.toHomeAction}>
              <span>已阅读</span>
            </div> : <div className="footerBottom"><div className="footerBottom-1"><span>已阅读</span> (<span>{this.state.changeTime}</span>s)</div></div>
          }
        </div>
      </div>
    );
  }
}

// export default connect(state => ({ openId: state.User.openId }))(Inform);
