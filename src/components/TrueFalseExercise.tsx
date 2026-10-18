import React, { useState } from 'react';
import { TrueFalseQuestion } from '../data/questionsData';
import { ChapterNumber } from '../types';
import { sound } from '../utils/audio';
import { CheckCircle2, XCircle, ChevronRight, Zap, HelpCircle, ArrowLeft, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TrueFalseExerciseProps {
  questions: TrueFalseQuestion[];
  chapter: ChapterNumber;
  onFinish: (score: number, total: number, wrongItems: any[]) => void;
  onBack: () => void;
}

export const TrueFalseExercise: React.FC<TrueFalseExerciseProps> = ({
  questions,
  chapter,
  onFinish,
  onBack,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userChoice, setUserChoice] = useState<boolean | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [wrongItems, setWrongItems] = useState<any[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);

  const currentQ = questions[currentIndex];

  const handleSelect = (choice: boolean) => {
    if (isAnswered) return;
    setUserChoice(choice);
    sound.playClick();

    const correct = choice === currentQ.isCorrect;
    setIsAnswered(true);
    setIsCorrect(correct);

    if (correct) {
      sound.playCorrect();
      setScore((s) => s + 1);
      const newCombo = combo + 1;
      setCombo(newCombo);
      if (newCombo >= 3) sound.playCombo();
    } else {
      sound.playWrong();
      setCombo(0);
      setWrongItems((w) => [
        ...w,
        {
          id: currentQ.id,
          prompt: currentQ.statement,
          userAnswer: choice ? '✓ (正確)' : '✕ (錯誤)',
          correctAnswer: currentQ.isCorrect ? '✓ (正確)' : '✕ (錯誤)',
          chapter,
          category: currentQ.category,
          explanation: currentQ.explanation,
        },
      ]);
    }
  };

  const handleNext = () => {
    sound.playLaser();
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setUserChoice(null);
      setIsAnswered(false);
      setIsCorrect(null);
      setShowExplanation(false);
    } else {
      onFinish(isCorrect ? score : score, questions.length, wrongItems);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Top HUD */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border border-cyan-500/30 bg-slate-900/80 p-4 rounded-xl backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.1)]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playClick();
              onBack();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:border-cyan-500 text-slate-300 hover:text-cyan-400 text-xs font-mono transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>返回目錄</span>
          </button>

          <div>
            <div className="text-[11px] font-mono text-cyan-400">
              {chapter === 4 ? '// 第4課 發現地球' : '// 第5課 地球生病了'}
            </div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <span>H4a_u2_04 判斷題 (知識與理解)</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/50 text-cyan-300">
                {currentQ.id}
              </span>
            </div>
          </div>
        </div>

        {/* HUD Counters */}
        <div className="flex items-center gap-4 font-mono text-xs">
          <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
            <span className="text-slate-400">進度:</span>
            <span className="text-cyan-400 font-bold">
              {currentIndex + 1} / {questions.length}
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
            <span className="text-slate-400">得分:</span>
            <span className="text-emerald-400 font-bold">{score}</span>
          </div>

          {combo > 1 && (
            <div className="flex items-center gap-1 bg-amber-950/60 border border-amber-500/60 px-2.5 py-1.5 rounded-lg text-amber-300 font-bold animate-pulse">
              <Zap className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span>COMBO x{combo}</span>
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden mb-6 border border-slate-800">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-emerald-400 transition-all duration-300 shadow-[0_0_10px_rgba(6,182,212,0.8)]"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="border border-cyan-500/30 bg-slate-900/90 rounded-2xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400"></div>

        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-500/40 px-2.5 py-1 rounded-md">
            SCAN #{currentIndex + 1}
          </span>
          <span className="text-xs px-2.5 py-1 rounded-md font-medium border bg-amber-950/70 border-amber-500 text-amber-300">
            ⚖️ 二元真偽判斷題 (請判斷敘述為正確或錯誤)
          </span>
        </div>

        {/* Statement Box */}
        <div className="p-6 rounded-xl bg-slate-950/80 border border-slate-800 text-xl sm:text-2xl font-bold text-white mb-8 leading-relaxed text-center sm:text-left">
          {currentQ.statement}
        </div>

        {/* Binary Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* True Button */}
          <button
            disabled={isAnswered}
            onClick={() => handleSelect(true)}
            className={`p-6 rounded-2xl border-2 font-bold transition-all duration-200 flex flex-col items-center justify-center gap-2 cursor-pointer disabled:cursor-default ${
              !isAnswered
                ? 'border-emerald-500/50 bg-emerald-950/30 hover:bg-emerald-900/50 hover:border-emerald-400 hover:scale-[1.02] text-emerald-300'
                : currentQ.isCorrect === true
                ? 'border-emerald-400 bg-emerald-950/80 text-emerald-200 ring-2 ring-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.5)]'
                : userChoice === true
                ? 'border-rose-500 bg-rose-950/80 text-rose-300'
                : 'border-slate-800 bg-slate-900/40 text-slate-600 opacity-40'
            }`}
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-400/50">
              <Check className="h-8 w-8 text-emerald-400" />
            </div>
            <span className="text-xl">✓ 正確 (TRUE)</span>
            <span className="text-xs font-mono text-emerald-400/70">敘述符合客觀事實</span>
          </button>

          {/* False Button */}
          <button
            disabled={isAnswered}
            onClick={() => handleSelect(false)}
            className={`p-6 rounded-2xl border-2 font-bold transition-all duration-200 flex flex-col items-center justify-center gap-2 cursor-pointer disabled:cursor-default ${
              !isAnswered
                ? 'border-rose-500/50 bg-rose-950/30 hover:bg-rose-900/50 hover:border-rose-400 hover:scale-[1.02] text-rose-300'
                : currentQ.isCorrect === false
                ? 'border-emerald-400 bg-emerald-950/80 text-emerald-200 ring-2 ring-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.5)]'
                : userChoice === false
                ? 'border-rose-500 bg-rose-950/80 text-rose-300'
                : 'border-slate-800 bg-slate-900/40 text-slate-600 opacity-40'
            }`}
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-500/20 border border-rose-400/50">
              <X className="h-8 w-8 text-rose-400" />
            </div>
            <span className="text-xl">✕ 錯誤 (FALSE)</span>
            <span className="text-xs font-mono text-rose-400/70">敘述存在錯誤觀念</span>
          </button>
        </div>

        {/* Feedback & Next Button */}
        {isAnswered && (
          <div className="border-t border-slate-800 pt-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {isCorrect ? (
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <CheckCircle2 className="h-6 w-6" />
                  <span>判斷精確！獲得 +100 EXP</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-rose-400 font-bold">
                  <XCircle className="h-6 w-6" />
                  <span>判斷失誤！正確答案為：{currentQ.isCorrect ? '✓ 正確' : '✕ 錯誤'}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {currentQ.explanation && (
                <button
                  onClick={() => setShowExplanation(!showExplanation)}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg border border-cyan-500/40 bg-cyan-950/30 text-cyan-300 text-xs font-mono hover:bg-cyan-900/40 transition-colors"
                >
                  <HelpCircle className="h-4 w-4" />
                  <span>{showExplanation ? '收起解析' : '作戰解析'}</span>
                </button>
              )}

              <button
                onClick={handleNext}
                className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl font-bold font-mono text-sm bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:brightness-110 shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{currentIndex + 1 < questions.length ? '下一指令' : '結算任務'}</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Explanation */}
        <AnimatePresence>
          {isAnswered && (showExplanation || !isCorrect) && currentQ.explanation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 rounded-xl border border-cyan-500/30 bg-cyan-950/30 text-slate-200 text-xs sm:text-sm leading-relaxed"
            >
              <div className="font-bold text-cyan-400 mb-1 flex items-center gap-1.5 font-mono">
                <HelpCircle className="h-4 w-4" />
                <span>分析日誌：</span>
              </div>
              <p>{currentQ.explanation}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
