import express, { Router } from 'express';
import Controller from './common/controller';
import { RouteDoc } from './common/RouteDoc';
import mongoose from 'mongoose';
// import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(process.env.NODE_ENV + '.env') });

class App {
  app: express.Application;
  router: Router;
  port = +process.env.SERVER_PORT;
  routes: RouteDoc[] = [{ method: 'GET', path: '/' }];
  mongoUrl: string = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@localhost:${process.env.MONGO_PORT}/${process.env.MONGO_SERVER}?authSource=admin`;

  constructor(controllers: Controller[]) {
    this.app = express();
    this.router = express.Router();
    this.initMongo();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
  }

  initializeMiddlewares() {
    this.app.use(morgan('tiny'));
    // this.app.use(cors);
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  initMongo(): void {
    mongoose.connect(this.mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    });
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
