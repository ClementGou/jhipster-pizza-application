import { ICommande } from 'app/entities/commande/commande.model';

export interface IPizza {
  id: number;
  nom?: string | null;
  prix?: number | null;
  commandes?: Pick<ICommande, 'id'> | null;
}

export type NewPizza = Omit<IPizza, 'id'> & { id: null };
