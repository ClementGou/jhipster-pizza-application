import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PizzaFormService } from './pizza-form.service';
import { PizzaService } from '../service/pizza.service';
import { IPizza } from '../pizza.model';
import { ICommande } from 'app/entities/commande/commande.model';
import { CommandeService } from 'app/entities/commande/service/commande.service';

import { PizzaUpdateComponent } from './pizza-update.component';

describe('Pizza Management Update Component', () => {
  let comp: PizzaUpdateComponent;
  let fixture: ComponentFixture<PizzaUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let pizzaFormService: PizzaFormService;
  let pizzaService: PizzaService;
  let commandeService: CommandeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [PizzaUpdateComponent],
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
      .overrideTemplate(PizzaUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PizzaUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    pizzaFormService = TestBed.inject(PizzaFormService);
    pizzaService = TestBed.inject(PizzaService);
    commandeService = TestBed.inject(CommandeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Commande query and add missing value', () => {
      const pizza: IPizza = { id: 456 };
      const commandes: ICommande = { id: 59535 };
      pizza.commandes = commandes;

      const commandeCollection: ICommande[] = [{ id: 50761 }];
      jest.spyOn(commandeService, 'query').mockReturnValue(of(new HttpResponse({ body: commandeCollection })));
      const additionalCommandes = [commandes];
      const expectedCollection: ICommande[] = [...additionalCommandes, ...commandeCollection];
      jest.spyOn(commandeService, 'addCommandeToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ pizza });
      comp.ngOnInit();

      expect(commandeService.query).toHaveBeenCalled();
      expect(commandeService.addCommandeToCollectionIfMissing).toHaveBeenCalledWith(
        commandeCollection,
        ...additionalCommandes.map(expect.objectContaining)
      );
      expect(comp.commandesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const pizza: IPizza = { id: 456 };
      const commandes: ICommande = { id: 72478 };
      pizza.commandes = commandes;

      activatedRoute.data = of({ pizza });
      comp.ngOnInit();

      expect(comp.commandesSharedCollection).toContain(commandes);
      expect(comp.pizza).toEqual(pizza);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPizza>>();
      const pizza = { id: 123 };
      jest.spyOn(pizzaFormService, 'getPizza').mockReturnValue(pizza);
      jest.spyOn(pizzaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pizza });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: pizza }));
      saveSubject.complete();

      // THEN
      expect(pizzaFormService.getPizza).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(pizzaService.update).toHaveBeenCalledWith(expect.objectContaining(pizza));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPizza>>();
      const pizza = { id: 123 };
      jest.spyOn(pizzaFormService, 'getPizza').mockReturnValue({ id: null });
      jest.spyOn(pizzaService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pizza: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: pizza }));
      saveSubject.complete();

      // THEN
      expect(pizzaFormService.getPizza).toHaveBeenCalled();
      expect(pizzaService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPizza>>();
      const pizza = { id: 123 };
      jest.spyOn(pizzaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pizza });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(pizzaService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareCommande', () => {
      it('Should forward to commandeService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(commandeService, 'compareCommande');
        comp.compareCommande(entity, entity2);
        expect(commandeService.compareCommande).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
