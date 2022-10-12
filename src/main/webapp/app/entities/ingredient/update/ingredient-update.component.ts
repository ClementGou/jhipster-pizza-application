import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IngredientFormService, IngredientFormGroup } from './ingredient-form.service';
import { IIngredient } from '../ingredient.model';
import { IngredientService } from '../service/ingredient.service';
import { IPizza } from 'app/entities/pizza/pizza.model';
import { PizzaService } from 'app/entities/pizza/service/pizza.service';

@Component({
  selector: 'jhi-ingredient-update',
  templateUrl: './ingredient-update.component.html',
})
export class IngredientUpdateComponent implements OnInit {
  isSaving = false;
  ingredient: IIngredient | null = null;

  pizzasSharedCollection: IPizza[] = [];

  editForm: IngredientFormGroup = this.ingredientFormService.createIngredientFormGroup();

  constructor(
    protected ingredientService: IngredientService,
    protected ingredientFormService: IngredientFormService,
    protected pizzaService: PizzaService,
    protected activatedRoute: ActivatedRoute
  ) {}

  comparePizza = (o1: IPizza | null, o2: IPizza | null): boolean => this.pizzaService.comparePizza(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ ingredient }) => {
      this.ingredient = ingredient;
      if (ingredient) {
        this.updateForm(ingredient);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const ingredient = this.ingredientFormService.getIngredient(this.editForm);
    if (ingredient.id !== null) {
      this.subscribeToSaveResponse(this.ingredientService.update(ingredient));
    } else {
      this.subscribeToSaveResponse(this.ingredientService.create(ingredient));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IIngredient>>): void {
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

  protected updateForm(ingredient: IIngredient): void {
    this.ingredient = ingredient;
    this.ingredientFormService.resetForm(this.editForm, ingredient);

    this.pizzasSharedCollection = this.pizzaService.addPizzaToCollectionIfMissing<IPizza>(this.pizzasSharedCollection, ingredient.pizza);
  }

  protected loadRelationshipsOptions(): void {
    this.pizzaService
      .query()
      .pipe(map((res: HttpResponse<IPizza[]>) => res.body ?? []))
      .pipe(map((pizzas: IPizza[]) => this.pizzaService.addPizzaToCollectionIfMissing<IPizza>(pizzas, this.ingredient?.pizza)))
      .subscribe((pizzas: IPizza[]) => (this.pizzasSharedCollection = pizzas));
  }
}
