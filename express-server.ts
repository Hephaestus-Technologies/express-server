import * as Express from "express";
import {Application, Request, Response, Router} from "express";
import * as https from "https";
import HtmlConfig from "./html-config";
import HttpsConfig, {toServerOptions} from "./https-config";
import ModuleConfig from "./module-config";
import ServerConfiguration from "./server-configuration";

const DEFAULT_HTTP_PORT = 80;
const DEFAULT_HTTPS_PORT = 443;

// noinspection JSUnusedGlobalSymbols
export default class ExpressServer {

    private readonly app: Application = Express();
    private readonly _serverConfig = new ServerConfiguration();

    public constructor(
        private port: number
    ) { }

    public configureHtml(config: HtmlConfig): void {
        this._serverConfig.configureHtml(config);
    }

    public configureHttps(config: HttpsConfig): void {
        this._serverConfig.configureHttps(config);
    }

    public configureAuthRouter(router: Router): void {
        this._serverConfig.configureAuthRouter(router);
    }

    public configureModules(...modules: ModuleConfig[]): void {
        this._serverConfig.configureModules(modules);
    }

    public configureSession(secret: string): void {
        this._serverConfig.configureSession(secret);
    }

    public start(): void {
        this._configureServer();
        this._startServer();
    }

    private _configureServer(): void {
        this.app.use(...this._serverConfig.middleware());
    }

    private _startServer(): void {
        const httpsConfig = this._serverConfig.httpsConfig();
        if (!httpsConfig)
            this._startHttpServer();
        else
            this._startHttpsServer(httpsConfig);
    }

    private _startHttpServer(): void {
        const port = this.port || DEFAULT_HTTP_PORT;
        this.app.listen(port, () => {
            console.log(`Listening on port ${port}`);
        })
    }

    private _startHttpsServer(httpsConfig: HttpsConfig): void {
        const serverOptions = toServerOptions(httpsConfig);
        const httpsServer = https.createServer(serverOptions, this.app);
        const port = this.port || DEFAULT_HTTPS_PORT;
        httpsServer.listen(port, () => {
            ExpressServer._startRedirectServer(httpsConfig);
            console.log(`Listening on port ${port}`);
        });
    }

    private static _startRedirectServer(httpsConfig: HttpsConfig): void {
        const redirectServer = Express();
        redirectServer.use((request: Request, response: Response) => {
            response.redirect(`https://${request.headers.host}${request.url}`);
        });
        redirectServer.listen(httpsConfig.httpPort || DEFAULT_HTTP_PORT);
    }

}
