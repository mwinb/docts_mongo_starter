import express, { Request, Response, Router } from 'express';
import Controller from '../common/controller';
import BaseRoutes from '../common/BaseRoutes';
import SatelliteService from './satellites.service';
import { RouteDoc } from '../common/RouteDoc';
import Satellite, { SatelliteSchema } from './satellites.model';

class SatelliteController extends Controller {
  routeMap = new Map<string, RouteDoc>([
    ['getAll', { method: 'GET', path: `${this.path}` }],
    ['getById', { method: 'GET', path: `${this.path}/:id` }],
    ['getModel', { method: 'GET', path: `${this.path}/model` }],
    ['addOne', { method: 'POST', path: `${this.path}` }],
    ['patchOne', { method: 'PATCH', path: `${this.path}` }]
  ]);
  exampleModel: Satellite = {
    name: 'Sat Name',
    lat: 1234,
    lon: 1234,
    status: 'Example Satus',
    _id: '1293109jfsadfkjw',
    _v: '1.0'
  };

  constructor(private satService = SatelliteService.instance(), path = BaseRoutes.satellite) {
    super(path);
    this.satService = satService;
  }

  initializeRoutes(router: Router): void {
    router.get(this.routeMap.get('getModel').path, this.getModel);
    router.get(this.routeMap.get('getById').path, this.getSatById);
    router.get(this.routeMap.get('getAll').path, this.getAllSats);
    router.post(this.routeMap.get('addOne').path, this.addSat);
    router.patch(this.routeMap.get('patchOne').path, this.patchSat);
  }

  getAllSats = async (_req: Request, res: Response) => {
    res.send(await this.satService.getAll());
  };

  addSat = async (req: Request, res: Response) => {
    const sat = req.body;

    const newSat: any = await this.satService.addOne(sat);
    if (newSat.code) {
      res.status(newSat.code).json(newSat);
    } else {
      res.json(newSat);
    }
  };

  patchSat = async (req: Request, res: Response) => {
    const sat = req.body;
    const patchedSat: any = await this.satService.patchOne(sat);
    if (patchedSat.code) res.status(patchedSat.code).json(patchedSat);
    else res.send(patchedSat);
  };

  getSatById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const sat: any = await this.satService.getOne(id);
    if (sat.code) res.status(sat.code).json(sat);
    else res.json(sat);
  };

  getModel = (_req: Request, res: Response) => {
    res.send(
      `<!doctype html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <title>TS Express Starter</title>
      </head>
      <body>
        <h1>Satellite Response Example:</h1>
        <h2>
        <pre>${JSON.stringify(this.exampleModel, undefined, 2)}<pre>
        </h2>
        <h1>Satellite Schema:</h1>
        <h2>
        <pre>${JSON.stringify(SatelliteSchema.obj, undefined, 2)}</pre>
        </h2>
      </body>
      </html>`
    );
  };
}

export default SatelliteController;
