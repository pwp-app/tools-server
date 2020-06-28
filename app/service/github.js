'use strict';

const Service = require('egg').Service;
const axios = require('../utils/common/axios');

const API_URL = 'https://api.github.com';

class GitHubService extends Service {
    async getReadme(repo) {
        const cached = await this.service.redis.get(`github_readme_${repo}`);
        if (cached) {
            return cached;
        }
        try {
            const res = await axios.get(`${API_URL}/repos/${repo}/readme`);
            if (res.data) {
                const readme = await axios.get(res.data.download_url);
                if (readme.data) {
                    await this.service.redis.set(`github_readme_${repo}`, readme.data, 1800);
                    return readme.data;
                }
                return null;
            }
            return null;
        } catch (err) {
            return null;
        }
    }
}

module.exports = GitHubService;