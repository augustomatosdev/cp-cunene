import Link from "next/link";
import React from "react";

export const DataCounter = ({ counter }: { counter: any }) => {
  return (
    <Link
      href={counter.link}
      className="rounded-xl border bg-card text-card-foreground shadow"
      style={{ background: counter.color, color: counter.textColor }}
    >
      <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="tracking-tight text-xl font-bold">{counter.title}</h3>
        {/* <BanknotesIcon className="h-4 w-4 text-muted-foreground" /> */}
        <p className="h-4 w-4 text-muted-foreground mr-4">{counter.icon}</p>
      </div>
      <div className="p-6 pt-0">
        <div>
          <span className="text-2xl font-bold">+{counter.weekTotal} </span>
          <span className="text-muted-foreground">esta semana</span>
        </div>
        <p className="text-xs text-muted-foreground">
          <span className="font-bold">{counter.total}</span> total
        </p>
      </div>
    </Link>
  );
};
