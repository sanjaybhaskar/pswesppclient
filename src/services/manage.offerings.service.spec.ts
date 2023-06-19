import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { FdWindowService } from './fd-window.service';
import { ManageOfferingsService } from './manage-offerings.service';

describe('ManageOfferingsService', () => {
  let service: ManageOfferingsService;
  let httpMock: HttpTestingController;
  let fdWindowServiceSpy: jasmine.SpyObj<FdWindowService>;

  beforeEach(() => {
    const windowServiceSpy = jasmine.createSpyObj('FdWindowService', [
      'getWindow',
    ]);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ManageOfferingsService,
        { provide: FdWindowService, useValue: windowServiceSpy },
      ],
    });
    service = TestBed.inject(ManageOfferingsService);
    httpMock = TestBed.inject(HttpTestingController);
    fdWindowServiceSpy = TestBed.inject(
      FdWindowService
    ) as jasmine.SpyObj<FdWindowService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should retrieve plans from API', () => {
    const mockPlans = {
      plans: [
        { name: 'Plan 1', price: 10 },
        { name: 'Plan 2', price: 20 },
      ],
    };
    const mockEndpoint = 'your-api-url';

    fdWindowServiceSpy.getWindow.and.returnValue({
      initPageData: {
        PAGE_LINKS: {
          currentOfferingEndpoint: mockEndpoint,
        },
      },
    });

    service.getCurrentOfferingData();

    const request = httpMock.match(mockEndpoint);
    expect(request.length).toBe(1);
    expect(request[0].request.method).toBe('GET');
    request[0].flush(mockPlans);

    service.getPlans().subscribe((plans) => {
      expect(plans).toEqual(mockPlans);
    });
  });

  it('should handle error', () => {
    const mockEndpoint = 'your-api-url';
    const mockError = { status: 404, message: 'Not found' };

    fdWindowServiceSpy.getWindow.and.returnValue({
      initPageData: {
        PAGE_LINKS: {
          currentOfferingEndpoint: mockEndpoint,
        },
      },
    });

    service.getCurrentOfferingData();

    const request = httpMock.expectOne(mockEndpoint);
    expect(request.request.method).toBe('GET');
    request.flush(null, { status: 404, statusText: 'Not found' });

    service.getPlans().subscribe(
      () => {},
      (error) => {
        expect(error.status).toEqual(mockError.status);
        expect(error.message).toEqual(mockError.message);
      }
    );
  });
});
