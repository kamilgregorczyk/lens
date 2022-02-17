/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import Call from "@hapi/call";
import Subtext from "@hapi/subtext";
import type http from "http";
import path from "path";
import { readFile } from "fs-extra";
import type { Cluster } from "../common/clusters/cluster";
import { appName, publicPath, isDevelopment, webpackDevServerPort } from "../common/vars";
import logger from "./logger";

export interface RouterRequestOpts {
  req: http.IncomingMessage;
  res: http.ServerResponse;
  cluster: Cluster;
  params: RouteParams;
  url: URL;
}

export interface RouteParams extends Record<string, string> {
  path?: string; // *-route
  namespace?: string;
  service?: string;
  account?: string;
  release?: string;
  repo?: string;
  chart?: string;
}

export interface LensApiRequest<P = any> {
  path: string;
  payload: P;
  params: RouteParams;
  cluster: Cluster;
  response: http.ServerResponse;
  query: URLSearchParams;
  raw: {
    req: http.IncomingMessage;
  }
}

function getMimeType(filename: string) {
  const mimeTypes: Record<string, string> = {
    html: "text/html",
    txt: "text/plain",
    css: "text/css",
    gif: "image/gif",
    jpg: "image/jpeg",
    png: "image/png",
    svg: "image/svg+xml",
    js: "application/javascript",
    woff2: "font/woff2",
    ttf: "font/ttf",
  };

  return mimeTypes[path.extname(filename).slice(1)] || "text/plain";
}

export type RouteHandler = (request: LensApiRequest) => Promise<void>;

export interface RouteDescriptor {
  method: "get" | "patch" | "delete" | "put" | "post" | "head";
  path: string;
  handler: RouteHandler;
}

export class Router {
  protected router = new Call.Router();

  public constructor(routes: RouteDescriptor[]) {
    this.addRoute({ method: "get", path: "/{path*}", handler: handleStaticFile });

    for (const route of routes) {
      this.addRoute(route);
    }
  }

  public async route(cluster: Cluster, req: http.IncomingMessage, res: http.ServerResponse): Promise<boolean> {
    const url = new URL(req.url, "http://localhost");
    const path = url.pathname;
    const method = req.method.toLowerCase();
    const matchingRoute = this.router.route(method, path);
    const routeFound = !matchingRoute.isBoom;

    if (routeFound) {
      const request = await this.getRequest({ req, res, cluster, url, params: matchingRoute.params });

      await matchingRoute.route(request);
    }

    return routeFound;
  }

  protected async getRequest(opts: RouterRequestOpts): Promise<LensApiRequest> {
    const { req, res, url, cluster, params } = opts;
    const { payload } = await Subtext.parse(req, null, {
      parse: true,
      output: "data",
    });

    return {
      cluster,
      path: url.pathname,
      raw: {
        req,
      },
      response: res,
      query: url.searchParams,
      payload,
      params,
    };
  }

  private addRoute({ handler, method, path }: RouteDescriptor): void {
    this.router.add({ method, path }, handler);
  }
}

const rootPath = path.resolve(__static);

async function handleStaticFile({ params, response, raw: { req }}: LensApiRequest): Promise<void> {
  let filePath = params.path;

  for (let retryCount = 0; retryCount < 5; retryCount += 1) {
    const asset = path.join(rootPath, filePath);
    const normalizedFilePath = path.resolve(asset);

    if (!normalizedFilePath.startsWith(rootPath)) {
      response.statusCode = 404;

      return response.end();
    }

    try {
      const filename = path.basename(req.url);
      // redirect requests to [appName].js, [appName].html /sockjs-node/ to webpack-dev-server (for hot-reload support)
      const toWebpackDevServer = filename.includes(appName) || filename.includes("hot-update") || req.url.includes("sockjs-node");

      if (isDevelopment && toWebpackDevServer) {
        const redirectLocation = `http://localhost:${webpackDevServerPort}${req.url}`;

        response.statusCode = 307;
        response.setHeader("Location", redirectLocation);

        return response.end();
      }

      const data = await readFile(asset);

      response.setHeader("Content-Type", getMimeType(asset));
      response.write(data);
      response.end();
    } catch (err) {
      if (retryCount > 5) {
        logger.error("handleStaticFile:", err.toString());
        response.statusCode = 404;

        return response.end();
      }

      filePath = `${publicPath}/${appName}.html`;
    }
  }
}
