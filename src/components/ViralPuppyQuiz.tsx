import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { CheckCircle, Circle, Share2, Trophy, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  funFact: string;
}

interface QuizResult {
  score: number;
  total: number;
  personality: string;
  recommendations: string[];
  shareMessage: string;
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "What's the most important factor in a puppy's first week of life?",
    options: ["Socialization", "Proper nutrition", "Exercise", "Training"],
    correctAnswer: 1,
    explanation: "Proper nutrition is crucial for healthy development!",
    funFact: "🍼 Puppies need to eat every 2-3 hours during their first week!"
  },
  {
    id: 2,
    question: "At what age should puppies start solid food?",
    options: ["2 weeks", "4 weeks", "6 weeks", "8 weeks"],
    correctAnswer: 1,
    explanation: "Around 4 weeks, puppies can start transitioning to solid food!",
    funFact: "🥣 Mix puppy food with warm water to make it easier to eat!"
  },
  {
    id: 3,
    question: "How often should you weigh your puppy?",
    options: ["Daily", "Weekly", "Monthly", "Only at vet visits"],
    correctAnswer: 1,
    explanation: "Weekly weighing helps track healthy growth patterns!",
    funFact: "📊 Consistent weight tracking can prevent health issues early!"
  },
  {
    id: 4,
    question: "What's the ideal weight gain for a healthy puppy per week?",
    options: ["5-10% of body weight", "10-15% of body weight", "15-20% of body weight", "20-25% of body weight"],
    correctAnswer: 1,
    explanation: "10-15% weekly weight gain indicates healthy growth!",
    funFact: "⚖️ Large breeds grow faster than small breeds initially!"
  },
  {
    id: 5,
    question: "When do puppies typically double their birth weight?",
    options: ["1 week", "2 weeks", "3 weeks", "4 weeks"],
    correctAnswer: 1,
    explanation: "Most healthy puppies double their birth weight by 2 weeks!",
    funFact: "🚀 This rapid growth phase is why nutrition is so important!"
  }
];

export const ViralPuppyQuiz: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNext = () => {
    if (selectedAnswer === null) return;

    const isCorrect = selectedAnswer === quizQuestions[currentQuestion].correctAnswer;
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    setShowExplanation(true);
    
    setTimeout(() => {
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
        setShowExplanation(false);
      } else {
        calculateResult();
      }
    }, 3000);
  };

  const calculateResult = () => {
    const percentage = (score / quizQuestions.length) * 100;
    let personality = "";
    let recommendations: string[] = [];
    let shareMessage = "";

    if (percentage >= 80) {
      personality = "🏆 Puppy Expert";
      recommendations = [
        "You're ready to help other puppy parents!",
        "Consider sharing your knowledge in our community",
        "Advanced puppy care tips would be perfect for you"
      ];
      shareMessage = "I'm a Puppy Expert! 🏆 Just scored 80%+ on the puppy care quiz!";
    } else if (percentage >= 60) {
      personality = "🌟 Dedicated Dog Parent";
      recommendations = [
        "You know the basics - keep learning!",
        "Focus on advanced nutrition and health monitoring",
        "Join our weekly puppy care tips"
      ];
      shareMessage = "I'm a Dedicated Dog Parent! 🌟 Check out this puppy care quiz!";
    } else if (percentage >= 40) {
      personality = "🐕 Learning Puppy Parent";
      recommendations = [
        "Great start! Keep building your knowledge",
        "Focus on puppy nutrition and growth tracking",
        "Download our free puppy care guide"
      ];
      shareMessage = "I'm a Learning Puppy Parent! 🐕 Taking the puppy care quiz!";
    } else {
      personality = "💕 New Puppy Parent";
      recommendations = [
        "Welcome to the puppy parenting journey!",
        "Start with our beginner's guide",
        "Join our supportive community for tips"
      ];
      shareMessage = "I'm a New Puppy Parent! 💕 Learning with this helpful quiz!";
    }

    setQuizResult({
      score,
      total: quizQuestions.length,
      personality,
      recommendations,
      shareMessage
    });
    setShowResult(true);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setQuizResult(null);
    setShowExplanation(false);
  };

  const shareResult = () => {
    if (quizResult) {
      // Implement actual sharing logic here
      console.log('Sharing:', quizResult.shareMessage);
    }
  };

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  if (showResult && quizResult) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl mx-auto"
      >
        <Card className="p-8 text-center bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl shadow-2xl">
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-2">{quizResult.personality}</h2>
            <p className="text-xl text-gray-600 mb-6">
              You scored {quizResult.score} out of {quizResult.total}!
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-4 mb-8"
          >
            <h3 className="text-lg font-semibold text-purple-800">Recommendations for you:</h3>
            {quizResult.recommendations.map((rec, index) => (
              <motion.div
                key={index}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center gap-2 text-gray-700"
              >
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>{rec}</span>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="space-y-4"
          >
            <Button
              onClick={shareResult}
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-full hover:scale-105 transition-all shadow-lg mr-4"
            >
              <Share2 className="w-5 h-5 mr-2" />
              Share My Result
            </Button>
            <Button
              onClick={resetQuiz}
              variant="outline"
              className="px-8 py-3 rounded-full border-2 border-purple-200 hover:bg-purple-50"
            >
              Take Quiz Again
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-6 p-4 bg-white rounded-xl shadow-md"
          >
            <h4 className="font-semibold text-purple-800 mb-2">🎁 Free Puppy Care Guide</h4>
            <p className="text-gray-600 text-sm mb-3">
              Get our comprehensive guide to raising healthy, happy puppies!
            </p>
            <Button className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-2 rounded-full">
              Download Free Guide
            </Button>
          </motion.div>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-2xl mx-auto"
    >
      <Card className="p-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl shadow-2xl">
        {/* Quiz Header */}
        <div className="text-center mb-8">
          <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-4 h-4 mr-2" />
            Viral Puppy Quiz
          </Badge>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            What's Your Puppy Parent Personality? 🐕
          </h2>
          <p className="text-gray-600">
            Test your puppy care knowledge and get personalized recommendations!
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">
              Question {currentQuestion + 1} of {quizQuestions.length}
            </span>
            <span className="text-sm text-gray-600">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <AnimatePresence mode="wait">
          {!showExplanation ? (
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
            >
              {/* Question */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">
                  {quizQuestions[currentQuestion].question}
                </h3>
                
                <div className="space-y-3">
                  {quizQuestions[currentQuestion].options.map((option, index) => (
                    <motion.button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-300 ${
                        selectedAnswer === index
                          ? 'border-purple-500 bg-purple-50 text-purple-800'
                          : 'border-gray-200 hover:border-purple-300 hover:bg-purple-25'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-3">
                        {selectedAnswer === index ? (
                          <CheckCircle className="w-5 h-5 text-purple-500" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-400" />
                        )}
                        <span className="font-medium">{option}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Next Button */}
              <div className="text-center">
                <Button
                  onClick={handleNext}
                  disabled={selectedAnswer === null}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full hover:scale-105 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {currentQuestion === quizQuestions.length - 1 ? 'Get My Result!' : 'Next Question'}
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              <div className={`p-6 rounded-xl mb-6 ${
                selectedAnswer === quizQuestions[currentQuestion].correctAnswer
                  ? 'bg-green-50 border-2 border-green-200'
                  : 'bg-red-50 border-2 border-red-200'
              }`}>
                <div className="text-4xl mb-2">
                  {selectedAnswer === quizQuestions[currentQuestion].correctAnswer ? '🎉' : '💡'}
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  {selectedAnswer === quizQuestions[currentQuestion].correctAnswer
                    ? 'Correct!'
                    : 'Not quite!'}
                </h3>
                <p className="text-gray-700 mb-3">
                  {quizQuestions[currentQuestion].explanation}
                </p>
                <div className="bg-white p-3 rounded-lg">
                  <p className="text-sm text-purple-700 font-medium">
                    {quizQuestions[currentQuestion].funFact}
                  </p>
                </div>
              </div>
              <p className="text-gray-600">Moving to next question...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};

export default ViralPuppyQuiz;