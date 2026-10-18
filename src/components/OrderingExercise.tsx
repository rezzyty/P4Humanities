import React, { useState } from 'react';
import { OrderingQuestion } from '../data/matchingOrderingData';
import { ChapterNumber } from '../types';
import { sound } from '../utils/audio';
import { CheckCircle2, XCircle, ChevronRight, Zap, HelpCircle, ArrowLeft, ArrowUp, ArrowDown, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface OrderingExerciseProps {
  questions: OrderingQuestion[];
  chapter: ChapterNumber;
  onFinish: (score: number, total: number, wrongItems: any[]) => void;
  onBack: () => void;
}

export const OrderingExercise: React.FC<OrderingExerciseProps> = ({
  questions,
  chapter,
  onFinish,
  onBack,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentQ = questions[currentIndex];

  // current items order: array of item IDs in user-arranged sequence
  const [currentOrder, setCurrentOrder] = useState<string[]>(() => {
    // start with natural initial order (or shuffled if matches correct)
    const initial = currentQ.items.map((it) => it.id);
    if (JSON.stringify(initial) === JSON.stringify(currentQ.correctOrder)) {
      // reverse it so student actively sorts it
      return [...initial].reverse();
    }
    return initial;
  });

  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [wrongItems, setWrongItems] = useState<any[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);

  const moveItem = (index: number, direction: 'up' | 'down') => {
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

  const handleResetOrder = () => {
    if (isAnswered) return;
    sound.playClick();
    setCurrentOrder([...currentQ.items.map((it) => it.id)].reverse());
  };

  const handleCheck = () => {
    if (isAnswered) return;

    const correct =
      currentOrder.length === currentQ.correctOrder.length &&
      currentOrder.every((id, idx) => id === currentQ.correctOrder[idx]);

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
          userAnswer: currentOrder.join(' ➔ '),
          correctAnswer: currentQ.correctOrder.join(' ➔ '),
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
      const nextQ = questions[currentIndex + 1];
      setCurrentIndex((prev) => prev + 1);
      const initial = nextQ.items.map((it) => it.id);
      setCurrentOrder(
        JSON.stringify(initial) === JSON.stringify(nextQ.correctOrder)
          ? [...initial].reverse()
          : initial
      );
      setIsAnswered(false);
      setIsCorrect(null);
      setShowExplanation(false);
    } else {
      onFinish(isCorrect ? score : score, questions.length, wrongItems);
    }
  };

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
              <span>H4a_u2_09 排序題 (知識與理解)</span>
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
          className="h-full bg-gradient-to-r from-amber-500 via-sky-400 to-emerald-400 transition-all duration-300 shadow-[0_0_10px_rgba(245,158,11,0.8)]"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Main Ordering Card */}
      <div className="border border-amber-500/30 bg-slate-900/90 rounded-2xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-amber-400"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-amber-400"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-amber-400"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-amber-400"></div>

        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <span className="text-xs font-mono text-amber-400 bg-amber-950/60 border border-amber-500/40 px-2.5 py-1 rounded-md">
            SEQUENCE PROTOCOL #{currentIndex + 1}
          </span>
          <span className="text-xs px-2.5 py-1 rounded-md font-medium border bg-amber-950/70 border-amber-500 text-amber-300">
            📊 序列順序排序題
          </span>
        </div>

        {/* Prompt */}
        <h2 className="text-lg sm:text-xl font-bold text-white mb-2 leading-relaxed">
          {currentQ.prompt}
        </h2>

        {/* Direction hint */}
        {currentQ.directionHint && (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-950/40 border border-amber-500/40 text-amber-300 text-xs font-mono mb-6">
            <span>規則指示：</span>
            <strong>{currentQ.directionHint}</strong>
          </div>
        )}

        {/* Current Sequencer Visualizer */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs font-mono text-slate-400">當前排列表達式：</div>
          <div className="flex items-center flex-wrap gap-2 font-mono font-bold text-sm">
            {currentOrder.map((id, idx) => (
              <React.Fragment key={id}>
                <span
                  className={`px-2.5 py-1 rounded-lg border ${
                    isAnswered
                      ? id === currentQ.correctOrder[idx]
                        ? 'border-emerald-500 bg-emerald-950 text-emerald-300'
                        : 'border-rose-500 bg-rose-950 text-rose-300'
                      : 'border-cyan-400 bg-cyan-950 text-cyan-200'
                  }`}
                >
                  第 {idx + 1} 位: {id}
                </span>
                {idx < currentOrder.length - 1 && (
                  <span className="text-slate-600 font-bold">➔</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Interactive Sortable List */}
        <div className="space-y-3 mb-8">
          {currentOrder.map((id, index) => {
            const item = currentQ.items.find((it) => it.id === id);
            if (!item) return null;

            const isPositionCorrect = isAnswered && id === currentQ.correctOrder[index];

            return (
              <motion.div
                key={item.id}
                layout
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className={`p-4 rounded-xl border flex items-center justify-between gap-4 transition-all ${
                  isAnswered
                    ? isPositionCorrect
                      ? 'border-emerald-500 bg-emerald-950/30'
                      : 'border-rose-500 bg-rose-950/30'
                    : 'border-slate-800 bg-slate-800/40 hover:border-amber-500/50'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <span
                    className={`h-8 w-8 rounded-lg flex items-center justify-center font-mono font-bold text-sm border ${
                      isAnswered
                        ? isPositionCorrect
                          ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                          : 'bg-rose-500 border-rose-400 text-white'
                        : 'bg-amber-500/20 border-amber-400 text-amber-300'
                    }`}
                  >
                    #{index + 1}
                  </span>

                  <div>
                    <span className="text-xs font-mono text-cyan-400 mr-2">【{item.id}】</span>
                    <span className="text-base font-medium text-white">{item.text}</span>
                  </div>
                </div>

                {/* Move controls */}
                {!isAnswered ? (
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      disabled={index === 0}
                      onClick={() => moveItem(index, 'up')}
                      className="p-2 rounded-lg border border-slate-700 bg-slate-800 hover:border-cyan-400 hover:text-cyan-300 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                      title="往上移一位"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button
                      disabled={index === currentOrder.length - 1}
                      onClick={() => moveItem(index, 'down')}
                      className="p-2 rounded-lg border border-slate-700 bg-slate-800 hover:border-cyan-400 hover:text-cyan-300 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                      title="往下移一位"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex-shrink-0">
                    {isPositionCorrect ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    ) : (
                      <div className="text-xs text-rose-400 font-mono flex items-center gap-1">
                        <XCircle className="h-4 w-4 inline" />
                        <span>正解：{currentQ.correctOrder[index]}</span>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-slate-800 pt-5 flex flex-wrap items-center justify-between gap-4">
          {!isAnswered ? (
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={handleCheck}
                className="px-6 py-3 rounded-xl font-bold font-mono text-sm bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 hover:brightness-110 shadow-[0_0_20px_rgba(245,158,11,0.4)] flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Zap className="h-4 w-4" />
                <span>確認順序序列 (CONFIRM SEQUENCE)</span>
              </button>

              <button
                onClick={handleResetOrder}
                className="px-4 py-3 rounded-xl border border-slate-700 bg-slate-800 hover:border-slate-600 text-slate-300 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" />
                <span>重設排序</span>
              </button>
            </div>
          ) : (
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {isCorrect ? (
                  <div className="flex items-center gap-2 text-emerald-400 font-bold">
                    <CheckCircle2 className="h-6 w-6" />
                    <span>排序完全正確！獲得 +150 EXP</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                    <XCircle className="h-6 w-6" />
                    <span>
                      排序有誤！正確序列為：
                      {currentQ.correctOrder.join(' ➔ ')}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {currentQ.explanation && (
                  <button
                    onClick={() => setShowExplanation(!showExplanation)}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg border border-amber-500/40 bg-amber-950/30 text-amber-300 text-xs font-mono hover:bg-amber-900/40 transition-colors"
                  >
                    <HelpCircle className="h-4 w-4" />
                    <span>{showExplanation ? '收起解析' : '作戰解析'}</span>
                  </button>
                )}

                <button
                  onClick={handleNext}
                  className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl font-bold font-mono text-sm bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:brightness-110 shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{currentIndex + 1 < questions.length ? '下一排序題' : '結算任務'}</span>
                  <ChevronRight className="h-4 w-4" />
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
              className="mt-4 p-4 rounded-xl border border-amber-500/30 bg-amber-950/20 text-slate-200 text-xs sm:text-sm leading-relaxed"
            >
              <div className="font-bold text-amber-400 mb-1 flex items-center gap-1.5 font-mono">
                <HelpCircle className="h-4 w-4" />
                <span>標準順序解析：</span>
              </div>
              <p className="mb-2 font-mono text-cyan-300 font-bold">
                正確順序：{currentQ.correctOrder.join(' ➔ ')}
              </p>
              <p className="text-slate-300">{currentQ.explanation}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
