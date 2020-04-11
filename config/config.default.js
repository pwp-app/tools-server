/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
    /**
     * built-in config
     * @type {Egg.EggAppConfig}
     **/
    const config = (exports = {});

    config.cluster = {
        listen: {
            path: '',
            port: 7700,
            hostname: '0.0.0.0',
        },
    };

    config.security = {
        domainWhiteList: ['http://localhost:7700', 'https://common-api.pwp.app'],
        xframe: {
            value: 'SAMEORIGIN',
        },
    };

    config.cors = {
        allowMethods: 'GET,POST',
    };

    config.validate = {
        convert: true,
        widelyUndefined: true,
    };

    config.onerror = {
        all: (err, ctx) => {
            if (ctx.status === 422) {
                ctx.body = JSON.stringify({
                    code: 422,
                    status: 'error',
                    message: 'Request validation failed.',
                });
            } else {
                ctx.body = JSON.stringify({
                    code: 500,
                    status: 'error',
                    message: 'Unknown internal error occured.',
                });
            }
            // 统一视为正常回复，用code区分错误
            ctx.set({
                'Content-Type': 'application/json',
            });
            ctx.status = 200;
        },
    };

    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + '_1586501413819_4461';

    // add your middleware config here
    config.middleware = ['notfoundHandler'];

    // add your user config here
    const userConfig = {
        appName: 'tools-server',
    };

    return {
        ...config,
        ...userConfig,
    };
};
