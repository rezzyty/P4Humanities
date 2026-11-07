import React, { useState } from 'react';
import { Volume2, VolumeX, Shield, Award, BookOpen, AlertTriangle, User, Zap, Smartphone, Monitor, Tablet, Sun, Moon, Gem, Star, Gift, Compass, Users } from 'lucide-react';
import { UserStats, DeviceMode, ThemeMode, MainNavMode, AccountId } from '../types';
import { ACCOUNTS_CONFIG } from '../utils/accountManager';
import { getMedalById } from '../data/transformerMedalsData';
import { sound } from '../utils/audio';

interface CyberHeaderProps {
  stats: UserStats;
  onUpdateStats: (newStats: Partial<UserStats>) => void;
  onOpenNotes: () => void;
  onOpenWrongLog: () => void;
  onOpenBadges: () => void;
  onOpenAccountSwitcher: () => void;
  onOpenRewardCenter: () => void;
  onOpenMedals: () => void;
  onGoHome: () => void;
  mainNavMode: MainNavMode;
  onChangeMainNavMode: (mode: MainNavMode) => void;
  currentTitle?: string;
  deviceMode: DeviceMode;
  onChangeDeviceMode: (mode: DeviceMode) => void;
  themeMode: ThemeMode;
  onToggleTheme: () => void;
}

const AVATARS = [
  { id: 'mecha_pilot', name: '機甲特工 (Jayden)', icon: '🤖', color: 'text-cyan-400' },
  { id: 'agent_neo', name: '智慧領航員 (Melaine)', icon: '🌸', color: 'text-rose-400' },
  { id: 'cyber_bot', name: '見習探險員 (Others)', icon: '⚡', color: 'text-amber-400' },
  { id: 'cyber_hacker', name: '星際駭客 CODE', icon: '🛰️', color: 'text-purple-400' },
  { id: 'avatar_dolphin', name: '中華白海豚領航員', icon: '🐬', color: 'text-cyan-400' },
  { id: 'avatar_lion', name: '獅子山守護神', icon: '🦁', color: 'text-amber-500' },
  { id: 'avatar_space', name: '天宮空間站特工', icon: '🛰️', color: 'text-blue-400' },
  { id: 'avatar_volcano', name: '烈火地質學者', icon: '🌋', color: 'text-red-500' },
  { id: 'avatar_panda', name: '國寶生態使者', icon: '🐼', color: 'text-emerald-500' },
];

export const CyberHeader: React.FC<CyberHeaderProps> = ({
  stats,
  onUpdateStats,
  onOpenNotes,
  onOpenWrongLog,
  onOpenBadges,
  onOpenAccountSwitcher,
  onOpenRewardCenter,
  onOpenMedals,
  onGoHome,
  mainNavMode,
  onChangeMainNavMode,
  currentTitle,
  deviceMode,
  onChangeDeviceMode,
  themeMode,
  onToggleTheme,
}) => {
  const currentAvatarObj = AVATARS.find((a) => a.id === stats.avatar) || AVATARS[0];
  const accountCfg = ACCOUNTS_CONFIG[stats.accountId || 'jayden'] || ACCOUNTS_CONFIG.jayden;
  const activeMedal = getMedalById(stats.activeMedalId || 'bumblebee');
  const unlockedMedalsCount = (stats.unlockedMedals || ['bumblebee']).length;

  const handleToggleSound = () => {
    const nextSound = !stats.soundEnabled;
    sound.setMuted(!nextSound);
    onUpdateStats({ soundEnabled: nextSound });
    if (nextSound) sound.playClick();
  };

  const handleCycleDeviceMode = () => {
    sound.playClick();
    if (deviceMode === 'desktop') onChangeDeviceMode('ipad');
    else if (deviceMode === 'ipad') onChangeDeviceMode('mobile');
    else onChangeDeviceMode('desktop');
  };

  return (
    <header className="relative z-30 border-b border-sky-200/90 bg-white/95 text-slate-800 shadow-[0_2px_15px_rgba(14,165,233,0.08)] backdrop-blur-md px-4 py-3 dark:border-cyan-500/30 dark:bg-slate-950/80 dark:text-slate-100 dark:shadow-[0_4px_20px_rgba(6,182,212,0.15)]">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Home */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playClick();
              onGoHome();
            }}
            className="group flex items-center gap-2.5 text-left focus:outline-none cursor-pointer"
          >
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-sky-400 bg-sky-50 text-sky-600 shadow-[0_0_12px_rgba(14,165,233,0.3)] group-hover:scale-105 transition-transform dark:border-cyan-400 dark:bg-cyan-950/60 dark:text-cyan-400">
              <Shield className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold tracking-widest text-sky-600 uppercase dark:text-cyan-400">
                  EARTH DEFENDER HQ
                </span>
                <span className="text-[10px] bg-sky-100 text-sky-700 border border-sky-300 px-1.5 py-0.2 rounded font-mono font-medium dark:bg-cyan-500/20 dark:text-cyan-300 dark:border-cyan-500/40">
                  P4 常識
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 group-hover:text-sky-600 transition-colors dark:text-white dark:group-hover:text-cyan-300">
                地球賽博防衛特訓戰
              </h1>
            </div>
          </button>

          {currentTitle && (
            <div className="hidden lg:flex items-center gap-2 ml-4 pl-4 border-l border-slate-200 dark:border-slate-700">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-500 animate-pulse dark:bg-cyan-400"></span>
              <span className="text-xs font-mono text-sky-700 tracking-wide font-semibold dark:text-cyan-300">
                {currentTitle}
              </span>
            </div>
          )}
        </div>

        {/* Center / Navigation Mode Switcher Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <button
            onClick={() => {
              sound.playClick();
              onChangeMainNavMode('exercise');
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer min-h-[36px] ${
              mainNavMode === 'exercise'
                ? 'bg-white dark:bg-slate-800 text-sky-700 dark:text-cyan-300 shadow-sm border border-slate-200/80 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BookOpen className="h-4 w-4 text-sky-500" />
            <span>自由特訓</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onChangeMainNavMode('journey');
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer min-h-[36px] ${
              mainNavMode === 'journey'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-sm font-black'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Compass className="h-4 w-4" />
            <span>冒險征途</span>
            <span className="px-1.5 py-0.2 rounded-full bg-amber-400/30 text-[9px] font-mono font-bold">
              5大關卡
            </span>
          </button>
        </div>

        {/* Player Profile & Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          {/* Active Student Account Switcher Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenAccountSwitcher();
            }}
            title="點擊切換學員帳號（Jayden / Melaine / 其他學員）"
            className="flex items-center gap-2.5 rounded-2xl border border-sky-300 hover:border-sky-500 bg-sky-50/80 hover:bg-sky-100/90 dark:border-cyan-500/40 dark:bg-cyan-950/40 dark:hover:bg-cyan-900/60 px-3 py-1.5 transition-all text-xs cursor-pointer shadow-xs min-h-[40px]"
          >
            <span className="text-xl leading-none">{currentAvatarObj.icon}</span>
            <div className="text-left">
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-xs sm:text-sm">
                <span>{stats.playerName}</span>
                <span className="text-[10px] text-sky-700 dark:text-cyan-300 font-mono font-bold bg-sky-200/70 dark:bg-cyan-900/80 px-1.5 py-0.2 rounded-md">
                  Lv.{stats.level}
                </span>
              </div>
              <div className="text-[10px] text-sky-800 dark:text-cyan-400 font-mono font-medium flex items-center gap-1">
                <span>{accountCfg.badge}</span>
                <span className="text-slate-400">|</span>
                <span className="underline decoration-dotted">切換學員</span>
              </div>
            </div>
          </button>

          {/* Currency / Reward Hub Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenRewardCenter();
            }}
            title="守護者榮譽獎勵兌換所 (點擊開啟)"
            className="flex items-center gap-2 px-3 py-1.5 rounded-2xl border border-amber-300 hover:border-amber-500 bg-amber-50 hover:bg-amber-100 dark:border-amber-500/40 dark:bg-amber-950/40 text-xs font-mono font-bold text-amber-900 dark:text-amber-300 transition-all cursor-pointer shadow-xs min-h-[40px]"
          >
            <Gift className="h-4 w-4 text-amber-600 dark:text-amber-400 animate-pulse" />
            <div className="hidden sm:flex items-center gap-2 text-xs">
              <span className="flex items-center gap-0.5 text-sky-700 dark:text-cyan-300">
                <Gem className="h-3.5 w-3.5 text-sky-500" />
                <span>{stats.crystals || 0}</span>
              </span>
              <span className="flex items-center gap-0.5 text-amber-700 dark:text-amber-400">
                <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                <span>{stats.stars || 0}★</span>
              </span>
            </div>
            <span className="text-[11px] font-sans font-bold bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded-md">
              獎勵所
            </span>
          </button>

          {/* Transformers Medals Hub Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenMedals();
            }}
            title="變形金剛塞伯坦勳章榮譽館（點擊開啟，包含雅詩、爵士等 24 款全系列）"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border border-red-300 hover:border-red-500 bg-red-50/90 hover:bg-red-100 dark:border-red-500/40 dark:bg-red-950/40 text-xs font-mono font-bold text-red-900 dark:text-red-300 transition-all cursor-pointer shadow-xs min-h-[40px]"
          >
            <span className="text-base leading-none">{activeMedal?.icon || '🤖'}</span>
            <div className="hidden sm:block text-left leading-tight">
              <div className="text-[10px] text-red-600 dark:text-red-400 font-bold truncate max-w-[85px]">
                {activeMedal?.characterEn || 'Transformer'}
              </div>
              <div className="text-[11px] font-sans font-bold text-slate-800 dark:text-white truncate max-w-[85px]">
                {activeMedal?.name.split(' ')[0] || '金剛勳章'}
              </div>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-red-600 text-white font-black">
              🏅 {unlockedMedalsCount}/24
            </span>
          </button>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-1.5">
            {/* Revision Notes Button */}
            <button
              onClick={() => {
                sound.playClick();
                onOpenNotes();
              }}
              title="温習筆記 (課文重點快速複習)"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-sky-300 bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-medium transition-all cursor-pointer dark:border-cyan-500/40 dark:bg-cyan-950/40 dark:text-cyan-300 dark:hover:bg-cyan-900/60"
            >
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">温習筆記</span>
            </button>

            {/* Wrong Questions Log */}
            <button
              onClick={() => {
                sound.playClick();
                onOpenWrongLog();
              }}
              title="錯題終端"
              className="relative flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-medium transition-all cursor-pointer dark:border-amber-500/40 dark:bg-amber-950/40 dark:text-amber-300"
            >
              <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <span className="hidden sm:inline">錯題庫</span>
              {stats.wrongQuestions.length > 0 && (
                <span className="flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-rose-500 text-[10px] text-white font-bold font-mono">
                  {stats.wrongQuestions.length}
                </span>
              )}
            </button>

            {/* Badges */}
            <button
              onClick={() => {
                sound.playClick();
                onOpenBadges();
              }}
              title="榮譽勳章"
              className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:border-purple-400 hover:bg-purple-50 text-purple-600 transition-all cursor-pointer dark:border-slate-700 dark:bg-slate-900 dark:text-purple-300 dark:hover:bg-purple-950/40"
            >
              <Award className="h-4 w-4" />
            </button>

            {/* Viewport / Device Mode Toggle */}
            <button
              onClick={handleCycleDeviceMode}
              title={`目前：${deviceMode === 'desktop' ? '桌面模式' : deviceMode === 'ipad' ? 'iPad 13" 觸控大字體模式' : '手機模式'} (點擊切換)`}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono font-medium transition-all cursor-pointer ${
                deviceMode === 'ipad'
                  ? 'border-sky-500 bg-sky-500 text-white shadow-md'
                  : deviceMode === 'mobile'
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-sky-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
              }`}
            >
              {deviceMode === 'ipad' ? (
                <>
                  <Tablet className="h-4 w-4 text-white" />
                  <span className="font-bold">iPad 13"</span>
                </>
              ) : deviceMode === 'mobile' ? (
                <>
                  <Smartphone className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="hidden sm:inline">手機版</span>
                </>
              ) : (
                <>
                  <Monitor className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                  <span className="hidden sm:inline">桌面版</span>
                </>
              )}
            </button>

            {/* Bright / Dark Theme Toggle */}
            <button
              onClick={() => {
                sound.playClick();
                onToggleTheme();
              }}
              title={themeMode === 'bright' ? '目前為明亮模式（點擊切換為夜間暗黑模式）' : '目前為暗黑模式（點擊切換為明亮日光模式）'}
              className="flex items-center gap-1 p-1.5 px-2 rounded-lg border border-slate-200 bg-white hover:border-amber-400 hover:bg-amber-50 text-slate-700 transition-all cursor-pointer dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-amber-400"
            >
              {themeMode === 'bright' ? (
                <>
                  <Sun className="h-4 w-4 text-amber-500 fill-amber-400" />
                  <span className="text-[11px] font-mono hidden md:inline text-amber-700 font-semibold">明亮</span>
                </>
              ) : (
                <>
                  <Moon className="h-4 w-4 text-cyan-400 fill-cyan-400" />
                  <span className="text-[11px] font-mono hidden md:inline text-cyan-300 font-semibold">暗黑</span>
                </>
              )}
            </button>

            {/* Sound Toggle */}
            <button
              onClick={handleToggleSound}
              title={stats.soundEnabled ? '音效開啟中 (點擊靜音)' : '已靜音 (點擊開啟)'}
              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                stats.soundEnabled
                  ? 'border-sky-300 bg-sky-50 text-sky-600 dark:border-cyan-500/50 dark:bg-cyan-950/50 dark:text-cyan-400'
                  : 'border-slate-200 bg-slate-100 text-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-500'
              }`}
            >
              {stats.soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
