'use strict';

const Controller = require('egg').Controller;
const qrcode = require('qrcode');
const crypto = require('crypto');
const jimp = require('jimp');
const jsqr = require('jsqr');
const R = require('../../utils/common/response');

class QRCodeController extends Controller {
    async encode() {
        const { ctx } = this;
        // 校验
        ctx.validate({ text: 'string', level: 'number?', width: 'number?', margin: 'number?' }, ctx.query);
        if (ctx.query.level && (ctx.query.level <= 0 || ctx.query.level > 4)) {
            R.error(ctx, 422, 'Level must be 1 - 4');
            return;
        }
        if (ctx.query.width && (ctx.query.width < 64 || ctx.query.width > 1024)) {
            R.error(ctx, 422, 'Width must be 64 - 1024');
            return;
        }
        if (typeof ctx.query.margin !== 'undefined' && (ctx.query.margin < 0 || ctx.query.margin > 8)) {
            R.error(ctx, 422, 'Margin must be 0 - 8');
            return;
        }
        // 构造参数
        let level;
        switch (ctx.query.level) {
        default:
            level = 'M';
            break;
        case 1:
            level = 'L';
            break;
        case 2:
            level = 'M';
            break;
        case 3:
            level = 'Q';
            break;
        case 4:
            level = 'H';
            break;
        }
        const options = {
            errorCorrectionLevel: level || 'M',
            width: ctx.query.width || 128,
            margin: typeof ctx.query.margin !== 'undefined' ? ctx.query.margin : 2,
        };
        const sha256 = crypto.createHash('sha256');
        const hash = sha256.update(ctx.query.text + '|' + JSON.stringify(options)).digest('hex');
        const cache = await this.service.redis.get(`qrencode:${hash}`);
        if (cache) {
            ctx.type = 'image/png';
            ctx.body = Buffer.from(cache, 'base64');
            return;
        }
        // 创建二维码
        let data = await qrcode.toDataURL(ctx.query.text, options);
        ctx.type = 'image/png';
        data = data.split(',')[1];
        ctx.body = Buffer.from(data, 'base64');
        // 设置缓存
        this.service.redis.set(`qrencode:${hash}`, data, 60 * 30);
    }

    async checkDecodeCache(ctx, hash) {
        const cache = await this.service.redis.get(`qrdecode:${hash}`);
        if (cache) {
            ctx.body = {
                code: 200,
                status: 'success',
                data: cache,
            };
            return true;
        }
        return false;
    }

    async decodeByURL(ctx, url) {
        const sha256 = crypto.createHash('sha256');
        const hash = sha256.update(url).digest('hex');
        if (await this.checkDecodeCache(ctx, hash)) {
            return;
        }
        let image = null;
        try {
            image = await jimp.read(url);
        } catch (e) {
            R.error(ctx, 500, 'Cannot download image from URL.');
            return false;
        }
        return this.readQRCode(ctx, image, hash);
    }

    async decodeByBase64(ctx, base64) {
        if (!(/^data:image\/(png|jpeg);base64,/.test(base64))) {
            R.error(ctx, 400, 'Param base64 must be a dataURL.');
            return false;
        }
        const sha256 = crypto.createHash('sha256');
        const hash = sha256.update(ctx.request.body.base64).digest('hex');
        if (await this.checkDecodeCache(ctx, hash)) {
            return;
        }
        const buffer = Buffer.from(ctx.request.body.base64.split(',')[1], 'base64');
        let image = null;
        try {
            image = await jimp.read(buffer);
        } catch (e) {
            R.error(ctx, 500, 'Cannot read this image.');
            return false;
        }
        return this.readQRCode(ctx, image, hash);
    }

    async readQRCode(ctx, image, hash) {
        const { width, height, data } = image.bitmap;
        const code = jsqr(data, width, height);
        if (!code) {
            R.error(ctx, 500, 'Cannot parse QRCode in this image.');
            return false;
        }
        ctx.body = {
            code: 200,
            status: 'success',
            data: code.data,
        };
        // 设置缓存
        this.service.redis.set(`qrdecode:${hash}`, code.data, 60 * 30);
        return true;
    }

    async decodeGet() {
        const { ctx } = this;
        ctx.validate({ url: 'url' }, ctx.query);
        await this.decodeByURL(ctx, ctx.query.url);
    }

    async decodePost() {
        const { ctx } = this;
        ctx.validate({ url: 'url?', base64: 'string?' });
        if (!ctx.request.body.url && !ctx.request.body.base64) {
            R.error(ctx, 400, 'Must submit a url or base64 encoded image.');
            return;
        }
        if (ctx.request.body.url) {
            // 检查缓存
            await this.decodeByURL(ctx, ctx.request.body.url);
        } else if (ctx.request.body.base64) {
            await this.decodeByBase64(ctx, ctx.request.body.base64);
        }
    }
}

module.exports = QRCodeController;
