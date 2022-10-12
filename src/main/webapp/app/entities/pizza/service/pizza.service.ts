import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPizza, NewPizza } from '../pizza.model';

export type PartialUpdatePizza = Partial<IPizza> & Pick<IPizza, 'id'>;

export type EntityResponseType = HttpResponse<IPizza>;
export type EntityArrayResponseType = HttpResponse<IPizza[]>;

@Injectable({ providedIn: 'root' })
export class PizzaService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/pizzas');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(pizza: NewPizza): Observable<EntityResponseType> {
    return this.http.post<IPizza>(this.resourceUrl, pizza, { observe: 'response' });
  }

  update(pizza: IPizza): Observable<EntityResponseType> {
    return this.http.put<IPizza>(`${this.resourceUrl}/${this.getPizzaIdentifier(pizza)}`, pizza, { observe: 'response' });
  }

  partialUpdate(pizza: PartialUpdatePizza): Observable<EntityResponseType> {
    return this.http.patch<IPizza>(`${this.resourceUrl}/${this.getPizzaIdentifier(pizza)}`, pizza, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPizza>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPizza[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getPizzaIdentifier(pizza: Pick<IPizza, 'id'>): number {
    return pizza.id;
  }

  comparePizza(o1: Pick<IPizza, 'id'> | null, o2: Pick<IPizza, 'id'> | null): boolean {
    return o1 && o2 ? this.getPizzaIdentifier(o1) === this.getPizzaIdentifier(o2) : o1 === o2;
  }

  addPizzaToCollectionIfMissing<Type extends Pick<IPizza, 'id'>>(
    pizzaCollection: Type[],
    ...pizzasToCheck: (Type | null | undefined)[]
  ): Type[] {
    const pizzas: Type[] = pizzasToCheck.filter(isPresent);
    if (pizzas.length > 0) {
      const pizzaCollectionIdentifiers = pizzaCollection.map(pizzaItem => this.getPizzaIdentifier(pizzaItem)!);
      const pizzasToAdd = pizzas.filter(pizzaItem => {
        const pizzaIdentifier = this.getPizzaIdentifier(pizzaItem);
        if (pizzaCollectionIdentifiers.includes(pizzaIdentifier)) {
          return false;
        }
        pizzaCollectionIdentifiers.push(pizzaIdentifier);
        return true;
      });
      return [...pizzasToAdd, ...pizzaCollection];
    }
    return pizzaCollection;
  }
}
