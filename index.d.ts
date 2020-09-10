import {Application} from "express";

export interface ExpressServer extends Application {

    constructor(port: number, assets: string[], clientName: string);

    start(): void;

}
