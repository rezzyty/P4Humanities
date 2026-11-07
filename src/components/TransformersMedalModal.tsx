import React, { useState } from 'react';
import { X, Shield, Zap, Sparkles, Star, Gem, CheckCircle2, Lock, ArrowRight, Award, Compass, Search, Filter } from 'lucide-react';
import { UserStats } from '../types';
import { TRANSFORMER_MEDALS, TransformerMedal, getMedalById } from '../data/transformerMedalsData';
import { sound } from '../utils/audio';

interface TransformersMedalModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: UserStats;
  onUpdateStats: (newPartial: Partial<UserStats>) => void;
}

export const TransformersMedalModal: React.FC<TransformersMedalModalProps> = ({
  isOpen,
  onClose,
  stats,
  onUpdateStats,
}) => {
  const [factionFilter, setFactionFilter] = useState<'all' | 'autobot' | 'decepticon'>('all');
  const [rarityFilter, setRarityFilter] = useState<'all' | 'SSR' | 'SR' | 'R'>('all');
  const [selectedMedal, setSelectedMedal] = useState<TransformerMedal | null>(null);

  if (!isOpen) return null;

  const unlocked = stats.unlockedMedals || ['bumblebee'];
  const activeMedalId = stats.activeMedalId || 'bumblebee';
  const activeMedal = getMedalById(activeMedalId) || TRANSFORMER_MEDALS[0];

  const handleEquipMedal = (medalId: string) => {
    sound.playCorrect();
    onUpdateStats({ activeMedalId: medalId });
  };

  const handleUnlockMedal = (medal: TransformerMedal) => {
    if (unlocked.includes(medal.id)) {
      handleEquipMedal(medal.id);
      return;
    }

    // Check if meets star requirement or crystal balance
    const meetsStars = (stats.stars || 0) >= medal.reqStars;
    const canAfford = (stats.crystals || 0) >= medal.costCrystals;

    if (!meetsStars && !canAfford) {
      sound.playWrong();
      return;
    }

    sound.playVictory();
    const newUnlocked = [...unlocked, medal.id];
    // Deduct crystals if paying with crystals
    const newCrystals = Math.max(0, (stats.crystals || 0) - medal.costCrystals);

    onUpdateStats({
      unlockedMedals: newUnlocked,
      activeMedalId: medal.id, // Auto-equip newly acquired medal
      crystals: newCrystals,
    });
  };

  const filteredMedals = TRANSFORMER_MEDALS.filter((m) => {
    if (factionFilter !== 'all' && m.faction !== factionFilter) return false;
    if (rarityFilter !== 'all' && m.rarity !== rarityFilter) return false;
    return true;
  });

  const autobotCount = TRANSFORMER_MEDALS.filter((m) => m.faction === 'autobot').length;
  const decepticonCount = TRANSFORMER_MEDALS.filter((m) => m.faction === 'decepticon').length;
  const collectedCount = TRANSFORMER_MEDALS.filter((m) => unlocked.includes(m.id)).length;
  const collectionPercentage = Math.round((collectedCount / TRANSFORMER_MEDALS.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/70 dark:bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-5xl max-h-[94vh] flex flex-col rounded-3xl border border-sky-300/80 dark:border-cyan-500/40 bg-white dark:bg-slate-900/95 shadow-2xl overflow-hidden">
        
        {/* Top Cybertoronian Cyber Header */}
        <div className="flex flex-wrap items-center justify-between border-b border-sky-200/90 dark:border-slate-800 px-6 py-4 bg-gradient-to-r from-sky-50 via-white to-blue-50/70 dark:from-slate-950 dark:via-slate-900 dark:to-cyan-950/40 gap-3">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-red-500 to-blue-600 text-white shadow-md border border-white/40">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold tracking-wider text-sky-600 dark:text-cyan-400 flex items-center gap-1.5">
                <span>TRANSFORMERS CYBERTRON SANCTUARY</span>
                <span className="text-[10px] bg-sky-100 text-sky-800 dark:bg-cyan-900/60 dark:text-cyan-300 px-2 py-0.2 rounded-md font-mono">
                  24 傳奇金剛
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>變形金剛塞伯坦勳章榮譽館</span>
              </h2>
            </div>
          </div>

          {/* Quick Wallet & Close */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-100/80 dark:bg-slate-800 border border-sky-300 dark:border-cyan-500/40 text-xs font-mono font-bold text-sky-800 dark:text-cyan-300">
              <Gem className="h-4 w-4 text-sky-500" />
              <span>{stats.crystals || 0} 晶石</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100/80 dark:bg-slate-800 border border-amber-300 dark:border-amber-500/40 text-xs font-mono font-bold text-amber-800 dark:text-amber-300">
              <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
              <span>{stats.stars || 0}★ 星章</span>
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

        {/* Current Equipped Companion Banner */}
        <div className="px-6 py-3.5 bg-gradient-to-r from-sky-500/10 via-blue-500/10 to-purple-500/10 border-b border-sky-200 dark:border-cyan-500/20 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className={`h-12 w-12 rounded-2xl bg-gradient-to-tr ${activeMedal.color} flex items-center justify-center text-2xl shadow-md text-white border-2 border-white dark:border-slate-800`}>
                {activeMedal.icon}
              </div>
              <span className="absolute -bottom-1 -right-1 text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-md bg-slate-900 text-white border border-sky-300">
                {activeMedal.rarity}
              </span>
            </div>
            <div>
              <div className="text-[11px] font-mono text-sky-700 dark:text-cyan-400 font-bold flex items-center gap-1.5">
                <span>⭐ 目前出戰守護金剛：</span>
                <span className="text-slate-500 font-normal">（將展示於個人檔案與金色證書）</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-slate-900 dark:text-white">
                  {activeMedal.name}
                </span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                  activeMedal.faction === 'autobot'
                    ? 'bg-red-100 text-red-800 border border-red-300 dark:bg-red-950 dark:text-red-300 dark:border-red-500/40'
                    : 'bg-purple-100 text-purple-800 border border-purple-300 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-500/40'
                }`}>
                  {activeMedal.faction === 'autobot' ? '🛡️ 博派主力' : '⚡ 狂派霸主'}
                </span>
                <span className="text-xs text-slate-600 dark:text-slate-400 hidden sm:inline">
                  {activeMedal.role}
                </span>
              </div>
            </div>
          </div>

          {/* Collection Progress Bar */}
          <div className="w-full sm:w-64">
            <div className="flex items-center justify-between text-xs font-mono mb-1.5">
              <span className="text-slate-600 dark:text-slate-400 font-semibold">金剛圖鑑收集進度</span>
              <span className="font-bold text-sky-600 dark:text-cyan-400">
                {collectedCount} / {TRANSFORMER_MEDALS.length} ({collectionPercentage}%)
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-sky-500 via-blue-500 to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${collectionPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Filter Navigation Bar */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => {
                sound.playClick();
                setFactionFilter('all');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer min-h-[36px] ${
                factionFilter === 'all'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 border border-slate-200 dark:border-slate-700'
              }`}
            >
              全部陣營 (24)
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setFactionFilter('autobot');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer min-h-[36px] flex items-center gap-1.5 ${
                factionFilter === 'autobot'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-red-600 dark:text-red-400 hover:bg-red-50 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <span>🛡️ 博派 Autobots</span>
              <span className="text-[10px] bg-red-100 text-red-800 dark:bg-red-950/80 dark:text-red-300 px-1.5 py-0.2 rounded-full">
                {autobotCount}
              </span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setFactionFilter('decepticon');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer min-h-[36px] flex items-center gap-1.5 ${
                factionFilter === 'decepticon'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 hover:bg-purple-50 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <span>⚡ 狂派 Decepticons</span>
              <span className="text-[10px] bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 px-1.5 py-0.2 rounded-full">
                {decepticonCount}
              </span>
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400 hidden sm:inline">稀有度：</span>
            {(['all', 'SSR', 'SR', 'R'] as const).map((r) => (
              <button
                key={r}
                onClick={() => {
                  sound.playClick();
                  setRarityFilter(r);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold cursor-pointer transition-all ${
                  rarityFilter === r
                    ? 'bg-slate-900 text-white dark:bg-cyan-500 dark:text-slate-950 shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {r === 'all' ? '全部' : r}
              </button>
            ))}
          </div>
        </div>

        {/* Medals Grid Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMedals.map((medal) => {
              const isOwned = unlocked.includes(medal.id);
              const isEquipped = activeMedalId === medal.id;
              const canAfford = (stats.crystals || 0) >= medal.costCrystals;
              const hasStars = (stats.stars || 0) >= medal.reqStars;

              return (
                <div
                  key={medal.id}
                  onClick={() => setSelectedMedal(medal)}
                  className={`relative rounded-2xl border-2 p-4 transition-all duration-200 flex flex-col justify-between cursor-pointer group ${
                    isEquipped
                      ? 'border-sky-500 bg-gradient-to-b from-sky-50 to-white dark:from-cyan-950/40 dark:to-slate-900 shadow-md ring-2 ring-sky-400/50'
                      : isOwned
                      ? 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-sky-400 dark:hover:border-cyan-400 shadow-xs'
                      : 'border-slate-200/80 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-950/40 opacity-90 hover:opacity-100'
                  }`}
                >
                  {/* Faction & Rarity Header */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                          medal.faction === 'autobot'
                            ? 'bg-red-100 text-red-700 border border-red-300 dark:bg-red-950/80 dark:text-red-300 dark:border-red-500/40'
                            : 'bg-purple-100 text-purple-700 border border-purple-300 dark:bg-purple-950/80 dark:text-purple-300 dark:border-purple-500/40'
                        }`}>
                          {medal.faction === 'autobot' ? '🛡️ 博派' : '⚡ 狂派'}
                        </span>
                        <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded-md bg-slate-900 text-amber-300 border border-amber-400/50">
                          {medal.rarity}
                        </span>
                      </div>

                      {isEquipped ? (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-sky-600 text-white animate-pulse">
                          出戰中
                        </span>
                      ) : isOwned ? (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-500/40">
                          已收藏
                        </span>
                      ) : (
                        <div className="flex items-center gap-1 text-xs font-mono font-bold text-sky-600 dark:text-cyan-400">
                          <Gem className="h-3.5 w-3.5" />
                          <span>{medal.costCrystals} 晶石</span>
                        </div>
                      )}
                    </div>

                    {/* Main Character Identity */}
                    <div className="flex items-start gap-3.5 mb-3">
                      <div className={`h-14 w-14 rounded-2xl bg-gradient-to-tr ${medal.color} flex items-center justify-center text-3xl shadow-md text-white flex-shrink-0 group-hover:scale-105 transition-transform`}>
                        {medal.icon}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="font-extrabold text-base text-slate-900 dark:text-white tracking-tight truncate flex items-center gap-1.5">
                          <span>{medal.name}</span>
                        </h3>
                        <div className="text-xs text-sky-700 dark:text-cyan-400 font-semibold truncate">
                          {medal.role}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate mt-0.5">
                          載具：{medal.altMode}
                        </div>
                      </div>
                    </div>

                    {/* Character Motto Box */}
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800 text-[11px] text-slate-700 dark:text-slate-300 italic mb-3 line-clamp-2 leading-relaxed">
                      {medal.motto}
                    </div>

                    {/* Bonus Effect */}
                    <div className="p-2 rounded-xl bg-sky-50/70 dark:bg-cyan-950/20 border border-sky-200/70 dark:border-cyan-500/20 text-[11px] text-sky-900 dark:text-cyan-300 mb-3 flex items-start gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-sky-600 dark:text-cyan-400 flex-shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{medal.bonusEffect}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div>
                    {isEquipped ? (
                      <div className="w-full py-2 px-3 rounded-xl bg-sky-600 text-white font-bold font-mono text-xs flex items-center justify-center gap-1.5 shadow-sm">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>守護代表出戰中</span>
                      </div>
                    ) : isOwned ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEquipMedal(medal.id);
                        }}
                        className="w-full py-2 px-3 rounded-xl bg-sky-50 hover:bg-sky-600 text-sky-700 hover:text-white border border-sky-300 hover:border-transparent dark:bg-slate-800 dark:text-cyan-300 dark:hover:bg-cyan-500 dark:hover:text-slate-950 font-bold font-mono text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer min-h-[38px]"
                      >
                        <Shield className="h-3.5 w-3.5" />
                        <span>配備為守護金剛</span>
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUnlockMedal(medal);
                        }}
                        className={`w-full py-2 px-3 rounded-xl font-bold font-mono text-xs flex items-center justify-center gap-1.5 transition-all min-h-[38px] cursor-pointer ${
                          canAfford || hasStars
                            ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm font-black'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 opacity-80'
                        }`}
                      >
                        {canAfford || hasStars ? (
                          <>
                            <Gem className="h-3.5 w-3.5" />
                            <span>解鎖此勳章 ({medal.costCrystals} 晶石)</span>
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

        {/* Footer */}
        <div className="border-t border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-950/70 px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-600 dark:text-slate-400">
          <div>
            💡 提示：點擊任何變形金剛卡片可開啟「塞伯坦全息數據檔案 (Tech Specs)」，查閱戰力雷達與詳細背景。
          </div>
          <div className="text-sky-700 dark:text-cyan-300 font-bold">
            完成更多單元測驗與冒險征途，即可免費收集全套 24 款變形金剛！
          </div>
        </div>
      </div>

      {/* Datapad Tech Specs Inspector Modal */}
      {selectedMedal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg rounded-3xl border-2 border-sky-400 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden p-6 text-slate-900 dark:text-white">
            <button
              onClick={() => setSelectedMedal(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Character Header */}
            <div className="flex items-center gap-4 mb-4">
              <div className={`h-16 w-16 rounded-2xl bg-gradient-to-tr ${selectedMedal.color} flex items-center justify-center text-4xl shadow-lg text-white border-2 border-white`}>
                {selectedMedal.icon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                    selectedMedal.faction === 'autobot'
                      ? 'bg-red-100 text-red-800 border border-red-300 dark:bg-red-950 dark:text-red-300'
                      : 'bg-purple-100 text-purple-800 border border-purple-300 dark:bg-purple-950 dark:text-purple-300'
                  }`}>
                    {selectedMedal.faction === 'autobot' ? '🛡️ 博派主力' : '⚡ 狂派陣營'}
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-900 text-amber-300">
                    {selectedMedal.rarity}
                  </span>
                </div>
                <h3 className="text-2xl font-black tracking-tight mt-1">
                  {selectedMedal.name}
                </h3>
                <div className="text-xs font-semibold text-sky-600 dark:text-cyan-400">
                  {selectedMedal.role}
                </div>
              </div>
            </div>

            {/* Description & Motto */}
            <div className="space-y-3 mb-5 text-xs">
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {selectedMedal.description}
              </p>

              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 italic border-l-4 border-sky-500">
                {selectedMedal.motto}
              </div>

              <div className="p-3 rounded-xl bg-sky-50 dark:bg-cyan-950/40 border border-sky-200 dark:border-cyan-500/40 text-sky-900 dark:text-cyan-200">
                <div className="font-bold mb-1 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-sky-600 dark:text-cyan-400" />
                  <span>守護者作戰特技加成：</span>
                </div>
                <div>{selectedMedal.bonusEffect}</div>
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
                  { label: '力量 Strength', val: selectedMedal.specs.strength, color: 'bg-red-500' },
                  { label: '智力 Intelligence', val: selectedMedal.specs.intelligence, color: 'bg-blue-500' },
                  { label: '速度 Speed', val: selectedMedal.specs.speed, color: 'bg-amber-500' },
                  { label: '耐力 Endurance', val: selectedMedal.specs.endurance, color: 'bg-emerald-500' },
                  { label: '勇氣 Courage', val: selectedMedal.specs.courage, color: 'bg-purple-500' },
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
              {unlocked.includes(selectedMedal.id) ? (
                <button
                  onClick={() => {
                    handleEquipMedal(selectedMedal.id);
                    setSelectedMedal(null);
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold font-mono text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Shield className="h-4 w-4" />
                  <span>配備為當前出戰守護金剛</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    handleUnlockMedal(selectedMedal);
                    setSelectedMedal(null);
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black font-mono text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Gem className="h-4 w-4" />
                  <span>立即解鎖此勳章 ({selectedMedal.costCrystals} 晶石)</span>
                </button>
              )}

              <button
                onClick={() => setSelectedMedal(null)}
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
