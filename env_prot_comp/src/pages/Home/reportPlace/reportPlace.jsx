import React, { Component } from "react";
import { List, Radio, InputItem } from "antd-mobile";
import UserLocation from "asset/image/user-location.png";
import SelectedLocation from "asset/image/selected-location.png";
import "./reportPlace.less";

const RadioItem = Radio.RadioItem;

export default class ReportPlace extends Component {
  state = {
    latitude: this.props.mapData.latitude,
    longitude: this.props.mapData.longitude,
    address: this.props.mapData.address,
    city: "",
    name: this.props.mapData.name,
    selected: this.props.mapData.name ? this.props.mapData.name : this.props.mapData.address,
    suggestion: [{
      lonlat: `${this.props.mapData.longitude} ${this.props.mapData.latitude}`,
      name: this.props.mapData.name ? this.props.mapData.name : this.props.mapData.address,
    }],
    isFirstTime: true,
    bounds: [113.667745922, 22.364291739, 114.727367497, 22.93907434], // 地图范围设置在深圳市
  };

  componentDidMount() {
    this.newMap();
  }

  newMap = () => {
    // 初始化地图
    this.map = new AMap.Map("container", {
      resizeEnable: true, // 是否监控地图容器尺寸变化
      center: [this.state.longitude, this.state.latitude],
      zoom: 13
    });
    // 加点
    this.marker = new AMap.Marker({
      map: this.map,
      icon: new AMap.Icon({
        image: UserLocation,
        imageSize: new AMap.Size(30, 30)
      }),
      position: [this.state.longitude, this.state.latitude],
    });

    // 限制地图显示范围
    const bounds = new AMap.Bounds([113.667745922, 22.364291739], [114.727367497, 22.93907434]);
    this.map.setLimitBounds(bounds);
    // 绑定地图移动与缩放事件
    this.map.on("dragend", this.getCenterPoint);

    this.map.on("zoomstart", () => this.abandonMove(false));
    this.map.on("zoomend", () => this.abandonMove(true));

    AMap.plugin(["AMap.Autocomplete", "AMap.PlaceSearch"], () => {
      const autoOptions = {
        city: "深圳", // 城市，默认全国
        pageSize: 20, // 单页显示结果条数
        pageIndex: 1, // 页码
        citylimit: true,  // 是否强制限制在设置的城市内搜索
        input: "keyWord", // 使用联想输入的input的id
      };
      this.autocomplete = new AMap.Autocomplete(autoOptions, this.tipAction);

      this.placeSearch = new AMap.PlaceSearch({
        city: "深圳", // 城市，默认全国
        pageSize: 50, // 单页显示结果条数
        pageIndex: 1, // 页码
        citylimit: true,  // 是否强制限制在设置的城市内搜索
      });
      AMap.event.addListener(this.autocomplete, "select", this.selectedAction);
    });
  };
  nearBy = (point) => {
    this.placeSearch.searchNearBy("", point, 500, (status, result) => {
      if (status === "complete" && result.info === "OK") {
        console.log("one", status, result);
        const suggestion = result.poiList.pois;
        const latitude = suggestion[0].location.lat;
        const longitude = suggestion[0].location.lng;
        const address = suggestion[0].address;
        const name = suggestion[0].name;
        this.setState({ suggestion, selected: suggestion[0].name, longitude, latitude, address, name });
      } else {
        this.setState({ suggestion: [] });
      }
    });
  }

  abandonMove = (flag) => {
    this.map.setCenter([this.state.longitude, this.state.latitude]);
    this.map.setStatus({ dragEnable: flag });
  }

  tipAction = () => {
    this.autocomplete.search(this.state.keyword, (status, result) => {
      console.log("two", status, result);
      if (status === "complete" && result.info === "OK") {
        this.map.getCity((info) => {
          console.log("区域", info);
          const city = info.city + info.district;
          this.setState({ city });
        });
        const latitude = result.tips[0].location.lat;
        const longitude = result.tips[0].location.lng;
        const address = result.tips[0].address;
        const name = result.tips[0].name;
        this.map.panTo([longitude, latitude]);
        this.setState({ suggestion: result.tips, selected: result.tips[0].name, latitude, longitude, address, name });
      } else {
        this.setState({ suggestion: [] });
      }
    });
  }
  selectedAction = (e) => {
    console.log("选中", e);
    this.map.getCity((info) => {
      console.log("区域", info);
      const city = info.city + info.district;
      this.setState({ city });
    });
    const latitude = e.poi.location.lat;
    const longitude = e.poi.location.lng;
    const address = e.poi.address;
    const name = e.poi.name;
    this.map.panTo([longitude, latitude]);
    this.setState({ latitude, longitude, address, name, selected: e.poi.name, keyword: null });
  }
  getCenterPoint = () => {
    console.log("进入了这里5");
    this.map.getCity((info) => {
      console.log("区域", info);
      const city = info.city + info.district;
      this.setState({ city });
    });
    const center = this.map.getCenter(); // 获取当前地图中心位置
    const point = [center.lng, center.lat];
    console.log(center);
    this.setState({ suggestion: [], keyword: null }, () => {
      this.nearBy(point);
    });
  }

  onInputChange = (e) => {
    this.setState({ keyword: e, isKeywordSearch: !!e, suggestion: [] }, () => {
      this.tipAction();
    });
  }
  onChange = (selected) => {
    console.log("进入了这里2", selected);
    this.map.getCity((info) => {
      console.log("区域", info);
      const city = info.city + info.district;
      this.setState({ city });
    });
    const latitude = selected.location.lat;
    const longitude = selected.location.lng;
    const address = selected.address;
    const name = selected.name;
    this.map.panTo([longitude, latitude]);
    this.setState({ latitude, longitude, address, name, selected: selected.name, keyword: null });
  };
  // ios input标签无法聚焦
  forFocus = () => {
    document.getElementById("keyWord").focus();
  }

  backAction = () => {
    this.props.getNewMapData(1);
  };

  configAction = () => {
    let addressInfo = {
      address: this.state.city + this.state.address,
      longitude: this.state.longitude,
      latitude: this.state.latitude,
      name: this.state.name,
    };
    this.props.getNewMapData(addressInfo);
  }
  render() {
    const hasResult = this.state.suggestion.length > 0;
    return (
      <div className="reportPlace">
        <div className="head">
          <div className="left" onClick={this.backAction}>
            <i className="iconfont paicon-return"></i>
          </div>
          <div className="center">举报位置</div>
          {
            !hasResult ? <div className="right"></div> : <div className="right" onClick={this.configAction}>确定</div>
          }
        </div>
        <div className="page-content fcn">
          <div id="container">
            <img className="selected-location-point" src={SelectedLocation} />
            <div className="fixed">
              <InputItem placeholder="搜索地点关键词" type="text" id="keyWord" value={this.state.keyword} onClick={this.forFocus} onChange={this.onInputChange} clear />
            </div>
          </div>
          <div id="suggestsDiv" className={`suggests fm ${hasResult ? "" : "df jcc"}`}>
            {hasResult
              ? <List>
                {this.state.suggestion.map((item, index) => (
                  <RadioItem key={index} checked={this.state.selected === item.name} onChange={() => this.onChange(item)}>
                    {item.name}
                  </RadioItem>
                ))}
              </List>
              : <span className="no-result">无结果</span>
            }
          </div>
        </div>
      </div>
    );
  }

}