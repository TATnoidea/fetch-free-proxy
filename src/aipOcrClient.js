const AipOcrClient = require('baidu-aip-sdk').ocr;

const APP_ID = 11531442;
const API_KEY = 'vkFdVOhzzHGqFLXqsLHFQVM6';
const SECRET_KEY = 'g1SVS7N3EkNBx4V6iwnonAw1u4nBeG1b';

const client = new AipOcrClient(APP_ID, API_KEY, SECRET_KEY);

module.exports = client;