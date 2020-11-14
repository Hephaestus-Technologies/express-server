import * as fs from "fs";
import * as Express from "express";
import {Application, RequestHandler} from "express";
import {ServerConfig} from "./server-config";

// noinspection JSUnusedGlobalSymbols
export default class ExpressServer {

    private readonly _port: number;
    private readonly _assets: string[];
    private readonly _clientFolder: string;
    private readonly _app: Application;

    constructor(serverConfig: ServerConfig) {
        this._port = serverConfig.port;
        this._assets = serverConfig.assets;
        this._clientFolder = serverConfig.clientFolder;
        this._app = Express();
    }

    get(url: string, handler: RequestHandler) {
        this._app.get(url, handler);
    }

    start(): void {
        this._setStaticRoutes();
        this._app.listen(
            this._port,
            () => console.log(`Listening on port ${this._port}`)
        );
    }

    private _setStaticRoutes = (): void => {
        this.get("/", (req, res) => res.sendFile(this._fullPathOf("index.html")));
        this._assets.forEach(asset => this._useStatic(asset));
        this._useStatic("stylesheets");
    }

    private _useStatic(assetName: string): void {
        const assetPath = this._fullPathOf(assetName);
        if (ExpressServer._isDirectory(assetPath))
            this._serveDirectory(assetName);
        else
            this._serveFile(assetName);
    }

    private _serveDirectory(assetName: string): void {
        this.get(`/${assetName}`, (req, res) => {
            res.sendFile(this._fullPathOf(`${assetName}/index.js`));
        });
        this.get(`/${assetName}/*`, (req, res) => {
            res.sendFile(this._resolvePath(req.url.substring(1)));
        });
    }

    private _serveFile(assetName: string): void {
        const fileName = this._fullPathOf(assetName);
        this.get(`/${assetName}`, (_, res) => res.sendFile(fileName));
    };

    private _fullPathOf(assetName: string): string {
        const appDir = require.main.filename.split(/[\\/]/).slice(0, -1).join("/");
        return `${appDir}/${this._clientFolder}/${assetName}`;
    }

    private _resolvePath(assetName: string): string {
        const filePath = this._fullPathOf(assetName);
        return ExpressServer._isDirectory(filePath) ?
            `${filePath}/index.js` :
            ExpressServer._hasExtension(filePath) ?
            filePath :
            `${filePath}.js`;
    }

    private static _isDirectory(filePath: string): boolean {
        return fs.existsSync(filePath) && fs.lstatSync(filePath).isDirectory();
    }

    private static _hasExtension(filePath: string): boolean {
        const [fileName] = filePath.split("/").slice(-1);
        return fileName.includes(".");
    }

}
