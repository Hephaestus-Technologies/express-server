import * as core from "express-serve-static-core";

interface ExpressServer extends core.Application {

    start(): void;

}

export default function ({port, assets, clientName} : {port: number, assets: string[], clientName: string}) : ExpressServer;
