import {Response, Router} from "express";
import ModuleConfig, {ImageConfig} from "./module-config";
import * as path from "path";
import * as fs from "fs";
import * as express from "express";

export default (config: ModuleConfig): Router => {

    const getDir = (config: ImageConfig): void => {
        router.use(`/${config.baseRoute}`, express.static(config.directory))
    };

    const getFile = (filename: string): void => {
        const bundleName = path.basename(filename);
        const bundle = fs.readFileSync(filename);
        router.get(`/${bundleName}`, (_, response: Response) => {
            response.send(bundle);
        });
    };

    const router = Router();
    if (config.jsFilepath) getFile(config.jsFilepath);
    if (config.cssFilepath) getFile(config.cssFilepath);
    if (config.images) getDir(config.images)
    if (config.restApi) router.use(config.restApi);
    return router;

};
