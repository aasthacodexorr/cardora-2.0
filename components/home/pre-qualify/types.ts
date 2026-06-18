export interface PreQualifyFormProps {
  vehiclePrice: string;
  downPayment: string;
  loanTerm: string;
  creditScore: string;
  includeTradeIn: boolean;
  tradeInValue: string;
  onVehiclePriceChange: (value: string) => void;
  onDownPaymentChange: (value: string) => void;
  onLoanTermChange: (value: string) => void;
  onCreditScoreChange: (value: string) => void;
  onIncludeTradeInToggle: () => void;
  onTradeInValueChange: (value: string) => void;
}

export interface PreQualifyResultProps {
  biWeeklyPayment: number;
  rate: number;
  loanAmount: number;
}
