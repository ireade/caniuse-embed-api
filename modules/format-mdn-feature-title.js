
module.exports = async (path) => {

    let title = null;

    switch (path[0]) {

        case 'api':
            if (path.length !== 2) break;

            title = `${path[1]} API`;

            break;

        case 'css':

            if (path.length === 3) {
                if (path[1] === 'at-rules') title = `CSS at-rule: ${path[2]}`;
                if (path[1] === 'properties') title = `CSS Property: ${path[2]}`;
                if (path[1] === 'selectors') title = `CSS Selector: ${path[2]}`;
                if (path[1] === 'types') title = `CSS Data Type: ${path[2]}`;
            }

            else if (path.length === 4 && path[1] === 'properties') {
                title = `CSS Property: ${path[2]}:${path[3]}`;
            }





            break;

        case 'html':
            if (path.length !== 3 && path.length !== 4) break;

            if (path[1] === 'manifest') title = `Web App Manifest Property: ${path[2]}`;
            if (path[1] === 'global_attributes') title = `Global HTML Attribute: ${path[2]}`;

            if (path[1] === 'elements' && path[2] !== 'input') title = `HTML Element: ${path[2]}`;
            if (path[1] === 'elements' && path[2] === 'input') title = `HTML Element: ${path[3]}`;

            break;

        case 'http':
            if (path.length !== 3) break;

            if (path[1] === 'methods') title = `HTTP Method: ${path[2]}`;
            if (path[1] === 'status') title = `HTTP Status: ${path[2]}`;
            if (path[1] === 'headers') title = `HTTP Header: ${path[2]}`;

            break;

        case 'javascript':

            title = `Javascript ${ path[ path.length - 1 ] }`;

            break;

        case 'mathml':
            if (path.length !== 3) break;

            if (path[1] === 'elements') title = `MathML Element: ${path[2]}`;

            break;

        case 'svg':
            if (path.length !== 3 && path.length !== 4) break;

            if (path[1] === 'elements') title = `SVG Element: ${path[2]}`;

            if (path[1] === 'attributes' && path.length === 4) title = `SVG Attribute: ${path[3]}`;

            break;

        case 'webextensions':
            if (path.length !== 3 && path.length !== 4) break;

            if (path[1] === 'manifest' && path.length === 3) title = `WebExtension Manifest Property: ${path[2]}`;

            if (path[1] === 'api'  && path.length === 4) title = `WebExtensions API: ${path[2]} ${path[3]}`;

            break;
    }

    if (!title) title = path.join(' ');
    return title;
};
