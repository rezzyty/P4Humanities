import React, { useState, useEffect } from 'react';
import { UserStats, ChapterNumber, ExerciseCategory } from './types';
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

const LOCAL_STORAGE_KEY = 'cyber_earth_defender_p4_data_v1';

const INITIAL_STATS: UserStats = {
  playerName: 'CYBER-P4',
  avatar: 'mecha_pilot',
  exp: 0,
  level: 1,
  soundEnabled: true,
  completedExercises: {},
  wrongQuestions: [],
  streak: 0,
};

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
  const [stats, setStats] = useState<UserStats>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_STATS;
  });

  const [currentView, setCurrentView] = useState<'dashboard' | 'exercise'>('dashboard');
  const [activeChapter, setActiveChapter] = useState<ChapterNumber>(4);
  const [activeCategory, setActiveCategory] = useState<ExerciseCategory>('H4a_u2_01選擇題_知識');

  // Modals state
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [notesChapter, setNotesChapter] = useState<ChapterNumber>(4);
  const [isWrongLogOpen, setIsWrongLogOpen] = useState(false);
  const [isBadgesOpen, setIsBadgesOpen] = useState(false);
  const [reportData, setReportData] = useState<{
    score: number;
    total: number;
    chapter: ChapterNumber;
    category: ExerciseCategory;
    wrongCount: number;
  } | null>(null);

  // Sync sound muted state with stats
  useEffect(() => {
    sound.setMuted(!stats.soundEnabled);
  }, [stats.soundEnabled]);

  // Persist stats in localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stats));
    } catch {}
  }, [stats]);

  const handleUpdateStats = (newPartial: Partial<UserStats>) => {
    setStats((prev) => {
      const updated = { ...prev, ...newPartial };
      // Check level up: 1 level per 100 EXP
      const newLevel = Math.max(1, Math.floor(updated.exp / 100) + 1);
      if (newLevel > prev.level) {
        sound.playVictory();
      }
      return { ...updated, level: newLevel };
    });
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

    // Add wrong items to persistent list without duplicates
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

    handleUpdateStats({
      exp: stats.exp + expGain,
      completedExercises: {
        ...stats.completedExercises,
        [exerciseKey]: newBest,
      },
      wrongQuestions: updatedWrongs,
      streak: percentage === 100 ? stats.streak + 1 : 0,
    });

    setReportData({
      score,
      total,
      chapter: activeChapter,
      category: activeCategory,
      wrongCount: wrongItems.length,
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
    <div className="min-h-screen cyber-grid-bg text-slate-100 flex flex-col font-sans">
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
        onGoHome={() => {
          setReportData(null);
          setCurrentView('dashboard');
        }}
        currentTitle={
          currentView === 'exercise'
            ? `第${activeChapter}課 - ${activeCategory.split('_')[1]}`
            : undefined
        }
      />

      {/* Main Container */}
      <main className="flex-1">
        {currentView === 'dashboard' && (
          <ChapterDashboard
            stats={stats}
            onStartExercise={handleStartExercise}
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
            // Trigger exercise re-render by staying in exercise view
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
      <footer className="border-t border-slate-900 bg-slate-950/90 py-4 px-4 text-center text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            CYBER EARTH DEFENDER // 香港小學四年級 常識科特訓作戰系統
          </div>
          <div className="text-cyan-500/80">
            收錄：第1課至第5課完整特訓題庫（單元一《環境與生活》+ 單元二《地球是我家》）
          </div>
        </div>
      </footer>
    </div>
  );
}
