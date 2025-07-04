import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "@/components/shared/ui/IconRegistry";

interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
}

interface MobileAccordionProps {
  items: AccordionItem[];
  className?: string;
  defaultOpen?: string;
}

const MobileAccordion: React.FC<MobileAccordionProps> = ({
  items,
  className = "",
  defaultOpen
}) => {
  const [openItem, setOpenItem] = useState<string | null>(defaultOpen || null);

  const toggleItem = (itemId: string) => {
    setOpenItem(openItem === itemId ? null : itemId);
  };

  return (
    <div className={className}>
      {items.map((item) => (
        <div key={item.id}>
          <button
            onClick={() => toggleItem(item.id)}
            className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
          >
            <div>
              {item.icon && <span className="text-[#F7931A]">{item.icon}</span>}
              <span className="font-semibold text-white text-lg">{item.title}</span>
            </div>
            <span>
              {openItem === item.id ? (
                <ChevronUp />
              ) : (
                <ChevronDown />
              )}
            </span>
          </button>
          
          {openItem === item.id && (
            <div>
              <div>
                {item.content}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MobileAccordion;