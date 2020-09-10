import { RequestHandler } from "express";
export default class ExpressServer {
    private readonly _port;
    private readonly _assets;
    private readonly _clientName;
    private readonly _app;
    constructor({ port, assets, clientName }: {
        port: number;
        assets: string[];
        clientName: string;
    });
    private _setStaticRoutes;
    private _useStatic;
    private _serveDirectory;
    private _serveFile;
    private _fullPathOf;
    private _resolvePath;
    private static _isDirectory;
    private static _hasExtension;
    get(url: string, handler: RequestHandler): void;
    start(): void;
}
