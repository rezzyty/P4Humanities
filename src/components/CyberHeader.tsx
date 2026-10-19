import React, { useState } from 'react';
import { Volume2, VolumeX, Shield, Award, BookOpen, AlertTriangle, User, Zap, Smartphone, Monitor } from 'lucide-react';
import { UserStats } from '../types';
import { sound } from '../utils/audio';

interface CyberHeaderProps {
  stats: UserStats;
  onUpdateStats: (newStats: Partial<UserStats>) => void;
  onOpenNotes: () => void;
  onOpenWrongLog: () => void;
  onOpenBadges: () => void;
  onGoHome: () => void;
  currentTitle?: string;
  deviceMode: 'desktop' | 'mobile';
  onToggleDeviceMode: () => void;
}

const AVATARS = [
  { id: 'mecha_pilot', name: '機甲駕駛員', icon: '🤖', color: 'text-cyan-400' },
  { id: 'agent_neo', name: '賽博探員 NEO', icon: '🕶️', color: 'text-emerald-400' },
  { id: 'cyber_bot', name: '量子戰士 BOT', icon: '⚡', color: 'text-amber-400' },
  { id: 'cyber_hacker', name: '星際駭客 CODE', icon: '🛰️', color: 'text-purple-400' },
];

export const CyberHeader: React.FC<CyberHeaderProps> = ({
  stats,
  onUpdateStats,
  onOpenNotes,
  onOpenWrongLog,
  onOpenBadges,
  onGoHome,
  currentTitle,
  deviceMode,
  onToggleDeviceMode,
}) => {
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(stats.playerName);

  const currentAvatarObj = AVATARS.find((a) => a.id === stats.avatar) || AVATARS[0];

  // Calculate rank title
  const getRankTitle = (lvl: number) => {
    if (lvl >= 10) return '傳奇星際司令官';
    if (lvl >= 7) return '地球特級防衛專家';
    if (lvl >= 4) return '賽博資深守護者';
    if (lvl >= 2) return '前線特工學員';
    return '見習守護者';
  };

  const handleToggleSound = () => {
    const nextSound = !stats.soundEnabled;
    sound.setMuted(!nextSound);
    onUpdateStats({ soundEnabled: nextSound });
    if (nextSound) sound.playClick();
  };

  const handleSaveName = () => {
    if (tempName.trim()) {
      onUpdateStats({ playerName: tempName.trim() });
    }
    setIsEditingName(false);
  };

  return (
    <header className="relative z-30 border-b border-cyan-500/30 bg-slate-950/80 backdrop-blur-md px-4 py-3 text-slate-100 shadow-[0_4px_20px_rgba(6,182,212,0.15)]">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Home */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playClick();
              onGoHome();
            }}
            className="group flex items-center gap-2.5 text-left focus:outline-none"
          >
            <div className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-400 bg-cyan-950/60 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.4)] group-hover:scale-105 transition-transform">
              <Shield className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-semibold tracking-widest text-cyan-400 uppercase">
                  EARTH DEFENDER HQ
                </span>
                <span className="text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-1.5 py-0.2 rounded font-mono">
                  P4 常識
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                地球賽博防衛特訓戰
              </h1>
            </div>
          </button>

          {currentTitle && (
            <div className="hidden lg:flex items-center gap-2 ml-4 pl-4 border-l border-slate-700">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
              <span className="text-xs font-mono text-cyan-300 tracking-wide font-medium">
                {currentTitle}
              </span>
            </div>
          )}
        </div>

        {/* Player Profile & Stats */}
        <div className="flex items-center gap-3">
          {/* Avatar & Player Name */}
          <div className="relative">
            <button
              onClick={() => {
                sound.playClick();
                setShowAvatarPicker(!showAvatarPicker);
              }}
              className="flex items-center gap-2 rounded-lg border border-slate-700 hover:border-cyan-500/60 bg-slate-900/90 px-2.5 py-1.5 transition-all text-xs"
            >
              <span className="text-lg leading-none">{currentAvatarObj.icon}</span>
              <div className="text-left hidden sm:block">
                <div className="font-semibold text-slate-200 flex items-center gap-1">
                  {stats.playerName}
                  <span className="text-[10px] text-cyan-400 font-mono">Lv.{stats.level}</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  {getRankTitle(stats.level)}
                </div>
              </div>
            </button>

            {/* Avatar Dropdown */}
            {showAvatarPicker && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl border border-cyan-500/40 bg-slate-900/95 p-3 shadow-2xl backdrop-blur-xl z-50">
                <div className="text-xs font-mono text-cyan-400 mb-2 pb-1 border-b border-slate-800">
                  // 指揮官檔案設定
                </div>
                <div className="mb-3">
                  <label className="text-[11px] text-slate-400 block mb-1">代號 / 學生名字：</label>
                  {isEditingName ? (
                    <div className="flex gap-1">
                      <input
                        type="text"
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        className="w-full bg-slate-800 border border-cyan-500/50 rounded px-2 py-1 text-xs text-white focus:outline-none"
                        maxLength={12}
                      />
                      <button
                        onClick={handleSaveName}
                        className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs px-2 rounded"
                      >
                        儲存
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between bg-slate-800/60 px-2 py-1 rounded">
                      <span className="text-xs text-white font-medium">{stats.playerName}</span>
                      <button
                        onClick={() => {
                          setTempName(stats.playerName);
                          setIsEditingName(true);
                        }}
                        className="text-[10px] text-cyan-400 hover:underline"
                      >
                        修改
                      </button>
                    </div>
                  )}
                </div>

                <div className="text-[11px] text-slate-400 mb-1">選擇戰鬥機甲角色：</div>
                <div className="grid grid-cols-2 gap-1.5">
                  {AVATARS.map((av) => (
                    <button
                      key={av.id}
                      onClick={() => {
                        sound.playClick();
                        onUpdateStats({ avatar: av.id });
                        setShowAvatarPicker(false);
                      }}
                      className={`flex items-center gap-1.5 p-2 rounded-lg border text-left text-xs transition-colors ${
                        stats.avatar === av.id
                          ? 'border-cyan-400 bg-cyan-950/60 text-white'
                          : 'border-slate-800 bg-slate-800/40 hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <span className="text-base">{av.icon}</span>
                      <span className="text-[11px] truncate">{av.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* EXP & Energy */}
          <div className="hidden md:flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-lg text-xs font-mono">
            <Zap className="h-4 w-4 text-amber-400 fill-amber-400" />
            <div>
              <div className="flex justify-between gap-2 text-[10px] text-slate-400">
                <span>EXP</span>
                <span className="text-cyan-400">{stats.exp} pt</span>
              </div>
              <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-0.5">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400"
                  style={{ width: `${Math.min(100, (stats.exp % 100))}%` }}
                />
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-1.5">
            {/* Revision Notes Button */}
            <button
              onClick={() => {
                sound.playClick();
                onOpenNotes();
              }}
              title="作戰筆記 (課文重點複習)"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-cyan-500/40 bg-cyan-950/40 hover:bg-cyan-900/60 text-cyan-300 text-xs font-medium transition-all"
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
              className="relative flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-amber-500/40 bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 text-xs font-medium transition-all"
            >
              <AlertTriangle className="h-4 w-4" />
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
              className="p-1.5 rounded-lg border border-slate-700 bg-slate-900 hover:border-purple-500/50 hover:bg-purple-950/40 text-purple-300 transition-all"
            >
              <Award className="h-4 w-4" />
            </button>

            {/* Device Mode Toggle */}
            <button
              onClick={() => {
                sound.playClick();
                onToggleDeviceMode();
              }}
              title={deviceMode === 'desktop' ? '切換為手機裝置模式 (大字體與手機版面)' : '切換為桌面版模式'}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-all ${
                deviceMode === 'mobile'
                  ? 'border-cyan-400 bg-cyan-950/80 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                  : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-cyan-500/50'
              }`}
            >
              {deviceMode === 'mobile' ? <Smartphone className="h-4 w-4 text-cyan-400 animate-pulse" /> : <Monitor className="h-4 w-4" />}
              <span className="hidden sm:inline">{deviceMode === 'mobile' ? '手機版' : '桌面版'}</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={handleToggleSound}
              title={stats.soundEnabled ? '音效開啟中 (點擊靜音)' : '已靜音 (點擊開啟)'}
              className={`p-1.5 rounded-lg border transition-all ${
                stats.soundEnabled
                  ? 'border-cyan-500/50 bg-cyan-950/50 text-cyan-400'
                  : 'border-slate-800 bg-slate-900 text-slate-500'
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
