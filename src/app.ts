import express from 'express';
import * as bodyParser from 'body-parser';
import Controller from './common/controller';
import { RouteDoc } from './common/RouteDoc';

class App {
  app: express.Application;
  port: number;
  routes: RouteDoc[] = [{ method: 'GET', path: '/' }];

  constructor(controllers: Controller[], port: number) {
    this.app = express();
    this.port = port;

    this.initializeMiddlewares();
    this.initializeControllers(controllers);
  }

  initializeMiddlewares() {
    this.app.use(bodyParser.json());
  }

  initializeControllers(controllers: Controller[]) {
    controllers.forEach(controller => {
      this.app.use('/', controller.router);
      this.routes = [...this.routes, ...controller.routes];
    });
    this.app.use('/', this.home);
  }

  home = (_req: express.Request, res: express.Response) => {
    res.send(
      `<!doctype html>

      <html lang="en">
      <head>
        <meta charset="utf-8">
        <title>TS Express Starter</title>
      </head>
      
      <body>
        <H1>Active Routes:</H1>
        ${(() => {
          let routesHtml = '';
          this.routes.forEach(val => {
            routesHtml += `<h3>${val.method} : ${val.path}</h3>`;
          });
          return routesHtml;
        })()}
      </body>
      </html>`
    );
  };

  listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
      console.log(`View Routes: http://localhost:${this.port}`);
    });
  }
}

export default App;
