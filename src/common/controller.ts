import { Router } from 'express';
import BaseRoutes from './BaseRoutes';
import { RouteDoc } from './RouteDoc';

export interface ControllerMethods {
  initializeRoutes: (router: Router) => void;
}

abstract class Controller {
  path: BaseRoutes;
  routeMap: Map<string, RouteDoc> = new Map();

  get routes() {
    return Array.from(this.routeMap.values());
  }

  constructor(path: BaseRoutes) {
    this.path = path;
  }

  abstract initializeRoutes(router: Router): void;
}

export default Controller;
