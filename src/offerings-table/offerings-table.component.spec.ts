import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OfferingsTableComponent } from './offerings-table.component';
import { ManageOfferingsService } from 'src/services/manage-offerings.service';
import { of } from 'rxjs';
import { Offering } from 'src/model/plan.model';

describe('OfferingsTableComponent', () => {
  let component: OfferingsTableComponent;
  let fixture: ComponentFixture<OfferingsTableComponent>;
  let manageOfferingService: ManageOfferingsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OfferingsTableComponent],
      providers: [ManageOfferingsService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferingsTableComponent);
    component = fixture.componentInstance;
    manageOfferingService = TestBed.inject(ManageOfferingsService);
  });

  it('should load offerings on component initialization', () => {
    const offerings: Offering[] = [
      { offeringId: '1', planId: 'plan1', offeringName: 'Offering 1' },
      { offeringId: '2', planId: 'plan2', offeringName: 'Offering 2' },
    ];

    spyOn(manageOfferingService, 'getOfferings').and.returnValue(of(offerings));

    fixture.detectChanges();

    expect(manageOfferingService.getOfferings).toHaveBeenCalledWith('');
    expect(component.offeringsData).toEqual(offerings);
  });

  it('should reload offerings when planValue changes', () => {
    const offerings: Offering[] = [
      { offeringId: '1', planId: 'plan1', offeringName: 'Offering 1' },
    ];

    spyOn(manageOfferingService, 'getOfferings').and.returnValue(of(offerings));

    component.planValue = 'plan1';
    fixture.detectChanges();

    expect(manageOfferingService.getOfferings).toHaveBeenCalledWith('plan1');
    expect(component.offeringsData).toEqual(offerings);
  });
  it('should reload offerings when planValue changes and it is not the first change', () => {
    const offerings: Offering[] = [
      { offeringId: '1', planId: 'plan1', offeringName: 'Offering 1' },
      { offeringId: '2', planId: 'plan2', offeringName: 'Offering 2' },
    ];

    spyOn(manageOfferingService, 'getOfferings').and.returnValue(of(offerings));

    // Set initial planValue
    component.planValue = 'plan1';
    fixture.detectChanges();

    // Change planValue to trigger reload
    component.planValue = 'plan2';

    // Simulate changes object with planValue
    const changes = {
      planValue: {
        currentValue: 'plan2',
        previousValue: 'plan1',
        firstChange: false,
        isFirstChange: () => false,
      },
    };

    // Call ngOnChanges with changes object
    component.ngOnChanges(changes);
    fixture.detectChanges();

    expect(manageOfferingService.getOfferings).toHaveBeenCalledWith('plan2');
    expect(component.offeringsData).toEqual(offerings);
  });
});
