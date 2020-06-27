'use strict';

module.exports = {
    success(ctx, data, message) {
        ctx.status = 200;
        ctx.body = {
            code: 200,
            status: 'success',
            message,
            data,
        };
    },
    error(ctx, code, message) {
        ctx.status = 200;
        ctx.body = {
            code,
            status: 'error',
            message,
        };
    },
};