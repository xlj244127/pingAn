import "whatwg-fetch";
import commonFunc from "utils/commonFunc";

let hasCommonAPI = false; // 网关前缀开关
let hasCommonAPIInTest = false; // 本地测试也需要网关前缀时开启
// const AuthIP = "http://30.99.142.190:8580"; // 本地开发中登出修改密码等接口需要调用的地址

// 西丽云
// const AuthIP = "http://113.96.62.75:30005"; // 本地开发中登出修改密码等接口需要调用的地址

let MyFetch = {
  host: "http://112.74.60.217:30346" // 外网的隨手拍ip地址
  // host: "http://192.168.192.205:30346" // 京偉本地的隨手拍ip地址
};

if (process.env.NODE_ENV === "production") { // 打包编译时，自动设置host为空，网关前缀为true
  MyFetch.host = "";
  hasCommonAPI = true;
  hasCommonAPIInTest = false;
}

const getCommonApi = () => {
  if (!hasCommonAPI) return "";
  return "/tpa";
};

const getHost = () => {
  if (hasCommonAPI && !hasCommonAPIInTest) return "";
  return MyFetch.host;
};

const defaultHeaders = {
  "Accept": "application/json",
  "Content-Type": "application/json",
};

const handleResponse = (response, resolve, reject) => {
  /* 这里后端返回值中使用code作为判断依据，code值为0成功，其他值需于后端确认。
   * 若不使用code，_success根据response.ok的值来确认，错误代码判断根据response.status判断
   */
  return response.json()
    .then(json => {
      const result = {
        _success: json.code === 0 || json.code === 200,
        data: json.data,
        status: response.status,
        statusText: response.statusText,
        code: json.code,
        message: json.msg
      };
      // TODO: 在下方通过if或switch进行各种已知错误代码code处理
      // code = 401 尚未登录
      if (json.code === 401) {
        sessionStorage.removeItem("user");
        window.location.reload(true);
        reject(result);
      }
      resolve(result);
    });
};

const handleCatch = (err, reject) => {
  let error = err;
  if (typeof err === "object") {
    console.error(err.message);
  } else {
    console.error(err);
    error = { _success: false, message: err };
  }
  reject(error);
};

const doFetch = (api, method, body, header = defaultHeaders) => new Promise((resolve, reject) => {
  const url = `${getHost()}${getCommonApi()}${api}`;
  const options = {
    method: method,
    headers: { ...header, "token": commonFunc.getCookie("token"), "tkUserToken": commonFunc.getCookie("token"), "userType": commonFunc.getCookie("userType") },
    body
  };
  fetch(url, options)
    .then(response => response)
    .then(response => handleResponse(response, resolve, reject))
    .catch(err => handleCatch(err, reject));
});

// 将URL中的参数名替换成对应的值
const getApi = (url, params) => {
  if (!params || typeof params !== "object") return url;
  const api = Object.keys(params).reduce((accUrl, key) => {
    const keyReg = new RegExp(`:${key}\\??`);
    return accUrl.replace(keyReg, params[key]);
  }, url.trim()).replace(/\/:([\w]*)\??/g, "");
  return api;
};

MyFetch.get = (url, params, header) => {
  let api = getApi(url, params);
  if (params && typeof params === "object") {
    const paramsArray = [];
    Object.keys(params).forEach(key => paramsArray.push(`${key}=${params[key]}`));
    if (api.search(/\?/) === -1) {
      api += `?${paramsArray.join("&")}`;
    } else {
      api += `&${paramsArray.join("&")}`;
    }
  }
  return doFetch(api, "GET", null, header);
};

MyFetch.post = (url, params, header) => {
  const api = getApi(url, params);
  const body = typeof params === "object" ? JSON.stringify(params) : params;
  return doFetch(api, "POST", body, header);
};

MyFetch.upload = (url, params, header = {}) => {
  const api = getApi(url, params);
  return doFetch(api, "POST", params, header);
};

MyFetch.put = (url, params, header) => {
  const api = getApi(url, params);
  const body = typeof params === "object" ? JSON.stringify(params) : params;
  return doFetch(api, "PUT", body, header);
};

MyFetch.delete = (url, params, header) => {
  const api = getApi(url, params);
  const body = typeof params === "object" ? JSON.stringify(params) : params;
  return doFetch(api, "DELETE", body, header);
};

MyFetch.download = (api, params = "", headers = defaultHeaders) => {
  let url = api.indexOf("http://") > -1 ? api : `${MyFetch.host}${getCommonApi(api)}${api}`;
  if (params) {
    const paramsArray = Object.keys(params).map(key => `${key}=${params[key]}`);
    if (url.search(/\?/) === -1) {
      url += `?${paramsArray.join("&")}`;
    } else {
      url += `&${paramsArray.join("&")}`;
    }
  }
  window.open(url);
};

export default MyFetch;
