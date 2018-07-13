const rp = require("request-promise");
const fs = require("fs");
const path = require("path");
const ocrClient = require("./aipOcrClient");
const crypto = require('crypto');

const hash = crypto.createHash('md5');

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

// 下载图片
function downloadImg(url, filename) {
  // 图片保存路径
  const imgURL = `${path.resolve(__dirname, "./img")}/${filename}`;
  rp({
    url: url,
    method: "GET",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36"
    }
  })
    .on("response", res => {
      if (res.statusCode === 200) {
        console.log(`img type: ${res.headers["content-type"]}`);
      } else {
        console.log("Sorry, can not get the img");
      }
    })
    .pipe(fs.createWriteStream(imgURL))
    .on("finish", res => {
      console.log("file already downloaded!");
    })
    .on("error", err => {
      if (err) throw err;
    });
}

// 从图片获取数字
function getNumFromImg(filename) {
  const img = fs.readFileSync(`${path.resolve(__dirname, './img')}/${filename}`).toString('base64');
  console.log(img)
  ocrClient.generalBasic(img).then(result => {
    console.log(result);
  });
}

// 生成随机文件名
function createRandomName() {
  const timestamp = new Date().getTime();
  const name = (Math.random() * 10000000000).toString();
  hash.update(name + timestamp);
  return hash.digest('hex');
}


module.exports = {
  check,
  getNumFromImg,
  downloadImg,
  createRandomName
};
