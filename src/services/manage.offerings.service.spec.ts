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
    const mockData = {
      plans: [
        { planid: 'plan1', planname: 'Plan 1' },
        { planid: 'plan2', planname: 'Plan 2' },
      ],
      offerings: [
        {
          offeringId: 'offering1',
          planid: 'plan1',
          offeringName: 'Offering 1',
        },
        {
          offeringId: 'offering2',
          planid: 'plan2',
          offeringName: 'Offering 2',
        },
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

    const req = httpMock.expectOne('http://example.com/api/current-offering');
    expect(req.request.method).toBe('GET');

    req.flush(mockData);

    service.getPlans().subscribe((plans) => {
      expect(plans).toEqual(mockData.plans);
    });

    service.getOfferings('plan1').subscribe((offerings) => {
      const expectedOfferings = mockData.offerings.filter(
        (offering) => offering.planid === 'plan1'
      );
      expect(offerings).toEqual(expectedOfferings);
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
