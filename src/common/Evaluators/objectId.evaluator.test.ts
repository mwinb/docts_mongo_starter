import SatelliteModel from '../../Satellites/satellites.model';
import { evaluateObjectId } from './objectId.evaluator';

describe('objectId evaluator', () => {
  it('returns true if a valid object id', () => {
    const { _id } = new SatelliteModel({ name: 'Sat', lat: 500, lon: 500, status: 'Awaiting Maneuver' });
    expect(evaluateObjectId(_id)).toBeTruthy();
  });

  it('throws a 400 if the objectId is invalid', () => {
    let thrownError;
    try {
      evaluateObjectId('1010101');
    } catch (error) {
      thrownError = error;
    }
    expect(thrownError.code).toBe(400);
  });
});
