import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatBubble } from './chat-bubble';
import { ConversationInput } from './conversation-input';
import { cn } from '@/lib/utils';

interface Question {
  id: string;
  message: string;
  type: 'text' | 'number' | 'select';
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  required?: boolean;
}

interface ConversationalStepProps {
  questions: Question[];
  onComplete: (answers: Record<string, string | number>) => void;
  initialAnswers?: Record<string, string | number>;
  isLoading?: boolean;
  className?: string;
}

export const ConversationalStep: React.FC<ConversationalStepProps> = ({
  questions,
  onComplete,
  initialAnswers = {},
  isLoading = false,
  className
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number>>(initialAnswers);
  const [showInput, setShowInput] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  useEffect(() => {
    // Show input after a short delay to let the question bubble animate in
    const timer = setTimeout(() => {
      setShowInput(true);
    }, 600);

    return () => clearTimeout(timer);
  }, [currentQuestionIndex]);

  const handleAnswer = async (value: string | number) => {
    const newAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(newAnswers);

    // Hide input during transition
    setShowInput(false);

    if (isLastQuestion) {
      // Complete the step
      await new Promise(resolve => setTimeout(resolve, 300));
      onComplete(newAnswers);
    } else {
      // Move to next question
      await new Promise(resolve => setTimeout(resolve, 300));
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn("space-y-6 max-w-2xl mx-auto", className)}
    >
      {/* Previous questions and answers */}
      <div className="space-y-2">
        {questions.slice(0, currentQuestionIndex).map((question, index) => (
          <div key={question.id}>
            <ChatBubble 
              message={question.message} 
              isUser={false}
              delay={0}
            />
            <ChatBubble 
              message={String(answers[question.id] || '')} 
              isUser={true}
              delay={0}
            />
          </div>
        ))}
      </div>

      {/* Current question */}
      <AnimatePresence mode="wait">
        <div key={currentQuestion.id}>
          <ChatBubble 
            message={currentQuestion.message} 
            isUser={false}
            delay={0.2}
          />
          
          <AnimatePresence>
            {showInput && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="mt-4"
              >
                <ConversationInput
                  type={currentQuestion.type}
                  placeholder={currentQuestion.placeholder}
                  options={currentQuestion.options}
                  value={answers[currentQuestion.id] || ''}
                  onSubmit={handleAnswer}
                  isLoading={isLoading}
                  autoFocus={true}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </AnimatePresence>
    </motion.div>
  );
};