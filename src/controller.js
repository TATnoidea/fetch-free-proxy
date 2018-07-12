const Model = require('./model');
const Proxy = Model.proxy;

function addProxy(proxy) {
  Proxy.create(proxy)
  .then(p => {
    console.log(p)
  })
  .catch(err => {
    if(err) throw err;
  })
}
