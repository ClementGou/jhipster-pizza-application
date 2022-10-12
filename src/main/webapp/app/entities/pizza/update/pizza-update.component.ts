import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { PizzaFormService, PizzaFormGroup } from './pizza-form.service';
import { IPizza } from '../pizza.model';
import { PizzaService } from '../service/pizza.service';
import { ICommande } from 'app/entities/commande/commande.model';
import { CommandeService } from 'app/entities/commande/service/commande.service';

@Component({
  selector: 'jhi-pizza-update',
  templateUrl: './pizza-update.component.html',
})
export class PizzaUpdateComponent implements OnInit {
  isSaving = false;
  pizza: IPizza | null = null;

  commandesSharedCollection: ICommande[] = [];

  editForm: PizzaFormGroup = this.pizzaFormService.createPizzaFormGroup();

  constructor(
    protected pizzaService: PizzaService,
    protected pizzaFormService: PizzaFormService,
    protected commandeService: CommandeService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareCommande = (o1: ICommande | null, o2: ICommande | null): boolean => this.commandeService.compareCommande(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ pizza }) => {
      this.pizza = pizza;
      if (pizza) {
        this.updateForm(pizza);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const pizza = this.pizzaFormService.getPizza(this.editForm);
    if (pizza.id !== null) {
      this.subscribeToSaveResponse(this.pizzaService.update(pizza));
    } else {
      this.subscribeToSaveResponse(this.pizzaService.create(pizza));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPizza>>): void {
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

  protected updateForm(pizza: IPizza): void {
    this.pizza = pizza;
    this.pizzaFormService.resetForm(this.editForm, pizza);

    this.commandesSharedCollection = this.commandeService.addCommandeToCollectionIfMissing<ICommande>(
      this.commandesSharedCollection,
      pizza.commandes
    );
  }

  protected loadRelationshipsOptions(): void {
    this.commandeService
      .query()
      .pipe(map((res: HttpResponse<ICommande[]>) => res.body ?? []))
      .pipe(
        map((commandes: ICommande[]) => this.commandeService.addCommandeToCollectionIfMissing<ICommande>(commandes, this.pizza?.commandes))
      )
      .subscribe((commandes: ICommande[]) => (this.commandesSharedCollection = commandes));
  }
}
