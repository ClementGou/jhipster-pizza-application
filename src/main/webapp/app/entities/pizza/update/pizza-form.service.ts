import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IPizza, NewPizza } from '../pizza.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPizza for edit and NewPizzaFormGroupInput for create.
 */
type PizzaFormGroupInput = IPizza | PartialWithRequiredKeyOf<NewPizza>;

type PizzaFormDefaults = Pick<NewPizza, 'id'>;

type PizzaFormGroupContent = {
  id: FormControl<IPizza['id'] | NewPizza['id']>;
  nom: FormControl<IPizza['nom']>;
  prix: FormControl<IPizza['prix']>;
  commandes: FormControl<IPizza['commandes']>;
};

export type PizzaFormGroup = FormGroup<PizzaFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PizzaFormService {
  createPizzaFormGroup(pizza: PizzaFormGroupInput = { id: null }): PizzaFormGroup {
    const pizzaRawValue = {
      ...this.getFormDefaults(),
      ...pizza,
    };
    return new FormGroup<PizzaFormGroupContent>({
      id: new FormControl(
        { value: pizzaRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      nom: new FormControl(pizzaRawValue.nom),
      prix: new FormControl(pizzaRawValue.prix),
      commandes: new FormControl(pizzaRawValue.commandes),
    });
  }

  getPizza(form: PizzaFormGroup): IPizza | NewPizza {
    return form.getRawValue() as IPizza | NewPizza;
  }

  resetForm(form: PizzaFormGroup, pizza: PizzaFormGroupInput): void {
    const pizzaRawValue = { ...this.getFormDefaults(), ...pizza };
    form.reset(
      {
        ...pizzaRawValue,
        id: { value: pizzaRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): PizzaFormDefaults {
    return {
      id: null,
    };
  }
}
