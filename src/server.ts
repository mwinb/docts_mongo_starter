import App from './app';
import SatelliteController from './Satellites/satellites.controller';

const app = new App([new SatelliteController()]);

app.listen();
