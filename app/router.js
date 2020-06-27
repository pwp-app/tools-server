'use strict';

const api_version = 'v1';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const { router, controller } = app;
    // QRCode
    router.get(`/${api_version}/qrcode/encode`, controller[api_version].qrcode.encode);
    router.get(`/${api_version}/qrcode/decode`, controller[api_version].qrcode.decodeGet);
    router.post(`/${api_version}/qrcode/decode`, controller[api_version].qrcode.decodePost);
    // npm
    router.get(`/${api_version}/npm/registry`, controller[api_version].npm.registry);
    router.get(`/${api_version}/npm/downloads`, controller[api_version].npm.downloads);
};
