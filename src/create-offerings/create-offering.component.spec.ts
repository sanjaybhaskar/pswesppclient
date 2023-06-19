import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ManageOfferingsService } from 'src/services/manage-offerings.service';
import { of } from 'rxjs';
import { Plan } from 'src/model/plan.model';
import { CreateOfferingComponent } from './create-offerings.component';

describe('CreateOfferingComponent', () => {
  let component: CreateOfferingComponent;
  let fixture: ComponentFixture<CreateOfferingComponent>;
  let manageOfferingService: jasmine.SpyObj<ManageOfferingsService>;

  beforeEach(async () => {
    const manageOfferingServiceSpy = jasmine.createSpyObj(
      'ManageOfferingsService',
      ['getPlans']
    );

    await TestBed.configureTestingModule({
      declarations: [CreateOfferingComponent],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: ManageOfferingsService, useValue: manageOfferingServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateOfferingComponent);
    component = fixture.componentInstance;
    manageOfferingService = TestBed.inject(
      ManageOfferingsService
    ) as jasmine.SpyObj<ManageOfferingsService>;
  });

  it('should fetch plans and log the data', () => {
    const mockPlans: Plan[] = [
      { planid: 1, planname: 'Plan 1' },
      { planid: 2, planname: 'Plan 2' },
    ];
    manageOfferingService.getPlans.and.returnValue(of(mockPlans));

    spyOn(console, 'log');

    component.ngOnInit();

    expect(manageOfferingService.getPlans).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith(mockPlans);
  });
});
