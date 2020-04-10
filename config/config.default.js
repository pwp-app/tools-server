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
    const config = exports = {};

    config.cluster = {
        listen: {
            path: '',
            port: 6000,
            hostname: '0.0.0.0',
        },
    };

    config.security = {
        domainWhiteList: ['http://localhost:6000', 'https://common-api.pwp.app'],
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

    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + '_1586501413819_4461';

    // add your middleware config here
    config.middleware = [];

    // add your user config here
    const userConfig = {
        appName: 'tools-server',
    };

    return {
        ...config,
        ...userConfig,
    };
};
