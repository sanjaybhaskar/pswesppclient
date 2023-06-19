import { Component, OnInit } from '@angular/core';
import { Plan } from 'src/model/plan.model';
import { ManageOfferingsService } from 'src/services/manage-offerings.service';

@Component({
  selector: 'app-create-offering',
  templateUrl: './create-offering.component.html',
  styleUrls: ['./create-offering.component.css'],
})
export class CreateOfferingComponent implements OnInit {
  constructor(private manageOfferingService: ManageOfferingsService) {}

  ngOnInit(): void {
    this.manageOfferingService.getPlans().subscribe((data: Plan[]) => {
      console.log(data);
    });
  }
}
