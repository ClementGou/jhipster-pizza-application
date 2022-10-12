import dayjs from 'dayjs/esm';

import { ICommande, NewCommande } from './commande.model';

export const sampleWithRequiredData: ICommande = {
  id: 5189,
};

export const sampleWithPartialData: ICommande = {
  id: 42552,
  estAEmporter: true,
  dateHeureLivraison: dayjs('2022-10-12T13:23'),
};

export const sampleWithFullData: ICommande = {
  id: 20165,
  estAEmporter: true,
  dateHeureCreation: dayjs('2022-10-11T19:57'),
  dateHeureLivraison: dayjs('2022-10-12T04:47'),
};

export const sampleWithNewData: NewCommande = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
