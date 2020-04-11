'use strict';

const Controller = require('egg').Controller;
const qrcode = require('qrcode');

class QRCodeController extends Controller {
    async encode() {
        const { ctx } = this;
        ctx.validate({ text: 'string' }, ctx.query);
        // 创建二维码
        const data = await qrcode.toDataURL(ctx.query.text);
        ctx.type = 'image/png';
        ctx.body = Buffer.from(data.split(',')[1], 'base64');
    }

    async decode() {

    }
}

module.exports = QRCodeController;