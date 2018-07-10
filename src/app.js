const rp = require('request-promise');
const cheerio = require('cheerio');

const proxyArr = [];
function fetchFastProxy() {
  for(let i = 1; i <= 1; i++) {
    const url = `https://www.kuaidaili.com/free/inha/${ i }/`;
    rp({
      url: url,
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36",
      }
    })
    .then(async body => {
      const $ = cheerio.load(body);
      const trList = $('.table tbody tr');

      for(let i = 0; i < trList.length; i++) {
        const td = trList.eq(i).children('td');
        const ip = td.eq(0).text();
        const port = td.eq(1).text();
        const protocol = td.eq(3).text().toLowerCase();
        const proxy = new PROXY(ip, port, protocol);
        const res = await check(proxy)
        if(res) proxyArr.push(proxy);
      }
    })
    .catch(err => {
      console.log(`Sorry, failed to send request to ${ url }`);
    })
  }
}

function PROXY(ip, port, protocol) {
  this.ip = ip;
  this.port = port;
  this.protocol = protocol;
}


function check(proxy) {
  const url = "http://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js";
  const proxyURL = `${ proxy.protocol }://${ proxy.ip }:${ proxy.port }`;
  return rp({
    url: url,
    method: "GET",
    resolveWithFullResponse: true,
    proxy: proxyURL,
    timeout: 20000
  })
  .then(res => {
    if(res.statusCode === 200) {
      console.log(`Congratulations, ${ proxyURL } works!`)
      return true;
    };
    console.log(`Sorry, ${ proxyURL } doesn't return 200`)
    return false;
  })
  .catch(err => {
    if(err) {
      console.log(`Sorry, ${ proxyURL } doesn't work, ${ err.Error }`);
      return false;
    };
  })
}


fetchFastProxy()