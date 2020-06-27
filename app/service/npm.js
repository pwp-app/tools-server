'use strict';

const Service = require('egg').Service;
const axios = require('../utils/common/axios');

const REGISTRY_URL = 'https://registry.npmjs.org';
const API_URL = 'https://api.npmjs.org';

class NpmService extends Service {
    async getRegistry(name) {
        const cached = await this.service.redis.get(`npm_registry_${name}`);
        if (cached) {
            return cached;
        }
        try {
            const res = await axios.get(`${REGISTRY_URL}/${name}`);
            if (res.data) {
                await this.service.redis.set(`npm_registry_${name}`, res.data, 1800);
                return res.data;
            }
            return null;
        } catch (err) {
            throw err.message;
        }
    }
    async getDownloads(start, end, name) {
        const cached = await this.service.redis.get(`npm_downloads_${start}_${end}_${name}`);
        if (cached) {
            return cached;
        }
        try {
            const res = await axios.get(`${API_URL}/downloads/point/${start}:${end}/${name}`);
            if (res.data) {
                await this.service.redis.set(`npm_downloads_${start}_${end}_${name}`, res.data, 1800);
                return res.data;
            }
            return null;
        } catch (err) {
            throw err.message;
        }
    }
}

module.exports = NpmService;