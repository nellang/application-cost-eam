import {CostEntry} from './cost-entry';

export interface ApplicationCost {
  name: string;
  description: string;
  costEntries: CostEntry[];
}
