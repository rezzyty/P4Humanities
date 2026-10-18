import React, { useEffect } from 'react';
import { Award, RotateCcw, AlertTriangle, ArrowLeft, Zap, CheckCircle2, Trophy } from 'lucide-react';
import { sound } from '../utils/audio';

import { ChapterNumber } from '../types';

interface ReportModalProps {
  score: number;
  total: number;
  chapter: ChapterNumber;
  category: string;
  wrongCount: number;
  onRetry: () => void;
  onGoHome: () => void;
  onOpenWrongLog: () => void;
}

const CHAPTER_TITLES: Record<ChapterNumber, string> = {
  1: '第1課 小小考察隊',
  2: '第2課 漫遊香港',
  3: '第3課 香港的氣候',
  4: '第4課 發現地球',
  5: '第5課 地球生病了',
};

export const ReportModal: React.FC<ReportModalProps> = ({
  score,
  total,
  chapter,
  category,
  wrongCount,
  onRetry,
  onGoHome,
  onOpenWrongLog,
}) => {
  const percentage = Math.round((score / total) * 100);

  useEffect(() => {
    sound.playVictory();
  }, []);

  const getGrade = (pct: number) => {
    if (pct === 100) return { letter: 'S+', title: '神級地球守護官', color: 'text-amber-400', border: 'border-amber-400' };
    if (pct >= 90) return { letter: 'S', title: '頂尖星際特工', color: 'text-cyan-400', border: 'border-cyan-400' };
    if (pct >= 80) return { letter: 'A', title: '優秀防衛戰士', color: 'text-emerald-400', border: 'border-emerald-400' };
    if (pct >= 60) return { letter: 'B', title: '合格防衛學員', color: 'text-blue-400', border: 'border-blue-400' };
    return { letter: 'C', title: '需加強戰備訓練', color: 'text-rose-400', border: 'border-rose-400' };
  };

  const grade = getGrade(percentage);
  const expEarned = score * 20 + (percentage === 100 ? 100 : 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-2xl border border-cyan-500/50 bg-slate-900/95 p-6 sm:p-8 shadow-[0_0_60px_rgba(6,182,212,0.3)] text-center overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="text-xs font-mono text-cyan-400 mb-2">
          // MISSION DEBRIEFING REPORT COMPLETED
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide mb-1">
          {CHAPTER_TITLES[chapter] || `第${chapter}課`} 特訓完成！
        </h2>
        <p className="text-xs font-mono text-slate-400 mb-6">{category}</p>

        {/* Grade Badge */}
        <div className="inline-block relative my-2">
          <div
            className={`w-28 h-28 mx-auto rounded-2xl border-4 ${grade.border} bg-slate-950/80 flex flex-col items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.3)]`}
          >
            <span className={`text-4xl sm:text-5xl font-black font-mono ${grade.color}`}>
              {grade.letter}
            </span>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-1">
              RANK
            </span>
          </div>
        </div>

        <div className={`text-sm font-bold mt-2 ${grade.color}`}>{grade.title}</div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-3 gap-3 my-6 font-mono text-xs">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block mb-1">精確答對</span>
            <span className="text-emerald-400 font-bold text-lg">
              {score} / {total}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block mb-1">準確率</span>
            <span className="text-cyan-400 font-bold text-lg">{percentage}%</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block mb-1">獲得 EXP</span>
            <span className="text-amber-400 font-bold text-lg flex items-center justify-center gap-0.5">
              <Zap className="h-4 w-4 inline" />+{expEarned}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          {wrongCount > 0 && (
            <button
              onClick={() => {
                sound.playClick();
                onOpenWrongLog();
              }}
              className="w-full py-3 px-4 rounded-xl border border-amber-500/50 bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 font-bold text-xs font-mono flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <AlertTriangle className="h-4 w-4" />
              <span>檢視本次錯題 ({wrongCount} 題)</span>
            </button>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => {
                sound.playClick();
                onRetry();
              }}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-700 bg-slate-800 hover:border-cyan-400 text-slate-200 font-bold text-xs font-mono flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
              <span>重新特訓 (RETRY)</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onGoHome();
              }}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs font-mono flex items-center justify-center gap-2 hover:brightness-110 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>返回作戰總部</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
