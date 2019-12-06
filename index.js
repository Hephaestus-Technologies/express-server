const Express = require("express");
const fs = require("fs");

module.exports = ({port, assets, clientName}) => {

    const self = Express();

    const constructor = () => {
        setStaticRoutes();
        return self;
    };

    const setStaticRoutes = () => {
        self.get("/", (req, res) => res.sendFile(fullPathOf("index.html")));
        assets.forEach(useStatic);
        useStatic("stylesheets");
    };

    const useStatic = (assetName) => {
        const assetPath = fullPathOf(assetName);
        if (isDirectory(assetPath))
            serveDirectory(assetName);
        else
            serveFile(assetName);
    };

    const serveDirectory = (assetName) => {
        self.get(`/${assetName}`, (req, res) => {
            res.sendFile(fullPathOf(`${assetName}/index.js`));
        });
        self.get(`/${assetName}/*`, (req, res) => {
            res.sendFile(resolvePath(req.url.substring(1)));
        });
    };

    const serveFile = (assetName) => {
        const fileName = fullPathOf(assetName);
        self.get(`/${assetName}`, (_, res) => res.sendFile(fileName));
    };

    const fullPathOf = (assetName) => {
        const appDir = require.main.filename.split(/[\\/]/).slice(0, -1).join("/");
        return `${appDir}/node_modules/${clientName}/${assetName}`;
    };

    const isDirectory = (filePath) => {
        return fs.existsSync(filePath) && fs.lstatSync(filePath).isDirectory();
    };

    const resolvePath = (assetName) => {
        const filePath = fullPathOf(assetName);
        return isDirectory(filePath) ?
            `${filePath}/index.js` :
            hasExtension(filePath) ?
            filePath :
            `${filePath}.js`;
    };

    const hasExtension = (filePath) => {
        const [fileName] = filePath.split("/").slice(-1);
        return fileName.includes(".");
    };

    self.start = () => {
        self.listen(
            port,
            () => console.log(`Listening on port ${port}`)
        );
    };

    return constructor();

};
