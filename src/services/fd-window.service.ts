import { Injectable } from '@angular/core';

@Injectable()
export class FdWindowService {
  private initPageData = {
    PAGE_LINKS: {
      currentOfferingEndpoint: '',
    },
  };
  constructor() {}

  getWindow(): any {
    return this.initPageData;
  }
}
