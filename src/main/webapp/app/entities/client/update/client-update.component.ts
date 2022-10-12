import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ClientFormService, ClientFormGroup } from './client-form.service';
import { IClient } from '../client.model';
import { ClientService } from '../service/client.service';
import { IPizza } from 'app/entities/pizza/pizza.model';
import { PizzaService } from 'app/entities/pizza/service/pizza.service';

@Component({
  selector: 'jhi-client-update',
  templateUrl: './client-update.component.html',
})
export class ClientUpdateComponent implements OnInit {
  isSaving = false;
  client: IClient | null = null;

  pizzasSharedCollection: IPizza[] = [];

  editForm: ClientFormGroup = this.clientFormService.createClientFormGroup();

  constructor(
    protected clientService: ClientService,
    protected clientFormService: ClientFormService,
    protected pizzaService: PizzaService,
    protected activatedRoute: ActivatedRoute
  ) {}

  comparePizza = (o1: IPizza | null, o2: IPizza | null): boolean => this.pizzaService.comparePizza(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ client }) => {
      this.client = client;
      if (client) {
        this.updateForm(client);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const client = this.clientFormService.getClient(this.editForm);
    if (client.id !== null) {
      this.subscribeToSaveResponse(this.clientService.update(client));
    } else {
      this.subscribeToSaveResponse(this.clientService.create(client));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IClient>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(client: IClient): void {
    this.client = client;
    this.clientFormService.resetForm(this.editForm, client);

    this.pizzasSharedCollection = this.pizzaService.addPizzaToCollectionIfMissing<IPizza>(this.pizzasSharedCollection, client.pizza);
  }

  protected loadRelationshipsOptions(): void {
    this.pizzaService
      .query()
      .pipe(map((res: HttpResponse<IPizza[]>) => res.body ?? []))
      .pipe(map((pizzas: IPizza[]) => this.pizzaService.addPizzaToCollectionIfMissing<IPizza>(pizzas, this.client?.pizza)))
      .subscribe((pizzas: IPizza[]) => (this.pizzasSharedCollection = pizzas));
  }
}
