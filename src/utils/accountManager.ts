import { AccountId, UserStats, WrongQuestionRecord, TestHistoryRecord, ChapterNumber } from '../types';

export const ACCOUNTS_STORAGE_KEY = 'cyber_earth_accounts_data_v2';
export const ACTIVE_ACCOUNT_ID_KEY = 'cyber_earth_active_account_id';
const LEGACY_STORAGE_KEY = 'cyber_earth_defender_p4_data_v1';

export interface AccountMetadata {
  id: AccountId;
  name: string;
  avatar: string;
  themeColor: string;
  badge: string;
  desc: string;
}

export const ACCOUNTS_CONFIG: Record<AccountId, AccountMetadata> = {
  jayden: {
    id: 'jayden',
    name: 'Jayden',
    avatar: 'mecha_pilot',
    themeColor: 'from-sky-500 to-blue-600',
    badge: '🚀 先鋒指揮',
    desc: '熱愛探索與科技，擅長地理與空間辨析',
  },
  melaine: {
    id: 'melaine',
    name: 'Melaine',
    avatar: 'agent_neo',
    themeColor: 'from-pink-500 to-rose-600',
    badge: '🌸 智慧領航',
    desc: '心思縝密細心，擅長氣候與生態環境知識',
  },
  others: {
    id: 'others',
    name: '其他學員',
    avatar: 'cyber_bot',
    themeColor: 'from-amber-500 to-emerald-600',
    badge: '🌟 訪客特訓',
    desc: '歡迎其他小朋友或家長體驗小四常識特訓',
  },
};

export const createInitialStats = (id: AccountId): UserStats => {
  const meta = ACCOUNTS_CONFIG[id];
  return {
    accountId: id,
    playerName: meta.name,
    avatar: meta.avatar,
    title: id === 'jayden' ? '小四常識先鋒特工' : id === 'melaine' ? '小四常識智慧指揮官' : '常識見習探險員',
    exp: 0,
    level: 1,
    stars: 0,
    crystals: 60, // 初始贈送 60 能量晶石
    soundEnabled: true,
    completedExercises: {},
    wrongQuestions: [],
    streak: 0,
    journeyProgress: {
      unlockedStage: 1,
      stageStars: {},
      stageHighScores: {},
    },
    unlockedRewards: id === 'jayden' ? ['title_pioneer'] : id === 'melaine' ? ['title_commander'] : ['title_rookie'],
    testHistory: [],
  };
};

export const loadAllAccounts = (): Record<AccountId, UserStats> => {
  try {
    const raw = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Ensure all 3 accounts exist with complete schema
      const result: Record<AccountId, UserStats> = {
        jayden: { ...createInitialStats('jayden'), ...(parsed.jayden || {}) },
        melaine: { ...createInitialStats('melaine'), ...(parsed.melaine || {}) },
        others: { ...createInitialStats('others'), ...(parsed.others || {}) },
      };
      // Normalize default names to ensure Jayden and Melaine display their designated student names
      if (!result.jayden.playerName || result.jayden.playerName === 'CYBER-P4') {
        result.jayden.playerName = 'Jayden';
      }
      if (!result.melaine.playerName || result.melaine.playerName === 'CYBER-P4') {
        result.melaine.playerName = 'Melaine';
      }
      saveAllAccounts(result);
      return result;
    }
  } catch (err) {
    console.error('Failed to parse accounts from localStorage', err);
  }

  // Attempt migration from legacy single-user data to Jayden
  let legacyStats: Partial<UserStats> = {};
  try {
    const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacyRaw) {
      legacyStats = JSON.parse(legacyRaw);
    }
  } catch {}

  const initial: Record<AccountId, UserStats> = {
    jayden: {
      ...createInitialStats('jayden'),
      ...legacyStats,
      accountId: 'jayden',
      playerName: (legacyStats.playerName && legacyStats.playerName !== 'CYBER-P4') ? legacyStats.playerName : 'Jayden',
      avatar: legacyStats.avatar || 'mecha_pilot',
      journeyProgress: (legacyStats as any)?.journeyProgress || {
        unlockedStage: 1,
        stageStars: {},
        stageHighScores: {},
      },
      unlockedRewards: (legacyStats as any)?.unlockedRewards || ['title_pioneer'],
      testHistory: (legacyStats as any)?.testHistory || [],
      stars: (legacyStats as any)?.stars || 0,
      crystals: (legacyStats as any)?.crystals || 60,
    },
    melaine: createInitialStats('melaine'),
    others: createInitialStats('others'),
  };

  saveAllAccounts(initial);
  return initial;
};

export const saveAllAccounts = (accounts: Record<AccountId, UserStats>): void => {
  try {
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
  } catch (err) {
    console.error('Failed to save accounts data', err);
  }
};

export const getActiveAccountId = (): AccountId => {
  try {
    const active = localStorage.getItem(ACTIVE_ACCOUNT_ID_KEY);
    if (active === 'jayden' || active === 'melaine' || active === 'others') {
      return active;
    }
  } catch {}
  return 'jayden';
};

export const setActiveAccountId = (id: AccountId): void => {
  try {
    localStorage.setItem(ACTIVE_ACCOUNT_ID_KEY, id);
  } catch {}
};

export interface RewardItem {
  id: string;
  name: string;
  category: 'title' | 'avatar' | 'certificate' | 'trophy';
  costCrystals: number;
  reqStars?: number;
  icon: string;
  desc: string;
  detailEffect: string;
}

export const REWARD_ITEMS: RewardItem[] = [
  // Titles
  {
    id: 'title_pioneer',
    name: '先鋒開拓者',
    category: 'title',
    costCrystals: 0,
    icon: '🚀',
    desc: 'Jayden 專屬啟程稱號',
    detailEffect: '頭銜更換為【先鋒開拓者】',
  },
  {
    id: 'title_commander',
    name: '智慧指揮官',
    category: 'title',
    costCrystals: 0,
    icon: '🌸',
    desc: 'Melaine 專屬啟程稱號',
    detailEffect: '頭銜更換為【智慧指揮官】',
  },
  {
    id: 'title_rookie',
    name: '見習探險員',
    category: 'title',
    costCrystals: 0,
    icon: '⚡',
    desc: '訪客與其他學員啟程稱號',
    detailEffect: '頭銜更換為【見習探險員】',
  },
  {
    id: 'title_map_master',
    name: '🗺️ 香港地理百事通',
    category: 'title',
    costCrystals: 60,
    icon: '🗺️',
    desc: '精通香港街道、地勢、最高峰與新市鎮規劃',
    detailEffect: '名片展示【香港地理百事通】尊貴金標',
  },
  {
    id: 'title_weather_guru',
    name: '⛈️ 氣象雷達風暴宗師',
    category: 'title',
    costCrystals: 80,
    icon: '⛈️',
    desc: '精準識別黑雨、紅雨、十號颶風與各項極端天氣應變',
    detailEffect: '名片展示【氣象雷達風暴宗師】閃電稱號',
  },
  {
    id: 'title_earth_guardian',
    name: '🌍 七洲四洋環球巡航使',
    category: 'title',
    costCrystals: 100,
    icon: '🧭',
    desc: '熟悉亞洲、太平洋等七大洲四大洋與板塊防災防震',
    detailEffect: '解鎖專屬地球全境巡航圖章',
  },
  {
    id: 'title_eco_hero',
    name: '🌱 綠色雙碳修復先鋒',
    category: 'title',
    costCrystals: 120,
    icon: '🌱',
    desc: '熟知治沙鎖邊工程、東江水、碳達峰與低碳生活',
    detailEffect: '頭像周圍環繞綠色生態生機光環',
  },
  {
    id: 'title_grandmaster',
    name: '👑 小四常識終極大滿貫',
    category: 'title',
    costCrystals: 200,
    reqStars: 12,
    icon: '👑',
    desc: '全章節高分征服者，常識界至高榮譽象徵',
    detailEffect: '解鎖金色尊爵桂冠頭銜與全場注目光效',
  },

  // Special Avatars
  {
    id: 'avatar_dolphin',
    name: '🐬 中華白海豚領航員',
    category: 'avatar',
    costCrystals: 90,
    icon: '🐬',
    desc: '大嶼山北面沙洲及龍鼓洲海岸公園特別代言領航員',
    detailEffect: '可切換為【中華白海豚】專屬頭像',
  },
  {
    id: 'avatar_lion',
    name: '🦁 獅子山不朽守護者',
    category: 'avatar',
    costCrystals: 110,
    icon: '🦁',
    desc: '代表香港人迎難而上、依山向高空發展的開拓精神',
    detailEffect: '可切換為【獅子山守護神】尊榮頭像',
  },
  {
    id: 'avatar_space',
    name: '🛰️ 天宮空間站特工',
    category: 'avatar',
    costCrystals: 130,
    icon: '🛰️',
    desc: '從太空軌道俯瞰蔚藍地球與壯麗山河的科技特工',
    detailEffect: '可切換為【天宮空間站】星際頭像',
  },
  {
    id: 'avatar_volcano',
    name: '🌋 烈火地質科考官',
    category: 'avatar',
    costCrystals: 120,
    icon: '🌋',
    desc: '無懼高溫探測火山熔岩與地殼運動的地質學者',
    detailEffect: '可切換為【烈火地質】專屬頭像',
  },
  {
    id: 'avatar_panda',
    name: '🐼 國寶生態多樣性使者',
    category: 'avatar',
    costCrystals: 140,
    icon: '🐼',
    desc: '傳遞自然界豐富物種保護與人與自然和諧共生理念',
    detailEffect: '可切換為【國寶生態使者】超萌頭像',
  },

  // Certificate
  {
    id: 'cert_official_p4',
    name: '📜 小四常識特訓總評金色結業證書',
    category: 'certificate',
    costCrystals: 50,
    reqStars: 6,
    icon: '📜',
    desc: '刻印學生真實姓名、等級與星章數的官方認證特訓獎狀',
    detailEffect: '支援高清全螢幕展示與列印留念',
  },
];
