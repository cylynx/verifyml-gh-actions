"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const url_1 = require("url");
class URLUtil {
    constructor() {
        this.isGithubProto = (protobufUrl) => {
            const url = new url_1.URL(protobufUrl);
            const { hostname } = url;
            const fileName = protobufUrl.split('/').pop();
            const [, extension] = fileName.split('.');
            if (hostname !== 'github.com' || extension !== 'proto') {
                return false;
            }
            return true;
        };
        this.transformToJsDelivr = (githubUrl) => {
            const url = new url_1.URL(githubUrl);
            const { pathname } = url;
            const [, username, repository, , branch, ...directory] = pathname.split('/');
            const fullPath = directory.join('/');
            const jsDelivrUrl = `https://cdn.jsdelivr.net/gh/${username}/${repository}@${branch}/${fullPath}`;
            return jsDelivrUrl;
        };
    }
}
exports.default = URLUtil;
