import React, { useState } from 'react';
import { JourneyStageDef, JourneyQuestion } from '../data/journeyData';
import { ChapterNumber } from '../types';
import { sound } from '../utils/audio';
import { CheckCircle2, XCircle, ChevronRight, Zap, HelpCircle, ArrowLeft, Star, Gem, Award, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface JourneyExerciseProps {
  stage: JourneyStageDef;
  onFinishStage: (score: number, total: number, starsEarned: number, wrongItems: any[]) => void;
  onBack: () => void;
}

export const JourneyExercise: React.FC<JourneyExerciseProps> = ({
  stage,
  onFinishStage,
  onBack,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentQ = stage.questions[currentIndex];

  // Answer states
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [selectedTF, setSelectedTF] = useState<boolean | null>(null);

  // Matching state
  const [matchedPairs, setMatchedPairs] = useState<Record<string, string>>({});
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);

  // Ordering state
  const [currentOrder, setCurrentOrder] = useState<string[]>(() => {
    if (currentQ.type === 'ordering' && currentQ.orderingItems) {
      return [...currentQ.orderingItems.map((it) => it.id)].reverse();
    }
    return [];
  });

  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [wrongItems, setWrongItems] = useState<any[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [stageFinished, setStageFinished] = useState(false);

  // Re-sync ordering state when question changes
  const initQuestionState = (q: JourneyQuestion) => {
    setSelectedChoice(null);
    setSelectedTF(null);
    setMatchedPairs({});
    setSelectedLeft(null);
    if (q.type === 'ordering' && q.orderingItems) {
      setCurrentOrder([...q.orderingItems.map((it) => it.id)].reverse());
    } else {
      setCurrentOrder([]);
    }
    setIsAnswered(false);
    setIsCorrect(null);
    setShowExplanation(false);
  };

  // Move ordering item
  const moveOrderingItem = (index: number, direction: 'up' | 'down') => {
    if (isAnswered) return;
    sound.playClick();
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= currentOrder.length) return;
    const copy = [...currentOrder];
    const temp = copy[index];
    copy[index] = copy[newIndex];
    copy[newIndex] = temp;
    setCurrentOrder(copy);
  };

  // Handle Matching click
  const handleLeftClick = (left: string) => {
    if (isAnswered) return;
    sound.playClick();
    setSelectedLeft(left);
  };

  const handleRightClick = (right: string) => {
    if (isAnswered || !selectedLeft) return;
    sound.playClick();
    setMatchedPairs((prev) => ({
      ...prev,
      [selectedLeft]: right,
    }));
    setSelectedLeft(null);
  };

  // Check Answer
  const handleCheck = () => {
    if (isAnswered) return;

    let correct = false;
    let userAnsDisplay = '';
    let correctAnsDisplay = '';

    if (currentQ.type === 'choice') {
      correct = selectedChoice === currentQ.correctAnswer;
      userAnsDisplay = selectedChoice !== null && currentQ.options ? currentQ.options[selectedChoice] : '未作答';
      correctAnsDisplay = currentQ.options ? currentQ.options[currentQ.correctAnswer] : '';
    } else if (currentQ.type === 'true_false') {
      correct = selectedTF === currentQ.correctAnswer;
      userAnsDisplay = selectedTF ? '正確 (✓)' : '錯誤 (✕)';
      correctAnsDisplay = currentQ.correctAnswer ? '正確 (✓)' : '錯誤 (✕)';
    } else if (currentQ.type === 'matching' && currentQ.matchingPairs) {
      correct = currentQ.matchingPairs.every(
        (p) => matchedPairs[p.left] === p.right
      );
      userAnsDisplay = Object.entries(matchedPairs)
        .map(([k, v]) => `${k}➔${v}`)
        .join('; ');
      correctAnsDisplay = currentQ.matchingPairs
        .map((p) => `${p.left}➔${p.right}`)
        .join('; ');
    } else if (currentQ.type === 'ordering') {
      correct =
        currentOrder.length === currentQ.correctAnswer.length &&
        currentOrder.every((id, idx) => id === currentQ.correctAnswer[idx]);
      userAnsDisplay = currentOrder.join('➔');
      correctAnsDisplay = currentQ.correctAnswer.join('➔');
    }

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
          prompt: currentQ.prompt,
          userAnswer: userAnsDisplay,
          correctAnswer: correctAnsDisplay,
          chapter: currentQ.chapter,
          category: `冒險征途_${stage.title}`,
          explanation: currentQ.explanation,
        },
      ]);
    }
  };

  // Next Question or Finish Stage
  const handleNext = () => {
    sound.playLaser();
    if (currentIndex + 1 < stage.questions.length) {
      const nextQ = stage.questions[currentIndex + 1];
      setCurrentIndex((i) => i + 1);
      initQuestionState(nextQ);
    } else {
      // Finished all questions in this stage
      setStageFinished(true);
    }
  };

  const finalScore = isCorrect ? score : score;
  const percentage = Math.round((finalScore / stage.questions.length) * 100);
  const starsEarned = percentage === 100 ? 3 : percentage >= 80 ? 2 : percentage >= 60 ? 1 : 0;

  if (stageFinished) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
        <div className="p-8 sm:p-10 rounded-3xl border border-amber-300 dark:border-amber-500/50 bg-white dark:bg-slate-900 shadow-2xl text-center relative overflow-hidden">
          <div className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 mb-2">
            // JOURNEY STAGE DEBRIEFING COMPLETED
          </div>

          <div className="text-4xl mb-3">{stage.icon}</div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-wide mb-1">
            {stage.title} 通關！
          </h2>
          <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mb-6">{stage.subtitle}</p>

          {/* Stars display */}
          <div className="flex items-center justify-center gap-3 my-4">
            {[1, 2, 3].map((s) => (
              <Star
                key={s}
                className={`h-12 w-12 transition-all transform ${
                  s <= starsEarned
                    ? 'text-amber-400 fill-amber-400 scale-110 drop-shadow-[0_0_15px_rgba(251,191,36,0.6)] animate-bounce'
                    : 'text-slate-300 dark:text-slate-700'
                }`}
              />
            ))}
          </div>

          <div className="text-lg font-bold text-slate-900 dark:text-white my-3">
            {starsEarned === 3 && '🌟 完美滿分！獲得 3 顆守護星章！'}
            {starsEarned === 2 && '✨ 表現優異！獲得 2 顆守護星章！'}
            {starsEarned === 1 && '👍 順利通關！獲得 1 顆守護星章！'}
            {starsEarned === 0 && '💪 未達通關標準（需答對 60% 以上），再挑戰一次吧！'}
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-3 gap-3 my-6 font-mono text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 block mb-1">答對題數</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold text-xl">
                {finalScore} / {stage.questions.length}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 block mb-1">準確率</span>
              <span className="text-sky-600 dark:text-cyan-400 font-bold text-xl">{percentage}%</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 block mb-1">獲得獎勵</span>
              <span className="text-amber-600 dark:text-amber-400 font-bold text-lg flex items-center justify-center gap-1">
                <Gem className="h-4 w-4" />+{stage.rewardCrystals}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => {
                sound.playClick();
                setCurrentIndex(0);
                setScore(0);
                setCombo(0);
                setWrongItems([]);
                initQuestionState(stage.questions[0]);
                setStageFinished(false);
              }}
              className="flex-1 py-3.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:border-amber-400 text-slate-800 dark:text-slate-200 font-bold text-sm font-mono flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
              <span>重新挑戰本關</span>
            </button>

            <button
              onClick={() => {
                sound.playVictory();
                onFinishStage(finalScore, stage.questions.length, starsEarned, wrongItems);
              }}
              className="flex-1 py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-sm font-mono flex items-center justify-center gap-2 shadow-md hover:brightness-105 cursor-pointer"
            >
              <span>領取獎勵並返回征途</span>
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isMatchingReady =
    currentQ.type === 'matching' &&
    currentQ.matchingPairs &&
    Object.keys(matchedPairs).length === currentQ.matchingPairs.length;

  const canCheck =
    (currentQ.type === 'choice' && selectedChoice !== null) ||
    (currentQ.type === 'true_false' && selectedTF !== null) ||
    (currentQ.type === 'matching' && isMatchingReady) ||
    currentQ.type === 'ordering';

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Top HUD */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border border-slate-200 dark:border-amber-500/30 bg-white/95 dark:bg-slate-900/80 p-4 rounded-2xl backdrop-blur-md shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playClick();
              onBack();
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:border-amber-400 text-slate-700 dark:text-slate-300 hover:text-amber-600 text-xs font-mono transition-colors cursor-pointer min-h-[40px]"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>返回征途地圖</span>
          </button>

          <div>
            <div className="text-[11px] font-mono font-semibold text-amber-600 dark:text-amber-400">
              // {stage.badge}・{stage.title}
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>{stage.subtitle}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 border border-amber-300 dark:border-amber-500/50 text-amber-800 dark:text-amber-300 font-bold">
                Q{currentIndex + 1}/{stage.questions.length}
              </span>
            </div>
          </div>
        </div>

        {/* Counters */}
        <div className="flex items-center gap-3 sm:gap-4 font-mono text-xs">
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="text-slate-500 dark:text-slate-400">進度:</span>
            <span className="text-amber-600 dark:text-amber-400 font-bold text-sm">
              {currentIndex + 1} / {stage.questions.length}
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
          className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-500 transition-all duration-300 shadow-sm"
          style={{ width: `${((currentIndex + 1) / stage.questions.length) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/90 rounded-2xl p-6 sm:p-8 shadow-sm dark:shadow-2xl relative overflow-hidden backdrop-blur-xl exercise-card">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400 bg-amber-100/90 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-500/40 px-3 py-1 rounded-lg">
            JOURNEY QUESTION #{currentIndex + 1}
          </span>
          <span className="text-xs px-3 py-1 rounded-lg font-bold border bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300">
            {currentQ.type === 'choice' && '🎯 單項選擇題'}
            {currentQ.type === 'true_false' && '⚖️ 是非判斷題'}
            {currentQ.type === 'matching' && '🔗 左右矩陣配對題'}
            {currentQ.type === 'ordering' && '📊 時空序列排序題'}
          </span>
        </div>

        {/* Prompt */}
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-6 leading-relaxed question-prompt">
          {currentQ.prompt}
        </h2>

        {/* 1. Choice Options */}
        {currentQ.type === 'choice' && currentQ.options && (
          <div className="grid grid-cols-1 gap-3.5 mb-8">
            {currentQ.options.map((opt, oIdx) => {
              const isSelected = selectedChoice === oIdx;
              const isOptionCorrect = oIdx === currentQ.correctAnswer;

              return (
                <button
                  key={oIdx}
                  disabled={isAnswered}
                  onClick={() => {
                    sound.playClick();
                    setSelectedChoice(oIdx);
                  }}
                  className={`p-4 sm:p-5 rounded-2xl border text-left font-medium text-base sm:text-lg transition-all flex items-center justify-between gap-4 cursor-pointer disabled:cursor-default option-btn min-h-[56px] shadow-xs ${
                    isAnswered
                      ? isOptionCorrect
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-200'
                        : isSelected
                        ? 'border-rose-500 bg-rose-50 text-rose-900 dark:bg-rose-950/80 dark:text-rose-200'
                        : 'border-slate-200 bg-slate-50 text-slate-400 opacity-60 dark:border-slate-800 dark:bg-slate-900'
                      : isSelected
                      ? 'border-sky-500 bg-sky-50 text-sky-900 font-bold ring-2 ring-sky-300 dark:border-cyan-400 dark:bg-cyan-950 dark:text-white'
                      : 'border-slate-200 bg-slate-50/70 hover:border-sky-300 hover:bg-sky-50/40 text-slate-800 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <span className="h-8 w-8 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center font-mono font-bold text-sm">
                      {String.fromCharCode(65 + oIdx)}
                    </span>
                    <span>{opt}</span>
                  </div>

                  {isAnswered && isOptionCorrect && <CheckCircle2 className="h-6 w-6 text-emerald-500" />}
                  {isAnswered && isSelected && !isOptionCorrect && <XCircle className="h-6 w-6 text-rose-500" />}
                </button>
              );
            })}
          </div>
        )}

        {/* 2. True / False Options */}
        {currentQ.type === 'true_false' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <button
              disabled={isAnswered}
              onClick={() => {
                sound.playClick();
                setSelectedTF(true);
              }}
              className={`p-6 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-2 cursor-pointer disabled:cursor-default min-h-[90px] ${
                isAnswered
                  ? currentQ.correctAnswer === true
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200'
                    : selectedTF === true
                    ? 'border-rose-500 bg-rose-50 text-rose-900 dark:bg-rose-950 dark:text-rose-200'
                    : 'border-slate-200 opacity-50'
                  : selectedTF === true
                  ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-300'
                  : 'border-slate-200 hover:border-emerald-400 bg-slate-50'
              }`}
            >
              <CheckCircle2 className="h-10 w-10 text-emerald-500" />
              <span className="font-bold text-xl text-emerald-700 dark:text-emerald-400">正確 (✓)</span>
            </button>

            <button
              disabled={isAnswered}
              onClick={() => {
                sound.playClick();
                setSelectedTF(false);
              }}
              className={`p-6 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-2 cursor-pointer disabled:cursor-default min-h-[90px] ${
                isAnswered
                  ? currentQ.correctAnswer === false
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200'
                    : selectedTF === false
                    ? 'border-rose-500 bg-rose-50 text-rose-900 dark:bg-rose-950 dark:text-rose-200'
                    : 'border-slate-200 opacity-50'
                  : selectedTF === false
                  ? 'border-rose-500 bg-rose-50 ring-2 ring-rose-300'
                  : 'border-slate-200 hover:border-rose-400 bg-slate-50'
              }`}
            >
              <XCircle className="h-10 w-10 text-rose-500" />
              <span className="font-bold text-xl text-rose-700 dark:text-rose-400">錯誤 (✕)</span>
            </button>
          </div>
        )}

        {/* 3. Matching Pairs Layout */}
        {currentQ.type === 'matching' && currentQ.matchingPairs && (
          <div className="space-y-4 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Column */}
              <div className="space-y-2.5">
                <div className="text-xs font-mono font-bold text-sky-700 dark:text-cyan-400">點擊選取左側項目：</div>
                {currentQ.matchingPairs.map((p, idx) => {
                  const isSelected = selectedLeft === p.left;
                  const isMatched = !!matchedPairs[p.left];

                  return (
                    <button
                      key={idx}
                      disabled={isAnswered}
                      onClick={() => handleLeftClick(p.left)}
                      className={`w-full p-4 rounded-xl border text-left font-semibold text-base transition-all flex items-center justify-between cursor-pointer min-h-[50px] ${
                        isSelected
                          ? 'border-sky-500 bg-sky-100 text-sky-900 ring-2 ring-sky-300'
                          : isMatched
                          ? 'border-emerald-400 bg-emerald-50 text-emerald-900'
                          : 'border-slate-200 bg-slate-50 text-slate-800 hover:border-sky-300'
                      }`}
                    >
                      <span>{p.left}</span>
                      {isMatched && (
                        <span className="text-xs font-mono text-emerald-700 font-bold bg-white px-2 py-0.5 rounded-lg border">
                          ➔ {matchedPairs[p.left]}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Right Column */}
              <div className="space-y-2.5">
                <div className="text-xs font-mono font-bold text-purple-700 dark:text-purple-400">點擊配對右側答案：</div>
                {currentQ.matchingPairs.map((p, idx) => {
                  const isUsed = Object.values(matchedPairs).includes(p.right);

                  return (
                    <button
                      key={idx}
                      disabled={isAnswered || !selectedLeft}
                      onClick={() => handleRightClick(p.right)}
                      className={`w-full p-4 rounded-xl border text-left font-semibold text-base transition-all cursor-pointer min-h-[50px] ${
                        isUsed
                          ? 'border-slate-200 bg-slate-100 text-slate-400 opacity-60'
                          : selectedLeft
                          ? 'border-purple-300 bg-purple-50 hover:bg-purple-100 text-purple-900 animate-pulse'
                          : 'border-slate-200 bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span>{p.right}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 4. Ordering Layout */}
        {currentQ.type === 'ordering' && currentQ.orderingItems && (
          <div className="space-y-3 mb-8">
            <div className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400">
              點選箭頭調整順序：
            </div>
            {currentOrder.map((id, index) => {
              const item = currentQ.orderingItems?.find((it) => it.id === id);
              if (!item) return null;

              return (
                <div
                  key={item.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-3 min-h-[52px]"
                >
                  <div className="flex items-center gap-3">
                    <span className="h-8 w-8 rounded-lg bg-amber-100 text-amber-800 font-mono font-bold flex items-center justify-center text-sm border border-amber-300">
                      #{index + 1}
                    </span>
                    <span className="font-semibold text-base text-slate-800">{item.text}</span>
                  </div>

                  {!isAnswered && (
                    <div className="flex items-center gap-1.5">
                      <button
                        disabled={index === 0}
                        onClick={() => moveOrderingItem(index, 'up')}
                        className="p-2.5 rounded-lg border border-slate-200 bg-white hover:border-amber-400 text-slate-700 disabled:opacity-30 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                      >
                        ↑
                      </button>
                      <button
                        disabled={index === currentOrder.length - 1}
                        onClick={() => moveOrderingItem(index, 'down')}
                        className="p-2.5 rounded-lg border border-slate-200 bg-white hover:border-amber-400 text-slate-700 disabled:opacity-30 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                      >
                        ↓
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Footer Actions */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-6 flex flex-wrap items-center justify-between gap-4">
          {!isAnswered ? (
            <button
              onClick={handleCheck}
              disabled={!canCheck}
              className={`w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold font-mono text-base flex items-center justify-center gap-2 transition-all min-h-[50px] ${
                canCheck
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 hover:brightness-105 shadow-md cursor-pointer'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
              }`}
            >
              <Zap className="h-5 w-5 fill-slate-950" />
              <span>確認答案 (CONFIRM ANSWER)</span>
            </button>
          ) : (
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {isCorrect ? (
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-base">
                    <CheckCircle2 className="h-6 w-6" />
                    <span>答對了！征途推進中</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-sm sm:text-base">
                    <XCircle className="h-6 w-6 flex-shrink-0" />
                    <span>回答錯誤，已收入本學員錯題庫</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                {currentQ.explanation && (
                  <button
                    onClick={() => setShowExplanation(!showExplanation)}
                    className="flex items-center gap-1.5 px-4 py-3 rounded-xl border border-amber-300 bg-amber-50 text-amber-800 text-xs sm:text-sm font-semibold hover:bg-amber-100 transition-colors min-h-[48px] cursor-pointer"
                  >
                    <HelpCircle className="h-4 w-4" />
                    <span>{showExplanation ? '收起解析' : '作戰解析'}</span>
                  </button>
                )}

                <button
                  onClick={handleNext}
                  className="flex-1 sm:flex-none px-7 py-3 rounded-xl font-bold font-mono text-base bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:brightness-105 shadow-md flex items-center justify-center gap-2 cursor-pointer min-h-[48px]"
                >
                  <span>{currentIndex + 1 < stage.questions.length ? '下一任務' : '查看征途結算'}</span>
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Explanation */}
        <AnimatePresence>
          {isAnswered && (showExplanation || !isCorrect) && currentQ.explanation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-5 p-5 rounded-xl border border-amber-200 bg-amber-50/90 dark:bg-amber-950/20 text-slate-800 dark:text-slate-200 text-sm leading-relaxed"
            >
              <div className="font-bold text-amber-800 dark:text-amber-400 mb-1.5 flex items-center gap-1.5 font-mono">
                <HelpCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <span>特訓作戰指引：</span>
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{currentQ.explanation}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
