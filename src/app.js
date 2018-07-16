const rp = require("request-promise");
const cheerio = require("cheerio");
const proxy = require("./model");
const utils = require("./utils");

// 获取快代理
async function fetchFastProxy(page) {
  for (let i = 1; i <= page; i++) {
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

// 获取米扑代理
async function fetchMiMvp(page) {
  for (let i = 1; i <= page; i++) {
    const url = `https://proxy.mimvp.com/free.php?proxy=in_hp&sort=&page=${ i }`;
    const baseUrl = 'https://proxy.mimvp.com/';
    await rp({
      url: url,
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36"
      }
    }).then(body => {
      const $ = cheerio.load(body);
      const trList = $(".table tbody tr");

      for (let i = 0; i < trList.length; i++) {
        const td = trList.eq(i).children("td");
        const ip = td.eq(1).text(); // 获取ip
        const portImg = baseUrl + td.eq(2).children('img').attr('src'); // 获取端口
        let protocol = td
          .eq(3)
          .text()
          .toLowerCase(); // 获取协议
        if(protocol > 5) {
          protocol = 'http';
        }
        const filename = `${ utils.createRandomName() }.png`;
        utils.downloadImg(portImg, filename).on('finish', async () => { // fs.createWriteStream完成时有一个finish事件，此时执行回调函数
          const port = await utils.getNumFromImg(filename); // 通过工具函数获取端口号
          utils.delImg(filename); // 获取端口号完成后删除文件
          const proxyObj = {ip, port, protocol};
          const res = await utils.check(proxyObj);  // 判断是否可用
          if(res) proxy.create(proxyObj); // 可用添加进入数据库
        })
      }
    });
  }
}
// 获取
function _main() {
  fetchFastProxy(1);
  fetchMiMvp(1)
}

_main();
