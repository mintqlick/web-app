"use client";

import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Plus, Minus } from "lucide-react";

const FrequentlyAsk = () => {
  const [openItem, setOpenItem] = useState(null);

  const handleToggle = (item) => {
    setOpenItem((prev) => (prev === item ? null : item));
  };

  const faqs = [
    {
      value: "item-1",
      question: "How does NodalCircle work?",
      answer: `NodalCircle is a peer-to-peer contribution platform where participants voluntarily support one another in structured cycles. When you join, you contribute to another user. Once your cycle completes, you become eligible to receive support from others.The system operates on a queue-based model users are matched to contribute, and the cycle continues as long as members recommit after each round.`,
    },
    {
      value: "item-2",
      question: "How soon do I receive my first support payout?",
      answer:
        "NodalCircle operates on a 7-day cycle system. Once you complete your first contribution, your support payout is scheduled for release within 7 days. The process is automated, cycle-based, and designed to follow this timeline consistently as long as you follow all steps, including recommitment when due.",
    },
    {
      value: "item-3",
      question: "How are payouts processed?",
      answer: `All payouts on NodalCircle are processed peer-to-peer. Once your support payout is due, the system automatically merges you with participants who are contributing in the current cycle. These contributors send support directly to your wallet no third-party or platform wallet holds your funds. Every transaction is transparent, trackable, and handled securely between users based on the platform’s matching logic.`,
    },
    {
      value: "item-4",
      question: "Why is there a membership fee?",
      answer: `The one-time membership fee is used to maintain platform sustainability, cover operational costs, and ensure smooth functioning of the system for all users. It helps us keep NodalCircle running securely, fairly, and without relying on ads, external funding, or user data.
            This fee is only paid once during your first cycle and is automatically deducted from your first support payout.`,
    },
    {
      value: "item-5",
      question: " What if someone doesn’t fulfil their payment?",
      answer: `If a participant fails to complete their assigned contribution within the allowed timeframe, the system automatically 
              removes them from the cycle and reassigns a new, active participant to you. This helps maintain fairness, speed, and balance within the cycle.
              The platform is built with safeguards to handle such cases quickly you won’t lose your position or be penalized for someone else’s delay.`,
    },

    {
      value: "item-8",
      question: "How does NodalCircle stay sustainable over time?",
      answer: `NodalCircle is sustained through a recommitment model. After each cycle, participants are required to recommit the same amount they previously contributed. This keeps the 
            support cycle flowing and ensures there are always new contributions entering the system.
            Combined with a one-time membership fee and transparent peer-to-peer matching, this structure keeps the platform balanced, fair, and self-sustaining without relying on external funding or profits.`,
    },
  ];

  return (
    <div className="w-full h-auto max-w-7xl bg-white overflow-hidden mt-[128px] mx-auto px-4">
      <h2 className="text-3xl lg:text-6xl font-bold text-gray-800 text-center mb-8">
        Frequently Asked Questions
      </h2>

      <Accordion
        type="single"
        collapsible
        className="w-full bg-gray-100 rounded-2xl px-6 py-4 space-y-4"
      >
        {faqs.map((faq) => (
          <AccordionItem
            key={faq.value}
            value={faq.value}
            className="border-b border-gray-300 pb-4"
          >
            <AccordionTrigger
              onClick={() => handleToggle(faq.value)}
              className="flex justify-between items-center text-left w-full font-semibold text-[22px] text-gray-800 py-4 hover:no-underline transition-all [&>svg]:hidden"
            >
              <span
                className="flex-1 text-left"
                style={{ textDecoration: "none" }}
              >
                {faq.question}
              </span>
              <span className="ml-4">
                {openItem === faq.value ? (
                  <Minus className="w-5 h-5 text-gray-700" />
                ) : (
                  <Plus className="w-5 h-5 text-gray-700" />
                )}
              </span>
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 mt-2 leading-relaxed text-[16px]">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default FrequentlyAsk;
