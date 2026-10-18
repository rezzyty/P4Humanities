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

export interface UserStats {
  playerName: string;
  avatar: string; // 'cyber_bot' | 'agent_neo' | 'mecha_pilot' | 'cyber_hacker'
  exp: number;
  level: number;
  soundEnabled: boolean;
  completedExercises: Record<string, number>; // key: `${chapter}_${category}` -> highest score %
  wrongQuestions: {
    id: string;
    chapter: ChapterNumber;
    category: ExerciseCategory;
    prompt: string;
    userAnswer: string;
    correctAnswer: string;
    timestamp: number;
  }[];
  streak: number;
}
