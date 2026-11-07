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
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-8">
      {/* Top HUD */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border border-slate-200 bg-white/95 text-slate-800 p-4 rounded-2xl shadow-sm backdrop-blur-md dark:border-cyan-500/30 dark:bg-slate-900/80 dark:text-slate-100 dark:shadow-[0_0_20px_rgba(6,182,212,0.1)]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playClick();
              onBack();
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-100 hover:bg-slate-200 hover:border-sky-300 text-slate-700 font-mono text-xs font-semibold transition-all cursor-pointer dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:text-cyan-400"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>返回目錄</span>
          </button>

          <div>
            <div className="text-[11px] font-mono font-bold text-sky-600 dark:text-cyan-400">
              {chapter === 1 ? '// 第1課 小小考察隊' : chapter === 2 ? '// 第2課 漫遊香港' : chapter === 3 ? '// 第3課 香港的氣候' : chapter === 4 ? '// 第4課 發現地球' : '// 第5課 地球生病了'}
            </div>
            <div className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2 dark:text-white">
              <span>{chapter <= 3 ? 'H4a_u1_04' : 'H4a_u2_04'} 判斷題 (知識與理解)</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded font-semibold bg-sky-100 border border-sky-300 text-sky-800 dark:bg-cyan-950 dark:border-cyan-500/50 dark:text-cyan-300">
                {currentQ.id}
              </span>
            </div>
          </div>
        </div>

        {/* HUD Counters */}
        <div className="flex items-center gap-3 sm:gap-4 font-mono text-xs">
          <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-300">
            <span className="text-slate-500 dark:text-slate-400">進度:</span>
            <span className="text-sky-600 font-bold dark:text-cyan-400">
              {currentIndex + 1} / {questions.length}
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-300">
            <span className="text-slate-500 dark:text-slate-400">得分:</span>
            <span className="text-emerald-600 font-bold dark:text-emerald-400">{score}</span>
          </div>

          {combo > 1 && (
            <div className="flex items-center gap-1 bg-amber-100 border border-amber-300 px-2.5 py-1.5 rounded-xl text-amber-800 font-bold dark:bg-amber-950/60 dark:border-amber-500/60 dark:text-amber-300 animate-pulse">
              <Zap className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
              <span>COMBO x{combo}</span>
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-6 border border-slate-200 dark:bg-slate-900 dark:border-slate-800">
        <div
          className="h-full bg-gradient-to-r from-sky-500 via-blue-500 to-emerald-500 transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="exercise-card border border-slate-200 bg-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-[0_4px_30px_rgba(0,0,0,0.05)] relative overflow-hidden dark:border-cyan-500/30 dark:bg-slate-900/90 dark:shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <span className="text-xs font-mono font-bold text-sky-700 bg-sky-50 border border-sky-300 px-3 py-1 rounded-lg dark:text-cyan-400 dark:bg-cyan-950/60 dark:border-cyan-500/40">
            第 {currentIndex + 1} 題 / 共 {questions.length} 題
          </span>
          <span className="text-xs px-3 py-1 rounded-lg font-semibold border bg-amber-50 border-amber-300 text-amber-800 dark:bg-amber-950/70 dark:border-amber-500 dark:text-amber-300">
            ⚖️ 二元真偽判斷題（請判斷敘述為正確或錯誤）
          </span>
        </div>

        {/* Statement Box */}
        <div className="question-prompt p-6 sm:p-8 rounded-2xl bg-slate-50 border border-slate-200 text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 mb-8 leading-relaxed text-center sm:text-left shadow-inner dark:bg-slate-950/80 dark:border-slate-800 dark:text-white">
          {currentQ.statement}
        </div>

        {/* Binary Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
          {/* True Button */}
          <button
            disabled={isAnswered}
            onClick={() => handleSelect(true)}
            className={`p-6 sm:p-8 rounded-3xl border-2 font-bold transition-all duration-200 flex flex-col items-center justify-center gap-3 cursor-pointer disabled:cursor-default active:scale-[0.98] ${
              !isAnswered
                ? 'border-emerald-300 bg-emerald-50/70 hover:bg-emerald-100 hover:border-emerald-500 text-emerald-950 shadow-sm hover:shadow-md dark:border-emerald-500/50 dark:bg-emerald-950/30 dark:text-emerald-300'
                : currentQ.isCorrect === true
                ? 'border-emerald-500 bg-emerald-100 text-emerald-950 ring-4 ring-emerald-400/50 shadow-lg dark:border-emerald-400 dark:bg-emerald-950/80 dark:text-emerald-200'
                : userChoice === true
                ? 'border-rose-400 bg-rose-100 text-rose-950 ring-2 ring-rose-400 dark:border-rose-500 dark:bg-rose-950/80 dark:text-rose-300'
                : 'border-slate-200 bg-slate-50 text-slate-400 opacity-40 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-600'
            }`}
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20 border border-emerald-400/50 text-emerald-700 dark:text-emerald-400">
              <Check className="h-10 w-10 stroke-[3]" />
            </div>
            <span className="text-2xl sm:text-3xl font-black">✓ 正確 (TRUE)</span>
            <span className="text-xs sm:text-sm font-medium text-emerald-700 dark:text-emerald-400/70">敘述符合客觀常識事實</span>
          </button>

          {/* False Button */}
          <button
            disabled={isAnswered}
            onClick={() => handleSelect(false)}
            className={`p-6 sm:p-8 rounded-3xl border-2 font-bold transition-all duration-200 flex flex-col items-center justify-center gap-3 cursor-pointer disabled:cursor-default active:scale-[0.98] ${
              !isAnswered
                ? 'border-rose-300 bg-rose-50/70 hover:bg-rose-100 hover:border-rose-500 text-rose-950 shadow-sm hover:shadow-md dark:border-rose-500/50 dark:bg-rose-950/30 dark:text-rose-300'
                : currentQ.isCorrect === false
                ? 'border-emerald-500 bg-emerald-100 text-emerald-950 ring-4 ring-emerald-400/50 shadow-lg dark:border-emerald-400 dark:bg-emerald-950/80 dark:text-emerald-200'
                : userChoice === false
                ? 'border-rose-400 bg-rose-100 text-rose-950 ring-2 ring-rose-400 dark:border-rose-500 dark:bg-rose-950/80 dark:text-rose-300'
                : 'border-slate-200 bg-slate-50 text-slate-400 opacity-40 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-600'
            }`}
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/20 border border-rose-400/50 text-rose-700 dark:text-rose-400">
              <X className="h-10 w-10 stroke-[3]" />
            </div>
            <span className="text-2xl sm:text-3xl font-black">✕ 錯誤 (FALSE)</span>
            <span className="text-xs sm:text-sm font-medium text-rose-700 dark:text-rose-400/70">敘述存在錯誤觀念</span>
          </button>
        </div>

        {/* Feedback & Next Button */}
        {isAnswered && (
          <div className="border-t border-slate-200 pt-5 flex flex-col sm:flex-row items-center justify-between gap-4 dark:border-slate-800">
            <div className="flex items-center gap-3">
              {isCorrect ? (
                <div className="flex items-center gap-2 text-emerald-600 font-bold text-base sm:text-lg dark:text-emerald-400">
                  <CheckCircle2 className="h-6 w-6" />
                  <span>判斷精確！獲得 +100 EXP</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-rose-600 font-bold text-base sm:text-lg dark:text-rose-400">
                  <XCircle className="h-6 w-6" />
                  <span>判斷失誤！正確答案為：{currentQ.isCorrect ? '✓ 正確' : '✕ 錯誤'}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {currentQ.explanation && (
                <button
                  onClick={() => setShowExplanation(!showExplanation)}
                  className="flex items-center gap-1 px-4 py-2.5 rounded-xl border border-sky-300 bg-sky-50 text-sky-700 text-xs sm:text-sm font-semibold hover:bg-sky-100 transition-colors cursor-pointer dark:border-cyan-500/40 dark:bg-cyan-950/30 dark:text-cyan-300"
                >
                  <HelpCircle className="h-4 w-4" />
                  <span>{showExplanation ? '收起解析' : '作戰解析'}</span>
                </button>
              )}

              <button
                onClick={handleNext}
                className="flex-1 sm:flex-none px-8 py-3 rounded-xl font-bold font-mono text-sm sm:text-base bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] dark:bg-emerald-500 dark:text-slate-950"
              >
                <span>{currentIndex + 1 < questions.length ? '下一題 (NEXT)' : '結算任務 (REPORT)'}</span>
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
              className="mt-6 p-4 sm:p-5 rounded-2xl border border-sky-200 bg-sky-50 text-slate-800 text-xs sm:text-sm leading-relaxed dark:border-cyan-500/40 dark:bg-slate-800/60 dark:text-slate-200"
            >
              <div className="font-bold text-sky-700 mb-1 flex items-center gap-1.5 font-mono dark:text-cyan-400">
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
