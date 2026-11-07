import React, { useState } from 'react';
import { MatchingQuestion } from '../data/matchingOrderingData';
import { ChapterNumber } from '../types';
import { sound } from '../utils/audio';
import { CheckCircle2, XCircle, ChevronRight, Zap, HelpCircle, ArrowLeft, RefreshCw, Link2, Unlink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MatchingExerciseProps {
  questions: MatchingQuestion[];
  chapter: ChapterNumber;
  onFinish: (score: number, total: number, wrongItems: any[]) => void;
  onBack: () => void;
}

export const MatchingExercise: React.FC<MatchingExerciseProps> = ({
  questions,
  chapter,
  onFinish,
  onBack,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  // links: map from leftItemId -> array of rightTargetIds
  const [links, setLinks] = useState<Record<string, string[]>>({});
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [itemResults, setItemResults] = useState<Record<string, boolean>>({});
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [wrongItems, setWrongItems] = useState<any[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);

  const currentQ = questions[currentIndex];

  const handleLeftClick = (leftId: string) => {
    if (isAnswered) return;
    sound.playClick();
    setSelectedLeft(selectedLeft === leftId ? null : leftId);
  };

  const handleRightClick = (targetId: string) => {
    if (isAnswered) return;
    if (!selectedLeft) {
      sound.playClick();
      // If none selected, focus the first left item that has no link yet
      const unlinked = currentQ.leftItems.find((item) => !links[item.id] || links[item.id].length === 0);
      if (unlinked) {
        setSelectedLeft(unlinked.id);
      }
      return;
    }

    sound.playLaser();
    setLinks((prev) => {
      const existing = prev[selectedLeft] || [];
      if (currentQ.allowMultiTarget) {
        // Toggle target
        const next = existing.includes(targetId)
          ? existing.filter((t) => t !== targetId)
          : [...existing, targetId];
        return { ...prev, [selectedLeft]: next };
      } else {
        // Single target: set or toggle
        if (existing.includes(targetId)) {
          const next = { ...prev };
          delete next[selectedLeft];
          return next;
        }
        return { ...prev, [selectedLeft]: [targetId] };
      }
    });

    // If single target, auto advance selectedLeft to next empty item
    if (!currentQ.allowMultiTarget) {
      const remaining = currentQ.leftItems.find(
        (item) => item.id !== selectedLeft && (!links[item.id] || links[item.id].length === 0)
      );
      setSelectedLeft(remaining ? remaining.id : null);
    }
  };

  const handleClearItemLinks = (leftId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAnswered) return;
    sound.playClick();
    setLinks((prev) => {
      const next = { ...prev };
      delete next[leftId];
      return next;
    });
  };

  const handleReset = () => {
    if (isAnswered) return;
    sound.playClick();
    setLinks({});
    setSelectedLeft(currentQ.leftItems[0]?.id || null);
  };

  const handleCheck = () => {
    if (isAnswered) return;

    let allCorrect = true;
    const results: Record<string, boolean> = {};

    currentQ.leftItems.forEach((item) => {
      const userTargets = (links[item.id] || []).sort();
      const correctTargets = (currentQ.correctPairs[item.id] || []).sort();

      const isMatch =
        userTargets.length === correctTargets.length &&
        userTargets.every((t, idx) => t === correctTargets[idx]);

      results[item.id] = isMatch;
      if (!isMatch) allCorrect = false;
    });

    setItemResults(results);
    setIsAnswered(true);

    if (allCorrect) {
      sound.playCorrect();
      setScore((s) => s + 1);
      const newCombo = combo + 1;
      setCombo(newCombo);
      if (newCombo >= 3) sound.playCombo();
    } else {
      sound.playWrong();
      setCombo(0);

      // format user vs correct answers
      const userSummary = currentQ.leftItems
        .map((item) => `${item.label} ➜ [${(links[item.id] || []).join(', ') || '無連線'}]`)
        .join('； ');
      const correctSummary = currentQ.leftItems
        .map((item) => `${item.label} ➜ [${(currentQ.correctPairs[item.id] || []).join(', ')}]`)
        .join('； ');

      setWrongItems((w) => [
        ...w,
        {
          id: currentQ.id,
          prompt: currentQ.prompt,
          userAnswer: userSummary,
          correctAnswer: correctSummary,
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
      setLinks({});
      setSelectedLeft(null);
      setIsAnswered(false);
      setItemResults({});
      setShowExplanation(false);
    } else {
      onFinish(score, questions.length, wrongItems);
    }
  };

  const hasAnyLink = Object.values(links).some((arr) => arr.length > 0);
  const isAllLinked = currentQ.leftItems.every((item) => (links[item.id] || []).length > 0);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 md:py-8">
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
              <span>{chapter <= 3 ? 'H4a_u1_07' : 'H4a_u2_07'} 配對題 (知識與理解)</span>
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
          className="h-full bg-gradient-to-r from-purple-500 via-sky-500 to-emerald-500 transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Main Matching Card */}
      <div className="exercise-card border border-slate-200 bg-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-[0_4px_30px_rgba(0,0,0,0.05)] relative overflow-hidden dark:border-purple-500/30 dark:bg-slate-900/90 dark:shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
          <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 border border-purple-300 px-3 py-1 rounded-lg dark:text-purple-400 dark:bg-purple-950/60 dark:border-purple-500/40">
            配對大組 #{currentIndex + 1}
          </span>
          <span className="text-xs px-3 py-1 rounded-lg font-semibold border bg-sky-50 border-sky-300 text-sky-700 dark:bg-cyan-950/70 dark:border-cyan-500 dark:text-cyan-300">
            {currentQ.allowMultiTarget ? '⚡ 複選配對（同一項目可連線多個特徵）' : '🔗 單項配對（一對一連線）'}
          </span>
        </div>

        {/* Prompt */}
        <h2 className="question-prompt text-xl sm:text-2xl font-bold text-slate-900 mb-2 leading-relaxed dark:text-white">
          {currentQ.prompt}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-mono mb-6 dark:text-slate-400">
          💡 操作方式：先點選左側項目，再點選右側符合特徵建立配對鏈結！
        </p>

        {/* Interactive Matrix Workspace */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 interactive-grid">
          {/* Left Items Column */}
          <div className="space-y-3.5">
            <div className="text-xs font-mono font-bold text-sky-700 flex items-center justify-between px-1 dark:text-cyan-400">
              <span>【待配對項目】</span>
              {!isAnswered && hasAnyLink && (
                <button
                  onClick={handleReset}
                  className="text-xs text-slate-500 hover:text-rose-600 flex items-center gap-1 transition-colors cursor-pointer dark:hover:text-rose-400"
                >
                  <RefreshCw className="h-3 w-3" />
                  <span>全部重設</span>
                </button>
              )}
            </div>

            {currentQ.leftItems.map((item) => {
              const isSelected = selectedLeft === item.id;
              const connectedTargets = links[item.id] || [];
              const isCorrect = itemResults[item.id];

              let borderClass = 'border-slate-200 bg-slate-50 hover:border-sky-300 hover:bg-sky-50/60 text-slate-800 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-200';
              if (!isAnswered && isSelected) {
                borderClass = 'border-sky-500 bg-sky-50 ring-2 ring-sky-400 shadow-md text-sky-950 font-semibold dark:border-cyan-400 dark:bg-cyan-950/70 dark:text-cyan-200';
              } else if (isAnswered) {
                borderClass = isCorrect
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-400 shadow-md dark:border-emerald-500 dark:bg-emerald-950/50 dark:text-emerald-200'
                  : 'border-rose-400 bg-rose-50 text-rose-950 ring-2 ring-rose-400 shadow-md dark:border-rose-500 dark:bg-rose-950/50 dark:text-rose-200';
              }

              return (
                <div
                  key={item.id}
                  onClick={() => handleLeftClick(item.id)}
                  className={`option-btn p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${borderClass} flex items-center justify-between gap-4 active:scale-[0.99]`}
                >
                  <div className="flex items-center gap-3.5">
                    <span
                      className={`h-8 w-8 rounded-xl flex items-center justify-center font-mono font-bold text-sm ${
                        isSelected ? 'bg-sky-600 text-white' : 'bg-white text-slate-700 border border-slate-300 dark:bg-slate-800 dark:text-cyan-300 dark:border-slate-700'
                      }`}
                    >
                      {item.id}
                    </span>
                    <span className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">{item.label}</span>
                  </div>

                  {/* Connected Target Badges */}
                  <div className="flex items-center gap-1.5 flex-wrap justify-end">
                    {connectedTargets.length > 0 ? (
                      connectedTargets.map((tId) => (
                        <span
                          key={tId}
                          className={`px-2.5 py-1 rounded-lg font-mono font-bold text-xs border ${
                            isAnswered
                              ? (currentQ.correctPairs[item.id] || []).includes(tId)
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-400'
                                : 'bg-rose-100 text-rose-800 border-rose-400'
                              : 'bg-sky-100 text-sky-800 border-sky-300 dark:bg-cyan-950 dark:text-cyan-300 dark:border-cyan-400'
                          }`}
                        >
                          ➔ {tId}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 font-mono">未連線</span>
                    )}

                    {!isAnswered && connectedTargets.length > 0 && (
                      <button
                        onClick={(e) => handleClearItemLinks(item.id, e)}
                        className="text-slate-400 hover:text-rose-500 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
                        title="解除連線"
                      >
                        <Unlink className="h-4 w-4" />
                      </button>
                    )}

                    {isAnswered && (
                      <span className="ml-1">
                        {isCorrect ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 inline" />
                        ) : (
                          <XCircle className="h-5 w-5 text-rose-500 dark:text-rose-400 inline" />
                        )}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Targets Column */}
          <div className="space-y-3.5">
            <div className="text-xs font-mono font-bold text-purple-700 px-1 dark:text-purple-400">
              <span>【特徵與描述選項】</span>
            </div>

            {currentQ.rightTargets.map((target) => {
              const connectedFrom = Object.entries(links)
                .filter(([_, arr]) => arr.includes(target.id))
                .map(([lId]) => lId);

              const isConnectedToSelected = selectedLeft ? (links[selectedLeft] || []).includes(target.id) : false;

              return (
                <div
                  key={target.id}
                  onClick={() => handleRightClick(target.id)}
                  className={`option-btn p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer active:scale-[0.99] ${
                    isConnectedToSelected
                      ? 'border-sky-500 bg-sky-50 ring-2 ring-sky-400 shadow-md dark:border-cyan-400 dark:bg-cyan-950/60 dark:ring-cyan-400'
                      : connectedFrom.length > 0
                      ? 'border-purple-300 bg-purple-50/70 dark:border-purple-500/60 dark:bg-purple-950/30'
                      : 'border-slate-200 bg-slate-50 hover:border-purple-300 hover:bg-purple-50/40 dark:border-slate-800 dark:bg-slate-800/40'
                  } flex items-start gap-3.5`}
                >
                  <span
                    className={`h-8 w-8 rounded-xl flex-shrink-0 flex items-center justify-center font-mono font-bold text-sm ${
                      isConnectedToSelected
                        ? 'bg-sky-600 text-white font-bold'
                        : connectedFrom.length > 0
                        ? 'bg-purple-600 text-white border border-purple-400'
                        : 'bg-white text-purple-700 border border-slate-300 dark:bg-slate-800 dark:text-purple-300 dark:border-slate-700'
                    }`}
                  >
                    {target.id}
                  </span>

                  <div className="flex-1">
                    <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-medium dark:text-slate-200">{target.text}</p>
                    {connectedFrom.length > 0 && (
                      <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs text-slate-500 font-mono">已連線項目：</span>
                        {connectedFrom.map((lId) => (
                          <span
                            key={lId}
                            className="text-xs font-mono px-2 py-0.5 rounded-lg bg-sky-100 border border-sky-300 text-sky-800 font-bold dark:bg-slate-950 dark:border-slate-700 dark:text-cyan-300"
                          >
                            項目 {lId}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-slate-200 pt-5 flex flex-wrap items-center justify-between gap-4 dark:border-slate-800">
          {!isAnswered ? (
            <button
              onClick={handleCheck}
              disabled={!isAllLinked}
              className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold font-mono text-sm sm:text-base flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                isAllLinked
                  ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg cursor-pointer dark:bg-gradient-to-r dark:from-purple-500 dark:to-cyan-500 dark:text-slate-950'
                  : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed dark:bg-slate-800 dark:text-slate-500 dark:border-slate-700'
              }`}
            >
              <Zap className="h-4 w-4" />
              <span>{isAllLinked ? '確認配對鏈結 (CHECK)' : '請將所有左側項目配對完畢'}</span>
            </button>
          ) : (
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {Object.values(itemResults).every(Boolean) ? (
                  <div className="flex items-center gap-2 text-emerald-600 font-bold text-base sm:text-lg dark:text-emerald-400">
                    <CheckCircle2 className="h-6 w-6" />
                    <span>完美配對！獲得 +150 EXP</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-rose-600 font-bold text-base sm:text-lg dark:text-rose-400">
                    <XCircle className="h-6 w-6" />
                    <span>部分項目配對有誤，請查看下方正確解析</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {currentQ.explanation && (
                  <button
                    onClick={() => setShowExplanation(!showExplanation)}
                    className="flex items-center gap-1 px-4 py-2.5 rounded-xl border border-purple-300 bg-purple-50 text-purple-700 text-xs sm:text-sm font-semibold hover:bg-purple-100 transition-colors cursor-pointer dark:border-purple-500/40 dark:bg-purple-950/30 dark:text-purple-300"
                  >
                    <HelpCircle className="h-4 w-4" />
                    <span>{showExplanation ? '收起解析' : '作戰解析'}</span>
                  </button>
                )}

                <button
                  onClick={handleNext}
                  className="flex-1 sm:flex-none px-8 py-3 rounded-xl font-bold font-mono text-sm sm:text-base bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] dark:bg-emerald-500 dark:text-slate-950"
                >
                  <span>{currentIndex + 1 < questions.length ? '下一配對題 (NEXT)' : '結算任務 (REPORT)'}</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Explanation Accordion */}
        <AnimatePresence>
          {isAnswered && (showExplanation || !Object.values(itemResults).every(Boolean)) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 p-4 sm:p-5 rounded-2xl border border-purple-200 bg-purple-50 text-slate-800 text-xs sm:text-sm leading-relaxed dark:border-purple-500/30 dark:bg-purple-950/20 dark:text-slate-200"
            >
              <div className="font-bold text-purple-700 mb-2 flex items-center gap-1.5 font-mono dark:text-purple-400">
                <HelpCircle className="h-4 w-4" />
                <span>標準配對答案解析：</span>
              </div>
              <p className="mb-2 text-slate-800 font-semibold dark:text-slate-200">
                {currentQ.leftItems
                  .map((item) => `【${item.label} ➜ ${(currentQ.correctPairs[item.id] || []).join('、')}】`)
                  .join('　')}
              </p>
              {currentQ.explanation && <p className="text-slate-600 dark:text-slate-400">{currentQ.explanation}</p>}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
