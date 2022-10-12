import { IClient, NewClient } from './client.model';

export const sampleWithRequiredData: IClient = {
  id: 71655,
};

export const sampleWithPartialData: IClient = {
  id: 43452,
  numeroTelephone: 'primary Poitou-Charentes Concrete',
};

export const sampleWithFullData: IClient = {
  id: 92689,
  nom: 'Sleek',
  numeroTelephone: 'c de Bedfordshire',
  email: 'Anselme_Pons71@yahoo.fr',
};

export const sampleWithNewData: NewClient = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
