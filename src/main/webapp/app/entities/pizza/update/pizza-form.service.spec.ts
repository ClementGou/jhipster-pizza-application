import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../pizza.test-samples';

import { PizzaFormService } from './pizza-form.service';

describe('Pizza Form Service', () => {
  let service: PizzaFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PizzaFormService);
  });

  describe('Service methods', () => {
    describe('createPizzaFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createPizzaFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nom: expect.any(Object),
            prix: expect.any(Object),
            commandes: expect.any(Object),
          })
        );
      });

      it('passing IPizza should create a new form with FormGroup', () => {
        const formGroup = service.createPizzaFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nom: expect.any(Object),
            prix: expect.any(Object),
            commandes: expect.any(Object),
          })
        );
      });
    });

    describe('getPizza', () => {
      it('should return NewPizza for default Pizza initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createPizzaFormGroup(sampleWithNewData);

        const pizza = service.getPizza(formGroup) as any;

        expect(pizza).toMatchObject(sampleWithNewData);
      });

      it('should return NewPizza for empty Pizza initial value', () => {
        const formGroup = service.createPizzaFormGroup();

        const pizza = service.getPizza(formGroup) as any;

        expect(pizza).toMatchObject({});
      });

      it('should return IPizza', () => {
        const formGroup = service.createPizzaFormGroup(sampleWithRequiredData);

        const pizza = service.getPizza(formGroup) as any;

        expect(pizza).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IPizza should not enable id FormControl', () => {
        const formGroup = service.createPizzaFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewPizza should disable id FormControl', () => {
        const formGroup = service.createPizzaFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
