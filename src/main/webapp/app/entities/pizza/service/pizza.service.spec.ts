import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IPizza } from '../pizza.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../pizza.test-samples';

import { PizzaService } from './pizza.service';

const requireRestSample: IPizza = {
  ...sampleWithRequiredData,
};

describe('Pizza Service', () => {
  let service: PizzaService;
  let httpMock: HttpTestingController;
  let expectedResult: IPizza | IPizza[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PizzaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Pizza', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const pizza = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(pizza).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Pizza', () => {
      const pizza = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(pizza).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Pizza', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Pizza', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Pizza', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addPizzaToCollectionIfMissing', () => {
      it('should add a Pizza to an empty array', () => {
        const pizza: IPizza = sampleWithRequiredData;
        expectedResult = service.addPizzaToCollectionIfMissing([], pizza);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(pizza);
      });

      it('should not add a Pizza to an array that contains it', () => {
        const pizza: IPizza = sampleWithRequiredData;
        const pizzaCollection: IPizza[] = [
          {
            ...pizza,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addPizzaToCollectionIfMissing(pizzaCollection, pizza);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Pizza to an array that doesn't contain it", () => {
        const pizza: IPizza = sampleWithRequiredData;
        const pizzaCollection: IPizza[] = [sampleWithPartialData];
        expectedResult = service.addPizzaToCollectionIfMissing(pizzaCollection, pizza);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(pizza);
      });

      it('should add only unique Pizza to an array', () => {
        const pizzaArray: IPizza[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const pizzaCollection: IPizza[] = [sampleWithRequiredData];
        expectedResult = service.addPizzaToCollectionIfMissing(pizzaCollection, ...pizzaArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const pizza: IPizza = sampleWithRequiredData;
        const pizza2: IPizza = sampleWithPartialData;
        expectedResult = service.addPizzaToCollectionIfMissing([], pizza, pizza2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(pizza);
        expect(expectedResult).toContain(pizza2);
      });

      it('should accept null and undefined values', () => {
        const pizza: IPizza = sampleWithRequiredData;
        expectedResult = service.addPizzaToCollectionIfMissing([], null, pizza, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(pizza);
      });

      it('should return initial array if no Pizza is added', () => {
        const pizzaCollection: IPizza[] = [sampleWithRequiredData];
        expectedResult = service.addPizzaToCollectionIfMissing(pizzaCollection, undefined, null);
        expect(expectedResult).toEqual(pizzaCollection);
      });
    });

    describe('comparePizza', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.comparePizza(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.comparePizza(entity1, entity2);
        const compareResult2 = service.comparePizza(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.comparePizza(entity1, entity2);
        const compareResult2 = service.comparePizza(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.comparePizza(entity1, entity2);
        const compareResult2 = service.comparePizza(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
