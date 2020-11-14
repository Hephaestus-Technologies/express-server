import {HttpVerb} from "./http-verb";

// noinspection JSUnusedGlobalSymbols
export const routePrefix = (routePrefix: string) => (Class) => {
    Class.prototype.routePrefix = routePrefix;
};

// noinspection JSUnusedGlobalSymbols
export const GET = (route: string) => (proto: any, propertyKey: string) => {
    proto["routes"] = proto["routes"] || [];
    proto["routes"].push({verb: HttpVerb.HTTP_GET, route, method: propertyKey});
};
