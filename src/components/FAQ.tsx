import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  title?: string;
  items: FAQItem[];
}

const FAQ: React.FC<FAQProps> = ({ 
  title = "Usein kysytyt kysymykset", 
  items 
}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-heading text-center">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {items.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left font-medium">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default FAQ;