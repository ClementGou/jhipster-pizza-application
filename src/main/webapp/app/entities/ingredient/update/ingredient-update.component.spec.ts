import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { IngredientFormService } from './ingredient-form.service';
import { IngredientService } from '../service/ingredient.service';
import { IIngredient } from '../ingredient.model';
import { IPizza } from 'app/entities/pizza/pizza.model';
import { PizzaService } from 'app/entities/pizza/service/pizza.service';

import { IngredientUpdateComponent } from './ingredient-update.component';

describe('Ingredient Management Update Component', () => {
  let comp: IngredientUpdateComponent;
  let fixture: ComponentFixture<IngredientUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let ingredientFormService: IngredientFormService;
  let ingredientService: IngredientService;
  let pizzaService: PizzaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [IngredientUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(IngredientUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(IngredientUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    ingredientFormService = TestBed.inject(IngredientFormService);
    ingredientService = TestBed.inject(IngredientService);
    pizzaService = TestBed.inject(PizzaService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Pizza query and add missing value', () => {
      const ingredient: IIngredient = { id: 456 };
      const pizza: IPizza = { id: 90482 };
      ingredient.pizza = pizza;

      const pizzaCollection: IPizza[] = [{ id: 73680 }];
      jest.spyOn(pizzaService, 'query').mockReturnValue(of(new HttpResponse({ body: pizzaCollection })));
      const additionalPizzas = [pizza];
      const expectedCollection: IPizza[] = [...additionalPizzas, ...pizzaCollection];
      jest.spyOn(pizzaService, 'addPizzaToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ ingredient });
      comp.ngOnInit();

      expect(pizzaService.query).toHaveBeenCalled();
      expect(pizzaService.addPizzaToCollectionIfMissing).toHaveBeenCalledWith(
        pizzaCollection,
        ...additionalPizzas.map(expect.objectContaining)
      );
      expect(comp.pizzasSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const ingredient: IIngredient = { id: 456 };
      const pizza: IPizza = { id: 71505 };
      ingredient.pizza = pizza;

      activatedRoute.data = of({ ingredient });
      comp.ngOnInit();

      expect(comp.pizzasSharedCollection).toContain(pizza);
      expect(comp.ingredient).toEqual(ingredient);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IIngredient>>();
      const ingredient = { id: 123 };
      jest.spyOn(ingredientFormService, 'getIngredient').mockReturnValue(ingredient);
      jest.spyOn(ingredientService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ingredient });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: ingredient }));
      saveSubject.complete();

      // THEN
      expect(ingredientFormService.getIngredient).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(ingredientService.update).toHaveBeenCalledWith(expect.objectContaining(ingredient));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IIngredient>>();
      const ingredient = { id: 123 };
      jest.spyOn(ingredientFormService, 'getIngredient').mockReturnValue({ id: null });
      jest.spyOn(ingredientService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ingredient: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: ingredient }));
      saveSubject.complete();

      // THEN
      expect(ingredientFormService.getIngredient).toHaveBeenCalled();
      expect(ingredientService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IIngredient>>();
      const ingredient = { id: 123 };
      jest.spyOn(ingredientService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ingredient });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(ingredientService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('comparePizza', () => {
      it('Should forward to pizzaService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(pizzaService, 'comparePizza');
        comp.comparePizza(entity, entity2);
        expect(pizzaService.comparePizza).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
