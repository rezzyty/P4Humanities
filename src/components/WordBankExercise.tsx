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
              <span>H4a_u2_03 供詞填充題 (知識與理解)</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/50 text-cyan-300">
                {currentSet.id}
              </span>
            </div>
          </div>
        </div>

        {/* HUD Counters */}
        <div className="flex items-center gap-4 font-mono text-xs">
          <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
            <span className="text-slate-400">大題組:</span>
            <span className="text-cyan-400 font-bold">
              {currentIndex + 1} / {questions.length}
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
            <span className="text-slate-400">累計得分:</span>
            <span className="text-emerald-400 font-bold">{totalSubScore}</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden mb-6 border border-slate-800">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-emerald-400 transition-all duration-300 shadow-[0_0_10px_rgba(6,182,212,0.8)]"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Main Container */}
      <div className="border border-cyan-500/30 bg-slate-900/90 rounded-2xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400"></div>

        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-500/40 px-2.5 py-1 rounded-md">
            MISSION SET #{currentIndex + 1}
          </span>
          <span className="text-xs px-2.5 py-1 rounded-md font-medium border bg-purple-950/70 border-purple-500 text-purple-300">
            🧩 供詞庫填充（請選取下方詞語填入空格）
          </span>
        </div>

        {/* Word Bank Floating Panel */}
        <div className="mb-6 p-4 rounded-xl border border-cyan-500/40 bg-slate-950/80 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-mono text-cyan-300 flex items-center gap-1.5 font-bold">
              <Zap className="h-4 w-4 text-cyan-400" />
              <span>【 可供選用之詞庫 】</span>
            </span>
            {!isAnswered && (
              <button
                onClick={handleResetCurrentSet}
                className="text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-1 transition-colors"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>重設所有空格</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {currentSet.wordBank.map((word, wIdx) => {
              const isUsed = usedWords.includes(word);

              return (
                <button
                  key={wIdx}
                  disabled={isAnswered}
                  onClick={() => handlePickWord(word)}
                  className={`px-3 py-2.5 rounded-lg border font-medium text-sm transition-all duration-200 cursor-pointer disabled:cursor-default flex items-center justify-center gap-1 ${
                    isUsed
                      ? 'border-slate-800 bg-slate-900/60 text-slate-500 opacity-60 line-through'
                      : 'border-cyan-400/60 bg-cyan-950/50 hover:bg-cyan-900/70 text-cyan-100 hover:border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.2)] hover:scale-[1.02]'
                  }`}
                >
                  <span>{word}</span>
                </button>
              );
            })}
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-mono">
            💡 提示：點擊句子中的【空格】以鎖定位置，再點選上方詞語填入！
          </p>
        </div>

        {/* 5 Sub-Questions Sentences */}
        <div className="space-y-3.5 mb-6">
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
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isAnswered
                    ? isCorrect
                      ? 'border-emerald-500/70 bg-emerald-950/20'
                      : 'border-rose-500/70 bg-rose-950/20'
                    : isActive
                    ? 'border-cyan-400 bg-cyan-950/40 ring-1 ring-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                    : 'border-slate-800 bg-slate-800/40 hover:border-slate-700'
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
                              className={`inline-flex items-center mx-1.5 px-3 py-1 rounded-lg border font-bold text-sm sm:text-base font-sans transition-all ${
                                isAnswered
                                  ? isCorrect
                                    ? 'border-emerald-500 bg-emerald-950 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                                    : 'border-rose-500 bg-rose-950 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.3)]'
                                  : userChoice
                                  ? 'border-cyan-400 bg-cyan-950 text-cyan-200 hover:border-rose-400 hover:text-rose-300'
                                  : isActive
                                  ? 'border-cyan-400 bg-cyan-950/70 text-cyan-400 animate-pulse'
                                  : 'border-dashed border-slate-600 bg-slate-900 text-slate-500'
                              }`}
                              title={userChoice && !isAnswered ? '點擊清除此格' : '點擊選取此格'}
                            >
                              {userChoice || '【 點選此格填入 】'}
                              {userChoice && !isAnswered && (
                                <span className="ml-1 text-xs text-rose-400">×</span>
                              )}
                            </span>
                          );
                        }
                        return <span key={pIdx}>{part}</span>;
                      });
                    })()}
                  </div>

                  {/* Sub Question Status */}
                  <div className="flex-shrink-0 flex items-center gap-2">
                    {isAnswered && (
                      <>
                        {isCorrect ? (
                          <div className="flex items-center gap-1 text-emerald-400 text-sm font-bold font-mono">
                            <CheckCircle2 className="h-5 w-5" />
                            <span>正確</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-rose-400 text-xs sm:text-sm font-bold">
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
        <div className="border-t border-slate-800 pt-5 flex flex-wrap items-center justify-between gap-4">
          {!isAnswered ? (
            <button
              onClick={handleCheck}
              disabled={!allFilled}
              className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold font-mono text-sm flex items-center justify-center gap-2 transition-all ${
                allFilled
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 hover:brightness-110 shadow-[0_0_20px_rgba(6,182,212,0.4)] cursor-pointer'
                  : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
              }`}
            >
              <Zap className="h-4 w-4" />
              <span>{allFilled ? '確認整組答案 (SUBMIT)' : '請填滿全部 5 個空格'}</span>
            </button>
          ) : (
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm font-mono text-slate-200">
                本大題得分：
                <span className="text-emerald-400 font-bold text-lg mx-1">
                  {Object.values(subResults).filter(Boolean).length}
                </span>
                / {currentSet.subQuestions.length}
              </div>

              <button
                onClick={handleNext}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold font-mono text-sm bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:brightness-110 shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{currentIndex + 1 < questions.length ? '下一大題組' : '結算任務'}</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
