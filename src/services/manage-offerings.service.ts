import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FdWindowService } from './fd-window.service';

@Injectable({
  providedIn: 'root',
})
export class ManageOfferingsService {
  private plansSubject: Subject<any> = new Subject<any>();

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
        this.plansSubject.next(data);
      });
  }

  getPlans() {
    return this.plansSubject.asObservable();
  }
}
