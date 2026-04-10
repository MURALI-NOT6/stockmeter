"use client";

import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { setCurrency, setCompany } from "@/lib/redux/slices/filterSlice";
import { fetchExchangeRate } from "@/lib/redux/slices/stockSlice";
import Dropdown from "./Dropdown";

export default function Header() {
  const dispatch = useAppDispatch();
  const { currency, company } = useAppSelector((state) => state.filters);

  const currencies = ["USD ($)", "INR (₹)", "EUR (€)", "GBP (£)"];
  const companies = ["Apple", "Tesla", "NVIDIA", "Microsoft", "Amazon", "Google"];

  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-8">
      <div>
        <h1 className="font-headline text-4xl font-black text-on-background uppercase tracking-tighter">
          STOCK METER <span className="text-primary-container glow-cyan">V1.0</span>
        </h1>
        <p className="text-on-surface-variant font-label text-xs tracking-widest mt-2 uppercase">
          Real-Time Quantitative Analytics Engine
        </p>
      </div>
      <div className="flex flex-wrap gap-3 items-center">
        <Dropdown
          options={currencies}
          value={currency}
          onChange={(v) => {
            dispatch(setCurrency(v));
            dispatch(fetchExchangeRate(v));
          }}
        />
        <Dropdown
          options={companies}
          value={company}
          onChange={(v) => dispatch(setCompany(v))}
          prefix="Asset"
        />
      </div>
    </div>
  );
}
