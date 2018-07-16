const Sequelize = require('sequelize');
const sequelize = require('./sequelize');

const proxy = sequelize.define('proxy', {
  id: {
    type: Sequelize.INTEGER(10),
    primaryKey: true,
    autoIncrement: true
  },
  ip: Sequelize.STRING(16),
  port: Sequelize.INTEGER(6),
  protocol: {
    type: Sequelize.STRING(5),
    defaultValue: 'http'
  },
  speed: {
    type: Sequelize.INTEGER(3),
    allowNull: true
  }
})

// 添加代理地址
function create(obj) {
  proxy.findOrCreate({
    where: {
      ip: obj.ip,
      port: obj.port
    },
    defaults: {
      protocol: obj.protocol,
      speed: obj.speed || null
    }
  })
  .spread((proxy, created) => {
    console.log(proxy)
    // console.log(created)
  });
}

module.exports = {
  create
};
