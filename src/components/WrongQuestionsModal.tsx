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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-3xl max-h-[85vh] flex flex-col rounded-2xl border border-amber-500/50 bg-slate-900/95 shadow-[0_0_50px_rgba(245,158,11,0.2)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-500/30 px-6 py-4 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-950 border border-amber-500/50 text-amber-400">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-mono text-amber-400">// MISSION ERROR TERMINAL</div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>錯題回顧終端機</span>
                <span className="text-xs bg-amber-950 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-mono">
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
            className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-400 hover:text-white hover:border-rose-500 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {wrongQuestions.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="h-16 w-16 text-emerald-400 mx-auto mb-3 opacity-80" />
              <h3 className="text-lg font-bold text-white mb-1">太厲害了！目前沒有未解決的錯題</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                您的常識作戰系統數據完全精準！繼續保持全勝紀錄吧，指揮官！
              </p>
            </div>
          ) : (
            wrongQuestions.map((item, idx) => (
              <div
                key={`${item.id}_${idx}`}
                className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 hover:border-amber-500/40 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="text-amber-400 font-bold">#{idx + 1}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 text-[10px]">
                      第{item.chapter}課
                    </span>
                    <span className="text-slate-400 text-[11px]">{item.id}</span>
                  </div>

                  <button
                    onClick={() => {
                      sound.playClick();
                      onRemoveItem(item.id);
                    }}
                    title="標記已掌握並從錯題庫移除"
                    className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-emerald-400 px-2 py-1 rounded hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <CheckCircle className="h-3.5 w-3.5" />
                    <span>已弄懂消除</span>
                  </button>
                </div>

                <div className="text-sm font-semibold text-white mb-3 leading-relaxed">
                  {item.prompt}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono mb-2">
                  <div className="p-2.5 rounded bg-rose-950/40 border border-rose-500/30 text-rose-300">
                    <span className="text-rose-400 font-bold block mb-0.5">// 你的回答：</span>
                    <span>{item.userAnswer}</span>
                  </div>
                  <div className="p-2.5 rounded bg-emerald-950/40 border border-emerald-500/30 text-emerald-300">
                    <span className="text-emerald-400 font-bold block mb-0.5">// 正確解答：</span>
                    <span>{item.correctAnswer}</span>
                  </div>
                </div>

                {item.explanation && (
                  <div className="text-xs text-slate-400 bg-slate-900/60 p-2.5 rounded border border-slate-800/80">
                    💡 <strong>解析提示：</strong> {item.explanation}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-amber-500/30 px-6 py-3 bg-slate-950/80 flex items-center justify-between">
          {wrongQuestions.length > 0 ? (
            confirmClear ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-rose-400">確定清空所有錯題？</span>
                <button
                  onClick={() => {
                    sound.playClick();
                    onClearAll();
                    setConfirmClear(false);
                  }}
                  className="px-2 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white text-xs font-mono"
                >
                  確認
                </button>
                <button
                  onClick={() => setConfirmClear(false)}
                  className="px-2 py-1 rounded bg-slate-800 text-slate-300 text-xs"
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
                className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 transition-colors cursor-pointer font-mono"
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
            className="px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold font-mono text-xs transition-colors cursor-pointer"
          >
            關閉終端 (CLOSE)
          </button>
        </div>
      </div>
    </div>
  );
};
