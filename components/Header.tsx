"use client";

import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { setCurrency, setCompany, setSector } from "@/lib/redux/slices/filterSlice";
import Dropdown from "./Dropdown";
import { SECTORS, getCompaniesBySector } from "@/lib/stockMapping";

export default function Header() {
  const dispatch = useAppDispatch();
  const { currency, company, sector } = useAppSelector((state) => state.filters);

  const currencies = ["USD ($)", "INR (₹)", "EUR (€)", "GBP (£)"];
  const companies = getCompaniesBySector(sector);

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
          width="120px"
          onChange={(v) => {
            dispatch(setCurrency(v));
          }}
        />
        <Dropdown
          options={SECTORS}
          value={sector}
          width="260px"
          onChange={(v) => {
            dispatch(setSector(v));
            const filtered = getCompaniesBySector(v);
            if (filtered.length > 0 && !filtered.includes(company)) {
              dispatch(setCompany(filtered[0]));
            }
          }}
          prefix="Sector"
        />
        <Dropdown
          options={companies}
          value={company}
          width="220px"
          onChange={(v) => dispatch(setCompany(v))}
          prefix="Asset"
        />
      </div>
    </div>
  );
}
