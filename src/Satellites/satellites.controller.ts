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
    ['addOne', { method: 'POST', path: `${this.path}` }],
    ['patchOne', { method: 'PATCH', path: `${this.path}` }],
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
    this.router.post(this._routes.get('addOne').path, this.addSat);
    this.router.patch(this._routes.get('patchOne').path, this.patchSat);
    this.router.get(this._routes.get('getById').path, this.getSatById);
  }

  getAllSats = (_req: express.Request, res: express.Response) => {
    res.send(this.satService.getAll());
  };

  addSat = (req: express.Request, res: express.Response) => {
    const sat = req.body;
    if (!this.satService.canCreateSatellite(sat)) {
      res.send(400).json({ message: 'Invalid properties provided.' });
    }
    try {
      const newSat = this.satService.addOne({ ...sat, id: undefined });
      res.send(newSat);
    } catch {
      res.send(500);
    }
  };

  patchSat = (req: express.Request, res: express.Response) => {
    const sat = req.body;
    if (!this.satService.canPatchSatellite(sat)) {
      res.send(400).json({ message: 'Invalid properties provided.' });
    }
    try {
      const patchedSat = this.satService.patchOne(sat);
      res.send(patchedSat);
    } catch {
      res.send(500);
    }
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
