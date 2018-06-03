export interface CostEntry {
  name: string;
  amount: number;
  currency: string;
  type: CostType;
  period: PeriodType;
}

export enum CostType {
  oneOff = 'One-Off',
  periodic = 'Periodic'
}

export enum PeriodType {
  monthly = 'Monthly',
  quarterly = 'Quarterly',
  yearly = 'Yearly',
  none = ''
}