import express from 'express';
import { postSatelliteValidator, patchSatelliteValidator } from '../common/Validators/satellite.validator';
import { Satellite } from './satellites.model';
import SatelliteService from './satellites.service';
import { Controller, Route, Validate } from 'vaports';
import jsonContentValidator from '../common/Validators/jsonContent.validator';
import idValidator from '../common/Validators/id.validator';
import SatelliteDefinition from '../common/Definitions/satellite.definition';

@Controller('/satellite')
class SatelliteController {
  exampleModel = {
    _id: '10101092ijsdfkj',
    name: 'Sat Name',
    lat: 1234,
    lon: 1234,
    status: 'Awaiting Maneuver'
  } as Satellite;

  constructor(public satService = new SatelliteService()) {}

  @Route('GET', { responseCode: 200 })
  async getAllSats(): Promise<Satellite[]> {
    return await this.satService.getAll();
  }

  @Route('GET', { path: '/:id' })
  @Validate(idValidator, 'params')
  async getSatById({ params: { id } }: express.Request): Promise<Satellite> {
    return await this.satService.getOne(id);
  }

  @Route('POST', { responseCode: 201 })
  @Validate(postSatelliteValidator, 'body')
  @Validate(jsonContentValidator, 'headers', { strip: false })
  async addSat({ body: sat }: express.Request): Promise<Satellite> {
    return await this.satService.addOne(sat);
  }

  @Route('PATCH')
  @Validate(patchSatelliteValidator, 'body')
  @Validate(jsonContentValidator, 'headers', { strip: false })
  async patchSat({ body: sat }: express.Request): Promise<Satellite> {
    return await this.satService.patchOne(sat);
  }

  @Route('GET', { path: '-api', handleErrors: false })
  getModel() {
    return `<!doctype html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <title>DocTS Example</title>
      </head>
      <body>
        <h1>Satellite Example:</h1>
        <h2>
        <pre>${JSON.stringify(this.exampleModel, null, 2)}<pre>
        </h2>
        <h1>Satellite Schema:</h1>
        <h2>
        <pre>${JSON.stringify(SatelliteDefinition, null, 2)}<pre>
        </h2>
      </body>
      </html>`;
  }
}

export default SatelliteController;
