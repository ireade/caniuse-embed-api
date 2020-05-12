const bcd = require('mdn-browser-compat-data');
const fetch = require('node-fetch');

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

    finalPaths.forEach((path) => {
        const feature = {
            id: 'mdn-' + path.join('-'),
            title: path[ path.length - 1 ]
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
                    var feature = {
                        id: key,
                        title: res.data[key].title
                    };
                    features.push(feature);
                }
            }

            return features;
        });
};


module.exports = async () => {
    const mdn = await getMDNData();
    const ciu = await getCanIUseData();
    return [...ciu, ...mdn];
};



