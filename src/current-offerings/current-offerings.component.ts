import { Component, OnInit } from '@angular/core';
import { Plan } from 'src/model/plan.model';
import { FdWindowService } from 'src/services/fd-window.service';
import { ManageOfferingsService } from 'src/services/manage-offerings.service';

@Component({
  selector: 'app-current-offerings',
  templateUrl: './current-offerings.component.html',
  styleUrls: ['./current-offerings.component.css'],
})
export class CurrentOfferingsComponent implements OnInit {
  planDropDownData = '';
  singlePlanDropdown?: string;
  planValue: string = '';
  isCreateOfferingsButtonEnabled: boolean = false;
  planName: any;

  constructor(
    private manageOfferingService: ManageOfferingsService,
    private fdWindowService: FdWindowService
  ) {}

  ngOnInit() {
    this.manageOfferingService.getPlans().subscribe((data: Plan[]) => {
      const plans = data;
      this.singlePlanDropdown = undefined;
      if (plans.length === 1) {
        this.singlePlanDropdown = plans[0].planname;
      } else {
        const options = plans.map((p) => {
          return { text: p.planid, value: p.planname };
        });
        const allPlans: [Object] = [{ text: 'All plans', disabled: true }];
        this.planDropDownData = JSON.stringify(allPlans.concat(options));
      }
    });
  }

  onValueChanges(e: Event): void {
    this.planValue = (e.target as HTMLInputElement).value;
    const options = JSON.parse(this.planDropDownData);
    this.planName = options.find(
      (p: { [key: string]: string }) => p.planid === this.planValue
    )?.planname;
  }

  isCreateNewEntitled(): void {
    if (this.fdWindowService?.getWindow()?.apis?.createOfferingApi) {
      this.isCreateOfferingsButtonEnabled = true;
    } else {
      this.isCreateOfferingsButtonEnabled = false;
    }
  }
}
