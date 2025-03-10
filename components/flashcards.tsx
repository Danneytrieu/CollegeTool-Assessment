import { Question } from "@/lib/schemas";
import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";

interface FlashcardsProps {
  questions: Question[];
}

export function Flashcards({ questions }: FlashcardsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
      setProgress(((currentIndex + 1) / questions.length) * 100);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
      setProgress(((currentIndex - 1) / questions.length) * 100);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto">
      <div className="w-full mb-8">
        <div className="h-1 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full">
          <motion.div
            className="h-full bg-blue-500 rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <div className="relative w-full aspect-[4/3] max-w-2xl perspective-1000">
        <motion.div
          className="w-full h-full relative preserve-3d transition-transform duration-500 cursor-pointer"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: "spring" }}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          {/* Back of card - Question */}
          <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
            <div className="w-full h-full bg-white dark:bg-zinc-900 rounded-xl p-8 flex flex-col items-center justify-center text-center shadow-lg">
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">Answer {currentIndex + 1}</p>
              <h2 className="text-2xl font-semibold">{questions[currentIndex].term}</h2>
              <div className="mt-8 text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                <span>Click to see Question</span>
                <svg 
                  className="w-4 h-4" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                >
                  <path d="M12 4v16m0-16L6 9m6-5l6 5"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Front of card - Answer */}
          <div className="absolute inset-0 w-full h-full backface-hidden ">
            <div className="w-full h-full bg-white dark:bg-zinc-900 rounded-xl p-8 flex flex-col items-center justify-center text-center shadow-lg">
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">Question</p>
              <p className="text-xl">{questions[currentIndex].definition}</p>
              <div className="mt-8 text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                <span>Click to see Answer</span>
                <svg 
                  className="w-4 h-4" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                >
                  <path d="M12 20V4m0 16l-6-5m6 5l6-5"/>
                </svg>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="flex items-center gap-4 mt-8">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        <span className="text-sm">
          {currentIndex + 1} / {questions.length}
        </span>
        <Button
          variant="outline"
          onClick={handleNext}
          disabled={currentIndex === questions.length - 1}
        >
          Next
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
} 