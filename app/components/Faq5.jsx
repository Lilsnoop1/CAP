"use client";

import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import React from "react";
import { RxPlus } from "react-icons/rx";

export default function Faq5() {
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="rb-12 mb-12 max-w-lg md:mb-18 lg:mb-20">
          <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
            Questions
          </h2>
          <p className="md:text-md">
            Find answers to common questions about echo chambers and alternative
            thinking.
          </p>
        </div>
        <Accordion
          type="multiple"
          className="grid items-start justify-stretch gap-4"
        >
          <AccordionItem
            value="item-0"
            className="border border-border-primary px-5 md:px-6"
          >
            <AccordionTrigger
              icon={
                <RxPlus className="size-7 shrink-0 text-text-primary transition-transform duration-300 md:size-8" />
              }
              className="md:py-5 md:text-md [&[data-state=open]>svg]:rotate-45"
            >
              What exactly is an echo chamber?
            </AccordionTrigger>
            <AccordionContent className="md:pb-6">
              An echo chamber is an environment where you're primarily exposed
              to beliefs and opinions that align with your own. Social media
              algorithms, news feeds, and social circles often reinforce
              existing views rather than challenge them, creating a feedback
              loop that strengthens your current perspective without introducing
              new ideas.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            value="item-1"
            className="border border-border-primary px-5 md:px-6"
          >
            <AccordionTrigger
              icon={
                <RxPlus className="size-7 shrink-0 text-text-primary transition-transform duration-300 md:size-8" />
              }
              className="md:py-5 md:text-md [&[data-state=open]>svg]:rotate-45"
            >
              How do echo chambers affect critical thinking?
            </AccordionTrigger>
            <AccordionContent className="md:pb-6">
              Echo chambers weaken critical thinking by removing the friction
              necessary for intellectual growth. When you're never challenged,
              you never need to defend your ideas or examine their weaknesses.
              This leads to intellectual complacency and an inability to engage
              with opposing viewpoints in meaningful ways.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            value="item-2"
            className="border border-border-primary px-5 md:px-6"
          >
            <AccordionTrigger
              icon={
                <RxPlus className="size-7 shrink-0 text-text-primary transition-transform duration-300 md:size-8" />
              }
              className="md:py-5 md:text-md [&[data-state=open]>svg]:rotate-45"
            >
              Can we escape echo chambers entirely?
            </AccordionTrigger>
            <AccordionContent className="md:pb-6">
              Complete escape is unlikely, but awareness is the first step.
              Actively seeking diverse perspectives, reading across ideological
              lines, and engaging in good-faith dialogue with people who think
              differently can significantly reduce the effects of echo chambers
              on your thinking.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            value="item-3"
            className="border border-border-primary px-5 md:px-6"
          >
            <AccordionTrigger
              icon={
                <RxPlus className="size-7 shrink-0 text-text-primary transition-transform duration-300 md:size-8" />
              }
              className="md:py-5 md:text-md [&[data-state=open]>svg]:rotate-45"
            >
              Why is disagreement valuable?
            </AccordionTrigger>
            <AccordionContent className="md:pb-6">
              Disagreement forces you to articulate why you believe what you do.
              It exposes gaps in your reasoning and introduces perspectives you
              hadn't considered. The discomfort of disagreement is actually a
              sign that learning is happening.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            value="item-4"
            className="border border-border-primary px-5 md:px-6"
          >
            <AccordionTrigger
              icon={
                <RxPlus className="size-7 shrink-0 text-text-primary transition-transform duration-300 md:size-8" />
              }
              className="md:py-5 md:text-md [&[data-state=open]>svg]:rotate-45"
            >
              How do I engage with opposing views?
            </AccordionTrigger>
            <AccordionContent className="md:pb-6">
              Start by listening to understand, not to win. Read or listen to
              the strongest version of arguments you disagree with. Ask
              questions genuinely. Assume good faith. The goal isn't to change
              your mind immediately, but to expand your understanding of why
              intelligent people think differently than you do.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <div className="mt-12 md:mt-18 lg:mt-20">
          <h4 className="mb-3 text-2xl font-bold md:mb-4 md:text-3xl md:leading-[1.3] lg:text-4xl">
            Want to dig deeper?
          </h4>
          <p className="md:text-md">Reach out to our team for more insights.</p>
          <div className="mt-6 md:mt-8">
            <Button title="Contact" variant="secondary">
              Contact
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
