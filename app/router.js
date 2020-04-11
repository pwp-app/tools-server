'use strict';

const api_version = 'v1';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const { router, controller } = app;
    // QRCode
    router.get(`/api/${api_version}/qrcode/encode`, controller[api_version].qrcode.encode);
    router.get(`/api/${api_version}/qrcode/decode`, controller[api_version].qrcode.decode);
};
