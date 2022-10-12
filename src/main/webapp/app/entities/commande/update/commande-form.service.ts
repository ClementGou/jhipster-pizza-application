import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ICommande, NewCommande } from '../commande.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICommande for edit and NewCommandeFormGroupInput for create.
 */
type CommandeFormGroupInput = ICommande | PartialWithRequiredKeyOf<NewCommande>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ICommande | NewCommande> = Omit<T, 'dateHeureCreation' | 'dateHeureLivraison'> & {
  dateHeureCreation?: string | null;
  dateHeureLivraison?: string | null;
};

type CommandeFormRawValue = FormValueOf<ICommande>;

type NewCommandeFormRawValue = FormValueOf<NewCommande>;

type CommandeFormDefaults = Pick<NewCommande, 'id' | 'estAEmporter' | 'dateHeureCreation' | 'dateHeureLivraison'>;

type CommandeFormGroupContent = {
  id: FormControl<CommandeFormRawValue['id'] | NewCommande['id']>;
  estAEmporter: FormControl<CommandeFormRawValue['estAEmporter']>;
  dateHeureCreation: FormControl<CommandeFormRawValue['dateHeureCreation']>;
  dateHeureLivraison: FormControl<CommandeFormRawValue['dateHeureLivraison']>;
  client: FormControl<CommandeFormRawValue['client']>;
};

export type CommandeFormGroup = FormGroup<CommandeFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CommandeFormService {
  createCommandeFormGroup(commande: CommandeFormGroupInput = { id: null }): CommandeFormGroup {
    const commandeRawValue = this.convertCommandeToCommandeRawValue({
      ...this.getFormDefaults(),
      ...commande,
    });
    return new FormGroup<CommandeFormGroupContent>({
      id: new FormControl(
        { value: commandeRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      estAEmporter: new FormControl(commandeRawValue.estAEmporter),
      dateHeureCreation: new FormControl(commandeRawValue.dateHeureCreation),
      dateHeureLivraison: new FormControl(commandeRawValue.dateHeureLivraison),
      client: new FormControl(commandeRawValue.client),
    });
  }

  getCommande(form: CommandeFormGroup): ICommande | NewCommande {
    return this.convertCommandeRawValueToCommande(form.getRawValue() as CommandeFormRawValue | NewCommandeFormRawValue);
  }

  resetForm(form: CommandeFormGroup, commande: CommandeFormGroupInput): void {
    const commandeRawValue = this.convertCommandeToCommandeRawValue({ ...this.getFormDefaults(), ...commande });
    form.reset(
      {
        ...commandeRawValue,
        id: { value: commandeRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): CommandeFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      estAEmporter: false,
      dateHeureCreation: currentTime,
      dateHeureLivraison: currentTime,
    };
  }

  private convertCommandeRawValueToCommande(rawCommande: CommandeFormRawValue | NewCommandeFormRawValue): ICommande | NewCommande {
    return {
      ...rawCommande,
      dateHeureCreation: dayjs(rawCommande.dateHeureCreation, DATE_TIME_FORMAT),
      dateHeureLivraison: dayjs(rawCommande.dateHeureLivraison, DATE_TIME_FORMAT),
    };
  }

  private convertCommandeToCommandeRawValue(
    commande: ICommande | (Partial<NewCommande> & CommandeFormDefaults)
  ): CommandeFormRawValue | PartialWithRequiredKeyOf<NewCommandeFormRawValue> {
    return {
      ...commande,
      dateHeureCreation: commande.dateHeureCreation ? commande.dateHeureCreation.format(DATE_TIME_FORMAT) : undefined,
      dateHeureLivraison: commande.dateHeureLivraison ? commande.dateHeureLivraison.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
