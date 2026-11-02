'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

const DEFAULT_FAQS: FAQItem[] = [
  {
    id: 'ai-explanation',
    question: 'How does WorkDey explain AI matching?',
    answer:
      'Unlike black-box algorithms, every WorkDey match score breaks down into transparent components: Skills fit, Experience fit, and Location & work style preferences. You see exactly which keywords and capabilities matched, what is missing, and what action you can take to close the gap.',
  },
  {
    id: 'salary-xaf',
    question: 'Why are all salaries shown upfront in XAF?',
    answer:
      'Pay transparency saves weeks of wasted interviews. Employers must provide a realistic monthly or annual salary range in Central African CFA Francs (XAF) before publishing. For international remote roles, equivalents are converted and clearly annotated.',
  },
  {
    id: 'employer-verification',
    question: 'How are employers verified on WorkDey?',
    answer:
      'Every hiring organization is reviewed by platform administrators before their job postings go live. We verify business registration documents (RCCM / taxpayer certificate in Cameroon or official incorporation registry abroad), confirming real hiring managers behind every role.',
  },
  {
    id: 'human-in-the-loop',
    question: 'Can the AI automatically reject my job application?',
    answer:
      'Never. In accordance with WorkDey’s ethical design principles, AI only provides match scoring, skill-gap analysis, and ranking recommendations. Every final decision — whether to shortlist, interview, or reject — must be taken by a verified human hiring manager.',
  },
  {
    id: 'cameroon-international',
    question: 'Is WorkDey only for Cameroon or open internationally?',
    answer:
      'WorkDey is headquartered and rooted in Cameroon (with deep support for Douala, Yaoundé, Buea, Limbe, Bamenda, Bafoussam, and Kribi), but welcomes remote opportunities across Africa and international tech teams hiring bilingual African talent in English and French.',
  },
  {
    id: 'privacy-cv',
    question: 'How is my CV and contact data protected?',
    answer:
      'Your profile and CV are protected by strict Supabase PostgreSQL Row Level Security (RLS). You can toggle whether your contact info is visible to verified employers, or keep it strictly confidential until you choose to apply to a specific vacancy.',
  },
];

interface FAQAccordionProps {
  items?: FAQItem[];
  className?: string;
}

export function FAQAccordion({ items = DEFAULT_FAQS, className = '' }: FAQAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id || null);

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div
            key={item.id}
            className={`border rounded-[10px] transition-colors duration-150 overflow-hidden ${
              isOpen
                ? 'bg-white border-[#0B7F7A]/40 shadow-sm'
                : 'bg-white border-[#E2E7EE] hover:border-[#CBD5E1]'
            }`}
          >
            <button
              type="button"
              onClick={() => toggle(item.id)}
              aria-expanded={isOpen}
              className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 select-none focus:outline-none focus:ring-2 focus:ring-[#0B7F7A]/20"
            >
              <span className="text-sm sm:text-base font-bold text-[#0B1C2F] leading-snug">
                {item.question}
              </span>
              <span
                className={`p-1 rounded-full text-[#5A6779] transition-transform duration-200 flex-shrink-0 ${
                  isOpen ? 'rotate-180 text-[#0B7F7A] bg-[#E6F5F3]' : 'bg-[#F4F6F9]'
                }`}
              >
                <ChevronDown className="w-4 h-4" />
              </span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 text-xs sm:text-sm text-[#3D4A5C] leading-relaxed border-t border-[#F4F6F9]">
                    {item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
