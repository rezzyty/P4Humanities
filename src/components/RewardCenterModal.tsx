import React, { useState } from 'react';
import { X, Award, Gem, Star, CheckCircle, Lock, Sparkles, Trophy, FileText, ChevronRight, Check, Shield, Zap } from 'lucide-react';
import { UserStats } from '../types';
import { REWARD_ITEMS, RewardItem } from '../utils/accountManager';
import { TRANSFORMER_MEDALS, TransformerMedal, getMedalById } from '../data/transformerMedalsData';
import { sound } from '../utils/audio';

interface RewardCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: UserStats;
  onUpdateStats: (newPartial: Partial<UserStats>) => void;
  defaultTab?: 'medals' | 'titles' | 'avatars' | 'certificate';
}

export const RewardCenterModal: React.FC<RewardCenterModalProps> = ({
  isOpen,
  onClose,
  stats,
  onUpdateStats,
  defaultTab = 'medals',
}) => {
  const [activeTab, setActiveTab] = useState<'medals' | 'titles' | 'avatars' | 'certificate'>(defaultTab);
  const [medalFactionFilter, setMedalFactionFilter] = useState<'all' | 'autobot' | 'decepticon'>('all');
  const [inspectingMedal, setInspectingMedal] = useState<TransformerMedal | null>(null);

  if (!isOpen) return null;

  const unlocked = stats.unlockedRewards || [];
  const unlockedMedals = stats.unlockedMedals || ['bumblebee'];
  const activeMedalId = stats.activeMedalId || 'bumblebee';
  const activeMedalObj = getMedalById(activeMedalId) || TRANSFORMER_MEDALS[0];

  const handlePurchase = (item: RewardItem) => {
    sound.playClick();
    if (unlocked.includes(item.id)) {
      if (item.category === 'title') {
        onUpdateStats({ title: item.name });
        sound.playCorrect();
      } else if (item.category === 'avatar') {
        onUpdateStats({ avatar: item.id });
        sound.playCorrect();
      }
      return;
    }

    if ((item.reqStars || 0) > (stats.stars || 0)) {
      sound.playWrong();
      return;
    }

    if (stats.crystals < item.costCrystals) {
      sound.playWrong();
      return;
    }

    sound.playCombo();
    const newUnlocked = [...unlocked, item.id];
    const newCrystals = stats.crystals - item.costCrystals;

    const updates: Partial<UserStats> = {
      crystals: newCrystals,
      unlockedRewards: newUnlocked,
    };

    if (item.category === 'title') {
      updates.title = item.name;
    } else if (item.category === 'avatar') {
      updates.avatar = item.id;
    }

    onUpdateStats(updates);
  };

  const handleEquipMedal = (medalId: string) => {
    sound.playCorrect();
    onUpdateStats({ activeMedalId: medalId });
  };

  const handleUnlockMedal = (medal: TransformerMedal) => {
    if (unlockedMedals.includes(medal.id)) {
      handleEquipMedal(medal.id);
      return;
    }

    const meetsStars = (stats.stars || 0) >= medal.reqStars;
    const canAfford = (stats.crystals || 0) >= medal.costCrystals;

    if (!meetsStars && !canAfford) {
      sound.playWrong();
      return;
    }

    sound.playVictory();
    const newUnlockedMedals = [...unlockedMedals, medal.id];
    const newCrystals = Math.max(0, (stats.crystals || 0) - medal.costCrystals);

    onUpdateStats({
      unlockedMedals: newUnlockedMedals,
      activeMedalId: medal.id,
      crystals: newCrystals,
    });
  };

  const titlesList = REWARD_ITEMS.filter((i) => i.category === 'title');
  const avatarsList = REWARD_ITEMS.filter((i) => i.category === 'avatar');
  const certItem = REWARD_ITEMS.find((i) => i.category === 'certificate')!;
  const isCertUnlocked = unlocked.includes(certItem.id);

  const filteredMedals = TRANSFORMER_MEDALS.filter((m) => {
    if (medalFactionFilter !== 'all' && m.faction !== medalFactionFilter) return false;
    return true;
  });

  const autobotCount = TRANSFORMER_MEDALS.filter((m) => m.faction === 'autobot').length;
  const decepticonCount = TRANSFORMER_MEDALS.filter((m) => m.faction === 'decepticon').length;
  const collectedMedalsCount = TRANSFORMER_MEDALS.filter((m) => unlockedMedals.includes(m.id)).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl border border-slate-200 dark:border-amber-500/40 bg-white dark:bg-slate-900/95 shadow-2xl overflow-hidden">
        
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between border-b border-slate-200 dark:border-slate-800 px-6 py-4 bg-slate-50/90 dark:bg-slate-950/70 gap-3">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-amber-100 dark:bg-amber-950 border border-amber-300 dark:border-amber-500/50 text-amber-700 dark:text-amber-400">
              <Trophy className="h-6 w-6" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold tracking-wider text-amber-600 dark:text-amber-400">
                // GUARDIAN REWARD & TROPHY SANCTUARY
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>地球守護者榮譽獎勵所</span>
                <span className="text-xs bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-500/50 px-2.5 py-0.5 rounded-full font-mono font-bold">
                  {stats.playerName} 的寶庫
                </span>
              </h2>
            </div>
          </div>

          {/* Student Wallet */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-50 dark:bg-slate-800 border border-sky-200 dark:border-cyan-500/40 text-xs font-mono font-bold">
              <Gem className="h-4 w-4 text-sky-500" />
              <span className="text-sky-700 dark:text-cyan-300">{stats.crystals || 0} 晶石</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-slate-800 border border-amber-200 dark:border-amber-500/40 text-xs font-mono font-bold">
              <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
              <span className="text-amber-700 dark:text-amber-300">{stats.stars || 0} 星章</span>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center shadow-xs"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto border-b border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-950/40 px-6 pt-3 gap-2">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('medals');
            }}
            className={`px-4 py-2.5 rounded-t-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer flex-shrink-0 min-h-[42px] ${
              activeTab === 'medals'
                ? 'bg-white dark:bg-slate-900 border-t-2 border-l border-r border-red-500 text-red-700 dark:text-red-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-white/60 dark:hover:bg-slate-800/40'
            }`}
          >
            <span>🏅 變形金剛勳章館 (24)</span>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-md bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">
              {collectedMedalsCount}/24
            </span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('titles');
            }}
            className={`px-4 py-2.5 rounded-t-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer flex-shrink-0 min-h-[42px] ${
              activeTab === 'titles'
                ? 'bg-white dark:bg-slate-900 border-t-2 border-l border-r border-amber-500 text-amber-700 dark:text-amber-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-white/60 dark:hover:bg-slate-800/40'
            }`}
          >
            <span>🏷️ 榮譽稱號館</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('avatars');
            }}
            className={`px-4 py-2.5 rounded-t-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer flex-shrink-0 min-h-[42px] ${
              activeTab === 'avatars'
                ? 'bg-white dark:bg-slate-900 border-t-2 border-l border-r border-sky-500 text-sky-700 dark:text-cyan-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-white/60 dark:hover:bg-slate-800/40'
            }`}
          >
            <span>🤖 專屬頭像造型</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('certificate');
            }}
            className={`px-4 py-2.5 rounded-t-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer flex-shrink-0 min-h-[42px] ${
              activeTab === 'certificate'
                ? 'bg-white dark:bg-slate-900 border-t-2 border-l border-r border-purple-500 text-purple-700 dark:text-purple-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-white/60 dark:hover:bg-slate-800/40'
            }`}
          >
            <span>📜 特訓榮譽結業證書</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* TAB 1: TRANSFORMERS MEDALS */}
          {activeTab === 'medals' && (
            <div className="space-y-4">
              {/* Equipped Companion Showcase Bar */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-red-500/10 via-sky-500/10 to-purple-500/10 border border-red-200 dark:border-red-500/30 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`h-12 w-12 rounded-2xl bg-gradient-to-tr ${activeMedalObj.color} flex items-center justify-center text-2xl shadow-md text-white border-2 border-white dark:border-slate-800`}>
                    {activeMedalObj.icon}
                  </div>
                  <div>
                    <div className="text-[11px] font-mono text-red-700 dark:text-red-400 font-bold flex items-center gap-1.5">
                      <span>⭐ 當前守護代表：</span>
                      <span className="text-slate-500 font-normal">（已裝備於頭像與證書）</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-base text-slate-900 dark:text-white">
                        {activeMedalObj.name}
                      </span>
                      <span className="text-xs text-sky-700 dark:text-cyan-400 font-semibold hidden sm:inline">
                        {activeMedalObj.role}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Faction Filter Buttons */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setMedalFactionFilter('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold cursor-pointer transition-all ${
                      medalFactionFilter === 'all'
                        ? 'bg-slate-900 text-white dark:bg-cyan-500 dark:text-slate-950 shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    全部 (24)
                  </button>
                  <button
                    onClick={() => setMedalFactionFilter('autobot')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold cursor-pointer transition-all flex items-center gap-1 ${
                      medalFactionFilter === 'autobot'
                        ? 'bg-red-600 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-red-600 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <span>🛡️ 博派 ({autobotCount})</span>
                  </button>
                  <button
                    onClick={() => setMedalFactionFilter('decepticon')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold cursor-pointer transition-all flex items-center gap-1 ${
                      medalFactionFilter === 'decepticon'
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-purple-600 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <span>⚡ 狂派 ({decepticonCount})</span>
                  </button>
                </div>
              </div>

              {/* Medals Grid (All 24 Characters) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {filteredMedals.map((medal) => {
                  const isOwned = unlockedMedals.includes(medal.id);
                  const isEquipped = activeMedalId === medal.id;
                  const canAfford = (stats.crystals || 0) >= medal.costCrystals;
                  const hasStars = (stats.stars || 0) >= medal.reqStars;

                  return (
                    <div
                      key={medal.id}
                      onClick={() => setInspectingMedal(medal)}
                      className={`relative rounded-2xl border-2 p-3.5 transition-all flex flex-col justify-between cursor-pointer group ${
                        isEquipped
                          ? 'border-red-500 bg-gradient-to-b from-red-50/70 to-white dark:from-red-950/30 dark:to-slate-900 shadow-md ring-2 ring-red-400/40'
                          : isOwned
                          ? 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-red-300 shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 opacity-90'
                      }`}
                    >
                      <div>
                        {/* Faction and Rarity */}
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1.5">
                            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md ${
                              medal.faction === 'autobot'
                                ? 'bg-red-100 text-red-700 dark:bg-red-950/80 dark:text-red-300'
                                : 'bg-purple-100 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300'
                            }`}>
                              {medal.faction === 'autobot' ? '🛡️ 博派' : '⚡ 狂派'}
                            </span>
                            <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded-md bg-slate-900 text-amber-300">
                              {medal.rarity}
                            </span>
                          </div>

                          {isEquipped ? (
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-red-600 text-white">
                              出戰中
                            </span>
                          ) : isOwned ? (
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                              已收藏
                            </span>
                          ) : (
                            <div className="flex items-center gap-1 text-xs font-mono font-bold text-sky-600 dark:text-cyan-400">
                              <Gem className="h-3.5 w-3.5" />
                              <span>{medal.costCrystals} 晶石</span>
                            </div>
                          )}
                        </div>

                        {/* Icon and Name */}
                        <div className="flex items-center gap-3 mb-2.5">
                          <div className={`h-12 w-12 rounded-2xl bg-gradient-to-tr ${medal.color} flex items-center justify-center text-2xl shadow-md text-white flex-shrink-0 group-hover:scale-105 transition-transform`}>
                            {medal.icon}
                          </div>

                          <div className="min-w-0 flex-1">
                            <h4 className="font-extrabold text-base text-slate-900 dark:text-white truncate">
                              {medal.name}
                            </h4>
                            <div className="text-xs text-sky-700 dark:text-cyan-400 font-semibold truncate">
                              {medal.role}
                            </div>
                          </div>
                        </div>

                        {/* Alt-mode and Quote */}
                        <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate mb-2">
                          載具：{medal.altMode}
                        </div>

                        <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950/70 text-[11px] text-slate-700 dark:text-slate-300 italic mb-3 line-clamp-2">
                          {medal.motto}
                        </div>
                      </div>

                      {/* Action Button */}
                      <div>
                        {isEquipped ? (
                          <div className="w-full py-2 px-3 rounded-xl bg-red-600 text-white font-bold font-mono text-xs flex items-center justify-center gap-1.5 shadow-sm">
                            <Check className="h-4 w-4" />
                            <span>守護代表出戰中</span>
                          </div>
                        ) : isOwned ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEquipMedal(medal.id);
                            }}
                            className="w-full py-2 px-3 rounded-xl bg-sky-50 hover:bg-red-600 text-sky-700 hover:text-white border border-sky-300 hover:border-transparent dark:bg-slate-800 dark:text-cyan-300 dark:hover:bg-red-600 dark:hover:text-white font-bold font-mono text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer min-h-[36px]"
                          >
                            <Shield className="h-3.5 w-3.5" />
                            <span>配備為守護代表</span>
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUnlockMedal(medal);
                            }}
                            className={`w-full py-2 px-3 rounded-xl font-bold font-mono text-xs flex items-center justify-center gap-1.5 transition-all min-h-[36px] cursor-pointer ${
                              canAfford || hasStars
                                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-sm'
                                : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                            }`}
                          >
                            {canAfford || hasStars ? (
                              <>
                                <Gem className="h-3.5 w-3.5" />
                                <span>立即解鎖 ({medal.costCrystals} 晶石)</span>
                              </>
                            ) : (
                              <>
                                <Lock className="h-3.5 w-3.5" />
                                <span className="truncate">{medal.reqDesc}</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: TITLES */}
          {activeTab === 'titles' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-500/30 text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between">
                <span>目前佩戴稱號：<strong className="text-sm underline">{stats.title}</strong></span>
                <span className="font-mono">完成各項測驗與冒險可賺取晶石兌換！</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {titlesList.map((item) => {
                  const isOwned = unlocked.includes(item.id);
                  const isEquipped = stats.title === item.name;
                  const canAfford = stats.crystals >= item.costCrystals;
                  const hasReqStars = (stats.stars || 0) >= (item.reqStars || 0);

                  return (
                    <div
                      key={item.id}
                      className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                        isEquipped
                          ? 'border-amber-400 bg-amber-50/90 dark:bg-amber-950/30 shadow-md ring-2 ring-amber-300'
                          : isOwned
                          ? 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-amber-300 shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 opacity-90'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{item.icon}</span>
                            <h4 className="font-bold text-base text-slate-900 dark:text-white">
                              {item.name}
                            </h4>
                          </div>

                          {isEquipped ? (
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500 text-white">
                              佩戴中
                            </span>
                          ) : isOwned ? (
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                              已解鎖
                            </span>
                          ) : (
                            <div className="flex items-center gap-1 text-xs font-mono font-bold text-sky-600 dark:text-cyan-400">
                              <Gem className="h-3.5 w-3.5" />
                              <span>{item.costCrystals} 晶石</span>
                            </div>
                          )}
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-2 leading-relaxed">
                          {item.desc}
                        </p>

                        <div className="text-[11px] font-mono text-amber-700 dark:text-amber-400 mb-4 bg-amber-50 dark:bg-amber-950/50 p-2 rounded-xl">
                          ✨ 專屬特效：{item.detailEffect}
                        </div>
                      </div>

                      <button
                        onClick={() => handlePurchase(item)}
                        className={`w-full py-2.5 px-3 rounded-xl font-bold font-mono text-xs flex items-center justify-center gap-1.5 transition-all min-h-[40px] cursor-pointer ${
                          isEquipped
                            ? 'bg-slate-100 text-slate-400 dark:bg-slate-800 cursor-default'
                            : isOwned
                            ? 'bg-sky-600 hover:bg-sky-500 text-white shadow-xs'
                            : canAfford && hasReqStars
                            ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-xs'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        {isEquipped ? (
                          <>
                            <CheckCircle className="h-4 w-4" />
                            <span>目前使用中</span>
                          </>
                        ) : isOwned ? (
                          <>
                            <Check className="h-4 w-4" />
                            <span>佩戴此稱號</span>
                          </>
                        ) : canAfford && hasReqStars ? (
                          <>
                            <Gem className="h-3.5 w-3.5" />
                            <span>立即兌換解鎖 ({item.costCrystals} 晶石)</span>
                          </>
                        ) : (
                          <>
                            <Lock className="h-3.5 w-3.5" />
                            <span>
                              {item.reqStars ? `需滿 ${item.reqStars}★ 及 ` : ''}晶石不足 ({stats.crystals}/{item.costCrystals})
                            </span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: AVATARS */}
          {activeTab === 'avatars' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-sky-50/70 dark:bg-sky-950/20 border border-sky-200 dark:border-cyan-500/30 text-xs text-sky-800 dark:text-cyan-300 flex items-center justify-between">
                <span>解鎖特別香港自然生態與科技航天角色造型！</span>
                <span className="font-mono">切換後即時同步更新指揮中心頭像</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {avatarsList.map((item) => {
                  const isOwned = unlocked.includes(item.id);
                  const isEquipped = stats.avatar === item.id;
                  const canAfford = stats.crystals >= item.costCrystals;

                  return (
                    <div
                      key={item.id}
                      className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                        isEquipped
                          ? 'border-sky-500 bg-sky-50/90 dark:bg-sky-950/30 shadow-md ring-2 ring-sky-300'
                          : isOwned
                          ? 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-sky-300 shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 opacity-90'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2.5">
                            <span className="text-3xl p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                              {item.icon}
                            </span>
                            <div>
                              <h4 className="font-bold text-base text-slate-900 dark:text-white">
                                {item.name}
                              </h4>
                              <span className="text-[11px] text-slate-500 font-mono">
                                特選作戰造型
                              </span>
                            </div>
                          </div>

                          {isEquipped ? (
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-sky-600 text-white">
                              使用中
                            </span>
                          ) : isOwned ? (
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                              已解鎖
                            </span>
                          ) : (
                            <div className="flex items-center gap-1 text-xs font-mono font-bold text-sky-600 dark:text-cyan-400">
                              <Gem className="h-3.5 w-3.5" />
                              <span>{item.costCrystals} 晶石</span>
                            </div>
                          )}
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-2 leading-relaxed">
                          {item.desc}
                        </p>

                        <div className="text-[11px] font-mono text-sky-700 dark:text-cyan-400 mb-4 bg-sky-50 dark:bg-sky-950/50 p-2 rounded-xl">
                          💡 效果：{item.detailEffect}
                        </div>
                      </div>

                      <button
                        onClick={() => handlePurchase(item)}
                        className={`w-full py-2.5 px-3 rounded-xl font-bold font-mono text-xs flex items-center justify-center gap-1.5 transition-all min-h-[40px] cursor-pointer ${
                          isEquipped
                            ? 'bg-slate-100 text-slate-400 dark:bg-slate-800 cursor-default'
                            : isOwned
                            ? 'bg-sky-600 hover:bg-sky-500 text-white shadow-xs'
                            : canAfford
                            ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-xs'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        {isEquipped ? (
                          <>
                            <CheckCircle className="h-4 w-4" />
                            <span>目前使用中</span>
                          </>
                        ) : isOwned ? (
                          <>
                            <Check className="h-4 w-4" />
                            <span>裝備此頭像</span>
                          </>
                        ) : canAfford ? (
                          <>
                            <Gem className="h-3.5 w-3.5" />
                            <span>立即兌換造型 ({item.costCrystals} 晶石)</span>
                          </>
                        ) : (
                          <>
                            <Lock className="h-3.5 w-3.5" />
                            <span>晶石不足 ({stats.crystals}/{item.costCrystals})</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: OFFICIAL CERTIFICATE */}
          {activeTab === 'certificate' && (
            <div className="space-y-6">
              {/* Preview Canvas of Certificate */}
              <div className="p-8 sm:p-10 rounded-3xl border-4 border-amber-300/80 bg-gradient-to-b from-amber-50/90 via-white to-amber-50/80 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 shadow-xl relative overflow-hidden text-center">
                {/* Decorative borders */}
                <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-amber-500"></div>
                <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-amber-500"></div>
                <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-amber-500"></div>
                <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-amber-500"></div>

                <div className="text-xs font-mono font-bold tracking-widest text-amber-700 dark:text-amber-400 uppercase mb-2">
                  HONORARY COMMENDATION OF EXCELLENCE
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-wide mb-3">
                  香港小學四年級 常識科特訓作戰系統
                </h3>
                <div className="text-sm font-bold text-sky-700 dark:text-cyan-400 mb-6 font-mono">
                  ★ 全單元特級守護者榮譽結業證書 ★
                </div>

                <div className="max-w-md mx-auto text-base sm:text-lg text-slate-700 dark:text-slate-200 mb-6 leading-relaxed">
                  茲證明學員 <strong className="text-xl sm:text-2xl text-amber-600 dark:text-amber-400 mx-2 underline decoration-amber-400 font-serif">{stats.playerName}</strong>
                  <br />
                  於本特訓系統中圓滿研習單元一《環境與生活》及單元二《地球是我家》共五大章節課程，表現卓越，特頒此狀以資表彰！
                </div>

                {/* Transformer Guardian Seal */}
                <div className="flex items-center justify-center gap-3 max-w-sm mx-auto mb-4 py-2.5 px-4 rounded-2xl bg-amber-100/70 dark:bg-slate-800/90 border border-amber-300 dark:border-amber-500/40 text-xs font-mono shadow-xs">
                  <span className="text-2xl">{activeMedalObj.icon}</span>
                  <div className="text-left">
                    <span className="text-[10px] text-amber-800 dark:text-amber-300 font-bold block">
                      榮譽塞伯坦守護代表勳章：
                    </span>
                    <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                      {activeMedalObj.name}（{activeMedalObj.role}）
                    </span>
                  </div>
                </div>

                {/* Badges and achievements display inside certificate */}
                <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto font-mono text-xs my-6 p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-amber-200 dark:border-amber-500/30">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block mb-1">榮譽等級</span>
                    <span className="text-sky-600 dark:text-cyan-400 font-bold text-base">Lv.{stats.level}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block mb-1">累積星章</span>
                    <span className="text-amber-500 font-bold text-base">{stats.stars || 0} ★</span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block mb-1">守護經驗</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold text-base">{stats.exp} EXP</span>
                  </div>
                </div>

                {/* Golden Seal stamp */}
                <div className="flex items-center justify-between max-w-lg mx-auto pt-4 border-t border-amber-200 dark:border-slate-800 text-xs font-mono text-slate-500">
                  <div className="text-left">
                    <div>頒發日期：{new Date().toLocaleDateString('zh-HK')}</div>
                    <div>驗證序號：CYBER-P4-{(stats.accountId || 'HK').toUpperCase()}-2026</div>
                  </div>

                  <div className="w-16 h-16 rounded-full border-2 border-amber-500 bg-amber-100 text-amber-800 flex flex-col items-center justify-center font-bold text-[9px] shadow-sm transform -rotate-12">
                    <span>特訓合格</span>
                    <span>★ 榮譽認證 ★</span>
                  </div>
                </div>
              </div>

              {/* Certificate Unlock / Actions */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div className="text-xs text-slate-600 dark:text-slate-300">
                  {isCertUnlocked ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                      <CheckCircle className="h-4 w-4" />
                      證書已永久解鎖！可隨時讓家長或老師查閱。
                    </span>
                  ) : (
                    <span>
                      需累積滿 <strong>6 顆星章</strong> 及花費 <strong>50 晶石</strong> 即可正式解鎖頒發榮譽獎狀！
                    </span>
                  )}
                </div>

                {!isCertUnlocked && (
                  <button
                    onClick={() => handlePurchase(certItem)}
                    disabled={stats.crystals < 50 || (stats.stars || 0) < 6}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold font-mono text-xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-md"
                  >
                    解鎖官方證書 (50 💎)
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 dark:border-slate-800 px-6 py-4 bg-slate-50/90 dark:bg-slate-950/80 flex justify-end">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-6 py-2.5 rounded-xl bg-slate-800 dark:bg-slate-700 text-white font-bold font-mono text-sm transition-colors cursor-pointer min-h-[44px]"
          >
            關閉榮譽殿堂 (CLOSE)
          </button>
        </div>
      </div>

      {/* Datapad Tech Specs Inspector Modal */}
      {inspectingMedal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg rounded-3xl border-2 border-sky-400 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden p-6 text-slate-900 dark:text-white">
            <button
              onClick={() => setInspectingMedal(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Character Header */}
            <div className="flex items-center gap-4 mb-4">
              <div className={`h-16 w-16 rounded-2xl bg-gradient-to-tr ${inspectingMedal.color} flex items-center justify-center text-4xl shadow-lg text-white border-2 border-white`}>
                {inspectingMedal.icon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                    inspectingMedal.faction === 'autobot'
                      ? 'bg-red-100 text-red-800 border border-red-300 dark:bg-red-950 dark:text-red-300'
                      : 'bg-purple-100 text-purple-800 border border-purple-300 dark:bg-purple-950 dark:text-purple-300'
                  }`}>
                    {inspectingMedal.faction === 'autobot' ? '🛡️ 博派主力' : '⚡ 狂派陣營'}
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-900 text-amber-300">
                    {inspectingMedal.rarity}
                  </span>
                </div>
                <h3 className="text-2xl font-black tracking-tight mt-1">
                  {inspectingMedal.name}
                </h3>
                <div className="text-xs font-semibold text-sky-600 dark:text-cyan-400">
                  {inspectingMedal.role}
                </div>
              </div>
            </div>

            {/* Description & Motto */}
            <div className="space-y-3 mb-5 text-xs">
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {inspectingMedal.description}
              </p>

              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 italic border-l-4 border-sky-500">
                {inspectingMedal.motto}
              </div>

              <div className="p-3 rounded-xl bg-sky-50 dark:bg-cyan-950/40 border border-sky-200 dark:border-cyan-500/40 text-sky-900 dark:text-cyan-200">
                <div className="font-bold mb-1 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-sky-600 dark:text-cyan-400" />
                  <span>守護者特技加成：</span>
                </div>
                <div>{inspectingMedal.bonusEffect}</div>
              </div>
            </div>

            {/* Tech Specs Radar Bars */}
            <div className="mb-6 bg-slate-50 dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-2.5 flex items-center justify-between">
                <span>// 塞伯坦作戰數據指標 (TECH SPECS)</span>
                <span className="text-[11px] text-sky-600 dark:text-cyan-400 font-normal">等級 10 滿分制</span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                {[
                  { label: '力量 Strength', val: inspectingMedal.specs.strength, color: 'bg-red-500' },
                  { label: '智力 Intelligence', val: inspectingMedal.specs.intelligence, color: 'bg-blue-500' },
                  { label: '速度 Speed', val: inspectingMedal.specs.speed, color: 'bg-amber-500' },
                  { label: '耐力 Endurance', val: inspectingMedal.specs.endurance, color: 'bg-emerald-500' },
                  { label: '勇氣 Courage', val: inspectingMedal.specs.courage, color: 'bg-purple-500' },
                ].map((spec) => (
                  <div key={spec.label} className="flex items-center gap-3">
                    <span className="w-32 text-slate-600 dark:text-slate-400 text-[11px]">{spec.label}</span>
                    <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${spec.color} rounded-full`}
                        style={{ width: `${spec.val * 10}%` }}
                      />
                    </div>
                    <span className="w-6 text-right font-bold text-slate-800 dark:text-slate-200">{spec.val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Equip / Unlock Button */}
            <div className="flex gap-2.5">
              {unlockedMedals.includes(inspectingMedal.id) ? (
                <button
                  onClick={() => {
                    handleEquipMedal(inspectingMedal.id);
                    setInspectingMedal(null);
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold font-mono text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Shield className="h-4 w-4" />
                  <span>配備為當前守護代表金剛</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    handleUnlockMedal(inspectingMedal);
                    setInspectingMedal(null);
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black font-mono text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Gem className="h-4 w-4" />
                  <span>立即解鎖此勳章 ({inspectingMedal.costCrystals} 晶石)</span>
                </button>
              )}

              <button
                onClick={() => setInspectingMedal(null)}
                className="py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm cursor-pointer"
              >
                關閉
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
