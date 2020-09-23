import * as fs from "fs";
import * as Express from "express";
import {Application, RequestHandler} from "express";

export default class ExpressServer {

    private readonly _port: number;
    private readonly _assets: string[];
    private readonly _clientFolder: string;
    private readonly _app: Application;

    constructor({port, assets, clientFolder} : {port: number, assets: string[], clientFolder: string}) {
        this._port = port;
        this._assets = assets;
        this._clientFolder = clientFolder;
        this._app = Express();
    }

    get(url: string, handler: RequestHandler) {
        this._app.get(url, handler);
    }

    start() : void {
        this._setStaticRoutes();
        this._app.listen(
            this._port,
            () => console.log(`Listening on port ${this._port}`)
        );
    }

    private _setStaticRoutes = () => {
        this.get("/", (req, res) => res.sendFile(this._fullPathOf("index.html")));
        this._assets.forEach(asset => this._useStatic(asset));
        this._useStatic("stylesheets");
    }

    private _useStatic(assetName) {
        const assetPath = this._fullPathOf(assetName);
        if (ExpressServer._isDirectory(assetPath))
            this._serveDirectory(assetName);
        else
            this._serveFile(assetName);
    }

    private _serveDirectory(assetName) {
        this.get(`/${assetName}`, (req, res) => {
            res.sendFile(this._fullPathOf(`${assetName}/index.js`));
        });
        this.get(`/${assetName}/*`, (req, res) => {
            res.sendFile(this._resolvePath(req.url.substring(1)));
        });
    }

    private _serveFile(assetName) {
        const fileName = this._fullPathOf(assetName);
        this.get(`/${assetName}`, (_, res) => res.sendFile(fileName));
    };

    private _fullPathOf(assetName) {
        const appDir = require.main.filename.split(/[\\/]/).slice(0, -1).join("/");
        return `${appDir}/${this._clientFolder}/${assetName}`;
    }

    private _resolvePath(assetName) {
        const filePath = this._fullPathOf(assetName);
        return ExpressServer._isDirectory(filePath) ?
            `${filePath}/index.js` :
            ExpressServer._hasExtension(filePath) ?
            filePath :
            `${filePath}.js`;
    }

    private static _isDirectory(filePath) {
        return fs.existsSync(filePath) && fs.lstatSync(filePath).isDirectory();
    }

    private static _hasExtension(filePath) {
        const [fileName] = filePath.split("/").slice(-1);
        return fileName.includes(".");
    }

}
