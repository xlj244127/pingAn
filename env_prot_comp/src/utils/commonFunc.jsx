const commonFunc = {
  setCookie(key, value, expireTime = 24 * 60 * 60 * 1000) {
    const expire = new Date();
    expire.setTime(expire.getTime() + expireTime);
    document.cookie = `${key}=${escape(value)};expires=${expire.toGMTString()};path=/;`;
  },

  getCookie(key) {
    const reg = new RegExp(`(^|)*${key}=([^;]*)(;|$)`);
    const result = document.cookie.match(reg);
    return result ? unescape(result[2]) : null;
  },

  removeCookie(key) {
    const expire = new Date();
    expire.setTime(expire.getTime() - 24 * 60 * 60 * 1000);
    const result = this.getCookie(key);
    if (result) {
      document.cookie = `${key}=${escape(result)};expires=${expire.toGMTString()};path=/`;
    }
  },
};

export default commonFunc;