import express, { Router } from 'express';
import Controller from './common/controller';
import { RouteDoc } from './common/RouteDoc';

class App {
  app: express.Application;
  router: Router;
  port: number;
  routes: RouteDoc[] = [{ method: 'GET', path: '/' }];

  constructor(controllers: Controller[], port: number) {
    this.app = express();
    this.port = port;
    this.router = express.Router();

    this.initializeMiddlewares();
    this.initializeControllers(controllers);
  }

  initializeMiddlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  initializeControllers(controllers: Controller[]) {
    controllers.forEach(controller => {
      controller.initializeRoutes(this.router);
      this.routes = [...this.routes, ...controller.routes];
    });
    this.app.use('/', this.router);
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
