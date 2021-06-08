import { HttpError } from '@mwinberry/doc-ts';

const StatusSet = new Set<string>([
  'Awaiting Maneuver',
  'Preparing Maneuver',
  'Executing Maneuver',
  'Maneuver Completed'
]);

export const validateStatus = (status: string) => StatusSet.has(status);
export const invalidStatusMessage = `Status must be one of the following: ${Array.from(StatusSet.values()).join(', ')}`;

export const evaluateSatelliteStatus = (arg: any): boolean => {
  if (validateStatus(arg)) return true;
  else throw new HttpError(400, invalidStatusMessage);
};
