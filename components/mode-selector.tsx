import { LearningMode } from "@/lib/schemas";
import { motion } from "framer-motion";
import { FileText, Brain, CheckSquare, Grid2X2 } from "lucide-react";

interface ModeSelectorProps {
  onSelectMode: (mode: LearningMode) => void;
  selectedMode?: LearningMode;
}

const modes: { id: LearningMode; label: string; icon: React.ReactNode }[] = [
  {
    id: "flashcards",
    label: "Flashcards",
    icon: <FileText className="w-6 h-6" />,
  },
  {
    id: "quiz",
    label: "Quiz",
    icon: <CheckSquare className="w-6 h-6" />,
  },
  {
    id: "match",
    label: "Match",
    icon: <Grid2X2 className="w-6 h-6" />,
  },
];

export function ModeSelector({ onSelectMode, selectedMode }: ModeSelectorProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-4xl mx-auto">
      {modes.map((mode) => (
        <motion.button
          key={mode.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectMode(mode.id)}
          className={`flex flex-col items-center justify-center p-6 rounded-xl bg-white dark:bg-zinc-900 border-2 transition-colors
            ${
              selectedMode === mode.id
                ? "border-blue-500"
                : "border-transparent hover:border-blue-500/50"
            }`}
        >
          <div
            className={`mb-2 transition-colors ${
              selectedMode === mode.id ? "text-blue-500" : "text-zinc-600 dark:text-zinc-400"
            }`}
          >
            {mode.icon}
          </div>
          <span className="text-sm font-medium">{mode.label}</span>
        </motion.button>
      ))}
    </div>
  );
} 