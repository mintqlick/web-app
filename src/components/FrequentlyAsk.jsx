"use client"

import React, { useState } from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Plus, Minus } from "lucide-react"

const FrequentlyAsk = () => {
  const [openItem, setOpenItem] = useState(null)

  const handleToggle = (item) => {
    setOpenItem((prev) => (prev === item ? null : item))
  }

  const faqs = [
    {
      value: "item-1",
      question: "How does NodalCircle work?",
      answer:
        "NodalCircle operates as a structured peer-to-peer community, where members contribute directly to each other. You participate in cycles and receive structured support in return.",
    },
    {
      value: "item-2",
      question: "How soon do I receive my first support payout?",
      answer:
        "Your first payout is processed 7 days after your first commitment",
    },
    {
      value: "item-3",
      question: "Is my participation guaranteed?",
      answer:
        "Every user is matched based on availability. While the platform is structured for fairness, participation outcomes depend on active engagement by all members.",
    },
    {
      value: "item-4",
      question: "How are payouts processed?",
      answer:
        "Once your cycle matures, a new participant is merged to send your support within 24–48 hours.",
    },
    {
      value: "item-5",
      question: "Can I contribute more than once?",
      answer:
        "Only one active cycle per account is allowed. To run multiple cycles, you’ll need to register separate accounts and activate each with $2.",
    },
    {
      value: "item-6",
      question: "Why is there a membership fee?",
      answer:
        "The $2 activation fee supports system maintenance and keeps the platform focused on serious, intentional participants.",
    },
    {
      value: "item-7",
      question: "What if someone doesn’t fulfill their payment?",
      answer:
        "The system enforces strict compliance. Non-paying users are removed to preserve trust and cycle flow.",
    },
    {
      value: "item-8",
      question: "How does NodalCircle stay stable over time?",
      answer:
        "NodalCircle is built on structure with timed cycles, recommitment requirements, and paced onboarding helping maintain long-term sustainability.",
    },
  ]

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
              <span className="flex-1 text-left" style={{textDecoration: "none"}}>{faq.question}</span>
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
  )
}

export default FrequentlyAsk
