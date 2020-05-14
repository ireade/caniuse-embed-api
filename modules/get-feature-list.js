const bcd = require('mdn-browser-compat-data');
const fetch = require('node-fetch');

const formatMDNTitle = require('./format-mdn-feature-title');

const sort_by = (field, primer) => {
    // http://stackoverflow.com/a/979325
    var key = primer ?
        function(x) {return primer(x[field])} :
        function(x) {return x[field]};
    return function (a, b) {
        return a = key(a), b = key(b), 1 * ((a > b) - (b > a));
    }
};

const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

const getMDNData = async () => {
    const finalPaths = [];

    const traverseObject = (obj, objPath) => {
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {

                const newPath = [...objPath, key];

                if ( obj[key]['__compat'] ) {
                    finalPaths.push(newPath);
                } else {
                    traverseObject(obj[key], newPath);
                }

            }
        }
        return null;
    };

    Object.keys(bcd).forEach((category) => {
        if (category === "browsers") return;
        traverseObject(bcd[category], [category]);
    });

    const features = [];
    const excludedCategories = ['webdriver', 'xpath', 'xslt'];

    finalPaths.forEach(async (path) => {

        if (excludedCategories.includes(path[0])) return;

        const feature = {
            id: 'mdn-' + path.join('__'), // @separator
            title: await formatMDNTitle(path),
            dataSource: 'mdn'
        };

        features.push(feature);
    });

    return features;
};

const getCanIUseData = async () => {

    const url = 'https://raw.githubusercontent.com/Fyrd/caniuse/master/fulldata-json/data-2.0.json';
    const options = {
        headers: {
            'Content-Type': 'application/json',
        }
    };

    return fetch(url, options)
        .then((res) => res.json())
        .then((res) => {

            const features = [];

            for (let key in res.data) {
                if (res.data.hasOwnProperty(key)) {

                    const feature = {
                        id: key,
                        title: res.data[key].title,
                        dataSource: 'caniuse'
                    };

                    feature.title = capitalizeFirstLetter(feature.title);

                    features.push(feature);
                }
            }

            return features;
        });
};


module.exports = async () => {

    const mdn = await getMDNData();
    const ciu = await getCanIUseData();
    const features = [...ciu, ...mdn];

    features.sort(sort_by('title', function(a){return a}));

    return features;
};



