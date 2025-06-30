import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

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
    <div className={`space-y-2 ${className}`}>
      {items.map((item) => (
        <div
          key={item.id}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden"
        >
          <button
            onClick={() => toggleItem(item.id)}
            className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              {item.icon && <span className="text-[#F7931A]">{item.icon}</span>}
              <span className="font-semibold text-white text-lg">{item.title}</span>
            </div>
            <span className="text-[#F7931A] transition-transform duration-200">
              {openItem === item.id ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </span>
          </button>
          
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              openItem === item.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="px-6 pb-4 text-gray-300 leading-relaxed">
              {item.content}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MobileAccordion; 