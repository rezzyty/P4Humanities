import React, { useState } from 'react';
import { WordBankSetQuestion } from '../data/questionsData';
import { ChapterNumber } from '../types';
import { sound } from '../utils/audio';
import { CheckCircle2, XCircle, ChevronRight, Zap, ArrowLeft, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface WordBankExerciseProps {
  questions: WordBankSetQuestion[];
  chapter: ChapterNumber;
  onFinish: (score: number, total: number, wrongItems: any[]) => void;
  onBack: () => void;
}

export const WordBankExercise: React.FC<WordBankExerciseProps> = ({
  questions,
  chapter,
  onFinish,
  onBack,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [activeSubId, setActiveSubId] = useState<number>(1);
  const [isAnswered, setIsAnswered] = useState(false);
  const [subResults, setSubResults] = useState<Record<number, boolean>>({});
  const [totalSubScore, setTotalSubScore] = useState(0);
  const [totalPossibleSubs, setTotalPossibleSubs] = useState(0);
  const [wrongItems, setWrongItems] = useState<any[]>([]);

  const currentSet = questions[currentIndex];

  // Count which words from wordBank are already used
  const usedWords = Object.values(answers);

  const handlePickWord = (word: string) => {
    if (isAnswered) return;
    sound.playClick();

    // Assign word to currently active sub-question
    setAnswers((prev) => ({
      ...prev,
      [activeSubId]: word,
    }));

    // Auto-advance activeSubId to next empty subId if available
    const nextEmpty = currentSet.subQuestions.find(
      (sq) => sq.subId > activeSubId && !answers[sq.subId]
    );
    if (nextEmpty) {
      setActiveSubId(nextEmpty.subId);
    } else {
      const anyEmpty = currentSet.subQuestions.find(
        (sq) => sq.subId !== activeSubId && !answers[sq.subId]
      );
      if (anyEmpty) setActiveSubId(anyEmpty.subId);
    }
  };

  const handleClearBlank = (subId: number) => {
    if (isAnswered) return;
    sound.playClick();
    setAnswers((prev) => {
      const next = { ...prev };
      delete next[subId];
      return next;
    });
    setActiveSubId(subId);
  };

  const handleResetCurrentSet = () => {
    if (isAnswered) return;
    sound.playClick();
    setAnswers({});
    setActiveSubId(1);
  };

  const handleCheck = () => {
    if (isAnswered) return;

    let setScore = 0;
    const results: Record<number, boolean> = {};
    const newWrongs: any[] = [];

    currentSet.subQuestions.forEach((sq) => {
      const userVal = (answers[sq.subId] || '').trim();
      const match = sq.acceptableAnswers.some(
        (ans) => ans.replace(/\s+/g, '') === userVal.replace(/\s+/g, '')
      );
      results[sq.subId] = match;
      if (match) {
        setScore += 1;
      } else {
        newWrongs.push({
          id: `${currentSet.id}_sub${sq.subId}`,
          prompt: sq.sentence,
          userAnswer: userVal || '(空白)',
          correctAnswer: sq.correctAnswer,
          chapter,
          category: currentSet.category,
        });
      }
    });

    setSubResults(results);
    setIsAnswered(true);
    setTotalSubScore((prev) => prev + setScore);
    setTotalPossibleSubs((prev) => prev + currentSet.subQuestions.length);

    if (setScore === currentSet.subQuestions.length) {
      sound.playCorrect();
      sound.playCombo();
    } else if (setScore > 0) {
      sound.playCorrect();
    } else {
      sound.playWrong();
    }

    if (newWrongs.length > 0) {
      setWrongItems((w) => [...w, ...newWrongs]);
    }
  };

  const handleNext = () => {
    sound.playLaser();
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setAnswers({});
      setIsAnswered(false);
      setSubResults({});
      setActiveSubId(1);
    } else {
      const totalSubQuestionsCount = questions.reduce((acc, q) => acc + q.subQuestions.length, 0);
      onFinish(
        totalSubScore,
        totalSubQuestionsCount,
        wrongItems
      );
    }
  };

  const allFilled = currentSet.subQuestions.every((sq) => !!answers[sq.subId]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Top HUD */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border border-purple-200 dark:border-cyan-500/30 bg-white/95 dark:bg-slate-900/80 p-4 rounded-2xl backdrop-blur-md shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playClick();
              onBack();
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:border-purple-400 text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-cyan-400 text-xs font-mono transition-colors cursor-pointer min-h-[40px]"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>返回目錄</span>
          </button>

          <div>
            <div className="text-[11px] font-mono font-semibold text-purple-600 dark:text-cyan-400">
              {chapter === 1 && '// 第1課 小小考察隊'}
              {chapter === 2 && '// 第2課 漫遊香港'}
              {chapter === 3 && '// 第3課 香港的氣候'}
              {chapter === 4 && '// 第4課 發現地球'}
              {chapter === 5 && '// 第5課 地球生病了'}
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>H4a 供詞填充題 (知識與理解)</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-100 dark:bg-cyan-950 border border-purple-300 dark:border-cyan-500/50 text-purple-800 dark:text-cyan-300 font-bold">
                {currentSet.id}
              </span>
            </div>
          </div>
        </div>

        {/* HUD Counters */}
        <div className="flex items-center gap-3 sm:gap-4 font-mono text-xs">
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="text-slate-500 dark:text-slate-400">大題組:</span>
            <span className="text-purple-600 dark:text-cyan-400 font-bold text-sm">
              {currentIndex + 1} / {questions.length}
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="text-slate-500 dark:text-slate-400">累計得分:</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">{totalSubScore}</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 dark:bg-slate-900 h-2.5 rounded-full overflow-hidden mb-6 border border-slate-300 dark:border-slate-800 shadow-inner">
        <div
          className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-emerald-500 transition-all duration-300 shadow-sm"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Main Container */}
      <div className="border border-purple-200/90 dark:border-cyan-500/30 bg-white dark:bg-slate-900/90 rounded-2xl p-6 sm:p-8 shadow-sm dark:shadow-2xl relative overflow-hidden backdrop-blur-xl exercise-card">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <span className="text-xs font-mono font-bold text-purple-700 dark:text-cyan-400 bg-purple-100/90 dark:bg-cyan-950/60 border border-purple-300 dark:border-cyan-500/40 px-3 py-1 rounded-lg">
            MISSION SET #{currentIndex + 1}
          </span>
          <span className="text-xs px-3 py-1 rounded-lg font-bold border bg-purple-50 dark:bg-purple-950/70 border-purple-300 dark:border-purple-500 text-purple-800 dark:text-purple-300">
            🧩 供詞庫填充（請選取下方詞語填入空格）
          </span>
        </div>

        {/* Word Bank Floating Panel */}
        <div className="mb-6 p-5 rounded-2xl border border-purple-200 dark:border-cyan-500/40 bg-purple-50/70 dark:bg-slate-950/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs sm:text-sm font-mono text-purple-800 dark:text-cyan-300 flex items-center gap-1.5 font-bold">
              <Zap className="h-4 w-4 text-purple-600 dark:text-cyan-400" />
              <span>【 可供選用之詞庫 】</span>
            </span>
            {!isAnswered && (
              <button
                onClick={handleResetCurrentSet}
                className="text-xs text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-cyan-400 flex items-center gap-1 transition-colors cursor-pointer p-1"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>重設所有空格</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
            {currentSet.wordBank.map((word, wIdx) => {
              const isUsed = usedWords.includes(word);

              return (
                <button
                  key={wIdx}
                  disabled={isAnswered}
                  onClick={() => handlePickWord(word)}
                  className={`px-3.5 py-3 rounded-xl border font-bold text-base transition-all duration-150 cursor-pointer disabled:cursor-default flex items-center justify-center gap-1 min-h-[48px] touch-target shadow-xs active:scale-95 ${
                    isUsed
                      ? 'border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/60 text-slate-400 dark:text-slate-500 opacity-60 line-through'
                      : 'border-purple-300 dark:border-cyan-400/60 bg-white dark:bg-cyan-950/50 hover:bg-purple-100 dark:hover:bg-cyan-900/70 text-purple-900 dark:text-cyan-100 hover:border-purple-400 shadow-sm'
                  }`}
                >
                  <span>{word}</span>
                </button>
              );
            })}
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 font-mono">
            💡 提示：點擊下方句子中的【空格】以鎖定位置，再點選上方詞語填入！
          </p>
        </div>

        {/* 5 Sub-Questions Sentences */}
        <div className="space-y-4 mb-6">
          {currentSet.subQuestions.map((sq) => {
            const userChoice = answers[sq.subId];
            const isActive = activeSubId === sq.subId;
            const isCorrect = subResults[sq.subId];

            return (
              <div
                key={sq.subId}
                onClick={() => {
                  if (!isAnswered) {
                    sound.playClick();
                    setActiveSubId(sq.subId);
                  }
                }}
                className={`p-5 rounded-2xl border transition-all cursor-pointer option-btn ${
                  isAnswered
                    ? isCorrect
                      ? 'border-emerald-400 bg-emerald-50/80 dark:bg-emerald-950/20'
                      : 'border-rose-400 bg-rose-50/80 dark:bg-rose-950/20'
                    : isActive
                    ? 'border-purple-500 bg-purple-50/90 dark:bg-cyan-950/40 ring-2 ring-purple-300 dark:ring-cyan-400 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 hover:border-purple-300'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3 text-base sm:text-lg leading-relaxed">
                  <div className="flex-1">
                    {(() => {
                      const parts = sq.sentence.split(/(\[BLANK\])/g);
                      return parts.map((part, pIdx) => {
                        if (part === '[BLANK]') {
                          return (
                            <span
                              key={pIdx}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (userChoice && !isAnswered) {
                                  handleClearBlank(sq.subId);
                                } else if (!isAnswered) {
                                  setActiveSubId(sq.subId);
                                }
                              }}
                              className={`inline-flex items-center mx-2 px-3.5 py-1.5 rounded-xl border font-bold text-base sm:text-lg font-sans transition-all min-h-[38px] ${
                                isAnswered
                                  ? isCorrect
                                    ? 'border-emerald-500 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                                    : 'border-rose-500 bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                                  : userChoice
                                  ? 'border-purple-400 bg-purple-100 dark:bg-cyan-950 text-purple-900 dark:text-cyan-200 hover:border-rose-400 hover:text-rose-600'
                                  : isActive
                                  ? 'border-purple-500 bg-purple-100/90 text-purple-900 dark:bg-cyan-950/70 dark:text-cyan-400 animate-pulse'
                                  : 'border-dashed border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-500'
                              }`}
                              title={userChoice && !isAnswered ? '點擊清除此格' : '點擊選取此格'}
                            >
                              {userChoice || '【 點選此格填入 】'}
                              {userChoice && !isAnswered && (
                                <span className="ml-1.5 text-xs text-rose-500 font-bold">×</span>
                              )}
                            </span>
                          );
                        }
                        return <span key={pIdx} className="text-slate-800 dark:text-slate-100">{part}</span>;
                      });
                    })()}
                  </div>

                  {/* Sub Question Status */}
                  <div className="flex-shrink-0 flex items-center gap-2">
                    {isAnswered && (
                      <>
                        {isCorrect ? (
                          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-sm font-bold font-mono">
                            <CheckCircle2 className="h-5 w-5" />
                            <span>正確</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-rose-600 dark:text-rose-400 text-xs sm:text-sm font-bold">
                            <XCircle className="h-5 w-5" />
                            <span>正解：{sq.correctAnswer}</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Submit / Next */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-6 flex flex-wrap items-center justify-between gap-4">
          {!isAnswered ? (
            <button
              onClick={handleCheck}
              disabled={!allFilled}
              className={`w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold font-mono text-base flex items-center justify-center gap-2 transition-all min-h-[50px] ${
                allFilled
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:brightness-105 shadow-md cursor-pointer active:scale-[0.98]'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-300 dark:border-slate-700 cursor-not-allowed'
              }`}
            >
              <Zap className="h-5 w-5 fill-white" />
              <span>{allFilled ? '確認整組答案 (SUBMIT)' : '請填滿全部 5 個空格'}</span>
            </button>
          ) : (
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm font-mono text-slate-800 dark:text-slate-200 font-semibold">
                本大題得分：
                <span className="text-emerald-600 dark:text-emerald-400 font-bold text-xl mx-1.5">
                  {Object.values(subResults).filter(Boolean).length}
                </span>
                / {currentSet.subQuestions.length}
              </div>

              <button
                onClick={handleNext}
                className="w-full sm:w-auto px-7 py-3 rounded-xl font-bold font-mono text-base bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:brightness-105 shadow-md flex items-center justify-center gap-2 cursor-pointer min-h-[48px] active:scale-[0.98]"
              >
                <span>{currentIndex + 1 < questions.length ? '下一大題組' : '結算任務'}</span>
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
