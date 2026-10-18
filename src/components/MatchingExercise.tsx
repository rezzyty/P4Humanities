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
              <span>H4a_u2_07 配對題 (知識與理解)</span>
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
          className="h-full bg-gradient-to-r from-purple-500 via-cyan-400 to-emerald-400 transition-all duration-300 shadow-[0_0_10px_rgba(168,85,247,0.8)]"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Main Matching Card */}
      <div className="border border-purple-500/30 bg-slate-900/90 rounded-2xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-purple-400"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-purple-400"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-purple-400"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-purple-400"></div>

        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <span className="text-xs font-mono text-purple-400 bg-purple-950/60 border border-purple-500/40 px-2.5 py-1 rounded-md">
            MATCHING MATRIX #{currentIndex + 1}
          </span>
          <span className="text-xs px-2.5 py-1 rounded-md font-medium border bg-cyan-950/70 border-cyan-500 text-cyan-300">
            {currentQ.allowMultiTarget ? '⚡ 複選配對（同一項目可連線多個特徵）' : '🔗 單項配對（一對一連線）'}
          </span>
        </div>

        {/* Prompt */}
        <h2 className="text-lg sm:text-xl font-bold text-white mb-2 leading-relaxed">
          {currentQ.prompt}
        </h2>
        <p className="text-xs text-slate-400 font-mono mb-6">
          💡 操作指令：先點選左側項目，再點選右側符合特徵建立量子鏈結！
        </p>

        {/* Interactive Matrix Workspace */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Left Items Column */}
          <div className="space-y-3">
            <div className="text-xs font-mono text-cyan-400 flex items-center justify-between px-1">
              <span>【待配對項目】</span>
              {!isAnswered && hasAnyLink && (
                <button
                  onClick={handleReset}
                  className="text-[11px] text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
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

              let borderClass = 'border-slate-800 bg-slate-800/40 hover:border-cyan-500/60';
              if (!isAnswered && isSelected) {
                borderClass = 'border-cyan-400 bg-cyan-950/70 ring-2 ring-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]';
              } else if (isAnswered) {
                borderClass = isCorrect
                  ? 'border-emerald-500 bg-emerald-950/50 text-emerald-200'
                  : 'border-rose-500 bg-rose-950/50 text-rose-200';
              }

              return (
                <div
                  key={item.id}
                  onClick={() => handleLeftClick(item.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${borderClass} flex items-center justify-between gap-3`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`h-7 w-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs ${
                        isSelected ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-cyan-300 border border-slate-700'
                      }`}
                    >
                      {item.id}
                    </span>
                    <span className="font-bold text-sm sm:text-base text-white">{item.label}</span>
                  </div>

                  {/* Connected Target Badges */}
                  <div className="flex items-center gap-1.5 flex-wrap justify-end">
                    {connectedTargets.length > 0 ? (
                      connectedTargets.map((tId) => (
                        <span
                          key={tId}
                          className={`px-2 py-0.5 rounded font-mono font-bold text-xs border ${
                            isAnswered
                              ? (currentQ.correctPairs[item.id] || []).includes(tId)
                                ? 'bg-emerald-950 text-emerald-300 border-emerald-400'
                                : 'bg-rose-950 text-rose-300 border-rose-400'
                              : 'bg-cyan-950 text-cyan-300 border-cyan-400'
                          }`}
                        >
                          ➔ {tId}
                        </span>
                      ))
                    ) : (
                      <span className="text-[11px] text-slate-500 font-mono">未連線</span>
                    )}

                    {!isAnswered && connectedTargets.length > 0 && (
                      <button
                        onClick={(e) => handleClearItemLinks(item.id, e)}
                        className="text-slate-500 hover:text-rose-400 p-1 text-xs"
                        title="解除連線"
                      >
                        <Unlink className="h-3.5 w-3.5" />
                      </button>
                    )}

                    {isAnswered && (
                      <span className="ml-1">
                        {isCorrect ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400 inline" />
                        ) : (
                          <XCircle className="h-4 w-4 text-rose-400 inline" />
                        )}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Targets Column */}
          <div className="space-y-3">
            <div className="text-xs font-mono text-purple-400 px-1">
              <span>【特徵與描述選項】</span>
            </div>

            {currentQ.rightTargets.map((target) => {
              // check which left items are connected to this target
              const connectedFrom = Object.entries(links)
                .filter(([_, arr]) => arr.includes(target.id))
                .map(([lId]) => lId);

              const isConnectedToSelected = selectedLeft ? (links[selectedLeft] || []).includes(target.id) : false;

              return (
                <div
                  key={target.id}
                  onClick={() => handleRightClick(target.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isConnectedToSelected
                      ? 'border-cyan-400 bg-cyan-950/60 ring-1 ring-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                      : connectedFrom.length > 0
                      ? 'border-purple-500/60 bg-purple-950/30'
                      : 'border-slate-800 bg-slate-800/40 hover:border-purple-500/50'
                  } flex items-start gap-3`}
                >
                  <span
                    className={`h-7 w-7 rounded-lg flex-shrink-0 flex items-center justify-center font-mono font-bold text-xs ${
                      isConnectedToSelected
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : connectedFrom.length > 0
                        ? 'bg-purple-900 text-purple-200 border border-purple-400'
                        : 'bg-slate-800 text-purple-300 border border-slate-700'
                    }`}
                  >
                    {target.id}
                  </span>

                  <div className="flex-1">
                    <p className="text-xs sm:text-sm text-slate-200 leading-snug">{target.text}</p>
                    {connectedFrom.length > 0 && (
                      <div className="mt-1 flex items-center gap-1">
                        <span className="text-[10px] text-slate-400 font-mono">已連線項目：</span>
                        {connectedFrom.map((lId) => (
                          <span
                            key={lId}
                            className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-950 border border-slate-700 text-cyan-300"
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
        <div className="border-t border-slate-800 pt-5 flex flex-wrap items-center justify-between gap-4">
          {!isAnswered ? (
            <button
              onClick={handleCheck}
              disabled={!isAllLinked}
              className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold font-mono text-sm flex items-center justify-center gap-2 transition-all ${
                isAllLinked
                  ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-slate-950 hover:brightness-110 shadow-[0_0_20px_rgba(168,85,247,0.4)] cursor-pointer'
                  : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
              }`}
            >
              <Zap className="h-4 w-4" />
              <span>{isAllLinked ? '量子連線驗證 (CHECK)' : '請將所有左側項目配對完畢'}</span>
            </button>
          ) : (
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {Object.values(itemResults).every(Boolean) ? (
                  <div className="flex items-center gap-2 text-emerald-400 font-bold">
                    <CheckCircle2 className="h-6 w-6" />
                    <span>完美配對！獲得 +150 EXP</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                    <XCircle className="h-6 w-6" />
                    <span>部分項目配對有誤，請查看正確解析</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {currentQ.explanation && (
                  <button
                    onClick={() => setShowExplanation(!showExplanation)}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg border border-purple-500/40 bg-purple-950/30 text-purple-300 text-xs font-mono hover:bg-purple-900/40 transition-colors"
                  >
                    <HelpCircle className="h-4 w-4" />
                    <span>{showExplanation ? '收起解析' : '作戰解析'}</span>
                  </button>
                )}

                <button
                  onClick={handleNext}
                  className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl font-bold font-mono text-sm bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:brightness-110 shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{currentIndex + 1 < questions.length ? '下一配對題' : '結算任務'}</span>
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
              className="mt-4 p-4 rounded-xl border border-purple-500/30 bg-purple-950/20 text-slate-200 text-xs sm:text-sm leading-relaxed"
            >
              <div className="font-bold text-purple-400 mb-1 flex items-center gap-1.5 font-mono">
                <HelpCircle className="h-4 w-4" />
                <span>標準配對答案解析：</span>
              </div>
              <p className="mb-2 text-slate-300">
                {currentQ.leftItems
                  .map((item) => `【${item.label} ➜ ${(currentQ.correctPairs[item.id] || []).join('、')}】`)
                  .join('　')}
              </p>
              {currentQ.explanation && <p className="text-slate-400">{currentQ.explanation}</p>}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
