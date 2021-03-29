import { Request, Response } from 'express';
import BaseRoutes from '../common/BaseRoutes';
import SatelliteService from './satellites.service';
import Satellite, { SatelliteSchema } from './satellites.model';
import { Controller, Route } from '@mwinberry/doc-ts';

@Controller(BaseRoutes.satellite)
class SatelliteController {
  exampleModel: Satellite = {
    name: 'Sat Name',
    lat: 1234,
    lon: 1234,
    status: 'Example Satus',
    _id: '1293109jfsadfkjw',
    _v: '1.0'
  };

  constructor(private satService = SatelliteService.instance()) {}
  @Route('GET')
  async getAllSats(_req: Request, res: Response): Promise<void> {
    res.send(await this.satService.getAll());
  }

  @Route('POST')
  async addSat(req: Request, res: Response): Promise<void> {
    const sat = req.body;
    res.json(await this.satService.addOne(sat));
  }

  @Route('PATCH')
  async patchSat(req: Request, res: Response): Promise<void> {
    const sat = req.body;
    res.send(await this.satService.patchOne(sat));
  }
  @Route('GET', { path: '/:id' })
  async getSatById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    res.json(await this.satService.getOne(id));
  }
  @Route('GET', { path: '-api' })
  async getModel(_req: Request, res: Response): Promise<void> {
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
  }
}

export default SatelliteController;
