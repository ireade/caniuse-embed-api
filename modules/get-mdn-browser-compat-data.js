const bcd = require('mdn-browser-compat-data');
const formatMDNTitle = require('./format-mdn-feature-title');

module.exports = async (feature) => {
    if (!feature) return bcd;

    const path = feature.split('mdn-')[1].split('__');

    let obj = bcd;
    for (let i = 0; i < path.length; i++) {
        obj = obj[ path[i] ];
    }

    const compat = obj['__compat'];
    compat.title = await formatMDNTitle(path);

    return compat || bcd;
};
