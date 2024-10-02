export type MonthType = Date[];

export type SummaryDataType = {
  total_income: number;
  total_expense: number;
  percentage: number;
};

export type PieChartsDataType = {
  amount: number;
  category: string;
  category_count: number;
  description: string;
  transaction_type: string;
};

export type PieChartsPercentageDataType = {
  name: string;
  value: number;
  color: string;
};
