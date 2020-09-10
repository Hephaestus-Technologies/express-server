import {Application} from "express";

interface ExpressServer extends Application {

    start(): void;

}

export default function (port: number, assets: string[], clientName: string) : ExpressServer;
