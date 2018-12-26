'use strict';

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1545049097557_2108';

  // add your config here
  config.middleware = [];
  config.mysql = {
    client: {
      // host
      host: 'localhost',
      // 端口号
      port: '3306',
      // 用户名
      user: 'root',
      // 密码
      password: 'zhang123',
      // 数据库名
      database: 'uroom',
    },
    app: true,
    agent: false,
  }
  return config;
};