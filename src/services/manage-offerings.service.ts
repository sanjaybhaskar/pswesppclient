import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, combineLatest, Subject, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { FdWindowService } from './fd-window.service';
import { Offering, Plan } from 'src/model/plan.model';

@Injectable({
  providedIn: 'root',
})
export class ManageOfferingsService {
  private plansSubject: BehaviorSubject<Plan[]> = new BehaviorSubject<Plan[]>(
    []
  );
  private offeringsSubject: BehaviorSubject<Offering[]> = new BehaviorSubject<
    Offering[]
  >([]);

  constructor(
    private http: HttpClient,
    private fdWindowService: FdWindowService
  ) {}

  getCurrentOfferingData() {
    const endpoint =
      this.fdWindowService.getWindow().initPageData.PAGE_LINKS
        .currentOfferingEndpoint;
    this.http
      .get(endpoint)
      .pipe(
        catchError((error: any) => {
          // Handle the error
          console.error('Error fetching current offering data:', error);
          return throwError(error);
        })
      )
      .subscribe((data: any) => {
        if (data && data.plans) {
          this.plansSubject.next(data.plans);
        }
        if (data && data.offerings) {
          this.offeringsSubject.next(data.offerings);
        }
      });
  }

  getPlans() {
    return this.plansSubject.asObservable();
  }

  getOfferings(planId: string) {
    if (planId === 'All plans') {
      // No filtering needed, return all offerings
      return combineLatest([this.offeringsSubject, this.plansSubject]).pipe(
        map(([offerings, plans]) => {
          return offerings.map((offering) => ({
            ...offering,
            planName: plans.find((plan) => plan.planid === offering.planid)?.planname || '',
          }));
        })
      );
    } else {
      // Filter offerings based on planValue
      return combineLatest([this.offeringsSubject, this.plansSubject]).pipe(
        map(([offerings, plans]) => {
          return offerings
            .filter((offering) => offering.planid === planId)
            .map((offering) => ({
              ...offering,
              planName: plans.find((plan) => plan.planid === offering.planid)?.planname || '',
            }));
        })
    }
  }
}
