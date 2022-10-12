import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IIngredient, NewIngredient } from '../ingredient.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IIngredient for edit and NewIngredientFormGroupInput for create.
 */
type IngredientFormGroupInput = IIngredient | PartialWithRequiredKeyOf<NewIngredient>;

type IngredientFormDefaults = Pick<NewIngredient, 'id'>;

type IngredientFormGroupContent = {
  id: FormControl<IIngredient['id'] | NewIngredient['id']>;
  nom: FormControl<IIngredient['nom']>;
  quantite: FormControl<IIngredient['quantite']>;
  prix: FormControl<IIngredient['prix']>;
  pizza: FormControl<IIngredient['pizza']>;
};

export type IngredientFormGroup = FormGroup<IngredientFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class IngredientFormService {
  createIngredientFormGroup(ingredient: IngredientFormGroupInput = { id: null }): IngredientFormGroup {
    const ingredientRawValue = {
      ...this.getFormDefaults(),
      ...ingredient,
    };
    return new FormGroup<IngredientFormGroupContent>({
      id: new FormControl(
        { value: ingredientRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      nom: new FormControl(ingredientRawValue.nom),
      quantite: new FormControl(ingredientRawValue.quantite),
      prix: new FormControl(ingredientRawValue.prix),
      pizza: new FormControl(ingredientRawValue.pizza),
    });
  }

  getIngredient(form: IngredientFormGroup): IIngredient | NewIngredient {
    return form.getRawValue() as IIngredient | NewIngredient;
  }

  resetForm(form: IngredientFormGroup, ingredient: IngredientFormGroupInput): void {
    const ingredientRawValue = { ...this.getFormDefaults(), ...ingredient };
    form.reset(
      {
        ...ingredientRawValue,
        id: { value: ingredientRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): IngredientFormDefaults {
    return {
      id: null,
    };
  }
}
