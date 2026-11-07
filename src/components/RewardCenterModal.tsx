import React, { useState } from 'react';
import { X, Award, Gem, Star, CheckCircle, Lock, Sparkles, Trophy, FileText, ChevronRight, Check } from 'lucide-react';
import { UserStats } from '../types';
import { REWARD_ITEMS, RewardItem } from '../utils/accountManager';
import { sound } from '../utils/audio';

interface RewardCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: UserStats;
  onUpdateStats: (newPartial: Partial<UserStats>) => void;
}

export const RewardCenterModal: React.FC<RewardCenterModalProps> = ({
  isOpen,
  onClose,
  stats,
  onUpdateStats,
}) => {
  const [activeTab, setActiveTab] = useState<'titles' | 'avatars' | 'certificate' | 'trophies'>('titles');
  const [showCertificatePreview, setShowCertificatePreview] = useState(false);

  if (!isOpen) return null;

  const unlocked = stats.unlockedRewards || [];

  const handlePurchase = (item: RewardItem) => {
    sound.playClick();
    if (unlocked.includes(item.id)) {
      // Already unlocked: If title, equip it!
      if (item.category === 'title') {
        onUpdateStats({ title: item.name });
        sound.playCorrect();
      } else if (item.category === 'avatar') {
        onUpdateStats({ avatar: item.id });
        sound.playCorrect();
      }
      return;
    }

    // Check prerequisites
    if ((item.reqStars || 0) > (stats.stars || 0)) {
      sound.playWrong();
      return;
    }

    if (stats.crystals < item.costCrystals) {
      sound.playWrong();
      return;
    }

    // Purchase!
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

  const titlesList = REWARD_ITEMS.filter((i) => i.category === 'title');
  const avatarsList = REWARD_ITEMS.filter((i) => i.category === 'avatar');
  const certItem = REWARD_ITEMS.find((i) => i.category === 'certificate')!;

  const isCertUnlocked = unlocked.includes(certItem.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl border border-slate-200 dark:border-amber-500/40 bg-white dark:bg-slate-900/95 shadow-2xl overflow-hidden">
        {/* Header */}
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
          <div className="flex items-center gap-3">
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
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: TITLES */}
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

                        {item.reqStars && !isOwned && (
                          <div className="text-[11px] font-mono text-amber-700 dark:text-amber-400 mb-2 flex items-center gap-1">
                            <Lock className="h-3 w-3" />
                            <span>需累積滿 {item.reqStars} 顆星章 (目前: {stats.stars || 0})</span>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => handlePurchase(item)}
                        disabled={isEquipped || (!isOwned && (!canAfford || !hasReqStars))}
                        className={`w-full py-2.5 px-3 rounded-xl font-bold font-mono text-xs flex items-center justify-center gap-1.5 transition-all min-h-[40px] cursor-pointer disabled:cursor-not-allowed ${
                          isEquipped
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                            : isOwned
                            ? 'bg-sky-600 hover:bg-sky-500 text-white shadow-xs'
                            : canAfford && hasReqStars
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 hover:brightness-105 shadow-sm'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600'
                        }`}
                      >
                        {isEquipped ? (
                          <>
                            <Check className="h-4 w-4" />
                            <span>使用中</span>
                          </>
                        ) : isOwned ? (
                          <span>佩戴此稱號</span>
                        ) : canAfford && hasReqStars ? (
                          <>
                            <Sparkles className="h-4 w-4" />
                            <span>兌換稱號 ({item.costCrystals} 💎)</span>
                          </>
                        ) : (
                          <>
                            <Lock className="h-3.5 w-3.5" />
                            <span>未達解鎖條件</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: AVATARS */}
          {activeTab === 'avatars' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-sky-50/70 dark:bg-sky-950/20 border border-sky-200 dark:border-cyan-500/30 text-xs text-sky-800 dark:text-cyan-300 flex items-center justify-between">
                <span>解鎖具有香港地理與環境特色的專屬守護獸造型！</span>
                <span className="font-mono">點擊「更換頭像」立即展示</span>
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
                          ? 'border-sky-400 bg-sky-50/90 dark:bg-cyan-950/30 shadow-md ring-2 ring-sky-300'
                          : isOwned
                          ? 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-sky-300 shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 opacity-90'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-xl bg-sky-100 dark:bg-slate-800 flex items-center justify-center text-3xl shadow-xs">
                              {item.icon}
                            </div>
                            <div>
                              <h4 className="font-bold text-base text-slate-900 dark:text-white">
                                {item.name}
                              </h4>
                              <div className="text-[11px] text-sky-700 dark:text-cyan-400 font-mono">
                                守護造型代號
                              </div>
                            </div>
                          </div>

                          {isEquipped ? (
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-sky-500 text-white">
                              使用中
                            </span>
                          ) : isOwned ? (
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                              已擁有
                            </span>
                          ) : (
                            <div className="flex items-center gap-1 text-xs font-mono font-bold text-sky-600 dark:text-cyan-400">
                              <Gem className="h-3.5 w-3.5" />
                              <span>{item.costCrystals} 晶石</span>
                            </div>
                          )}
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>

                      <button
                        onClick={() => handlePurchase(item)}
                        disabled={isEquipped || (!isOwned && !canAfford)}
                        className={`w-full py-2.5 px-3 rounded-xl font-bold font-mono text-xs flex items-center justify-center gap-1.5 transition-all min-h-[40px] cursor-pointer disabled:cursor-not-allowed ${
                          isEquipped
                            ? 'bg-sky-100 text-sky-800 dark:bg-cyan-950/60 dark:text-cyan-300'
                            : isOwned
                            ? 'bg-sky-600 hover:bg-sky-500 text-white shadow-xs'
                            : canAfford
                            ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:brightness-105 shadow-sm'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600'
                        }`}
                      >
                        {isEquipped ? (
                          <>
                            <Check className="h-4 w-4" />
                            <span>目前頭像</span>
                          </>
                        ) : isOwned ? (
                          <span>套用此頭像</span>
                        ) : canAfford ? (
                          <>
                            <Sparkles className="h-4 w-4" />
                            <span>兌換造型 ({item.costCrystals} 💎)</span>
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

          {/* TAB 3: OFFICIAL CERTIFICATE */}
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
    </div>
  );
};
