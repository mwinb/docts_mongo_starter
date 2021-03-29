import { StatusSet, statusValidator } from './satellites.model';

it('returns true if status is in status set', () => {
  expect(statusValidator(Array.from(StatusSet.values()).pop())).toBeTruthy();
});

it('returns false if status not in status set', () => {
  expect(statusValidator('I am not a valid status.')).toBeFalsy();
});
