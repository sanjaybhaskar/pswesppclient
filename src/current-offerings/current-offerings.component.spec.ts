import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CurrentOfferingsComponent } from './current-offerings.component';
import { of } from 'rxjs';
import { Plan } from 'src/model/plan.model';
import { ManageOfferingsService } from 'src/services/manage-offerings.service';
import { FdWindowService } from 'src/services/fd-window.service';

describe('CurrentOfferingsComponent', () => {
  let component: CurrentOfferingsComponent;
  let fixture: ComponentFixture<CurrentOfferingsComponent>;
  let manageOfferingService: jasmine.SpyObj<ManageOfferingsService>;
  let fdWindowService: jasmine.SpyObj<FdWindowService>;

  beforeEach(async () => {
    const manageOfferingServiceSpy = jasmine.createSpyObj(
      'ManageOfferingService',
      ['getPlans']
    );
    const fdWindowServiceSpy = jasmine.createSpyObj('FdWindowService', [
      'getWindow',
    ]);

    await TestBed.configureTestingModule({
      declarations: [CurrentOfferingsComponent],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: ManageOfferingsService, useValue: manageOfferingServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CurrentOfferingsComponent);
    component = fixture.componentInstance;
    manageOfferingService = TestBed.inject(
      ManageOfferingsService
    ) as jasmine.SpyObj<ManageOfferingsService>;
    fdWindowService = TestBed.inject(
      FdWindowService
    ) as jasmine.SpyObj<FdWindowService>;
  });

  it('should fetch plans and set singlePlanDropDown when there is only one plan', () => {
    const mockPlans: Plan[] = [{ planid: '1', planname: 'Plan 1' }];
    manageOfferingService.getPlans.and.returnValue(of(mockPlans));

    fixture.detectChanges();

    expect(component.singlePlanDropdown).toEqual(mockPlans[0].planname);
    expect(component.planDropDownData).toBe('');
  });

  it('should fetch plans and set planDropDownData when there are multiple plans', () => {
    const mockPlans: Plan[] = [
      { planid: 1, planname: 'Plan 1' },
      { planid: 2, planname: 'Plan 2' },
    ];
    manageOfferingService.getPlans.and.returnValue(of(mockPlans));

    fixture.detectChanges();

    const expectedOptions = [
      { text: 'All plans', disabled: true },
      { text: 1, value: 'Plan 1' },
      { text: 2, value: 'Plan 2' },
    ];
    expect(component.singlePlanDropdown).toBeUndefined();
    expect(component.planDropDownData).toEqual(JSON.stringify(expectedOptions));
  });

  it('should set planValue on value changes', () => {
    const event = new Event('input');
    const inputElement = document.createElement('input');
    inputElement.value = 'Test Plan';
    spyOnProperty(event, 'target').and.returnValue(inputElement);

    component.onValueChanges(event);

    expect(component.planValue).toEqual('Test Plan');
  });

  it('should enable create offerings button if getWindow returns createOfferingApi', () => {
    fdWindowService.getWindow.and.returnValue({
      apis: { createOfferingApi: true },
    });

    component.isCreateNewEntitled();

    expect(component.isCreateOfferingsButtonEnabled).toBe(true);
  });

  it('should disable create offerings button if getWindow does not return createOfferingApi', () => {
    fdWindowService.getWindow.and.returnValue({});

    component.isCreateNewEntitled();

    expect(component.isCreateOfferingsButtonEnabled).toBe(false);
  });
});
