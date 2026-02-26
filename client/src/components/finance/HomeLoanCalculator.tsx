import { useState } from "react";
import { Calculator, TrendingDown, DollarSign, ChevronDown } from "lucide-react";

interface MortgageResult {
  monthlyPayment: number;
  totalInterest: number;
  totalAmount: number;
  principalPercent: number;
  interestPercent: number;
}

export const HomeLoansCalculator = () => {
  const [propertyPrice, setPropertyPrice] = useState<string>("");
  const [downPayment, setDownPayment]     = useState<string>("");
  const [interestRate, setInterestRate]   = useState<string>("8.5");
  const [loanTerm, setLoanTerm]           = useState<string>("20");
  const [result, setResult]               = useState<MortgageResult | null>(null);

  const calculate = () => {
    const price = parseFloat(propertyPrice) || 0;
    const down  = parseFloat(downPayment) || 0;
    const rate  = parseFloat(interestRate) || 0;
    const years = parseInt(loanTerm) || 0;

    if (price <= 0 || rate <= 0 || years <= 0) return;

    const principal   = price - down;
    const monthlyRate = rate / 100 / 12;
    const numPayments = years * 12;

    const monthlyPayment =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
      (Math.pow(1 + monthlyRate, numPayments) - 1);

    const totalAmount      = monthlyPayment * numPayments;
    const totalInterest    = totalAmount - principal;
    const principalPercent = (principal / totalAmount) * 100;
    const interestPercent  = (totalInterest / totalAmount) * 100;

    setResult({ monthlyPayment, totalInterest, totalAmount, principalPercent, interestPercent });
  };

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-NP", {
      style: "currency",
      currency: "NPR",
      maximumFractionDigits: 0,
    }).format(n);

  const downPercent =
    propertyPrice && downPayment
      ? Math.round((parseFloat(downPayment) / parseFloat(propertyPrice)) * 100)
      : 0;

  const loanAmount = Math.max(
    0,
    (parseFloat(propertyPrice) || 0) - (parseFloat(downPayment) || 0)
  );

  return (
    <div className="space-y-5">

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* Property Price */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Property Price
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold">
              Rs.
            </span>
            <input
              type="number"
              value={propertyPrice}
              onChange={(e) => setPropertyPrice(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-slate-900 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#e51013]/20 focus:border-[#e51013] transition-all bg-slate-50"
            />
          </div>
        </div>

        {/* Down Payment */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Down Payment{" "}
            {downPercent > 0 && (
              <span className="text-[#e51013] normal-case font-bold">
                ({downPercent}%)
              </span>
            )}
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold">
              Rs.
            </span>
            <input
              type="number"
              value={downPayment}
              onChange={(e) => setDownPayment(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-slate-900 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#e51013]/20 focus:border-[#e51013] transition-all bg-slate-50"
              
            />
          </div>
        </div>

        {/* Interest Rate */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Annual Interest Rate
          </label>
          <div className="relative">
            <input
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              step="0.1"
              className="w-full pl-4 pr-10 py-3 border border-slate-200 rounded-xl text-slate-900 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#e51013]/20 focus:border-[#e51013] transition-all bg-slate-50"
            
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
              %
            </span>
          </div>
        </div>

        {/* Loan Term */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Loan Term
          </label>
          <div className="relative">
            <select
              value={loanTerm}
              onChange={(e) => setLoanTerm(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#e51013]/20 focus:border-[#e51013] transition-all appearance-none bg-slate-50"
            >
              <option value="5">5 Years</option>
              <option value="10">10 Years</option>
              <option value="15">15 Years</option>
              <option value="20">20 Years</option>
              <option value="25">25 Years</option>
              <option value="30">30 Years</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Loan Amount Preview */}
      <div className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Loan Amount
        </span>
        <span className="font-black text-slate-900">{fmt(loanAmount)}</span>
      </div>

      {/* Calculate Button */}
      <button
        onClick={calculate}
        className="w-full py-3.5 bg-[#e51013] hover:bg-[#c40e10] text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-500/20 hover:-translate-y-0.5 text-sm uppercase tracking-wide"
      >
        <Calculator className="w-4 h-4" />
        Calculate Monthly Payment
      </button>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          <div className="h-px bg-slate-100" />

          {/* Monthly Payment */}
          <div className="bg-red-50 border border-red-100 rounded-2xl p-5 text-center">
            <p className="text-xs font-bold text-[#e51013] uppercase tracking-wider mb-1">
              Monthly Payment
            </p>
            <p className="text-4xl font-black text-[#e51013]">
              {fmt(result.monthlyPayment)}
            </p>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              for {loanTerm} years · {parseInt(loanTerm) * 12} total payments
            </p>
          </div>

          {/* Breakdown Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="card p-4 border border-slate-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                  Total Paid
                </span>
              </div>
              <p className="font-black text-slate-900">{fmt(result.totalAmount)}</p>
            </div>

            <div className="card p-4 border border-slate-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 bg-orange-50 rounded-lg flex items-center justify-center">
                  <TrendingDown className="w-3.5 h-3.5 text-orange-500" />
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                  Total Interest
                </span>
              </div>
              <p className="font-black text-slate-900">{fmt(result.totalInterest)}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Payment Breakdown
            </p>
            <div className="flex rounded-full overflow-hidden h-3">
              <div
                className="bg-[#e51013] transition-all duration-700"
                style={{ width: `${result.principalPercent}%` }}
              />
              <div
                className="bg-orange-400 transition-all duration-700"
                style={{ width: `${result.interestPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                <div className="w-2.5 h-2.5 rounded-full bg-[#e51013]" />
                Principal ({Math.round(result.principalPercent)}%)
              </div>
              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                <div className="w-2.5 h-2.5 rounded-full bg-orange-400" />
                Interest ({Math.round(result.interestPercent)}%)
              </div>
            </div>
          </div>

          {/* Tip */}
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex items-start gap-2">
            <span className="text-base">💡</span>
            <p className="text-xs text-amber-700 font-medium leading-relaxed">
              A higher down payment reduces your loan amount and saves significant interest over time.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};