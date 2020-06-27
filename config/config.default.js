/* eslint valid-jsdoc: "off" */

'use strict';

const keys = require('./keys');

module.exports = () => {
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
        xframe: {
            value: 'SAMEORIGIN',
        },
        csrf: {
            enable: false,
        },
        domainWhiteList: ['http://localhost:8080', 'http://packages.pwp.app'],
    };

    config.cors = {
        allowMethods: 'GET,POST',
    };

    config.validate = {
        convert: true,
        widelyUndefined: true,
    };

    config.redis = {
        client: {
            port: 6379,
            host: '127.0.0.1',
            password: keys.redis,
            db: 0,
        },
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
    config.keys = keys.cookie;

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
