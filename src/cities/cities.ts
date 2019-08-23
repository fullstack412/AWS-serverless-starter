import { ApiHandler } from '../../shared/api.interfaces';

import { CitiesController } from './cities.controller';
import { CitiesServiceSettings } from './cities.interfaces';
import { CitiesRepository } from './cities.repository';
import { CitiesService } from './cities.service';

const DEFAULT_COUNTRY: string = process.env.DEFAULT_COUNTRY as string || 'Hungary';
const citiesServiceSettings: CitiesServiceSettings = {
  defaultCountry: DEFAULT_COUNTRY
};

const repo: CitiesRepository = new CitiesRepository();
const service: CitiesService = new CitiesService(repo, citiesServiceSettings);
const controller: CitiesController = new CitiesController(service);

export const getCity: ApiHandler = controller.getCity;
