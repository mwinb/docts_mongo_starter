import { String, Number } from 'vaports';
import { SatStatus } from '../../Satellites/satellites.model';
import { evaluateObjectId } from '../Evaluators/objectId.evaluator';
import { evaluateSatelliteStatus } from '../Evaluators/satelliteStatus.evaluator';

class PostSatelliteValidator {
  @String()
  name: string;

  @Number()
  lat: number;

  @Number()
  lon: number;

  @String({ evaluators: [evaluateSatelliteStatus] })
  status: SatStatus;
}

class PatchSatelliteValidator {
  @String({ evaluators: [evaluateObjectId] })
  _id: string;

  @String({ optional: true })
  name: string;

  @Number({ optional: true })
  lat: number;

  @Number({ optional: true })
  lon: number;

  @String({ evaluators: [evaluateSatelliteStatus], optional: true })
  status: SatStatus;
}

export const postSatelliteValidator = new PostSatelliteValidator();
export const patchSatelliteValidator = new PatchSatelliteValidator();
