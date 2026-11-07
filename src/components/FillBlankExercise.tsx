import React, { useState } from 'react';
import { FillBlankQuestion } from '../data/questionsData';
import { ChapterNumber } from '../types';
import { sound } from '../utils/audio';
import { CheckCircle2, XCircle, ChevronRight, Zap, HelpCircle, ArrowLeft, KeyRound } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FillBlankExerciseProps {
  questions: FillBlankQuestion[];
  chapter: ChapterNumber;
  onFinish: (score: number, total: number, wrongItems: any[]) => void;
  onBack: () => void;
}

export const FillBlankExercise: React.FC<FillBlankExerciseProps> = ({
  questions,
  chapter,
  onFinish,
  onBack,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInputs, setUserInputs] = useState<Record<number, string>>({});
  const [isAnswered, setIsAnswered] = useState(false);
  const [blankResults, setBlankResults] = useState<Record<number, boolean>>({});
  const [isAllCorrect, setIsAllCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [wrongItems, setWrongItems] = useState<any[]>([]);
  const [showHint, setShowHint] = useState(false);

  const currentQ = questions[currentIndex];

  const handleInputChange = (blankIdx: number, val: string) => {
    setUserInputs((prev) => ({
      ...prev,
      [blankIdx]: val,
    }));
  };

  const handleQuickFill = (blankIdx: number, word: string) => {
    sound.playClick();
    setUserInputs((prev) => ({
      ...prev,
      [blankIdx]: word,
    }));
  };

  const handleCheck = () => {
    if (isAnswered) return;

    let allCorrect = true;
    const results: Record<number, boolean> = {};

    currentQ.blanks.forEach((b) => {
      const userVal = (userInputs[b.index] || '').trim();
      const match = b.acceptableAnswers.some((ans) => {
        // Compare trimmed strings, ignore spaces
        const normUser = userVal.replace(/\s+/g, '');
        const normAns = ans.replace(/\s+/g, '');
        return normUser === normAns;
      });

      results[b.index] = match;
      if (!match) allCorrect = false;
    });

    setBlankResults(results);
    setIsAnswered(true);
    setIsAllCorrect(allCorrect);

    if (allCorrect) {
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
          prompt: currentQ.sentence,
          userAnswer: currentQ.blanks
            .map((b) => `[${b.index}] ${userInputs[b.index] || '(空白)'}`)
            .join('，'),
          correctAnswer: currentQ.blanks
            .map((b) => `[${b.index}] ${b.acceptableAnswers.join('/')}`)
            .join('，'),
          chapter,
          category: currentQ.category,
        },
      ]);
    }
  };

  const handleNext = () => {
    sound.playLaser();
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setUserInputs({});
      setIsAnswered(false);
      setBlankResults({});
      setIsAllCorrect(false);
      setShowHint(false);
    } else {
      onFinish(isAllCorrect ? score : score, questions.length, wrongItems);
    }
  };

  // Generate helper suggestion chips (contains correct answers and a couple of distractors)
  const getHelperChips = () => {
    const correctWords = currentQ.blanks.map((b) => b.primaryAnswer);
    const pool = [
      ...correctWords,
      '森林',
      '石油',
      '陸地',
      '海洋',
      '氣候',
      '暴雨',
      '東江',
      '沙漠',
      '極地',
      '空曠',
      '抗震',
    ];
    // deduplicate
    const unique = Array.from(new Set(pool));
    return unique.slice(0, Math.max(6, correctWords.length + 3));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Top Bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border border-sky-200 dark:border-cyan-500/30 bg-white/95 dark:bg-slate-900/80 p-4 rounded-2xl backdrop-blur-md shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playClick();
              onBack();
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:border-sky-400 text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-cyan-400 text-xs font-mono transition-colors cursor-pointer min-h-[40px]"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>返回目錄</span>
          </button>

          <div>
            <div className="text-[11px] font-mono font-semibold text-sky-600 dark:text-cyan-400">
              {chapter === 1 && '// 第1課 小小考察隊'}
              {chapter === 2 && '// 第2課 漫遊香港'}
              {chapter === 3 && '// 第3課 香港的氣候'}
              {chapter === 4 && '// 第4課 發現地球'}
              {chapter === 5 && '// 第5課 地球生病了'}
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>H4a 填充題 (知識與理解)</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-100 dark:bg-cyan-950 border border-sky-300 dark:border-cyan-500/50 text-sky-800 dark:text-cyan-300 font-bold">
                {currentQ.id}
              </span>
            </div>
          </div>
        </div>

        {/* HUD Counters */}
        <div className="flex items-center gap-3 sm:gap-4 font-mono text-xs">
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="text-slate-500 dark:text-slate-400">進度:</span>
            <span className="text-sky-600 dark:text-cyan-400 font-bold text-sm">
              {currentIndex + 1} / {questions.length}
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="text-slate-500 dark:text-slate-400">得分:</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">{score}</span>
          </div>

          {combo > 1 && (
            <div className="flex items-center gap-1 bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-500/60 px-3 py-2 rounded-xl text-amber-800 dark:text-amber-300 font-bold animate-pulse">
              <Zap className="h-4 w-4 fill-amber-500 text-amber-500" />
              <span>COMBO x{combo}</span>
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 dark:bg-slate-900 h-2.5 rounded-full overflow-hidden mb-6 border border-slate-300 dark:border-slate-800 shadow-inner">
        <div
          className="h-full bg-gradient-to-r from-sky-500 via-blue-500 to-emerald-500 transition-all duration-300 shadow-sm"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="border border-sky-200/90 dark:border-cyan-500/30 bg-white dark:bg-slate-900/90 rounded-2xl p-6 sm:p-8 shadow-sm dark:shadow-2xl relative overflow-hidden backdrop-blur-xl exercise-card">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-mono font-bold text-sky-700 dark:text-cyan-400 bg-sky-100/90 dark:bg-cyan-950/60 border border-sky-300 dark:border-cyan-500/40 px-3 py-1 rounded-lg">
            TASK #{currentIndex + 1}
          </span>
          <span className="text-xs px-3 py-1 rounded-lg font-bold border bg-sky-50 dark:bg-cyan-950/70 border-sky-300 dark:border-cyan-500 text-sky-800 dark:text-cyan-300">
            ✍️ 關鍵字注入填充（共 {currentQ.blanks.length} 個空格）
          </span>
        </div>

        {/* Sentence Display */}
        <div className="bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-7 mb-6 text-xl sm:text-2xl font-medium text-slate-800 dark:text-slate-100 leading-loose question-prompt">
          {(() => {
            // Split sentence by [BLANK_X]
            const parts = currentQ.sentence.split(/(\[BLANK_\d+\])/g);
            return parts.map((part, i) => {
              const match = part.match(/\[BLANK_(\d+)\]/);
              if (match) {
                const bIdx = parseInt(match[1]);
                const isBlankCorrect = blankResults[bIdx];

                return (
                  <span
                    key={i}
                    className={`inline-flex items-center mx-1.5 px-3.5 py-1.5 rounded-xl border font-mono font-bold text-base sm:text-lg transition-all ${
                      isAnswered
                        ? isBlankCorrect
                          ? 'border-emerald-500 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                          : 'border-rose-500 bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300'
                        : userInputs[bIdx]
                        ? 'border-sky-400 bg-sky-100 dark:bg-cyan-950/50 text-sky-900 dark:text-cyan-200'
                        : 'border-sky-300 dark:border-cyan-500/50 bg-sky-50/70 dark:bg-slate-900 text-sky-700 dark:text-cyan-400 underline decoration-dotted'
                    }`}
                  >
                    {userInputs[bIdx] || `【 空格 ${bIdx} 】`}
                  </span>
                );
              }
              return <span key={i}>{part}</span>;
            });
          })()}
        </div>

        {/* Input Fields for Each Blank */}
        <div className="space-y-4 mb-6">
          <div className="text-xs sm:text-sm font-mono font-semibold text-slate-600 dark:text-slate-400 flex items-center justify-between">
            <span>請輸入填入的詞語：</span>
            <button
              onClick={() => setShowHint(!showHint)}
              className="text-sky-600 dark:text-cyan-400 hover:text-sky-700 dark:hover:text-cyan-300 flex items-center gap-1.5 text-xs font-semibold cursor-pointer p-1"
            >
              <KeyRound className="h-4 w-4" />
              <span>{showHint ? '隱藏快捷詞庫' : '開啟快捷詞庫輔助'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentQ.blanks.map((b) => {
              const bResult = blankResults[b.index];
              return (
                <div
                  key={b.index}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all option-btn ${
                    isAnswered
                      ? bResult
                        ? 'border-emerald-400 bg-emerald-50/80 dark:bg-emerald-950/30'
                        : 'border-rose-400 bg-rose-50/80 dark:bg-rose-950/30'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 hover:border-sky-400'
                  }`}
                >
                  <label className="text-xs sm:text-sm font-mono text-sky-700 dark:text-cyan-300 block mb-2 font-bold flex items-center justify-between">
                    <span>空格 {b.index}：</span>
                    {isAnswered && (
                      <span className="text-xs font-sans">
                        {bResult ? (
                          <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold">
                            <CheckCircle2 className="h-4 w-4 inline" /> 正確
                          </span>
                        ) : (
                          <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1 font-bold">
                            <XCircle className="h-4 w-4 inline" /> 正解：
                            {b.acceptableAnswers.join(' / ')}
                          </span>
                        )}
                      </span>
                    )}
                  </label>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      disabled={isAnswered}
                      value={userInputs[b.index] || ''}
                      onChange={(e) => handleInputChange(b.index, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleCheck();
                      }}
                      placeholder={`請輸入空格 ${b.index} 答案...`}
                      className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-950 border text-slate-900 dark:text-white text-base font-medium focus:outline-none transition-all min-h-[48px] ${
                        isAnswered
                          ? bResult
                            ? 'border-emerald-500 text-emerald-800 dark:text-emerald-300'
                            : 'border-rose-500 text-rose-800 dark:text-rose-300'
                          : 'border-slate-300 dark:border-slate-700 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:focus:ring-cyan-900'
                      }`}
                    />
                  </div>

                  {/* Quick-fill helper chips if opened */}
                  {showHint && !isAnswered && (
                    <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap gap-2">
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-mono w-full">點選填入：</span>
                      {getHelperChips().map((chip, cIdx) => (
                        <button
                          key={cIdx}
                          type="button"
                          onClick={() => handleQuickFill(b.index, chip)}
                          className="px-3 py-1.5 rounded-xl border border-sky-300 dark:border-cyan-500/30 bg-sky-50 dark:bg-cyan-950/40 hover:bg-sky-100 dark:hover:bg-cyan-900/60 text-sky-800 dark:text-cyan-300 text-xs sm:text-sm font-semibold transition-colors cursor-pointer min-h-[36px] active:scale-95"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Submit / Next */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-6 flex flex-wrap items-center justify-between gap-4">
          {!isAnswered ? (
            <button
              onClick={handleCheck}
              disabled={Object.keys(userInputs).length === 0}
              className={`w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold font-mono text-base flex items-center justify-center gap-2 transition-all min-h-[50px] ${
                Object.keys(userInputs).length > 0
                  ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:brightness-105 shadow-md cursor-pointer active:scale-[0.98]'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-300 dark:border-slate-700 cursor-not-allowed'
              }`}
            >
              <Zap className="h-5 w-5 fill-white" />
              <span>注入代碼驗證 (CHECK)</span>
            </button>
          ) : (
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {isAllCorrect ? (
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-base">
                    <CheckCircle2 className="h-6 w-6" />
                    <span>全部空格正確！獲得 +120 EXP</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-sm sm:text-base">
                    <XCircle className="h-6 w-6 flex-shrink-0" />
                    <span>
                      部分空格需加強！正解：
                      {currentQ.blanks.map((b) => b.acceptableAnswers.join('/')).join('，')}
                    </span>
                  </div>
                )}
              </div>

              <button
                onClick={handleNext}
                className="w-full sm:w-auto px-7 py-3 rounded-xl font-bold font-mono text-base bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:brightness-105 shadow-md flex items-center justify-center gap-2 cursor-pointer min-h-[48px] active:scale-[0.98]"
              >
                <span>{currentIndex + 1 < questions.length ? '下一任務' : '結算任務'}</span>
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
