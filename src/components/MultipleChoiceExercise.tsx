import React, { useState } from 'react';
import { MultipleChoiceQuestion } from '../data/questionsData';
import { ChapterNumber } from '../types';
import { sound } from '../utils/audio';
import { CheckCircle2, XCircle, ChevronRight, RotateCcw, Zap, HelpCircle, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MultipleChoiceExerciseProps {
  questions: MultipleChoiceQuestion[];
  chapter: ChapterNumber;
  onFinish: (score: number, total: number, wrongItems: any[]) => void;
  onBack: () => void;
}

export const MultipleChoiceExercise: React.FC<MultipleChoiceExerciseProps> = ({
  questions,
  chapter,
  onFinish,
  onBack,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [wrongItems, setWrongItems] = useState<any[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);

  const currentQ = questions[currentIndex];

  const handleSelect = (label: string) => {
    if (isAnswered) return;
    sound.playClick();

    if (currentQ.isMultiSelect) {
      if (selectedOptions.includes(label)) {
        setSelectedOptions(selectedOptions.filter((o) => o !== label));
      } else {
        setSelectedOptions([...selectedOptions, label]);
      }
    } else {
      setSelectedOptions([label]);
    }
  };

  const handleConfirmAnswer = () => {
    if (selectedOptions.length === 0 || isAnswered) return;

    const sortedSelected = [...selectedOptions].sort();
    const sortedCorrect = [...currentQ.correctAnswers].sort();
    const correct =
      sortedSelected.length === sortedCorrect.length &&
      sortedSelected.every((val, index) => val === sortedCorrect[index]);

    setIsAnswered(true);
    setIsCorrect(correct);

    if (correct) {
      sound.playCorrect();
      setScore((s) => s + 1);
      const newCombo = combo + 1;
      setCombo(newCombo);
      if (newCombo > maxCombo) setMaxCombo(newCombo);
      if (newCombo >= 3) {
        sound.playCombo();
      }
    } else {
      sound.playWrong();
      setCombo(0);
      setWrongItems((w) => [
        ...w,
        {
          id: currentQ.id,
          prompt: currentQ.prompt,
          userAnswer: selectedOptions.join('、'),
          correctAnswer: currentQ.correctAnswers.join('、'),
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
      setSelectedOptions([]);
      setIsAnswered(false);
      setIsCorrect(null);
      setShowExplanation(false);
    } else {
      // Completed all
      const finalScore = isCorrect ? score : score; // already counted
      onFinish(finalScore, questions.length, wrongItems);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-8">
      {/* Top Navigation & Status Bar */}
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
              <span>{chapter <= 3 ? 'H4a_u1_01' : 'H4a_u2_01'} 選擇題 (知識與理解)</span>
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
        {/* Question Header & Type Tag */}
        <div className="flex items-center justify-between mb-5">
          <span className="text-xs font-mono font-bold text-sky-700 bg-sky-50 border border-sky-300 px-3 py-1 rounded-lg dark:text-cyan-400 dark:bg-cyan-950/60 dark:border-cyan-500/40">
            第 {currentIndex + 1} 題 / 共 {questions.length} 題
          </span>
          <span
            className={`text-xs px-3 py-1 rounded-lg font-semibold border ${
              currentQ.isMultiSelect
                ? 'bg-purple-50 border-purple-300 text-purple-700 dark:bg-purple-950/70 dark:border-purple-500 dark:text-purple-300'
                : 'bg-sky-50 border-sky-300 text-sky-700 dark:bg-blue-950/70 dark:border-blue-500 dark:text-blue-300'
            }`}
          >
            {currentQ.isMultiSelect ? '⚠️ 多選題：答案可多於一個' : '🎯 單選題'}
          </span>
        </div>

        {/* Prompt */}
        <h2 className="question-prompt text-xl sm:text-2xl font-bold text-slate-900 mb-6 leading-relaxed dark:text-white">
          {currentQ.prompt}
        </h2>

        {/* Options Grid */}
        <div className="space-y-3.5 mb-8">
          {currentQ.options.map((opt) => {
            const isSelected = selectedOptions.includes(opt.label);
            const isCorrectOption = currentQ.correctAnswers.includes(opt.label);

            let btnStyle = 'border-slate-200 bg-slate-50/80 hover:bg-sky-50 hover:border-sky-300 text-slate-800 dark:border-slate-800 dark:bg-slate-800/40 dark:hover:bg-slate-800/80 dark:hover:border-cyan-500/60 dark:text-slate-200';

            if (!isAnswered && isSelected) {
              btnStyle = 'border-sky-500 bg-sky-50 text-sky-950 shadow-md ring-2 ring-sky-400 font-semibold dark:border-cyan-400 dark:bg-cyan-950/70 dark:text-cyan-200 dark:ring-cyan-400';
            } else if (isAnswered) {
              if (isCorrectOption) {
                btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 shadow-md ring-2 ring-emerald-400 font-semibold dark:border-emerald-500 dark:bg-emerald-950/70 dark:text-emerald-200';
              } else if (isSelected && !isCorrectOption) {
                btnStyle = 'border-rose-400 bg-rose-50 text-rose-950 ring-2 ring-rose-400 shadow-md dark:border-rose-500 dark:bg-rose-950/70 dark:text-rose-200';
              } else {
                btnStyle = 'border-slate-100 bg-slate-50 text-slate-400 opacity-60 dark:border-slate-900 dark:bg-slate-900/30 dark:text-slate-500';
              }
            }

            return (
              <button
                key={opt.label}
                disabled={isAnswered}
                onClick={() => handleSelect(opt.label)}
                className={`option-btn w-full text-left p-4 sm:p-5 rounded-2xl border flex items-center justify-between gap-4 transition-all duration-200 ${btnStyle} cursor-pointer disabled:cursor-default active:scale-[0.99]`}
              >
                <div className="flex items-center gap-4">
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-xl font-mono font-bold text-sm border flex-shrink-0 ${
                      isSelected
                        ? isAnswered
                          ? isCorrectOption
                            ? 'bg-emerald-600 border-emerald-500 text-white'
                            : 'bg-rose-600 border-rose-500 text-white'
                          : 'bg-sky-600 border-sky-600 text-white'
                        : 'border-slate-300 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    {opt.label}
                  </span>
                  <span className="text-base sm:text-lg font-medium leading-snug">{opt.text}</span>
                </div>

                {isAnswered && isCorrectOption && (
                  <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                )}
                {isAnswered && isSelected && !isCorrectOption && (
                  <XCircle className="h-6 w-6 text-rose-500 dark:text-rose-400 flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Action Button & Feedback */}
        <div className="border-t border-slate-200 pt-5 flex flex-wrap items-center justify-between gap-4 dark:border-slate-800">
          {!isAnswered ? (
            <button
              onClick={handleConfirmAnswer}
              disabled={selectedOptions.length === 0}
              className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold font-mono text-sm sm:text-base flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                selectedOptions.length > 0
                  ? 'bg-sky-600 hover:bg-sky-500 text-white shadow-lg cursor-pointer dark:bg-cyan-500 dark:text-slate-950'
                  : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed dark:bg-slate-800 dark:text-slate-500 dark:border-slate-700'
              }`}
            >
              <Zap className="h-4 w-4" />
              <span>確認指令 (SUBMIT)</span>
            </button>
          ) : (
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {isCorrect ? (
                  <div className="flex items-center gap-2 text-emerald-600 font-bold text-base dark:text-emerald-400">
                    <CheckCircle2 className="h-6 w-6" />
                    <span>回答正確！獲得 +100 EXP</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-rose-600 font-bold text-base dark:text-rose-400">
                    <XCircle className="h-6 w-6" />
                    <span>回答錯誤！正確答案：{currentQ.correctAnswers.join('、')}</span>
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
        </div>

        {/* Explanation Accordion */}
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
                <span>常識重點解析：</span>
              </div>
              <p>{currentQ.explanation}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
