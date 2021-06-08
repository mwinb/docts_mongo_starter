import { SchemaDefinition } from 'mongoose';
import { Satellite } from '../../Satellites/satellites.model';
import { validateStatus, invalidStatusMessage } from '../Evaluators/satelliteStatus.evaluator';

const SatelliteDefinition: SchemaDefinition<Satellite> = {
  name: {
    type: String,
    unique: true,
    required: [true, 'Satellite requires name']
  },
  status: {
    type: String,
    validate: {
      validator: validateStatus,
      message: invalidStatusMessage
    },
    default: 'Awaiting Maneuver'
  },
  lat: {
    type: Number
  },
  lon: {
    type: Number
  }
};
export default SatelliteDefinition;
