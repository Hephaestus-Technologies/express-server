import {ServerOptions} from "https";
import * as fs from "fs";

export default interface HttpsConfig {
    keyFilename: string;
    certFilename: string;
    caFilename: string;
    httpPort?: number;
}

export const toServerOptions = (config: HttpsConfig): ServerOptions => {
    return {
        key: fs.readFileSync(config.keyFilename),
        cert: fs.readFileSync(config.certFilename),
        ca: fs.readFileSync(config.caFilename)
    };
}
