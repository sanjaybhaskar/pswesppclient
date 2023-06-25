import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Offering, Plan } from 'src/model/plan.model';
import { ManageOfferingsService } from 'src/services/manage-offerings.service';

@Component({
  selector: 'app-offerings-table',
  templateUrl: './offerings-table.component.html',
  styleUrls: ['./offerings-table.component.css'],
})
export class OfferingsTableComponent implements OnInit, OnChanges {
  @Input() planValue: string = '';
  @Input() planName: string = '';
  
  offeringsData: Offering[] = [];
  plans: Plan[] = [];
  constructor(private manageOfferingService: ManageOfferingsService) {}

  ngOnInit() {
    this.loadOfferings();

    this.manageOfferingService.getPlans().subscribe((data: Plan[]) => {
      this.plans = data;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.planValue && !changes.planValue.firstChange) {
      this.loadOfferings();
    }
  }

  private loadOfferings() {
    this.manageOfferingService
      .getOfferings(this.planValue)
      .subscribe((data: Offering[]) => {
        this.offeringsData = data;
      });
  }
}
