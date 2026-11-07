import React, { useState } from 'react';
import { JOURNEY_STAGES, JourneyStageDef } from '../data/journeyData';
import { UserStats } from '../types';
import { sound } from '../utils/audio';
import { Star, Lock, Sparkles, ChevronRight, Trophy, Shield, CheckCircle2, Award, Zap, Compass, ArrowRight } from 'lucide-react';
import { JourneyExercise } from './JourneyExercise';

interface JourneyModeProps {
  stats: UserStats;
  onUpdateJourneyStage: (stageId: number, score: number, total: number, stars: number, wrongItems: any[]) => void;
  onSwitchToFreeMode: () => void;
  onOpenNotes: (chapter: any) => void;
}

export const JourneyMode: React.FC<JourneyModeProps> = ({
  stats,
  onUpdateJourneyStage,
  onSwitchToFreeMode,
  onOpenNotes,
}) => {
  const [activeStage, setActiveStage] = useState<JourneyStageDef | null>(null);

  const journeyProgress = stats.journeyProgress || {
    unlockedStage: 1,
    stageStars: {},
    stageHighScores: {},
  };

  const unlockedStage = journeyProgress.unlockedStage || 1;
  const stageStars = journeyProgress.stageStars || {};
  const stageHighScores = journeyProgress.stageHighScores || {};

  const totalStarsEarned = Object.values(stageStars).reduce((acc, s) => acc + s, 0);

  const handleStartStage = (stage: JourneyStageDef) => {
    sound.playClick();
    setActiveStage(stage);
  };

  const handleFinishActiveStage = (score: number, total: number, starsEarned: number, wrongItems: any[]) => {
    if (!activeStage) return;
    onUpdateJourneyStage(activeStage.stageId, score, total, starsEarned, wrongItems);
    setActiveStage(null);
  };

  if (activeStage) {
    return (
      <JourneyExercise
        stage={activeStage}
        onFinishStage={handleFinishActiveStage}
        onBack={() => setActiveStage(null)}
      />
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 animate-fade-in space-y-6">
      {/* Hero Campaign Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-amber-300 dark:border-amber-500/40 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-sky-500/10 dark:from-amber-950/40 dark:via-slate-900 dark:to-cyan-950/40 p-6 sm:p-8 backdrop-blur-md shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-bold font-mono text-xs shadow-xs">
                CAMPUS JOURNEY MODE
              </span>
              <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400">
                // 全章節闖關冒險
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-wide mb-2 flex items-center gap-2.5">
              <span>🗺️ 小四常識 冒險征途（涵蓋第1、3、4、5課）</span>
            </h2>
            <p className="text-sm text-slate-700 dark:text-slate-300 max-w-xl leading-relaxed">
              為 <strong>{stats.playerName}</strong> 量身打造的循序漸進總復習！涵蓋第1、3、4、5課，過關斬將至跨章終極大會戰，收集 {JOURNEY_STAGES.length * 3} 顆守護者星章！
            </p>
          </div>

          {/* Student Campaign Overview Card */}
          <div className="flex flex-wrap lg:flex-nowrap items-center gap-4 bg-white/90 dark:bg-slate-900/90 p-4 rounded-2xl border border-amber-200 dark:border-amber-500/40 shadow-sm w-full lg:w-auto">
            <div className="text-center px-3 border-r border-slate-200 dark:border-slate-800">
              <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">征途星章</div>
              <div className="text-2xl font-black text-amber-500 flex items-center justify-center gap-1">
                <Star className="h-5 w-5 fill-amber-500" />
                <span>{totalStarsEarned} / {JOURNEY_STAGES.length * 3}</span>
              </div>
            </div>

            <div className="text-center px-3 border-r border-slate-200 dark:border-slate-800">
              <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">已解鎖關卡</div>
              <div className="text-2xl font-black text-sky-600 dark:text-cyan-400">
                {Math.min(JOURNEY_STAGES.length, unlockedStage)} / {JOURNEY_STAGES.length}
              </div>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                onSwitchToFreeMode();
              }}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-sky-400 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>切換自由選題</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-6 pt-4 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center gap-3">
          <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400 flex-shrink-0">
            征途完成度：{Math.round((totalStarsEarned / (JOURNEY_STAGES.length * 3)) * 100)}%
          </span>
          <div className="flex-1 h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-500 transition-all duration-500 shadow-sm"
              style={{ width: `${Math.min(100, (totalStarsEarned / (JOURNEY_STAGES.length * 3)) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stage Nodes Map */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>征途關卡航道圖 (STAGES 1 - {JOURNEY_STAGES.length})</span>
          </h3>
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
            每關答對 60% 即可解鎖下一關卡
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {JOURNEY_STAGES.map((st) => {
            const isUnlocked = unlockedStage >= st.stageId;
            const stars = stageStars[st.stageId] || 0;
            const bestScore = stageHighScores[st.stageId];
            const isBoss = st.stageId === JOURNEY_STAGES.length;

            return (
              <div
                key={st.stageId}
                className={`p-5 sm:p-6 rounded-3xl border-2 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 ${
                  !isUnlocked
                    ? 'border-slate-200 bg-slate-100/60 dark:border-slate-800 dark:bg-slate-950/40 opacity-70'
                    : isBoss
                    ? 'border-purple-300 dark:border-purple-500/50 bg-gradient-to-r from-purple-50/90 via-white to-pink-50/90 dark:from-purple-950/30 dark:via-slate-900 dark:to-pink-950/30 shadow-md ring-2 ring-purple-200 dark:ring-purple-500/30'
                    : stars === 3
                    ? 'border-emerald-300 dark:border-emerald-500/50 bg-gradient-to-r from-emerald-50/80 to-white dark:from-emerald-950/20 dark:to-slate-900 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-amber-400 shadow-xs'
                }`}
              >
                {/* Left Stage Info */}
                <div className="flex items-start gap-4">
                  <div
                    className={`h-16 w-16 rounded-2xl flex items-center justify-center text-3xl shadow-sm flex-shrink-0 ${
                      !isUnlocked
                        ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 grayscale'
                        : isBoss
                        ? 'bg-gradient-to-tr from-purple-500 to-amber-500 text-white shadow-purple-500/20'
                        : 'bg-amber-100 dark:bg-slate-800'
                    }`}
                  >
                    {!isUnlocked ? <Lock className="h-7 w-7 text-slate-400" /> : st.icon}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                          isBoss
                            ? 'bg-purple-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {st.badge}
                      </span>
                      <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 font-mono">
                        {st.subtitle}
                      </span>
                      {bestScore !== undefined && (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          最高分 {bestScore}%
                        </span>
                      )}
                    </div>

                    <h4 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                      {st.title}
                    </h4>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-xl leading-relaxed">
                      {st.description}
                    </p>

                    {/* Stars Rating Display */}
                    {isUnlocked && (
                      <div className="flex items-center gap-1.5 mt-2.5">
                        <span className="text-xs font-mono text-slate-500 dark:text-slate-400 mr-1">
                          評級：
                        </span>
                        {[1, 2, 3].map((s) => (
                          <Star
                            key={s}
                            className={`h-4 w-4 ${
                              s <= stars
                                ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]'
                                : 'text-slate-300 dark:text-slate-700'
                            }`}
                          />
                        ))}
                        <span className="text-xs font-mono text-slate-600 dark:text-slate-300 ml-2">
                          (通關獎勵: +{st.rewardCrystals} 晶石)
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Action Button */}
                <div className="w-full sm:w-auto flex-shrink-0 flex items-center gap-2">
                  {st.chapter !== 'all' && (
                    <button
                      onClick={() => onOpenNotes(st.chapter)}
                      className="px-3 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-sky-50 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer min-h-[48px]"
                    >
                      先讀筆記
                    </button>
                  )}

                  <button
                    disabled={!isUnlocked}
                    onClick={() => handleStartStage(st)}
                    className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold font-mono text-sm flex items-center justify-center gap-2 transition-all min-h-[48px] cursor-pointer disabled:cursor-not-allowed ${
                      !isUnlocked
                        ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600'
                        : isBoss
                        ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white shadow-md hover:brightness-105 active:scale-95'
                        : stars === 3
                        ? 'border border-emerald-400 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md hover:brightness-105 active:scale-95'
                    }`}
                  >
                    {!isUnlocked ? (
                      <>
                        <Lock className="h-4 w-4" />
                        <span>尚未解鎖</span>
                      </>
                    ) : stars === 3 ? (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        <span>滿分重溫</span>
                      </>
                    ) : stars > 0 ? (
                      <>
                        <span>繼續挑戰刷三星</span>
                        <ChevronRight className="h-4 w-4" />
                      </>
                    ) : (
                      <>
                        <span>開始征途挑戰</span>
                        <ChevronRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
