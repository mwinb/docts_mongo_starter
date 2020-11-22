import App from './app';
import SatelliteController from './Satellites/satellites.controller';

const app = new App([new SatelliteController()], 5000);

app.listen();
