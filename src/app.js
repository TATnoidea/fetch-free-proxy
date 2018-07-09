const request = require("request");
const cheerio = require("cheerio");

let proxyArr = [];

function fetchFastProxy() {
  for (let i = 1; i <= 10; i++) {
    const url = `https://www.kuaidaili.com/free/inha/${i}`;
    request(
      {
        url: url,
        method: "GET",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36"
        }
      },
      async (err, res, body) => {
        if (err || !body) return;
        const $ = cheerio.load(body);
        const trList = $("tbody tr");
        for (let i = 0; i < trList.length; i++) {
          const tr = trList.eq(i);
          const ip = tr
            .children("td")
            .eq(0)
            .text();
          const port = tr
            .children("td")
            .eq(1)
            .text();
          const protocol = tr
            .children("td")
            .eq(3)
            .text()
            .toLowerCase();
          const proxy = new PROXY(ip, port, protocol);
          const result = await check(proxy);
          console.log(result);
        }
      }
    );
  }
}

function PROXY(ip, port, protocol = "http") {
  this.ip = ip;
  this.port = port;
  this.protocol = protocol;
}

async function check(proxy) {
  const url = "http://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js";
  const proxyURL = `${proxy.protocol}://${proxy.ip}:${proxy.port}`;
  await request(
    {
      url: url,
      porxy: proxyURL,
      method: "GET",
      timeout: 20000
    },
    (err, res, body) => {
      if (!err || res.statusCode !== 200 || !body) {
        console.log(`${proxyURL} doesn't work.`);
        return false;
      }
      console.log(`congratulations! ${proxyURL} works.`);
      return true;
    }
  );
}
fetchFastProxy();
