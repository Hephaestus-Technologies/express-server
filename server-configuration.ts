import {Handler, Router} from "express";
import ModuleConfig from "./module-config";
import HttpsConfig from "./https-config";
import HtmlConfig from "./html-config";
import * as bodyParser from "body-parser";
import toSession from "./session-config";
import ModuleRouter from "./module-router";
import HtmlRouter from "./html-router";

export default class ServerConfiguration {

    private readonly _moduleConfigs: ModuleConfig[] = [];
    private _authRouter: Router = null;
    private _httpsConfig: HttpsConfig = null;
    private _sessionSecret: string = null;
    private _htmlConfig: HtmlConfig = null;

    public configureHtml(config: HtmlConfig): void {
        this._htmlConfig = config;
    }

    public configureHttps(config: HttpsConfig): void {
        this._httpsConfig = config;
    }

    public configureAuthRouter(router: Router): void {
        this._authRouter = router;
    }

    public configureModules(modules: ModuleConfig[]): void {
        this._moduleConfigs.push(...modules);
    }

    public configureSession(secret: string): void {
        this._sessionSecret = secret;
    }

    public middleware(): Handler[] {
        return [
            bodyParser.json(),
            ...this._configureSession(),
            ...this._configureHtml(),
            ...this._configureAuth(),
            ...this._configureModules()
        ];
    }

    private _configureHtml(): Router[] {
        if (!this._htmlConfig) return [];
        const router = HtmlRouter(this._htmlConfig, this._moduleConfigs);
        return [router];
    }

    private _configureSession(): Handler[] {
        if (!this._sessionSecret) return [];
        const isSecure = Boolean(this._httpsConfig);
        const session = toSession(this._sessionSecret, isSecure);
        return [session];
    }

    private _configureAuth(): Router[] {
        return this._authRouter ? [this._authRouter] : [];
    }

    private _configureModules(): Router[] {
        return this._moduleConfigs.map(ModuleRouter);
    };

    public httpsConfig(): HttpsConfig {
        return this._httpsConfig;
    }

}
