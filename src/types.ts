export type ExerciseCategory =
  | 'H4a_u1_01選擇題_知識'
  | 'H4a_u1_02填充題_知識'
  | 'H4a_u1_03供詞填充題_知識'
  | 'H4a_u1_04判斷題_知識'
  | 'H4a_u1_07配對題_知識'
  | 'H4a_u1_09排序題_知識'
  | 'H4a_u2_01選擇題_知識'
  | 'H4a_u2_02填充題_知識'
  | 'H4a_u2_03供詞填充題_知識'
  | 'H4a_u2_04判斷題_知識'
  | 'H4a_u2_07配對題_知識'
  | 'H4a_u2_09排序題_知識';

export type ChapterNumber = 1 | 2 | 3 | 4 | 5;

export type PlayMode = 'practice' | 'speed_challenge' | 'mock_exam';

export type DeviceMode = 'desktop' | 'ipad' | 'mobile';

export type ThemeMode = 'bright' | 'dark';

export type AccountId = 'jayden' | 'melaine' | 'others';

export type MainNavMode = 'exercise' | 'journey';

export interface WrongQuestionRecord {
  id: string;
  chapter: ChapterNumber;
  category: string;
  prompt: string;
  userAnswer: string;
  correctAnswer: string;
  timestamp: number;
  explanation?: string;
}

export interface TestHistoryRecord {
  id: string;
  timestamp: number;
  title: string;
  score: number;
  total: number;
  percentage: number;
  mode: 'free_exercise' | 'journey';
  chapter?: ChapterNumber;
}

export interface JourneyStageProgress {
  unlockedStage: number; // 1 to 5 (Stages 1..5, excluding Chapter 2)
  stageStars: Record<number, number>; // stage (1..5) -> stars earned (0..3)
  stageHighScores: Record<number, number>; // stage (1..5) -> score percentage (0..100)
}

export interface UserStats {
  accountId: AccountId;
  playerName: string;
  avatar: string; // 'mecha_pilot' | 'agent_neo' | 'cyber_bot' | 'cyber_hacker' | 'dolphin_guard' | 'lion_rock' | 'space_agent'
  title: string;
  exp: number;
  level: number;
  stars: number; // 守護者星章
  crystals: number; // 地球能量晶石 (用以解鎖稱號/造型/榮譽獎盃)
  soundEnabled: boolean;
  completedExercises: Record<string, number>; // key: `${chapter}_${category}` -> highest score %
  wrongQuestions: WrongQuestionRecord[];
  streak: number;
  journeyProgress: JourneyStageProgress;
  unlockedRewards: string[]; // reward item IDs
  testHistory: TestHistoryRecord[];
  unlockedMedals?: string[]; // IDs of unlocked Transformer medals
  activeMedalId?: string; // ID of currently equipped Transformer medal
}

