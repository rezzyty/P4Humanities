import React, { useState } from 'react';
import { X, UserCheck, Shield, Zap, Star, Gem, AlertTriangle, CheckCircle2, Edit3, ArrowRight } from 'lucide-react';
import { AccountId, UserStats } from '../types';
import { ACCOUNTS_CONFIG, AccountMetadata } from '../utils/accountManager';
import { getMedalById } from '../data/transformerMedalsData';
import { sound } from '../utils/audio';

interface AccountSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: Record<AccountId, UserStats>;
  activeAccountId: AccountId;
  onSwitchAccount: (id: AccountId) => void;
  onUpdateActiveAccountName: (newName: string) => void;
}

export const AccountSwitcherModal: React.FC<AccountSwitcherModalProps> = ({
  isOpen,
  onClose,
  accounts,
  activeAccountId,
  onSwitchAccount,
  onUpdateActiveAccountName,
}) => {
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState('');

  if (!isOpen) return null;

  const activeStats = accounts[activeAccountId];
  const accountList: AccountId[] = ['jayden', 'melaine', 'others'];

  const handleStartEdit = () => {
    setTempName(activeStats.playerName);
    setEditingName(true);
  };

  const handleSaveName = () => {
    if (tempName.trim()) {
      sound.playClick();
      onUpdateActiveAccountName(tempName.trim());
    }
    setEditingName(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-3xl border border-slate-200 dark:border-sky-500/40 bg-white dark:bg-slate-900/95 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-6 py-5 bg-slate-50/90 dark:bg-slate-950/70">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-sky-100 dark:bg-cyan-950 border border-sky-300 dark:border-cyan-500/50 text-sky-700 dark:text-cyan-400">
              <UserCheck className="h-6 w-6" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold tracking-wider text-sky-600 dark:text-cyan-400">
                // STUDENT PROFILE MULTI-USER SYSTEM
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>特訓指揮官帳號切換中心</span>
                <span className="text-xs bg-sky-100 dark:bg-cyan-950 text-sky-800 dark:text-cyan-300 border border-sky-300 dark:border-cyan-500/50 px-2.5 py-0.5 rounded-full font-mono font-bold">
                  3 位獨立學員
                </span>
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-400 transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center shadow-xs"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Notice Banner */}
        <div className="bg-sky-50 dark:bg-sky-950/40 border-b border-sky-200 dark:border-cyan-500/30 px-6 py-2.5 text-xs text-sky-800 dark:text-cyan-200 flex items-center gap-2">
          <Shield className="h-4 w-4 text-sky-600 dark:text-cyan-400 flex-shrink-0" />
          <span>
            每位學員具備<strong>完全獨立的錯題庫、作答記錄、冒險征途進度與星石獎勵</strong>，隨時切換不干擾！
          </span>
        </div>

        {/* Body: 3 Accounts Grid */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {accountList.map((accId) => {
              const cfg = ACCOUNTS_CONFIG[accId];
              const userStat = accounts[accId];
              const isActive = accId === activeAccountId;
              const equippedMedal = getMedalById(userStat.activeMedalId || (accId === 'jayden' ? 'jazz' : accId === 'melaine' ? 'arcee' : 'bumblebee'));

              return (
                <div
                  key={accId}
                  onClick={() => {
                    if (!isActive) {
                      sound.playVictory();
                      onSwitchAccount(accId);
                    }
                  }}
                  className={`p-5 rounded-2xl border-2 transition-all flex flex-col justify-between cursor-pointer relative overflow-hidden ${
                    isActive
                      ? 'border-sky-500 bg-gradient-to-b from-sky-50/90 to-white dark:from-cyan-950/40 dark:to-slate-900 shadow-lg ring-2 ring-sky-300 dark:ring-cyan-500/40'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 hover:border-sky-300 hover:bg-white dark:hover:bg-slate-900/80 shadow-xs'
                  }`}
                >
                  {/* Active Ribbon */}
                  {isActive && (
                    <div className="absolute top-0 right-0 bg-sky-500 text-white text-[10px] font-mono font-bold px-3 py-0.5 rounded-bl-xl shadow-xs">
                      目前登入中
                    </div>
                  )}

                  <div>
                    {/* Avatar & Name Header */}
                    <div className="flex items-center gap-3.5 mb-3.5">
                      <div className={`h-14 w-14 rounded-2xl bg-gradient-to-tr ${cfg.themeColor} flex items-center justify-center text-3xl shadow-md flex-shrink-0 text-white`}>
                        {accId === 'jayden' ? '🚀' : accId === 'melaine' ? '🌸' : '⚡'}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-extrabold text-lg sm:text-xl text-slate-900 dark:text-white tracking-tight truncate flex items-center gap-2">
                            <span>
                              {accId === 'jayden'
                                ? (!userStat.playerName || userStat.playerName === 'CYBER-P4' ? 'Jayden' : userStat.playerName)
                                : userStat.playerName}
                            </span>
                          </h3>
                        </div>
                        <div className="text-xs font-mono font-semibold text-sky-700 dark:text-cyan-400">
                          {cfg.badge}
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-slate-600 dark:text-slate-400 mb-4 line-clamp-2 leading-relaxed">
                      {cfg.desc}
                    </div>

                    {/* Stats Pill Matrix */}
                    <div className="space-y-2 text-xs font-mono mb-4">
                      <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                        <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <Zap className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                          <span>等級 / EXP</span>
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          Lv.{userStat.level} ({userStat.exp} pt)
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                        <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                          <span>守護者星章</span>
                        </span>
                        <span className="font-bold text-amber-600 dark:text-amber-400">
                          {userStat.stars || 0} ★
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                        <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <Gem className="h-3.5 w-3.5 text-cyan-500" />
                          <span>地球能量晶石</span>
                        </span>
                        <span className="font-bold text-sky-600 dark:text-cyan-400">
                          {userStat.crystals || 0} 💎
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                        <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <span className="text-xs">{equippedMedal?.icon || '🤖'}</span>
                          <span>金剛勳章</span>
                        </span>
                        <span className="font-bold text-red-600 dark:text-red-400">
                          {equippedMedal?.name.split(' ')[0] || '金剛'} ({(userStat.unlockedMedals || []).length}/24)
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                        <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <AlertTriangle className="h-3.5 w-3.5 text-rose-500" />
                          <span>錯題待復習</span>
                        </span>
                        <span className={`font-bold ${userStat.wrongQuestions.length > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                          {userStat.wrongQuestions.length} 題
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Switch or Active Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isActive) {
                        sound.playVictory();
                        onSwitchAccount(accId);
                      }
                    }}
                    className={`w-full py-2.5 px-3 rounded-xl font-bold font-mono text-xs flex items-center justify-center gap-1.5 transition-all min-h-[42px] cursor-pointer ${
                      isActive
                        ? 'bg-sky-600 text-white shadow-sm'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-sky-500 hover:text-white'
                    }`}
                  >
                    {isActive ? (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        <span>正在使用中</span>
                      </>
                    ) : (
                      <>
                        <span>切換至此帳號</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Active Profile Rename Drawer */}
          <div className="mt-6 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xs font-mono text-slate-500 dark:text-slate-400">目前活躍帳號自訂：</div>
              <div className="text-sm font-bold text-slate-800 dark:text-white">
                {activeStats.playerName}（{activeStats.title}）
              </div>
            </div>

            {editingName ? (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  placeholder="輸入學生姓名..."
                  maxLength={12}
                  className="px-3 py-1.5 text-xs rounded-xl border border-sky-400 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none min-h-[38px]"
                />
                <button
                  onClick={handleSaveName}
                  className="px-4 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold font-mono min-h-[38px] cursor-pointer"
                >
                  確認修改
                </button>
                <button
                  onClick={() => setEditingName(false)}
                  className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs min-h-[38px] cursor-pointer"
                >
                  取消
                </button>
              </div>
            ) : (
              <button
                onClick={handleStartEdit}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-sky-400 text-slate-700 dark:text-slate-200 text-xs font-semibold cursor-pointer shadow-xs min-h-[38px]"
              >
                <Edit3 className="h-3.5 w-3.5 text-sky-600 dark:text-cyan-400" />
                <span>修改本帳號顯示名稱</span>
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 dark:border-slate-800 px-6 py-4 bg-slate-50/90 dark:bg-slate-950/80 flex justify-end">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold font-mono text-sm transition-colors cursor-pointer min-h-[44px]"
          >
            完成並返回 (CONFIRM)
          </button>
        </div>
      </div>
    </div>
  );
};
