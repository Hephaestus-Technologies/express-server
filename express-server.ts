import * as Express from "express";
import {Application, RequestHandler, Response, Router} from "express";
import * as https from "https";
import {ServerOptions} from "https";
import * as session from "express-session";
import * as bodyParser from "body-parser";
import * as fs from "fs";

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;

export interface HtmlConfig {
    lang?: string;
    title?: string
    favicon?: string;
}

const htmlTemplate = (config: HtmlConfig) => `
<html lang="${config.lang || "en"}">
    <title>${config.title || "Express Server"}</title>
    ${config.favicon ? `<link rel="icon" href="/${config.favicon}" />` : ""}
</html>
`;

export interface HttpsConfig {
    keyFilename: string;
    certFilename: string;
    caFilename: string;
    httpPort?: number;
}

export interface ModuleConfig {
    clientRouter: Router;
    restApi: RequestHandler;
}

// noinspection JSUnusedGlobalSymbols
export default class ExpressServer {

    private serverOptions: ServerOptions = null;
    private httpPort: number = null;
    private readonly app: Application = Express();

    public constructor(
        private port: number
    ) {
        this.app.use(bodyParser.json());
        this.configureModule = this.configureModule.bind(this);
    }

    public configureHtml(config: HtmlConfig = {}): void {
        this.app.get("/", (_, response: Response) => {
            response.send(htmlTemplate(config));
        });
    }

    public configureHttps(config: HttpsConfig): void {
        this.serverOptions = {
            key: fs.readFileSync(config.keyFilename),
            cert: fs.readFileSync(config.certFilename),
            ca: fs.readFileSync(config.caFilename)
        };
        this.httpPort = config.httpPort || 80;
    }

    public configureAuthRouter(router: Router): void {
        this.app.use(router);
    }

    public configureModules(...modules: ModuleConfig[]): void {
        modules.forEach(this.configureModule);
    }

    private configureModule(module: ModuleConfig): void {
        this.app.use(module.clientRouter, module.restApi);
    }

    public configureSession(secret: string): void {
        this.app.use(ExpressServer._sessionConfig(secret));
    }

    private static _sessionConfig(secret: string) {
        return session({
            secret,
            resave: false,
            saveUninitialized: true,
            cookie: {
                httpOnly: true,
                secure: true,
                maxAge: 2 * HOUR
            }
        });
    }

    public start(): void {
        if (!this.serverOptions)
            this._startHttpServer();
        else
            this._startHttpsServer();
    }

    private _startHttpServer() {
        const port = this.port || 80;
        this.app.listen(port, () => {
            console.log(`Listening on port ${port}`)
        })
    }

    private _startHttpsServer() {
        const httpsServer = https.createServer(this.serverOptions, this.app);
        const port = this.port || 443;
        httpsServer.listen(port, () => {
            this._configureRedirectServer();
            console.log(`Listening on port ${port}`);
        });
    }

    private _configureRedirectServer() {
        const redirectServer = Express();
        redirectServer.use(((req, res) => {
            res.redirect(`https://${req.headers.host}${req.url}`);
        }));
        redirectServer.listen(this.httpPort);
    }

}
