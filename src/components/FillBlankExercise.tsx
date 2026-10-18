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
              <span>H4a_u2_02 填充題 (知識與理解)</span>
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
            TASK #{currentIndex + 1}
          </span>
          <span className="text-xs px-2.5 py-1 rounded-md font-medium border bg-cyan-950/70 border-cyan-500 text-cyan-300">
            ✍️ 關鍵字注入填充（共 {currentQ.blanks.length} 個空格）
          </span>
        </div>

        {/* Sentence Display */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 mb-6 text-lg sm:text-xl font-medium text-slate-100 leading-loose">
          {(() => {
            // Split sentence by [BLANK_X]
            const parts = currentQ.sentence.split(/(\[BLANK_\d+\])/g);
            return parts.map((part, i) => {
              const match = part.match(/\[BLANK_(\d+)\]/);
              if (match) {
                const bIdx = parseInt(match[1]);
                const blank = currentQ.blanks.find((b) => b.index === bIdx);
                const isBlankCorrect = blankResults[bIdx];

                return (
                  <span
                    key={i}
                    className={`inline-flex items-center mx-1.5 px-3 py-1 rounded-lg border font-mono font-bold text-base transition-all ${
                      isAnswered
                        ? isBlankCorrect
                          ? 'border-emerald-500 bg-emerald-950/80 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                          : 'border-rose-500 bg-rose-950/80 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.3)]'
                        : userInputs[bIdx]
                        ? 'border-cyan-400 bg-cyan-950/50 text-cyan-200'
                        : 'border-cyan-500/50 bg-slate-900 text-cyan-400 underline decoration-dotted'
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
          <div className="text-xs font-mono text-slate-400 flex items-center justify-between">
            <span>請輸入填入的詞語：</span>
            <button
              onClick={() => setShowHint(!showHint)}
              className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 text-[11px]"
            >
              <KeyRound className="h-3.5 w-3.5" />
              <span>{showHint ? '隱藏快捷詞庫' : '開啟快捷詞庫輔助'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentQ.blanks.map((b) => {
              const bResult = blankResults[b.index];
              return (
                <div
                  key={b.index}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isAnswered
                      ? bResult
                        ? 'border-emerald-500/70 bg-emerald-950/30'
                        : 'border-rose-500/70 bg-rose-950/30'
                      : 'border-slate-800 bg-slate-800/40 hover:border-cyan-500/50'
                  }`}
                >
                  <label className="text-xs font-mono text-cyan-300 block mb-1.5 flex items-center justify-between">
                    <span>空格 {b.index}：</span>
                    {isAnswered && (
                      <span className="text-[11px] font-sans">
                        {bResult ? (
                          <span className="text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="h-3.5 w-3.5 inline" /> 正確
                          </span>
                        ) : (
                          <span className="text-rose-400 flex items-center gap-1">
                            <XCircle className="h-3.5 w-3.5 inline" /> 正解：
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
                      className={`w-full px-3 py-2 rounded-lg bg-slate-950 border text-white text-sm font-medium focus:outline-none transition-all ${
                        isAnswered
                          ? bResult
                            ? 'border-emerald-500 text-emerald-300'
                            : 'border-rose-500 text-rose-300'
                          : 'border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400'
                      }`}
                    />
                  </div>

                  {/* Quick-fill helper chips if opened */}
                  {showHint && !isAnswered && (
                    <div className="mt-2.5 pt-2 border-t border-slate-800 flex flex-wrap gap-1.5">
                      <span className="text-[10px] text-slate-500 font-mono w-full">點選填入：</span>
                      {getHelperChips().map((chip, cIdx) => (
                        <button
                          key={cIdx}
                          type="button"
                          onClick={() => handleQuickFill(b.index, chip)}
                          className="px-2 py-0.5 rounded border border-cyan-500/30 bg-cyan-950/40 hover:bg-cyan-900/60 text-cyan-300 text-xs font-sans transition-colors cursor-pointer"
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
        <div className="border-t border-slate-800 pt-5 flex flex-wrap items-center justify-between gap-4">
          {!isAnswered ? (
            <button
              onClick={handleCheck}
              disabled={Object.keys(userInputs).length === 0}
              className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold font-mono text-sm flex items-center justify-center gap-2 transition-all ${
                Object.keys(userInputs).length > 0
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 hover:brightness-110 shadow-[0_0_20px_rgba(6,182,212,0.4)] cursor-pointer'
                  : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
              }`}
            >
              <Zap className="h-4 w-4" />
              <span>注入代碼驗證 (CHECK)</span>
            </button>
          ) : (
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {isAllCorrect ? (
                  <div className="flex items-center gap-2 text-emerald-400 font-bold">
                    <CheckCircle2 className="h-6 w-6" />
                    <span>全部空格正確！獲得 +120 EXP</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-rose-400 font-bold">
                    <XCircle className="h-6 w-6" />
                    <span>
                      部分空格需加強！正解：
                      {currentQ.blanks.map((b) => b.acceptableAnswers.join('/')).join('，')}
                    </span>
                  </div>
                )}
              </div>

              <button
                onClick={handleNext}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold font-mono text-sm bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:brightness-110 shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{currentIndex + 1 < questions.length ? '下一任務' : '結算任務'}</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
