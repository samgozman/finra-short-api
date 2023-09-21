interface FinraReport {
  date: Date;
  shortVolume: number;
  shortExemptVolume: number;
  totalVolume: number;
}

// Finra report assigned to each individual stock
export interface FinraAssignedReports {
  [ticker: string]: FinraReport;
}
