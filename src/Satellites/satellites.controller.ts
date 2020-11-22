import express from 'express';
import Controller from '../common/controller';
import BaseRoutes from '../common/BaseRoutes';
import SatelliteService from './satellites.service';
import { RouteDoc } from '../common/RouteDoc';

class SatelliteController implements Controller {
  satService: SatelliteService;
  path = BaseRoutes.satellite;
  router = express.Router();
  _routes = new Map<string, RouteDoc>([
    ['getAll', { method: 'GET', path: `${this.path}` }],
    ['getById', { method: 'GET', path: `${this.path}/:id` }]
  ]);

  constructor(satService = new SatelliteService()) {
    this.satService = satService;
    this.initializeRoutes();
  }

  get routes(): RouteDoc[] {
    return Array.from(this._routes.values());
  }

  initializeRoutes() {
    this.router.get(this._routes.get('getAll').path, this.getAllSats);
    this.router.get(this._routes.get('getById').path, this.getSatById);
  }

  getAllSats = (_req: express.Request, res: express.Response) => {
    res.send(this.satService.getAll());
  };

  getSatById = (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    try {
      res.json(this.satService.getOne(+id));
    } catch (err) {
      res.sendStatus(404);
    }
  };
}

export default SatelliteController;
