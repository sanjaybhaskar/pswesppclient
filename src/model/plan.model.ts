export interface CurrentOfferingData {
  plans: Plan[];
  offerings: Offering[];
}
export interface Plan {
  planname: string;
  planid: string;
}

export interface Offering {
  planid: string;
  planname: string;
}
