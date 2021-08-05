import morgan from 'morgan';
import { VaporApp, VaporConfig } from 'vaports';
import { initDatabase } from './common/dbConfig';
import SatelliteController from './Satellites/satellites.controller';
import fastify from 'fastify';
import middie from 'middie';

async function main() {
  const app = fastify();
  await app.register(middie);
  const port = +process.env.PORT;
  const config: VaporConfig = {
    showApi: true,
    expressApplication: app,
    controllers: [new SatelliteController()],
    middleware: [morgan('combined')],
    path: '/'
  };
  const appV1 = new VaporApp(config);

  await initDatabase();
  appV1.expressApplication.listen(port, () => {
    console.log(`VaporApp listening on the port ${port}`);
    if (appV1.showApi) console.log(`View v1: http://localhost:${port}${appV1.path}`);
  });
}
main();
