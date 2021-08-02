import { HttpError } from 'vaports';

export const evaluateJsonContent = (arg: string) => {
  if (!arg.includes('application/json')) {
    throw new HttpError(400, 'This endpoint only supports content-type: application/json');
  }
  return true;
};
