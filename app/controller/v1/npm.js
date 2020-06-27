'use strict';

const Controller = require('egg').Controller;
const R = require('../../utils/common/response');

class NpmController extends Controller {
    async registry() {
        const { ctx } = this;
        ctx.validate({ package: 'string' }, ctx.query);
        const res = await this.service.npm.getRegistry(ctx.query.package);
        if (res) {
            R.success(ctx, res, null);
            return;
        }
        R.error(ctx, 500, '无法获取数据');
    }
    async downloads() {
        const { ctx } = this;
        ctx.validate({ package: 'string', start: 'date', end: 'date' }, ctx.query);
        const res = await this.service.npm.getDownloads(ctx.query.start, ctx.query.end, ctx.query.package);
        if (res) {
            R.success(ctx, res, null);
            return;
        }
        R.error(ctx, 500, '无法获取数据');
    }
}

module.exports = NpmController;