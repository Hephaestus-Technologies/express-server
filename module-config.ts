import {RequestHandler} from "express";

export interface ImageConfig {
    baseRoute: string,
    directory: string
}

export default interface ModuleConfig {
    jsFilepath?: string;
    cssFilepath?: string;
    images?: ImageConfig;
    restApi?: RequestHandler;
}
