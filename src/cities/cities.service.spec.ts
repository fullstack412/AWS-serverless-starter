import { expect } from 'chai';
import { Chance } from 'chance';
import { Done } from 'mocha';
import { instance, mock, reset, when } from 'ts-mockito';

import { ErrorResult, ForbiddenResult, NotFoundResult } from '../../shared/errors';
import { CitiesServiceSettings, City, GetCityResult } from './cities.interfaces';
import { CitiesRepository } from './cities.repository';
import { CitiesService } from './cities.service';

// tslint:disable no-unsafe-any (Generates false alarm with ts-mockito functions.)

const chance: Chance.Chance = new Chance();

const defaultCountry: string = 'SomeCountry';

describe('CitiesService', () => {
  const citiesRepositoryMock: CitiesRepository = mock(CitiesRepository);
  const citiesRepositoryMockInstance: CitiesRepository = instance(citiesRepositoryMock);
  let citiesServiceSettings: CitiesServiceSettings;
  let service: CitiesService;
  let testCity: City;

  beforeEach(() => {
    reset(citiesRepositoryMock);
    testCity = {
      country: chance.country(),
      id: chance.natural(),
      name: chance.city(),
      populationDensity: chance.natural()
    };
    citiesServiceSettings = { defaultCountry };
    service = new CitiesService(citiesRepositoryMockInstance, citiesServiceSettings);
    when(citiesRepositoryMock.exists(testCity.id)).thenReturn(true);
    when(citiesRepositoryMock.hasAccess(testCity.id)).thenReturn(true);
    when(citiesRepositoryMock.getCity(testCity.id, defaultCountry)).thenReturn(testCity);
  });

  describe('getCity function', () => {
    it('should resolve with the id it gets from repository', async () => {
      const result: GetCityResult = await service.getCity(testCity.id);
      expect(result.city.id).to.equal(testCity.id);
    });

    it('should resolve with the country it gets from repository', async () => {
      const result: GetCityResult = await service.getCity(testCity.id);
      expect(result.city.country).to.equal(testCity.country);
    });

    it('should reject for non-existing ID', (done: Done) => {
      const id: number = chance.natural();
      when(citiesRepositoryMock.exists(id)).thenReturn(false);

      service.getCity(id)
        .catch((error: ErrorResult) => {
          expect(error instanceof NotFoundResult).to.equal(true);
          done();
        });
    });

    it('should reject for ID without permission', (done: Done) => {
      const id: number = chance.natural();
      when(citiesRepositoryMock.exists(id)).thenReturn(true);
      when(citiesRepositoryMock.hasAccess(id)).thenReturn(false);

      service.getCity(id)
        .catch((error: ErrorResult) => {
          expect(error instanceof ForbiddenResult).to.equal(true);
          done();
        });
    });

    it('should reject if the repository call fails', (done: Done) => {
      const id: number = chance.natural();
      when(citiesRepositoryMock.exists(id)).thenThrow(new Error());

      service.getCity(id)
        .catch((error: Error) => {
          expect(error instanceof Error).to.equal(true);
          done();
        });
    });
  });
});
