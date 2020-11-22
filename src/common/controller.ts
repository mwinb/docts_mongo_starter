import express from 'express';
import BaseRoutes from './BaseRoutes';
import { RouteDoc } from './RouteDoc';

interface Controller {
  path: BaseRoutes;
  router: express.Router;
  routes: RouteDoc[];
}

export default Controller;
