const rp = require('request-promise');

// 检测代理是否可用
function check(proxy) {
  const url = "http://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js";
  const proxyURL = `${proxy.protocol}://${proxy.ip}:${proxy.port}`;
  return (
    rp({
      url: url,
      method: "GET",
      resolveWithFullResponse: true, // 返回完整的响应，否则只返回响应体
      proxy: proxyURL,
      timeout: 20000
    })
      // 请求成功
      .then(res => {
        if (res.statusCode === 200) {
          console.log(`Congratulations, ${proxyURL} works!`);
          return true;
        }
        console.log(`Sorry, ${proxyURL} doesn't return 200`);
        return false;
      })
      // 请求失败
      .catch(err => {
        if (err) {
          console.log(`Sorry, ${proxyURL} doesn't work, ${err}`);
          return false;
        }
      })
  );
}

module.exports = {
  check
}