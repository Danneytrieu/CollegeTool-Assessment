import { Question } from "@/lib/schemas";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { PlayIcon, Timer, Trophy } from "lucide-react";
import confetti from "canvas-confetti";

interface MatchProps {
  questions: Question[];
}

type MatchCard = {
  id: number;
  content: string;
  type: "question" | "answer";
  isSelected: boolean;
  isMatched: boolean;
  matchId: number;
};

export function Match({ questions }: MatchProps) {
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [cards, setCards] = useState<MatchCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [timer, setTimer] = useState<number>(0);
  const [isGameComplete, setIsGameComplete] = useState(false);

  // Initialize game cards
  const initializeGame = () => {
    const gameCards: MatchCard[] = [];
    questions.forEach((q, index) => {
      gameCards.push({
        id: index * 2,
        content: q.definition,
        type: "question",
        isSelected: false,
        isMatched: false,
        matchId: index,
      });
      gameCards.push({
        id: index * 2 + 1,
        content: q.term,
        type: "answer",
        isSelected: false,
        isMatched: false,
        matchId: index,
      });
    });
    return gameCards.sort(() => Math.random() - 0.5);
  };

  const startGame = () => {
    setCards(initializeGame());
    setIsGameStarted(true);
    setTimer(0);
    setMatchedPairs(0);
    setIsGameComplete(false);
  };

  const handleCardClick = (cardId: number) => {
    if (cards[cardId].isMatched) return; // Prevent clicking matched cards
    if (selectedCards.includes(cardId)) return; // Prevent clicking same card
    if (selectedCards.length === 2) {
      // If two cards are already selected, clear selections before selecting new card
      const newCards = [...cards];
      selectedCards.forEach(id => {
        newCards[id].isSelected = false;
      });
      newCards[cardId].isSelected = true;
      setCards(newCards);
      setSelectedCards([cardId]);
      return;
    }

    // Select the clicked card
    const newCards = [...cards];
    newCards[cardId].isSelected = true;
    setCards(newCards);
    
    const newSelectedCards = [...selectedCards, cardId];
    setSelectedCards(newSelectedCards);

    // Check for match when two cards are selected
    if (newSelectedCards.length === 2) {
      const firstCard = cards[newSelectedCards[0]];
      const secondCard = cards[newSelectedCards[1]];

      if (firstCard.matchId === secondCard.matchId) {
        // Match found
        setTimeout(() => {
          const updatedCards = [...newCards];
          updatedCards[newSelectedCards[0]].isMatched = true;
          updatedCards[newSelectedCards[1]].isMatched = true;
          setCards(updatedCards);
          setSelectedCards([]);
          setMatchedPairs(prev => prev + 1);

          if (matchedPairs + 1 === questions.length) {
            setIsGameComplete(true);
            confetti();
          }
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          const updatedCards = [...newCards];
          updatedCards[newSelectedCards[0]].isSelected = false;
          updatedCards[newSelectedCards[1]].isSelected = false;
          setCards(updatedCards);
          setSelectedCards([]);
        }, 1000);
      }
    }
  };

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGameStarted && !isGameComplete) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isGameStarted, isGameComplete]);

  if (!isGameStarted) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-8">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Memory Match Game</h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            Match questions with their correct answers
          </p>
        </div>
        <Button onClick={startGame} size="lg" className="gap-2">
          <PlayIcon className="w-5 h-5" />
          Start Game
        </Button>
      </div>
    );
  }

  if (isGameComplete) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-8">
        <Trophy className="w-16 h-16 text-yellow-500" />
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Congratulations!</h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            You completed the game in {timer} seconds
          </p>
        </div>
        <Button onClick={startGame} size="lg">
          Play Again
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <Timer className="w-5 h-5" />
          <span>{timer}s</span>
        </div>
        <div className="text-sm">
          Matches: {matchedPairs}/{questions.length}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AnimatePresence>
          {cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.02 }}
              className={`aspect-[4/3] cursor-pointer`}
              onClick={() => handleCardClick(index)}
            >
              <div
                className={`w-full h-full bg-white dark:bg-zinc-800 rounded-xl border-2 
                  ${card.isMatched ? "opacity-50" : ""}
                  ${card.isSelected ? "border-yellow-500 shadow-lg" : "border-zinc-200 dark:border-zinc-700"}
                  ${card.type === "question" ? "bg-blue-50 dark:bg-blue-950" : "bg-green-50 dark:bg-green-950"}
                `}
              >
                <div className="flex items-center justify-center h-full p-4 text-center">
                  <p className="text-sm">{card.content}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
} 