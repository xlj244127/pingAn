import React, { Component } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { changeRootFont } from "store/UI/action";
import { setOpenId } from "store/user/action";

import FirstPage from "pages/firstPage/firstPage";
import Home from "pages/Home/Home";
import ComplainRefer from "pages/complainRefer/complainRefer";
import ReportDetail from "pages/reportDetail/reportDetail";
import Inform from "pages/inform/inform";
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
    const VConsole = require("vconsole");
    this.vConsole = !this.vConsole && new VConsole();
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
          <Route path="/tpa/" exact render={() => <Redirect to="/tpa/firstPage" />} />
          <Route path="/tpa/firstPage" exact component={FirstPage} />
          <Route path="/tpa/home" exact component={Home} />
          <Route path="/tpa/inform" exact component={Inform} />
          <Route path="/tpa/complainRefer" exact component={ComplainRefer} />
          <Route path="/tpa/complainRefer/reportDetail" exact component={ReportDetail} />
          <Route path="/tpa/complainRefer/reportDetail/image" exact component={Swipe} />
          <Route path="/tpa/*" component={NotFound} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default connect(null, { changeRootFont, setOpenId })(App);
