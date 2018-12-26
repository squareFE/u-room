'use strict';

const Controller = require('egg').Controller;

class RoomPriceController extends Controller {
  async index() {
    const result = await this.ctx.service.roomPriceService.addData();

    this.ctx.body = {
      data: result,
      date: new Date()
    };
  }
}

module.exports = RoomPriceController;
