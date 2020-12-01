#An easily configurable Express server

`npm install --save @hephaestus-technologies/express-server`

##Minimal Example

This will start an Express server on port 80.

```typeScript
import ExpressServer from "express-server";

const server = new ExpressServer();
server.start();
```

##Port
By default, content will be served on port 80
(or port 443 if HTTPs is configured).
To override this, just pass a different port to the constructor:
```TypeScript
const server = new ExpressServer(3000);
```
This is the port that will override both the HTTP and HTTPs default.

##Serve HTML at root

To serve HTML at root ("http://localhost:{PORT}/"):

```TypeScript
server.configureHtml();
```

The HTML can be further customized by passing a config object:

```TypeScript
server.configureHtml({
  lang: string, //default "en"
  title: string, //default "Express Server"
  favicon: string //default null
});
```

Note that scripts and stylesheets are not configured via this method.
See [Modules](#modules) to serve client code.

##Using HTTPs

By default, content will be served over HTTP. To serve content over HTTPs,
provide the paths to the key/certificate/ca. Filenames must be absolute.

```TypeScript
server.configureHttps({
  keyFilename: string,
  certFilename: string,
  caFilename: string,
  httpPort: number //default 80
});
```

When configured to serve HTTPs, the server will automatically redirect any
request sent over HTTP on the provided port (defaulting to `80`).

##Modules
A module combines client JavaScipt and a REST API.
Provide a router to serve static client content. Provide a RequestHandler
to serve REST requests. If a bundle name is provided and HTML is configure,
a script tag with that as the source will be added to the body of the HTML.
This interface is expected to substantially change
in the near future.

```TypeScript
interface ModuleConfig {
  bundleName? string,
  clientRouter: Router,
  restApi: RequestHandler
}

server.configureModules(moduleConfig1, moduleConfig2, ...);
```

See
https://github.com/Hephaestus-Technologies/rest-api
for an easy to use REST library.


##Additional Configuration

###Session Config
Express Session can be included simply by passing a secret:
```TypeScript
const secret = "blah";
server.configureSession(secret);
```
The session's cookie will have a 2 hour expiration
and will only be served over HTTPs.
