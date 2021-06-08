import { HttpError } from '@mwinberry/doc-ts';
import { isValidObjectId } from 'mongoose';

export const evaluateObjectId = (arg: any) => {
  if (isValidObjectId(arg)) return true;
  else throw new HttpError(400, 'Invalid Object Id.');
};
