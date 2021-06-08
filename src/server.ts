import morgan from 'morgan';
import express from 'express';
import { DocApp, DocAppConfig } from '@mwinberry/doc-ts';
import SatelliteController from './Satellites/satellites.controller';
import { initDatabase } from './common/dbConfig';

async function main() {
  const port = +process.env.PORT;
  const config: DocAppConfig = {
    showApi: true,
    expressApplication: express(),
    controllers: [new SatelliteController()],
    middleware: [express.json(), morgan('combined')]
  };
  const appV1 = new DocApp(config);

  await initDatabase();
  appV1.expressApplication.listen(port, () => {
    console.log(`DocApp listening on the port ${port}`);
    if (appV1.showApi) console.log(`View v1: http://localhost:${port}${appV1.path}`);
  });
}
main();
