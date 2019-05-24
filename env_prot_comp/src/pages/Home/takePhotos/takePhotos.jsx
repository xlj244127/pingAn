import React, { PureComponent } from "react";
import "./takePhotos.less";
import { ImagePicker } from "antd-mobile";

export default class TakePhotos extends PureComponent {
  state = {
    files: this.props.attaInfos || [],
    // files: [
    //   {
    //     url: "https://zos.alipayobjects.com/rmsportal/PZUUCKTRIHWiZSY.jpeg",
    //     id: "2121",
    //   }
    // ],
    max: 0,
    isShowPopUp: false,
  };

  // 选择弹窗
  onAddImageClick = (e) => {
    e.preventDefault();
    this.setState({ isShowPopUp: true });
  };

  // 点击蒙层或点击取消关闭弹窗
  cancelAction = () => {
    this.setState({ isShowPopUp: false });
  };

  // 获取图片
  getPhoto = (sourceType) => {
    this.setState({ isShowPopUp: false, max: this.state.files.length }, () => {
      window.sc.chooseImage(
        {
          count: sourceType === "camera" ? this.state.max : 6 - this.state.max,
          sizeType: ["compressed"],
          sourceType: [sourceType]
        },
        (res) => {
          if (res.code === 0) {
            const files = res.data.map(item => ({
              url: `data:image/jpg;base64,${item.replace(/\s*/g, "")}`,
              hash: `jpg;${item}`
            }));
            this.setState({ files: [...this.state.files, ...files] }, () => this.props.getDate(this.state.files));
          }
        }
      );
    });
  }

  // 图片修改
  onChange = (files) => {
    this.setState({ files }, () => {
      this.props.getDate(this.state.files);
    });
  };

  render() {
    const { files } = this.state;
    return (
      <div>
        <div>
          <ImagePicker
            files={files}
            onChange={this.onChange}
            selectable={files.length <= 5}
            onAddImageClick={this.onAddImageClick}
          />
        </div>
        {
          this.state.isShowPopUp && <div className="fix">
            <div className="mengchen" onClick={this.cancelAction} />
            <div className="popbott">
              <div className="takePhoto">
                <div className="photo" onClick={() => this.getPhoto("camera")}>拍照</div>
                <div className="photo" onClick={() => this.getPhoto("album")}>从相册选择</div>
              </div>
              <div className="cancel" onClick={this.cancelAction}>取消</div>
            </div>
          </div>
        }
      </div>
    );
  }
}