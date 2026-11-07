import React, { useState, useEffect } from 'react';
import { UserStats, ChapterNumber, ExerciseCategory, DeviceMode, ThemeMode, AccountId, MainNavMode, WrongQuestionRecord } from './types';
import { CyberHeader } from './components/CyberHeader';
import { ChapterDashboard } from './components/ChapterDashboard';
import { MultipleChoiceExercise } from './components/MultipleChoiceExercise';
import { FillBlankExercise } from './components/FillBlankExercise';
import { WordBankExercise } from './components/WordBankExercise';
import { TrueFalseExercise } from './components/TrueFalseExercise';
import { StudyNotesModal } from './components/StudyNotesModal';
import { WrongQuestionsModal } from './components/WrongQuestionsModal';
import { RankBadgesModal } from './components/RankBadgesModal';
import { ReportModal } from './components/ReportModal';
import { MatchingExercise } from './components/MatchingExercise';
import { OrderingExercise } from './components/OrderingExercise';
import { AccountSwitcherModal } from './components/AccountSwitcherModal';
import { RewardCenterModal } from './components/RewardCenterModal';
import { JourneyMode } from './components/JourneyMode';
import { loadAllAccounts, saveAllAccounts, getActiveAccountId, setActiveAccountId } from './utils/accountManager';
import { sound } from './utils/audio';

import {
  CHAP4_CHOICE_QUESTIONS,
  CHAP4_FILL_BLANK_QUESTIONS,
  CHAP4_WORD_BANK_SETS,
  CHAP4_TRUE_FALSE_QUESTIONS,
  CHAP5_CHOICE_QUESTIONS,
  CHAP5_FILL_BLANK_QUESTIONS,
  CHAP5_WORD_BANK_SETS,
  CHAP5_TRUE_FALSE_QUESTIONS,
} from './data/questionsData';
import {
  CHAP4_MATCHING_QUESTIONS,
  CHAP5_MATCHING_QUESTIONS,
  CHAP4_ORDERING_QUESTIONS,
  CHAP5_ORDERING_QUESTIONS,
} from './data/matchingOrderingData';
import {
  CHAP1_CHOICE_QUESTIONS,
  CHAP1_FILL_BLANK_QUESTIONS,
  CHAP1_WORD_BANK_SETS,
  CHAP1_TRUE_FALSE_QUESTIONS,
  CHAP1_MATCHING_QUESTIONS,
  CHAP1_ORDERING_QUESTIONS,
  CHAP2_CHOICE_QUESTIONS,
  CHAP2_FILL_BLANK_QUESTIONS,
  CHAP2_WORD_BANK_SETS,
  CHAP2_TRUE_FALSE_QUESTIONS,
  CHAP2_MATCHING_QUESTIONS,
  CHAP2_ORDERING_QUESTIONS,
  CHAP3_CHOICE_QUESTIONS,
  CHAP3_FILL_BLANK_QUESTIONS,
  CHAP3_WORD_BANK_SETS,
  CHAP3_TRUE_FALSE_QUESTIONS,
  CHAP3_MATCHING_QUESTIONS,
  CHAP3_ORDERING_QUESTIONS,
} from './data/unit1QuestionsData';


const getChoiceQuestions = (ch: ChapterNumber) => {
  switch (ch) {
    case 1: return CHAP1_CHOICE_QUESTIONS;
    case 2: return CHAP2_CHOICE_QUESTIONS;
    case 3: return CHAP3_CHOICE_QUESTIONS;
    case 4: return CHAP4_CHOICE_QUESTIONS;
    case 5: return CHAP5_CHOICE_QUESTIONS;
  }
};

const getFillBlankQuestions = (ch: ChapterNumber) => {
  switch (ch) {
    case 1: return CHAP1_FILL_BLANK_QUESTIONS;
    case 2: return CHAP2_FILL_BLANK_QUESTIONS;
    case 3: return CHAP3_FILL_BLANK_QUESTIONS;
    case 4: return CHAP4_FILL_BLANK_QUESTIONS;
    case 5: return CHAP5_FILL_BLANK_QUESTIONS;
  }
};

const getWordBankQuestions = (ch: ChapterNumber) => {
  switch (ch) {
    case 1: return CHAP1_WORD_BANK_SETS;
    case 2: return CHAP2_WORD_BANK_SETS;
    case 3: return CHAP3_WORD_BANK_SETS;
    case 4: return CHAP4_WORD_BANK_SETS;
    case 5: return CHAP5_WORD_BANK_SETS;
  }
};

const getTrueFalseQuestions = (ch: ChapterNumber) => {
  switch (ch) {
    case 1: return CHAP1_TRUE_FALSE_QUESTIONS;
    case 2: return CHAP2_TRUE_FALSE_QUESTIONS;
    case 3: return CHAP3_TRUE_FALSE_QUESTIONS;
    case 4: return CHAP4_TRUE_FALSE_QUESTIONS;
    case 5: return CHAP5_TRUE_FALSE_QUESTIONS;
  }
};

const getMatchingQuestions = (ch: ChapterNumber) => {
  switch (ch) {
    case 1: return CHAP1_MATCHING_QUESTIONS;
    case 2: return CHAP2_MATCHING_QUESTIONS;
    case 3: return CHAP3_MATCHING_QUESTIONS;
    case 4: return CHAP4_MATCHING_QUESTIONS;
    case 5: return CHAP5_MATCHING_QUESTIONS;
  }
};

const getOrderingQuestions = (ch: ChapterNumber) => {
  switch (ch) {
    case 1: return CHAP1_ORDERING_QUESTIONS;
    case 2: return CHAP2_ORDERING_QUESTIONS;
    case 3: return CHAP3_ORDERING_QUESTIONS;
    case 4: return CHAP4_ORDERING_QUESTIONS;
    case 5: return CHAP5_ORDERING_QUESTIONS;
  }
};

export default function App() {
  const [accounts, setAccounts] = useState<Record<AccountId, UserStats>>(() => loadAllAccounts());
  const [activeAccountId, setActiveAccountIdState] = useState<AccountId>(() => getActiveAccountId());
  const stats = accounts[activeAccountId] || accounts.jayden;

  const [mainNavMode, setMainNavMode] = useState<MainNavMode>('exercise');
  const [currentView, setCurrentView] = useState<'dashboard' | 'exercise'>('dashboard');
  const [activeChapter, setActiveChapter] = useState<ChapterNumber>(4);
  const [activeCategory, setActiveCategory] = useState<ExerciseCategory>('H4a_u2_01選擇題_知識');
  const [deviceMode, setDeviceMode] = useState<DeviceMode>(() => {
    try {
      const saved = localStorage.getItem('cyber_earth_device_mode');
      if (saved === 'desktop' || saved === 'ipad' || saved === 'mobile') return saved;
    } catch {}
    return 'ipad';
  });
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('cyber_earth_theme_mode');
      if (saved === 'bright' || saved === 'dark') return saved;
    } catch {}
    return 'bright';
  });

  // Modals state
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [notesChapter, setNotesChapter] = useState<ChapterNumber>(4);
  const [isWrongLogOpen, setIsWrongLogOpen] = useState(false);
  const [isBadgesOpen, setIsBadgesOpen] = useState(false);
  const [isAccountSwitcherOpen, setIsAccountSwitcherOpen] = useState(false);
  const [isRewardCenterOpen, setIsRewardCenterOpen] = useState(false);

  const [reportData, setReportData] = useState<{
    score: number;
    total: number;
    chapter: ChapterNumber;
    category: ExerciseCategory;
    wrongCount: number;
  } | null>(null);

  // Sync theme with HTML documentElement
  useEffect(() => {
    if (themeMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem('cyber_earth_theme_mode', themeMode);
    } catch {}
  }, [themeMode]);

  useEffect(() => {
    try {
      localStorage.setItem('cyber_earth_device_mode', deviceMode);
    } catch {}
  }, [deviceMode]);

  // Sync sound muted state with stats
  useEffect(() => {
    sound.setMuted(!stats.soundEnabled);
  }, [stats.soundEnabled]);

  const handleUpdateStats = (newPartial: Partial<UserStats>) => {
    setAccounts((prev) => {
      const current = prev[activeAccountId];
      const updated = { ...current, ...newPartial };
      // Check level up: 1 level per 100 EXP
      const newLevel = Math.max(1, Math.floor(updated.exp / 100) + 1);
      if (newLevel > current.level) {
        sound.playVictory();
      }
      const result: Record<AccountId, UserStats> = {
        ...prev,
        [activeAccountId]: { ...updated, level: newLevel },
      };
      saveAllAccounts(result);
      return result;
    });
  };

  const handleSwitchAccount = (newId: AccountId) => {
    sound.playVictory();
    setActiveAccountIdState(newId);
    setActiveAccountId(newId);
    setCurrentView('dashboard');
    setReportData(null);
    setIsAccountSwitcherOpen(false);
  };

  const handleUpdateActiveAccountName = (newName: string) => {
    handleUpdateStats({ playerName: newName });
  };

  const handleStartExercise = (chapter: ChapterNumber, category: ExerciseCategory) => {
    setActiveChapter(chapter);
    setActiveCategory(category);
    setReportData(null);
    setCurrentView('exercise');
  };

  const handleFinishExercise = (score: number, total: number, wrongItems: any[]) => {
    const percentage = Math.round((score / total) * 100);
    const exerciseKey = `${activeChapter}_${activeCategory}`;

    // Add wrong items to persistent list for active student without duplicates
    const updatedWrongs = [...stats.wrongQuestions];
    wrongItems.forEach((item) => {
      if (!updatedWrongs.some((w) => w.id === item.id)) {
        updatedWrongs.push({
          ...item,
          timestamp: Date.now(),
        });
      }
    });

    // Update completedExercises if new score is higher
    const prevBest = stats.completedExercises[exerciseKey] || 0;
    const newBest = Math.max(prevBest, percentage);

    const expGain = score * 25 + (percentage === 100 ? 150 : 50);
    const starEarned = percentage === 100 && prevBest < 100 ? 1 : 0;
    const crystalsGain = score * 3 + (percentage === 100 ? 30 : 15);

    handleUpdateStats({
      exp: stats.exp + expGain,
      stars: (stats.stars || 0) + starEarned,
      crystals: (stats.crystals || 0) + crystalsGain,
      completedExercises: {
        ...stats.completedExercises,
        [exerciseKey]: newBest,
      },
      wrongQuestions: updatedWrongs,
      streak: percentage === 100 ? stats.streak + 1 : 0,
      testHistory: [
        {
          id: `ex_${activeChapter}_${Date.now()}`,
          timestamp: Date.now(),
          title: `第${activeChapter}課 ${activeCategory.split('_')[1]}`,
          score,
          total,
          percentage,
          mode: 'free_exercise' as const,
          chapter: activeChapter,
        },
        ...(stats.testHistory || []),
      ].slice(0, 30),
    });

    setReportData({
      score,
      total,
      chapter: activeChapter,
      category: activeCategory,
      wrongCount: wrongItems.length,
    });
  };

  const handleFinishJourneyStage = (
    stageId: number,
    score: number,
    total: number,
    stars: number,
    wrongItems: any[]
  ) => {
    const percentage = Math.round((score / total) * 100);
    const currentStageStars = stats.journeyProgress?.stageStars || {};
    const currentHighScores = stats.journeyProgress?.stageHighScores || {};
    const prevStars = currentStageStars[stageId] || 0;
    const newStars = Math.max(prevStars, stars);
    const prevHigh = currentHighScores[stageId] || 0;
    const newHigh = Math.max(prevHigh, percentage);

    // Unlock next stage if scored >= 60%
    const curUnlocked = stats.journeyProgress?.unlockedStage || 1;
    const nextUnlocked = percentage >= 60 ? Math.max(curUnlocked, stageId + 1) : curUnlocked;

    // Add wrong questions to active student's notebook
    const updatedWrongs = [...stats.wrongQuestions];
    wrongItems.forEach((item) => {
      if (!updatedWrongs.some((w) => w.id === item.id)) {
        updatedWrongs.push({
          ...item,
          timestamp: Date.now(),
        });
      }
    });

    const starDelta = Math.max(0, newStars - prevStars);
    const crystalsEarned = score * 5 + (stars === 3 ? 50 : stars > 0 ? 30 : 10);
    const expGain = score * 30 + (stars === 3 ? 150 : 50);

    handleUpdateStats({
      exp: stats.exp + expGain,
      stars: (stats.stars || 0) + starDelta,
      crystals: (stats.crystals || 0) + crystalsEarned,
      wrongQuestions: updatedWrongs,
      journeyProgress: {
        unlockedStage: nextUnlocked,
        stageStars: {
          ...currentStageStars,
          [stageId]: newStars,
        },
        stageHighScores: {
          ...currentHighScores,
          [stageId]: newHigh,
        },
      },
      testHistory: [
        {
          id: `journey_${stageId}_${Date.now()}`,
          timestamp: Date.now(),
          title: `冒險征途 第${stageId}關`,
          score,
          total,
          percentage,
          mode: 'journey' as const,
        },
        ...(stats.testHistory || []),
      ].slice(0, 30),
    });
  };

  const handleClearWrongQuestions = () => {
    handleUpdateStats({ wrongQuestions: [] });
  };

  const handleRemoveWrongQuestion = (id: string) => {
    handleUpdateStats({
      wrongQuestions: stats.wrongQuestions.filter((w) => w.id !== id),
    });
  };

  return (
    <div className={`min-h-screen cyber-grid-bg text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200 ${
      deviceMode === 'ipad' ? 'ipad-device-mode' : deviceMode === 'mobile' ? 'mobile-device-mode' : ''
    }`}>
      {deviceMode === 'ipad' && (
        <div className="bg-sky-50 border-b border-sky-200 px-4 py-1.5 text-center text-xs font-mono text-sky-800 flex items-center justify-center gap-2 dark:bg-sky-950/80 dark:border-cyan-500/40 dark:text-cyan-200">
          <span>📟 iPad 13" 觸控大字體模式已啟用（最適字號與寬大觸控按鈕，方便 Apple Pencil 與手指點選）</span>
          <button
            onClick={() => setDeviceMode('desktop')}
            className="underline text-sky-600 hover:text-sky-800 font-semibold dark:text-cyan-400 dark:hover:text-cyan-200 cursor-pointer"
          >
            切換為一般桌面版
          </button>
        </div>
      )}
      {deviceMode === 'mobile' && (
        <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-1.5 text-center text-xs font-mono text-emerald-800 flex items-center justify-center gap-2 dark:bg-emerald-950/80 dark:border-emerald-500/40 dark:text-emerald-200">
          <span>📱 手機直式排版模式已啟動</span>
          <button
            onClick={() => setDeviceMode('ipad')}
            className="underline text-emerald-600 hover:text-emerald-800 font-semibold dark:text-emerald-400 cursor-pointer"
          >
            切換為 iPad 模式
          </button>
        </div>
      )}

      {/* Top Cyber HUD Header */}
      <CyberHeader
        stats={stats}
        onUpdateStats={handleUpdateStats}
        onOpenNotes={() => {
          setNotesChapter(activeChapter);
          setIsNotesOpen(true);
        }}
        onOpenWrongLog={() => setIsWrongLogOpen(true)}
        onOpenBadges={() => setIsBadgesOpen(true)}
        onOpenAccountSwitcher={() => setIsAccountSwitcherOpen(true)}
        onOpenRewardCenter={() => setIsRewardCenterOpen(true)}
        onGoHome={() => {
          setReportData(null);
          setCurrentView('dashboard');
        }}
        mainNavMode={mainNavMode}
        onChangeMainNavMode={(mode) => {
          setMainNavMode(mode);
          setCurrentView('dashboard');
          setReportData(null);
        }}
        currentTitle={
          currentView === 'exercise'
            ? `第${activeChapter}課 - ${activeCategory.split('_')[1]}`
            : undefined
        }
        deviceMode={deviceMode}
        onChangeDeviceMode={(mode) => setDeviceMode(mode)}
        themeMode={themeMode}
        onToggleTheme={() => setThemeMode((m) => (m === 'bright' ? 'dark' : 'bright'))}
      />

      {/* Main Container */}
      <main className="flex-1">
        {currentView === 'dashboard' && mainNavMode === 'exercise' && (
          <ChapterDashboard
            stats={stats}
            onStartExercise={handleStartExercise}
            onOpenNotes={(ch) => {
              setNotesChapter(ch);
              setIsNotesOpen(true);
            }}
          />
        )}

        {currentView === 'dashboard' && mainNavMode === 'journey' && (
          <JourneyMode
            stats={stats}
            onUpdateJourneyStage={handleFinishJourneyStage}
            onSwitchToFreeMode={() => setMainNavMode('exercise')}
            onOpenNotes={(ch) => {
              setNotesChapter(ch);
              setIsNotesOpen(true);
            }}
          />
        )}

        {currentView === 'exercise' && (
          <div>
            {/* Render Category based on activeCategory */}
            {activeCategory.includes('選擇題') && (
              <MultipleChoiceExercise
                key={`${activeChapter}_${activeCategory}`}
                chapter={activeChapter}
                questions={getChoiceQuestions(activeChapter)}
                onFinish={handleFinishExercise}
                onBack={() => setCurrentView('dashboard')}
              />
            )}

            {activeCategory.includes('填充題') && !activeCategory.includes('供詞') && (
              <FillBlankExercise
                key={`${activeChapter}_${activeCategory}`}
                chapter={activeChapter}
                questions={getFillBlankQuestions(activeChapter)}
                onFinish={handleFinishExercise}
                onBack={() => setCurrentView('dashboard')}
              />
            )}

            {activeCategory.includes('供詞填充題') && (
              <WordBankExercise
                key={`${activeChapter}_${activeCategory}`}
                chapter={activeChapter}
                questions={getWordBankQuestions(activeChapter)}
                onFinish={handleFinishExercise}
                onBack={() => setCurrentView('dashboard')}
              />
            )}

            {activeCategory.includes('判斷題') && (
              <TrueFalseExercise
                key={`${activeChapter}_${activeCategory}`}
                chapter={activeChapter}
                questions={getTrueFalseQuestions(activeChapter)}
                onFinish={handleFinishExercise}
                onBack={() => setCurrentView('dashboard')}
              />
            )}

            {activeCategory.includes('配對題') && (
              <MatchingExercise
                key={`${activeChapter}_${activeCategory}`}
                chapter={activeChapter}
                questions={getMatchingQuestions(activeChapter)}
                onFinish={handleFinishExercise}
                onBack={() => setCurrentView('dashboard')}
              />
            )}

            {activeCategory.includes('排序題') && (
              <OrderingExercise
                key={`${activeChapter}_${activeCategory}`}
                chapter={activeChapter}
                questions={getOrderingQuestions(activeChapter)}
                onFinish={handleFinishExercise}
                onBack={() => setCurrentView('dashboard')}
              />
            )}
          </div>
        )}
      </main>

      {/* Modals */}
      <AccountSwitcherModal
        isOpen={isAccountSwitcherOpen}
        onClose={() => setIsAccountSwitcherOpen(false)}
        accounts={accounts}
        activeAccountId={activeAccountId}
        onSwitchAccount={handleSwitchAccount}
        onUpdateActiveAccountName={handleUpdateActiveAccountName}
      />

      <RewardCenterModal
        isOpen={isRewardCenterOpen}
        onClose={() => setIsRewardCenterOpen(false)}
        stats={stats}
        onUpdateStats={handleUpdateStats}
      />

      <StudyNotesModal
        isOpen={isNotesOpen}
        onClose={() => setIsNotesOpen(false)}
        defaultChapter={notesChapter}
      />

      <WrongQuestionsModal
        isOpen={isWrongLogOpen}
        onClose={() => setIsWrongLogOpen(false)}
        wrongQuestions={stats.wrongQuestions}
        onClearAll={handleClearWrongQuestions}
        onRemoveItem={handleRemoveWrongQuestion}
      />

      <RankBadgesModal
        isOpen={isBadgesOpen}
        onClose={() => setIsBadgesOpen(false)}
        stats={stats}
      />

      {reportData && (
        <ReportModal
          score={reportData.score}
          total={reportData.total}
          chapter={reportData.chapter}
          category={reportData.category}
          wrongCount={reportData.wrongCount}
          onRetry={() => {
            setReportData(null);
          }}
          onGoHome={() => {
            setReportData(null);
            setCurrentView('dashboard');
          }}
          onOpenWrongLog={() => {
            setIsWrongLogOpen(true);
          }}
        />
      )}

      {/* Cyber Footer */}
      <footer className="border-t border-slate-200 bg-white/90 py-4 px-4 text-center text-xs font-mono text-slate-500 dark:border-slate-900 dark:bg-slate-950/90 dark:text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            CYBER EARTH DEFENDER // 香港小學四年級 常識科特訓作戰系統
          </div>
          <div className="text-sky-600 font-semibold dark:text-cyan-400/80">
            目前指揮官：{stats.playerName}（{stats.title}）| 晶石：{stats.crystals || 0} 💎 | 星章：{stats.stars || 0} ★
          </div>
        </div>
      </footer>
    </div>
  );
}

