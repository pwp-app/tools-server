'use strict';

const Controller = require('egg').Controller;
const R = require('../../utils/common/response');

class GitHubController extends Controller {
    async readme() {
        const { ctx } = this;
        ctx.validate({ repo: 'string' }, ctx.query);
        const res = await this.service.github.getReadme(ctx.query.repo);
        if (res) {
            R.success(ctx, res, null);
            return;
        }
        R.error(ctx, 500, '无法获取信息');
    }
}

module.exports = GitHubController;