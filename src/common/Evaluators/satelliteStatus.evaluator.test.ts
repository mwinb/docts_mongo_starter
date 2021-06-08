import { evaluateSatelliteStatus } from './satelliteStatus.evaluator';

describe('evaluating satellite status', () => {
  it('returns true if valid satellite status', () => {
    expect(evaluateSatelliteStatus('Awaiting Maneuver')).toBeTruthy();
  });

  it('throws a 400 if it is an invalid satellite status', () => {
    let thrownError;
    try {
      evaluateSatelliteStatus('Invalid Status');
    } catch (error) {
      thrownError = error;
    }
    expect(thrownError.code).toBe(400);
  });
});
