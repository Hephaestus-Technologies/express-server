"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const Express = require("express");
class ExpressServer {
    constructor({ port, assets, clientName }) {
        this._setStaticRoutes = () => {
            this.get("/", (req, res) => res.sendFile(this._fullPathOf("index.html")));
            this._assets.forEach(asset => this._useStatic(asset));
            this._useStatic("stylesheets");
        };
        this._port = port;
        this._assets = assets;
        this._clientName = clientName;
        this._app = Express();
        this._setStaticRoutes();
    }
    _useStatic(assetName) {
        const assetPath = this._fullPathOf(assetName);
        if (ExpressServer._isDirectory(assetPath))
            this._serveDirectory(assetName);
        else
            this._serveFile(assetName);
    }
    ;
    _serveDirectory(assetName) {
        this.get(`/${assetName}`, (req, res) => {
            res.sendFile(this._fullPathOf(`${assetName}/index.js`));
        });
        this.get(`/${assetName}/*`, (req, res) => {
            res.sendFile(this._resolvePath(req.url.substring(1)));
        });
    }
    ;
    _serveFile(assetName) {
        const fileName = this._fullPathOf(assetName);
        this.get(`/${assetName}`, (_, res) => res.sendFile(fileName));
    }
    ;
    _fullPathOf(assetName) {
        const appDir = require.main.filename.split(/[\\/]/).slice(0, -1).join("/");
        return `${appDir}/node_modules/${this._clientName}/${assetName}`;
    }
    ;
    _resolvePath(assetName) {
        const filePath = this._fullPathOf(assetName);
        return ExpressServer._isDirectory(filePath) ?
            `${filePath}/index.js` :
            ExpressServer._hasExtension(filePath) ?
                filePath :
                `${filePath}.js`;
    }
    ;
    static _isDirectory(filePath) {
        return fs.existsSync(filePath) && fs.lstatSync(filePath).isDirectory();
    }
    ;
    static _hasExtension(filePath) {
        const [fileName] = filePath.split("/").slice(-1);
        return fileName.includes(".");
    }
    ;
    get(url, handler) {
        this._app.get(url, handler);
    }
    start() {
        this._app.listen(this._port, () => console.log(`Listening on port ${this._port}`));
    }
    ;
}
exports.default = ExpressServer;
