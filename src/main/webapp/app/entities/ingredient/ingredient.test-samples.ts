import { IIngredient, NewIngredient } from './ingredient.model';

export const sampleWithRequiredData: IIngredient = {
  id: 37469,
};

export const sampleWithPartialData: IIngredient = {
  id: 48440,
  prix: 34624,
};

export const sampleWithFullData: IIngredient = {
  id: 27456,
  nom: 'parsing a',
  quantite: 60209,
  prix: 22664,
};

export const sampleWithNewData: NewIngredient = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
