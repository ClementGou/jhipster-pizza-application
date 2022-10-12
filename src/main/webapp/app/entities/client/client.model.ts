import { IPizza } from 'app/entities/pizza/pizza.model';

export interface IClient {
  id: number;
  nom?: string | null;
  numeroTelephone?: string | null;
  email?: string | null;
  pizza?: Pick<IPizza, 'id'> | null;
}

export type NewClient = Omit<IClient, 'id'> & { id: null };
