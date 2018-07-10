const rp = require("request-promise");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");

// 获取快代理
async function fetchFastProxy(proxyArr) {
  for (let i = 1; i <= 1; i++) {
    const url = `https://www.kuaidaili.com/free/inha/${i}/`;
    await rp({
      url: url,
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36"
      }
    })
      .then(async body => {
        const $ = cheerio.load(body);
        const trList = $(".table tbody tr");

        for (let i = 0; i < trList.length; i++) {
          const td = trList.eq(i).children("td");
          const ip = td.eq(0).text(); // 获取ip
          const port = td.eq(1).text(); // 获取端口
          const protocol = td
            .eq(3)
            .text()
            .toLowerCase(); // 获取协议
          const proxy = new PROXY(ip, port, protocol); // 实例化代理对象
          const res = await check(proxy);
          if (res) proxyArr.push(proxy);
        }
        console.log(proxyArr);
      })
      .catch(err => {
        if (err) throw err;
        console.log(`Sorry, failed to send request to ${url}`);
      });
  }
}
// 代理对象构造函数
function PROXY(ip, port, protocol = "http") {
  this.ip = ip;
  this.port = port;
  this.protocol = protocol;
}

// 检测是否可用
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

// 保存代理到json文件中
function saveProxyToJSON(proxyArr) {
  const fileURL = path.resolve(__dirname, "./data/proxy.json"); //  文件地址
  if (fs.existsSync(fileURL)) {
    const fileData = JSON.parse(fs.readFileSync(fileURL)); // 读取文件数据
    const data = JSON.stringify(fileData.concat(data)); // 合并数组并转为字符串格式
    fs.writeFile(fileURL, data, err => {
      if (err) throw err;
      console.log("Append success!");
    });
  } else {
    const data = JSON.stringify(proxyArr);
    fs.writeFile(fileURL, data, { flag: "w+" }, err => {
      if (err) throw err;
      console.log('Success');
    });
  }
}

async function _main() {
  const proxyArr = [];
  await fetchFastProxy(proxyArr);
  saveProxyToJSON(proxyArr);
}

_main();
