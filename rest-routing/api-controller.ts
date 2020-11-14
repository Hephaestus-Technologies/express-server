import ExpressServer from "../express-server";
import QueryParams from "./query-params";
import {StatusCode} from "./status-code";
import IHttpResult from "./i-http-result";
import {HttpVerb} from "./http-verb";

// noinspection JSUnusedGlobalSymbols
export default class ApiController {

    public routePrefix;

    public registerRoutes(server: ExpressServer): void {
        if (!this.routePrefix) this.routePrefix = "";
        if (!this["routes"]) return;
        this["routes"].forEach(this._registerRouteTo(server));
    }

    private _registerRouteTo(server) {
        return ({verb, route, method}: {verb: HttpVerb, route: string, method: string}) => {
            switch (verb) {
                case HttpVerb.HTTP_GET:
                    return server.get(this._urlFrom(route), this._handlerFrom(method));
                default: return;
            }
        };
    }

    private _urlFrom(route: string): string {
        route = ApiController._trim(route, "/");
        const routePrefix = ApiController._trim(this.routePrefix, "/");
        return `/${routePrefix}/${route}`;
    }

    private _handlerFrom(methodName: string) {
        return async (req, res) => {
            try {
                const params = ApiController._paramsFrom(req);
                const result = await this._execute(methodName, params);
                res.status(result.statusCode).send(result.body);
            }
            catch (e) {
                ApiController._sendError(req, res, e);
            }
        };
    }

    private async _execute(methodName: string, params: {url: any[], query: QueryParams}): Promise<IHttpResult> {
        const result = await this[methodName](...params.url, params.query);
        return result.statusCode ? result : {statusCode: StatusCode.OK, body: result};
    }

    private static _paramsFrom(req): {url: any[], query: QueryParams} {
        const url = Object.values(req.params);
        const query = new QueryParams(req.query);
        return {url, query};
    }

    private static _sendError(req, res, e: Error): void {
        const status = StatusCode.INTERNAL_SERVER_ERROR;
        const body = req.hostname === "localhost" ? e.stack.split('\n').map(l => l.trim()) : "Internal Server Error";
        res.status(status).send(body);
    }

    private static _trim(str: string, charList: string = " "): string {
        const leftTrim = new RegExp(`^[${charList}]+`);
        const rightTrim = new RegExp(`[${charList}]+$`);
        return str.replace(leftTrim, "").replace(rightTrim, "")
    }

}
