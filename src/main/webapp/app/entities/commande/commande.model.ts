import dayjs from 'dayjs/esm';
import { IClient } from 'app/entities/client/client.model';

export interface ICommande {
  id: number;
  estAEmporter?: boolean | null;
  dateHeureCreation?: dayjs.Dayjs | null;
  dateHeureLivraison?: dayjs.Dayjs | null;
  client?: Pick<IClient, 'id'> | null;
}

export type NewCommande = Omit<ICommande, 'id'> & { id: null };
