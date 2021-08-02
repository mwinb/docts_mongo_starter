import { HttpError } from 'vaports';
import { isValidObjectId } from 'mongoose';

export const evaluateObjectId = (arg: any) => {
  if (isValidObjectId(arg)) return true;
  else throw new HttpError(400, 'Invalid Object Id.');
};
