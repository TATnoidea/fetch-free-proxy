const rp = require("request-promise");
const cheerio = require("cheerio");
const proxy = require("./model");
const utils = require("./utils");

// 获取快代理
async function fetchFastProxy() {
  for (let i = 1; i <= 20; i++) {
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
          const proxyObj = { ip, port, protocol }; // 实例化代理对象
          const res = await utils.check(proxyObj);
          if (res) proxy.create(proxyObj);
        }
      })
      .catch(err => {
        if (err) throw err;
        console.log(`Sorry, failed to send request to ${url}`);
      });
  }
}

// 获取
function _main() {
  fetchFastProxy();
}

_main();


