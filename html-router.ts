import HtmlConfig from "./html-config";
import ModuleConfig from "./module-config";
import {Response, Router} from "express";
import * as path from "path";

export default (config: HtmlConfig, modules: ModuleConfig[]): Router => {

    const invoke = (): Router => {
        const router = Router();
        const html = template();
        router.get("/", (_, response: Response) => {
            response.send(html);
        });
        return router
    };

    const template = (): string => `
        <html lang="${config.lang || "en"}">
            <head>
                <title>${config.title || "Express Server"}</title>
                ${config.favicon ? `<link rel="icon" href="/${config.favicon}" />` : ""}
                ${cssBundles().join("\n")}
            </head>
            <body>
                ${jsBundles().join("\n")}
            </body>
        </html>
    `;

    const jsBundles = (): string[] => {
        return modules
            .map(m => m.jsFilepath)
            .filter(Boolean)
            .map(f => path.basename(f))
            .map(jsTag);
    };

    const cssBundles = (): string[] => {
        return modules
            .map(m => m.cssFilepath)
            .filter(Boolean)
            .map(f => path.basename(f))
            .map(cssTag);
    };

    const jsTag = (bundle): string => `
        <script src="${bundle}"></script>
`;

    const cssTag = (bundle): string => `
        <link rel="stylesheet" href="${bundle}"/>
`;

    return invoke();

};
