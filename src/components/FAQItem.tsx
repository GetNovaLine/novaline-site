"use client";

import { useState } from "react";

export default function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-card-border">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 py-5 text-left transition-colors hover:text-accent"
      >
        <span className="text-base font-medium">{q}</span>
        <span className={`text-muted transition-transform ${open ? "rotate-45" : ""}`} aria-hidden>
          +
        </span>
      </button>
      {open && (
        <div className="pb-5 text-sm text-muted">
          {a.split("\n").map((paragraph, i) => (
            <p key={i} className={i > 0 ? "mt-2" : ""}>
              {paragraph}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
