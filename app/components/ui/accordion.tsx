"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";

interface AccordionProps {
  items: {
    question: string;
    answer: string;
  }[];
}

export function Accordion({ items }: AccordionProps) {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full space-y-4">
      {items.map((item, index) => (
        <div
          key={index}
          className="border border-gris-800 rounded-lg overflow-hidden"
        >
          <button
            className={cn(
              "w-full px-6 py-4 flex items-center justify-between text-left",
              "bg-gris-900 hover:bg-gris-800 transition-colors",
              openIndex === index ? "text-white" : "text-gris-300"
            )}
            onClick={() => toggleAccordion(index)}
          >
            <span className="text-h5 font-squada">{item.question}</span>
            <ChevronDown
              className={cn(
                "h-5 w-5 transition-transform duration-200",
                openIndex === index ? "transform rotate-180" : ""
              )}
            />
          </button>
          <div
            className={cn(
              "overflow-hidden transition-all duration-200",
              openIndex === index ? "max-h-96" : "max-h-0"
            )}
          >
            <div className="px-6 py-4 bg-gris-900 text-gris-300">
              <p className="text-body">{item.answer}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
