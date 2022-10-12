import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { PizzaService } from '../service/pizza.service';

import { PizzaComponent } from './pizza.component';

describe('Pizza Management Component', () => {
  let comp: PizzaComponent;
  let fixture: ComponentFixture<PizzaComponent>;
  let service: PizzaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'pizza', component: PizzaComponent }]), HttpClientTestingModule],
      declarations: [PizzaComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(PizzaComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PizzaComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(PizzaService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.pizzas?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to pizzaService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getPizzaIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getPizzaIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
