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
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Top Navigation & Status Bar */}
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
              <span>H4a_u2_01 選擇題 (知識與理解)</span>
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
        {/* Decorative corner borders */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400"></div>

        {/* Question Header & Type Tag */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-500/40 px-2.5 py-1 rounded-md">
            QUESTION #{currentIndex + 1}
          </span>
          <span
            className={`text-xs px-2.5 py-1 rounded-md font-medium border ${
              currentQ.isMultiSelect
                ? 'bg-purple-950/70 border-purple-500 text-purple-300'
                : 'bg-blue-950/70 border-blue-500 text-blue-300'
            }`}
          >
            {currentQ.isMultiSelect ? '⚠️ 多選題：答案可多於一個' : '🎯 單選題'}
          </span>
        </div>

        {/* Prompt */}
        <h2 className="text-lg sm:text-xl font-bold text-white mb-6 leading-relaxed">
          {currentQ.prompt}
        </h2>

        {/* Options Grid */}
        <div className="space-y-3 mb-6">
          {currentQ.options.map((opt) => {
            const isSelected = selectedOptions.includes(opt.label);
            const isCorrectOption = currentQ.correctAnswers.includes(opt.label);

            let btnStyle = 'border-slate-800 bg-slate-800/40 hover:bg-slate-800/80 hover:border-cyan-500/60 text-slate-200';

            if (!isAnswered && isSelected) {
              btnStyle = 'border-cyan-400 bg-cyan-950/70 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.3)] ring-1 ring-cyan-400';
            } else if (isAnswered) {
              if (isCorrectOption) {
                btnStyle = 'border-emerald-500 bg-emerald-950/70 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.3)] ring-1 ring-emerald-400';
              } else if (isSelected && !isCorrectOption) {
                btnStyle = 'border-rose-500 bg-rose-950/70 text-rose-200 shadow-[0_0_15px_rgba(244,63,94,0.3)]';
              } else {
                btnStyle = 'border-slate-900 bg-slate-900/30 text-slate-500 opacity-60';
              }
            }

            return (
              <button
                key={opt.label}
                disabled={isAnswered}
                onClick={() => handleSelect(opt.label)}
                className={`w-full text-left p-4 rounded-xl border flex items-center justify-between gap-3 transition-all duration-200 ${btnStyle} cursor-pointer disabled:cursor-default`}
              >
                <div className="flex items-center gap-3.5">
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-lg font-mono font-bold text-sm border ${
                      isSelected
                        ? isAnswered
                          ? isCorrectOption
                            ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                            : 'bg-rose-500 border-rose-400 text-white'
                          : 'bg-cyan-500 border-cyan-400 text-slate-950'
                        : 'border-slate-700 bg-slate-800 text-slate-400'
                    }`}
                  >
                    {opt.label}
                  </span>
                  <span className="text-base font-medium">{opt.text}</span>
                </div>

                {isAnswered && isCorrectOption && (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                )}
                {isAnswered && isSelected && !isCorrectOption && (
                  <XCircle className="h-5 w-5 text-rose-400 flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Action Button & Feedback */}
        <div className="border-t border-slate-800 pt-5 flex flex-wrap items-center justify-between gap-4">
          {!isAnswered ? (
            <button
              onClick={handleConfirmAnswer}
              disabled={selectedOptions.length === 0}
              className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold font-mono text-sm flex items-center justify-center gap-2 transition-all ${
                selectedOptions.length > 0
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 hover:brightness-110 shadow-[0_0_20px_rgba(6,182,212,0.4)] cursor-pointer'
                  : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
              }`}
            >
              <Zap className="h-4 w-4" />
              <span>確認指令 (SUBMIT)</span>
            </button>
          ) : (
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {isCorrect ? (
                  <div className="flex items-center gap-2 text-emerald-400 font-bold">
                    <CheckCircle2 className="h-6 w-6" />
                    <span>回答正確！獲得 +100 EXP</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-rose-400 font-bold">
                    <XCircle className="h-6 w-6" />
                    <span>回答錯誤！正確答案：{currentQ.correctAnswers.join('、')}</span>
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
        </div>

        {/* Explanation Accordion */}
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
                <span>常識戰術分析資料庫：</span>
              </div>
              <p>{currentQ.explanation}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
