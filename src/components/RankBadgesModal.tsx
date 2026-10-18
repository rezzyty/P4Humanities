import React from 'react';
import { X, Award, Shield, Zap, Compass, Droplet, Trees, Flame, Cpu } from 'lucide-react';
import { UserStats } from '../types';
import { sound } from '../utils/audio';

interface RankBadgesModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: UserStats;
}

interface BadgeDef {
  id: string;
  name: string;
  desc: string;
  icon: string;
  isUnlocked: (stats: UserStats) => boolean;
}

const BADGES: BadgeDef[] = [
  {
    id: 'first_blood',
    name: '賽博防衛初陣',
    desc: '完成任意一項常識章節訓練',
    icon: '🔰',
    isUnlocked: (s) => Object.keys(s.completedExercises).length >= 1,
  },
  {
    id: 'c1_master',
    name: '考察導航特工',
    desc: '完成第1課《小小考察隊》任一專題特訓',
    icon: '🗺️',
    isUnlocked: (s) => Object.keys(s.completedExercises).some((k) => k.startsWith('1_')),
  },
  {
    id: 'c2_master',
    name: '漫遊香港地貌專家',
    desc: '完成第2課《漫遊香港》任一專題特訓',
    icon: '🏙️',
    isUnlocked: (s) => Object.keys(s.completedExercises).some((k) => k.startsWith('2_')),
  },
  {
    id: 'c3_master',
    name: '氣象雷達測量師',
    desc: '完成第3課《香港的氣候》任一專題特訓',
    icon: '⛈️',
    isUnlocked: (s) => Object.keys(s.completedExercises).some((k) => k.startsWith('3_')),
  },
  {
    id: 'c4_master',
    name: '七洲四洋探險士',
    desc: '完成第4課《發現地球》任一專題特訓',
    icon: '🧭',
    isUnlocked: (s) => Object.keys(s.completedExercises).some((k) => k.startsWith('4_')),
  },
  {
    id: 'c5_master',
    name: '綠色地球修復師',
    desc: '完成第5課《地球生病了》任一專題特訓',
    icon: '🌱',
    isUnlocked: (s) => Object.keys(s.completedExercises).some((k) => k.startsWith('5_')),
  },
  {
    id: 'combo_king',
    name: '連續答對連擊王',
    desc: '戰鬥中達成 5 連擊或以上',
    icon: '⚡',
    isUnlocked: (s) => s.streak >= 5,
  },
  {
    id: 'perfect_100',
    name: '百分百特工核心',
    desc: '在任一練習中取得 100% 滿分',
    icon: '👑',
    isUnlocked: (s) => Object.values(s.completedExercises).some((score) => score === 100),
  },
  {
    id: 'level_5',
    name: '資深賽博指揮官',
    desc: '作戰經驗值達到等級 5 以上',
    icon: '🎖️',
    isUnlocked: (s) => s.level >= 5,
  },
  {
    id: 'eco_guardian',
    name: '全能常識星際特使',
    desc: '累積經驗值突破 500 EXP',
    icon: '🛡️',
    isUnlocked: (s) => s.exp >= 500,
  },
  {
    id: 'matrix_linker',
    name: '量子矩陣配對大師',
    desc: '通關任一課的【配對題】專題特訓',
    icon: '🔗',
    isUnlocked: (s) =>
      Object.keys(s.completedExercises).some((k) => k.includes('配對題')),
  },
  {
    id: 'sequence_master',
    name: '時空序列排序專家',
    desc: '通關任一課的【排序題】專題特訓',
    icon: '📊',
    isUnlocked: (s) =>
      Object.keys(s.completedExercises).some((k) => k.includes('排序題')),
  },
  {
    id: 'all_clear',
    name: '全領域終極制霸',
    desc: '通關全系統 30 大專題特訓模組中至少 15 個',
    icon: '🪐',
    isUnlocked: (s) => Object.keys(s.completedExercises).length >= 15,
  },
];

export const RankBadgesModal: React.FC<RankBadgesModalProps> = ({ isOpen, onClose, stats }) => {
  if (!isOpen) return null;

  const unlockedCount = BADGES.filter((b) => b.isUnlocked(stats)).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl border border-purple-500/50 bg-slate-900/95 shadow-[0_0_50px_rgba(168,85,247,0.25)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-purple-500/30 px-6 py-4 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-950 border border-purple-500/50 text-purple-400">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-mono text-purple-400">// CYBER ACHIEVEMENT LOG</div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>榮譽勳章成就館</span>
                <span className="text-xs bg-purple-950 text-purple-300 border border-purple-500/40 px-2 py-0.5 rounded-full font-mono">
                  {unlockedCount} / {BADGES.length} 解鎖
                </span>
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-400 hover:text-white hover:border-purple-500 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Badges Grid */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {BADGES.map((b) => {
            const unlocked = b.isUnlocked(stats);

            return (
              <div
                key={b.id}
                className={`p-3.5 rounded-xl border flex items-center gap-3.5 transition-all ${
                  unlocked
                    ? 'border-purple-500/50 bg-purple-950/20 shadow-[0_0_15px_rgba(168,85,247,0.15)]'
                    : 'border-slate-800 bg-slate-950/40 opacity-50 grayscale'
                }`}
              >
                <div
                  className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl text-2xl border ${
                    unlocked
                      ? 'border-purple-400 bg-purple-900/40 shadow-[0_0_10px_rgba(168,85,247,0.4)]'
                      : 'border-slate-800 bg-slate-900 text-slate-600'
                  }`}
                >
                  {b.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="font-bold text-sm text-white truncate">{b.name}</h4>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        unlocked
                          ? 'bg-purple-950 text-purple-300 border border-purple-500/40'
                          : 'bg-slate-900 text-slate-500'
                      }`}
                    >
                      {unlocked ? 'ACTIVE' : 'LOCKED'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 leading-snug">{b.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="border-t border-purple-500/30 px-6 py-3 bg-slate-950/80 flex justify-end">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold font-mono text-xs transition-colors cursor-pointer"
          >
            返回作戰基地 (BACK)
          </button>
        </div>
      </div>
    </div>
  );
};
