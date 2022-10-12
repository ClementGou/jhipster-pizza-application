import { IPizza, NewPizza } from './pizza.model';

export const sampleWithRequiredData: IPizza = {
  id: 41114,
};

export const sampleWithPartialData: IPizza = {
  id: 45457,
  nom: 'application Fish',
};

export const sampleWithFullData: IPizza = {
  id: 71699,
  nom: 'Indian',
  prix: 44241,
};

export const sampleWithNewData: NewPizza = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
