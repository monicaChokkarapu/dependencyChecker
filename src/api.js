import axios from 'axios';


const BASE_URLS = {
    GIT: 'https://raw.githubusercontent.com',
    NPM_AUDIT: 'https://registry.npmjs.org/-/npm/v1/security/audits',
    NPM: 'https://api.npms.io/v2/package/mget'
};

const getNpmPayload = (pkg, version) => {
    return {
        "name": "npm_audit_test",
        "version": "1.0.0",
        [pkg]: {
            "react": version
        },
        "dependencies": {
            [pkg]: {
                "version": version
            }
        }
    }
};

function get(apiCfg) {
    const url = apiCfg.location === 'git' ? `${BASE_URLS.GIT}/${apiCfg.repoLocation}/master/package.json` : `${BASE_URLS.NPM}/master/package.json`
    axios({
        method: 'get',
        url: url,
      })
        .then((response) => {
            apiCfg.callback(response)
        }).catch((response) => {
            apiCfg.callback({response, isError: true})
        });
}

function post(apiCfg) {
    const url = apiCfg.dest === 'npm' ? BASE_URLS.NPM : BASE_URLS.NPM_AUDIT;
    return axios({
        method: 'post',
        url: url,
        data: apiCfg.payload,
        pkgName: apiCfg.pkgName
      })
        .then((response) => {
            return response;
        }).catch((response) => {
            return {[apiCfg.pkgName]: response};
        });
}

export {get, post, getNpmPayload};