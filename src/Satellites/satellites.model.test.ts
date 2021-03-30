import { Model } from 'mongoose';
import Satellite, { SatModel, seedSats, StatusSet, statusValidator } from './satellites.model';

const mockSats = ([
  {
    status: 'Awaiting Maneuver',
    _id: '6001ac07f9439a66a26571b6',
    name: 'I am a new Satellite',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lat: 479,
    lon: 243,
    __v: 0
  }
] as unknown) as Satellite[];

it('returns true if status is in status set', () => {
  expect(statusValidator(Array.from(StatusSet.values()).pop())).toBeTruthy();
});

it('returns false if status not in status set', () => {
  expect(statusValidator('I am not a valid status.')).toBeFalsy();
});

describe('Seeding Satellites', () => {
  it('seeds satellites', async () => {
    jest.spyOn(SatModel, 'insertMany').mockImplementation(() => {
      return mockSats;
    });
    await seedSats();
    expect(SatModel.insertMany).toHaveBeenCalled();
  });

  it('logs if the Satellites are already seeded', async () => {
    jest.spyOn(SatModel, 'insertMany').mockImplementation(async () => {
      throw new Error('Error');
    });
    jest.spyOn(console, 'log');
    await seedSats();
    expect(console.log).toHaveBeenCalledWith('Already seeded.');
  });
});
