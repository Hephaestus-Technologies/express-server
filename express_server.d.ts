import { RequestHandler } from "express";
export default class ExpressServer {
    private readonly _port;
    private readonly _assets;
    private readonly _clientFolder;
    private readonly _app;
    constructor({ port, assets, clientFolder }: {
        port: number;
        assets: string[];
        clientFolder: string;
    });
    get(url: string, handler: RequestHandler): void;
    start(): void;
    private _setStaticRoutes;
    private _useStatic;
    private _serveDirectory;
    private _serveFile;
    private _fullPathOf;
    private _resolvePath;
    private static _isDirectory;
    private static _hasExtension;
}
