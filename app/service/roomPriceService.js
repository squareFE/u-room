const Service = require('egg').Service;
const cheerio = require('cheerio');
let superagent = require('superagent');
require('superagent-charset')(superagent);
const fs = require('fs'); //文件模块
const dayjs = require('dayjs');

class RoomPriceService extends Service {
  async find() {
    const result = await superagent.get('http://zz.newhouse.fang.com/house/baojia.htm').charset('gbk')
    const $ = cheerio.load(result.text.toString('utf-8'));
    const priceAreaArr = $('.pricearea') || [];
    let data = [];
    priceAreaArr.map((item) => {
      let areaObj = {
        areaName: '',
        community: [],
        averagePrice: 0
      };
      let areaName = $('.pricearea').eq(item).find('.newtitle_center').attr('id');
      let communityList = $('.pricearea').eq(item).find('ul li');
      areaObj.areaName = areaName;
      let totalPrice = 0;
      let totalCommunity = 0;

      communityList.map((communityIndex) => {
        const community = $('.pricearea').eq(item).find('ul li').eq(communityIndex);
        const name = $(community).find('.name a').text();
        const communityPrice = $(community).find('.price').text();
        // 去除待定的小区，不加入计算
        const price = parseInt(communityPrice);
        if (!isNaN(price)) {
          totalCommunity++;
          totalPrice += price;
        }

        let communityObj = {
          communityName: name,
          communityPrice: communityPrice
        }


        areaObj.community.push(communityObj);
      })
      if (totalCommunity != 0) {
        // 保留一位小数
        let averagePrice = (totalPrice / totalCommunity).toFixed(1);
        areaObj.averagePrice = averagePrice;
      }

      data.push(areaObj);
      return areaName;
    })
    // const a = await this.app.mysql.select('ts', {
    //   columns: ['test']
    // })
    // console.log(a, '-----------')
    return data;
  }

  async addData() {
    const data = await this.find();
    const json = {
      date: dayjs().format('YYYY-MM-DD hh:mm:ss'),
      data
    }
    const dataStr = JSON.stringify(json);
    const date = dayjs().format('YYYY-MM-DD');
    const path = `./data/${date}.json`
    fs.writeFileSync(path, dataStr);
    return data
  }
}

module.exports = RoomPriceService;