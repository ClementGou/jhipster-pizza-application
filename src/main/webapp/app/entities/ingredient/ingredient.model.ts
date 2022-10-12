import { IPizza } from 'app/entities/pizza/pizza.model';

export interface IIngredient {
  id: number;
  nom?: string | null;
  quantite?: number | null;
  prix?: number | null;
  pizza?: Pick<IPizza, 'id'> | null;
}

export type NewIngredient = Omit<IIngredient, 'id'> & { id: null };
