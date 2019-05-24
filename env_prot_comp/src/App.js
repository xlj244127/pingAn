import React, { Component } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { changeRootFont } from "store/UI/action";
import { setOpenId } from "store/user/action";

import Home from "pages/Home/Home";
import ComplainRefer from "pages/complainRefer/complainRefer";
import ReportDetail from "pages/reportDetail/reportDetail";
import Swipe from "pages/swiper/swiper";
import NotFound from "pages/notFound/notFound";
import "asset/css/App.less";

class App extends Component {
  constructor(props) {
    super(props);
    this.setHtmlFontSize();
    this.state = {
      requestCode: "",
      name: "",
      mobile: "",
      userInfo: {},
    };
  }

  componentDidMount() {
    window.onresize = this.setHtmlFontSize;
    // const VConsole = require("vconsole");
    // this.vConsole = !this.vConsole && new VConsole();
  }

  setHtmlFontSize = () => {
    let html = document.documentElement;
    let bodyWidth = html.clientWidth;
    if (bodyWidth < 320) bodyWidth = 320;
    let fontSize = bodyWidth / 375 * 100;
    html.style.fontSize = fontSize + "px";
    this.props.changeRootFont(fontSize);
  };

  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/" exact render={() => <Redirect to="/home" />} />
          <Route path="/home" exact component={Home} />
          <Route path="/complainRefer" exact component={ComplainRefer} />
          <Route path="/complainRefer/reportDetail" exact component={ReportDetail} />
          <Route path="/complainRefer/reportDetail/image" exact component={Swipe} />
          <Route path="*" component={NotFound} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default connect(null, { changeRootFont, setOpenId })(App);
