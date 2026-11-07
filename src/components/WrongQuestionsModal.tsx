import React, { useState } from 'react';
import { X, AlertTriangle, Trash2, RotateCcw, CheckCircle } from 'lucide-react';
import { sound } from '../utils/audio';

import { ChapterNumber } from '../types';

interface WrongQuestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  wrongQuestions: {
    id: string;
    chapter: ChapterNumber;
    category: string;
    prompt: string;
    userAnswer: string;
    correctAnswer: string;
    timestamp: number;
    explanation?: string;
  }[];
  onClearAll: () => void;
  onRemoveItem: (id: string) => void;
}

export const WrongQuestionsModal: React.FC<WrongQuestionsModalProps> = ({
  isOpen,
  onClose,
  wrongQuestions,
  onClearAll,
  onRemoveItem,
}) => {
  const [confirmClear, setConfirmClear] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl max-h-[85vh] flex flex-col rounded-2xl border border-slate-200 dark:border-amber-500/50 bg-white dark:bg-slate-900/95 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-amber-500/30 px-6 py-4 bg-slate-50/90 dark:bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-950 border border-amber-300 dark:border-amber-500/50 text-amber-700 dark:text-amber-400">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-mono font-semibold text-amber-600 dark:text-amber-400">// MISSION ERROR TERMINAL</div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>錯題回顧終端機</span>
                <span className="text-xs bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-500/40 px-2.5 py-0.5 rounded-full font-mono font-bold">
                  {wrongQuestions.length} 題需複習
                </span>
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-400 transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center shadow-xs"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {wrongQuestions.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">太厲害了！目前沒有未解決的錯題</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                您的常識作戰系統數據完全精準！繼續保持全勝紀錄吧，指揮官！
              </p>
            </div>
          ) : (
            wrongQuestions.map((item, idx) => (
              <div
                key={`${item.id}_${idx}`}
                className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 hover:border-amber-400 transition-colors shadow-xs"
              >
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="text-amber-700 dark:text-amber-400 font-bold text-sm">#{idx + 1}</span>
                    <span className="px-2.5 py-1 rounded-lg bg-slate-200/80 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold">
                      第{item.chapter}課
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 text-xs">{item.id}</span>
                  </div>

                  <button
                    onClick={() => {
                      sound.playClick();
                      onRemoveItem(item.id);
                    }}
                    title="標記已掌握並從錯題庫移除"
                    className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 transition-colors cursor-pointer min-h-[36px]"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>已弄懂消除</span>
                  </button>
                </div>

                <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-3 leading-relaxed">
                  {item.prompt}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm font-mono mb-2.5">
                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/30 text-rose-800 dark:text-rose-300">
                    <span className="text-rose-600 dark:text-rose-400 font-bold block mb-1">// 你的回答：</span>
                    <span className="font-sans font-semibold">{item.userAnswer}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold block mb-1">// 正確解答：</span>
                    <span className="font-sans font-semibold">{item.correctAnswer}</span>
                  </div>
                </div>

                {item.explanation && (
                  <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 bg-amber-50/70 dark:bg-slate-900/60 p-3 rounded-xl border border-amber-200 dark:border-slate-800/80 leading-relaxed">
                    💡 <strong className="text-amber-800 dark:text-amber-300">解析提示：</strong> {item.explanation}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 dark:border-amber-500/30 px-6 py-4 bg-slate-50/90 dark:bg-slate-950/80 flex items-center justify-between">
          {wrongQuestions.length > 0 ? (
            confirmClear ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-rose-600 font-bold">確定清空所有錯題？</span>
                <button
                  onClick={() => {
                    sound.playClick();
                    onClearAll();
                    setConfirmClear(false);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-mono font-bold cursor-pointer"
                >
                  確認
                </button>
                <button
                  onClick={() => setConfirmClear(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 text-xs font-bold cursor-pointer"
                >
                  取消
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  sound.playClick();
                  setConfirmClear(true);
                }}
                className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 hover:text-rose-700 transition-colors cursor-pointer font-mono font-bold p-1"
              >
                <Trash2 className="h-4 w-4" />
                <span>清空所有紀錄</span>
              </button>
            )
          ) : (
            <div />
          )}

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-mono text-sm transition-colors cursor-pointer min-h-[44px]"
          >
            關閉終端 (CLOSE)
          </button>
        </div>
      </div>
    </div>
  );
};
