# fetch-free-proxy
基于node.js编写的爬虫，用于爬取免费代理。

### Usage:

```
npm install
npm install forever -g // 后台运行所需依赖
npm serve // 启动服务
npm start // 后台启动服务
npm stop // 停止后台服务
```
Or
```
yarn
yarn global add forever // 后台运行所需依赖
yarn serve // 启动服务
yarn start // 后台启动服务
yarn stop // 停止后台服务
```

> 目前可以获取快代理和米扑代理， 能够将数据保存在mysql中，mysql的具体配置在`./src/mysql.config.js`中。



### 目录结构
```
└─fetch-free-proxy
    │  .gitignore
    │  package.json
    │  README.md
    │  yarn.lock
    │
    ├─log // 相关日志输出
    │
    └─src
        │  aipOcrClient.js  // 百度OCR
        │  app.js // 主函数
        │  model.js // sequelize model
        │  mysql.config.js  // mysql配置
        │  sequelize.js // sequelize配置
        │  utils.js // 工具函数
        │
        └─img // 保存图片
```

>  由于部分网站的端口号采取转换为了图片形式，所以使用Baidu OCR对图片进行识别。
> 识别过程主要是先将图片下载下来在调用相关api来进行处理，识别完成后会删除图片。