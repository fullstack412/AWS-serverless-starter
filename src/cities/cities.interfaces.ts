export interface City {
  country: string;
  id: number;
  name: string;
  populationDensity: number;
}

export interface GetCityResult {
  city: City;
}

export type CitiesServiceSettings = {
  defaultCountry: string;
};
