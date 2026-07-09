"use client";

import { useState } from "react";

const faqs = [
  {
    question: "Is this connected to live Board of Nursing data?",
    answer:
      "Not in this Phase 1 demo. The search uses local fictional seed records while the product experience and API shape are validated."
  },
  {
    question: "Can I use these results for employment screening?",
    answer:
      "No. The records in this demo are sample data only and are not suitable for real screening, credentialing, or adverse action decisions."
  },
  {
    question: "Will the API include official source links?",
    answer:
      "Yes. Source attribution and last refreshed dates are required fields for every result and remain core to the product model."
  },
  {
    question: "Does Nurse Verify support all 50 states?",
    answer:
      "The planned production product is designed around all 50 state Boards of Nursing. This demo includes a representative seed set across 12 states."
  }
];

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="divide-y divide-slate-200 rounded border border-slate-200 bg-white">
      {faqs.map((faq, index) => (
        <div key={faq.question}>
          <button
            type="button"
            className="focus-ring flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
            onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
            aria-expanded={openIndex === index}
          >
            <span className="font-semibold text-slate-950">{faq.question}</span>
            <span className="text-xl text-accent-700">{openIndex === index ? "-" : "+"}</span>
          </button>
          {openIndex === index ? <p className="px-5 pb-5 text-sm leading-6 text-slate-600">{faq.answer}</p> : null}
        </div>
      ))}
    </div>
  );
}
