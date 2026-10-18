import React, { useState } from 'react';
import { Globe2, AlertTriangle, CheckCircle, Sparkles, BookOpen, ChevronRight, Filter, Map, Compass, CloudRain } from 'lucide-react';
import { ExerciseCategory, ChapterNumber, UserStats } from '../types';
import { sound } from '../utils/audio';
import {
  CHAP4_CHOICE_QUESTIONS,
  CHAP4_FILL_BLANK_QUESTIONS,
  CHAP4_WORD_BANK_SETS,
  CHAP4_TRUE_FALSE_QUESTIONS,
  CHAP5_CHOICE_QUESTIONS,
  CHAP5_FILL_BLANK_QUESTIONS,
  CHAP5_WORD_BANK_SETS,
  CHAP5_TRUE_FALSE_QUESTIONS,
} from '../data/questionsData';
import {
  CHAP4_MATCHING_QUESTIONS,
  CHAP5_MATCHING_QUESTIONS,
  CHAP4_ORDERING_QUESTIONS,
  CHAP5_ORDERING_QUESTIONS,
} from '../data/matchingOrderingData';
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
} from '../data/unit1QuestionsData';

interface ChapterDashboardProps {
  stats: UserStats;
  onStartExercise: (chapter: ChapterNumber, category: ExerciseCategory) => void;
  onOpenNotes: (chapter: ChapterNumber) => void;
}

export const ChapterDashboard: React.FC<ChapterDashboardProps> = ({
  stats,
  onStartExercise,
  onOpenNotes,
}) => {
  const [selectedChap, setSelectedChap] = useState<ChapterNumber>(1);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'true_false' | 'matching' | 'ordering' | 'choice' | 'fill'>('all');

  // Chapter 1 Modules
  const chap1Modules = [
    {
      category: 'H4a_u1_04判斷題_知識' as ExerciseCategory,
      filterType: 'true_false',
      title: 'H4a_u1_04 判斷題 (知識與理解)',
      subtitle: '二元真偽審查：香港與亞洲位置、世界地圖與全境圖功用、格網座標、方向標',
      count: CHAP1_TRUE_FALSE_QUESTIONS.length,
      unit: '題',
      icon: '⚖️',
      color: 'from-amber-500 to-orange-600',
      borderColor: 'hover:border-amber-400',
      badge: '必考重點',
    },
    {
      category: 'H4a_u1_07配對題_知識' as ExerciseCategory,
      filterType: 'matching',
      title: 'H4a_u1_07 配對題 (知識與理解)',
      subtitle: '量子連線矩陣：地圖種類用途、港島九龍新界地標、地圖四大要素、圖例符號、電子地圖功能',
      count: CHAP1_MATCHING_QUESTIONS.length,
      unit: '大組',
      icon: '🔗',
      color: 'from-purple-500 to-pink-600',
      borderColor: 'hover:border-purple-400',
      badge: '熱門題型',
    },
    {
      category: 'H4a_u1_09排序題_知識' as ExerciseCategory,
      filterType: 'ordering',
      title: 'H4a_u1_09 排序題 (知識與理解)',
      subtitle: '順序邏輯排列：地圖涵蓋面積大小、各項地理實際面積由大至小、尖沙咀/九龍公園考察路線',
      count: CHAP1_ORDERING_QUESTIONS.length,
      unit: '題',
      icon: '📊',
      color: 'from-sky-500 to-indigo-600',
      borderColor: 'hover:border-sky-400',
      badge: '全新上線',
    },
    {
      category: 'H4a_u1_01選擇題_知識' as ExerciseCategory,
      filterType: 'choice',
      title: 'H4a_u1_01 選擇題 (知識與理解)',
      subtitle: '地圖資訊、鄰近香港國家、香港三大部分、街道圖要素、格網座標、尖沙咀地標',
      count: CHAP1_CHOICE_QUESTIONS.length,
      unit: '題',
      icon: '🎯',
      color: 'from-cyan-500 to-blue-600',
      borderColor: 'hover:border-cyan-400',
    },
    {
      category: 'H4a_u1_02填充題_知識' as ExerciseCategory,
      filterType: 'fill',
      title: 'H4a_u1_02 填充題 (知識與理解)',
      sentencePreview: '世界地圖、亞洲東南端、香港島/九龍/新界、圖例、格網座標、指南針、電子地圖',
      subtitle: '代碼填空注入：世界地圖、亞洲東南端、香港三大區域、圖例、格網座標、指南針、電子地圖',
      count: CHAP1_FILL_BLANK_QUESTIONS.length,
      unit: '題',
      icon: '✍️',
      color: 'from-teal-500 to-emerald-600',
      borderColor: 'hover:border-emerald-400',
    },
    {
      category: 'H4a_u1_03供詞填充題_知識' as ExerciseCategory,
      filterType: 'fill',
      title: 'H4a_u1_03 供詞填充題 (知識與理解)',
      subtitle: '供詞庫填充：地圖要素與全境街道圖、香港地理位置最高峰、電子地圖導航與街景',
      count: CHAP1_WORD_BANK_SETS.length,
      unit: '大組 (15小題)',
      icon: '🧩',
      color: 'from-blue-500 to-indigo-600',
      borderColor: 'hover:border-blue-400',
    },
  ];

  // Chapter 2 Modules
  const chap2Modules = [
    {
      category: 'H4a_u1_04判斷題_知識' as ExerciseCategory,
      filterType: 'true_false',
      title: 'H4a_u1_04 判斷題 (知識與理解)',
      subtitle: '二元真偽審查：香港山多平地少、大帽山高度、啟德郵輪碼頭、機場三跑道、移山填海利弊',
      count: CHAP2_TRUE_FALSE_QUESTIONS.length,
      unit: '題',
      icon: '⚖️',
      color: 'from-amber-500 to-orange-600',
      borderColor: 'hover:border-amber-400',
      badge: '必考重點',
    },
    {
      category: 'H4a_u1_07配對題_知識' as ExerciseCategory,
      filterType: 'matching',
      title: 'H4a_u1_07 配對題 (知識與理解)',
      subtitle: '生態連線矩陣：土地發展限制與解方、交通網絡與新市鎮目的、填海地貌變化、夷平山丘影響',
      count: CHAP2_MATCHING_QUESTIONS.length,
      unit: '大組',
      icon: '🔗',
      color: 'from-purple-500 to-pink-600',
      borderColor: 'hover:border-purple-400',
      badge: '熱門題型',
    },
    {
      category: 'H4a_u1_09排序題_知識' as ExerciseCategory,
      filterType: 'ordering',
      title: 'H4a_u1_09 排序題 (知識與理解)',
      subtitle: '順序邏輯排列：香港四座名山高度由高至低、香港國際機場發展經過歷史順序',
      count: CHAP2_ORDERING_QUESTIONS.length,
      unit: '題',
      icon: '📊',
      color: 'from-sky-500 to-indigo-600',
      borderColor: 'hover:border-sky-400',
      badge: '全新上線',
    },
    {
      category: 'H4a_u1_01選擇題_知識' as ExerciseCategory,
      filterType: 'choice',
      title: 'H4a_u1_01 選擇題 (知識與理解)',
      subtitle: '缺乏平地限制、地勢特徵、新市鎮、赤鱲角削山填海工程、高樓建築特色、啟德用地',
      count: CHAP2_CHOICE_QUESTIONS.length,
      unit: '題',
      icon: '🎯',
      color: 'from-cyan-500 to-blue-600',
      borderColor: 'hover:border-cyan-400',
    },
    {
      category: 'H4a_u1_02填充題_知識' as ExerciseCategory,
      filterType: 'fill',
      title: 'H4a_u1_02 填充題 (知識與理解)',
      subtitle: '關鍵字填空：九龍新界平地、移山填海、沙洲及龍鼓洲海岸公園中華白海豚保育、維港收窄',
      count: CHAP2_FILL_BLANK_QUESTIONS.length,
      unit: '題',
      icon: '✍️',
      color: 'from-teal-500 to-emerald-600',
      borderColor: 'hover:border-emerald-400',
    },
    {
      category: 'H4a_u1_03供詞填充題_知識' as ExerciseCategory,
      filterType: 'fill',
      title: 'H4a_u1_03 供詞填充題 (知識與理解)',
      subtitle: '供詞庫注入：地貌特徵與高空樓宇、赤鱲角機場削平填海、跨海大橋、啟德體育園',
      count: CHAP2_WORD_BANK_SETS.length,
      unit: '大組 (10小題)',
      icon: '🧩',
      color: 'from-blue-500 to-indigo-600',
      borderColor: 'hover:border-blue-400',
    },
  ];

  // Chapter 3 Modules
  const chap3Modules = [
    {
      category: 'H4a_u1_04判斷題_知識' as ExerciseCategory,
      filterType: 'true_false',
      title: 'H4a_u1_04 判斷題 (知識與理解)',
      subtitle: '二元真偽審查：香港四季乾濕特點、紅色火災危險警告、雷暴遠離水面、防中暑、電暖爐安全',
      count: CHAP3_TRUE_FALSE_QUESTIONS.length,
      unit: '題',
      icon: '⚖️',
      color: 'from-amber-500 to-orange-600',
      borderColor: 'hover:border-amber-400',
      badge: '必考重點',
    },
    {
      category: 'H4a_u1_07配對題_知識' as ExerciseCategory,
      filterType: 'matching',
      title: 'H4a_u1_07 配對題 (知識與理解)',
      subtitle: '氣候矩陣連線：各月份氣候特點、四季特色、天氣對生活影響、衣物穿著、天氣警告與應對',
      count: CHAP3_MATCHING_QUESTIONS.length,
      unit: '大組',
      icon: '🔗',
      color: 'from-purple-500 to-pink-600',
      borderColor: 'hover:border-purple-400',
      badge: '熱門題型',
    },
    {
      category: 'H4a_u1_09排序題_知識' as ExerciseCategory,
      filterType: 'ordering',
      title: 'H4a_u1_09 排序題 (知識與理解)',
      subtitle: '順序邏輯排列：熱帶氣旋信號風力等級、暴雨警告雨量程度、公曆四季流轉、火災警告等級',
      count: CHAP3_ORDERING_QUESTIONS.length,
      unit: '題',
      icon: '📊',
      color: 'from-sky-500 to-indigo-600',
      borderColor: 'hover:border-sky-400',
      badge: '全新上線',
    },
    {
      category: 'H4a_u1_01選擇題_知識' as ExerciseCategory,
      filterType: 'choice',
      title: 'H4a_u1_01 選擇題 (知識與理解)',
      subtitle: '四季天氣、炎熱雨量、酷熱天氣防護、颱風雷暴應對措施、山火防範、寒流長輩送暖',
      count: CHAP3_CHOICE_QUESTIONS.length,
      unit: '題',
      icon: '🎯',
      color: 'from-cyan-500 to-blue-600',
      borderColor: 'hover:border-cyan-400',
    },
    {
      category: 'H4a_u1_02填充題_知識' as ExerciseCategory,
      filterType: 'fill',
      title: 'H4a_u1_02 填充題 (知識與理解)',
      subtitle: '氣候代碼填空：春溫暖潮濕、夏炎熱多雨、天文台警告、熱帶氣旋水浸、秋燥山火、冬寒流保暖',
      count: CHAP3_FILL_BLANK_QUESTIONS.length,
      unit: '題',
      icon: '✍️',
      color: 'from-teal-500 to-emerald-600',
      borderColor: 'hover:border-emerald-400',
    },
    {
      category: 'H4a_u1_03供詞填充題_知識' as ExerciseCategory,
      filterType: 'fill',
      title: 'H4a_u1_03 供詞填充題 (知識與理解)',
      subtitle: '供詞庫注入：四季氣候形容詞、冬季防寒與雷暴停水上活動、暴雨水浸與酷熱中暑',
      count: CHAP3_WORD_BANK_SETS.length,
      unit: '大組 (15小題)',
      icon: '🧩',
      color: 'from-blue-500 to-indigo-600',
      borderColor: 'hover:border-blue-400',
    },
  ];

  // Chapter 4 Modules
  const chap4Modules = [
    {
      category: 'H4a_u2_04判斷題_知識' as ExerciseCategory,
      filterType: 'true_false',
      title: 'H4a_u2_04 判斷題 (知識與理解)',
      subtitle: '二元真偽審查：地球大洲洋數、極地雨林氣候、沙漠長袍、地震逃生禁忌',
      count: CHAP4_TRUE_FALSE_QUESTIONS.length,
      unit: '題',
      icon: '⚖️',
      color: 'from-amber-500 to-orange-600',
      borderColor: 'hover:border-amber-400',
      badge: '必考重點',
    },
    {
      category: 'H4a_u2_07配對題_知識' as ExerciseCategory,
      filterType: 'matching',
      title: 'H4a_u2_07 配對題 (知識與理解)',
      subtitle: '量子連線矩陣：大洲大洋特色、香港地理位置、自然環境氣候特點、防災措施作用',
      count: CHAP4_MATCHING_QUESTIONS.length,
      unit: '大組',
      icon: '🔗',
      color: 'from-purple-500 to-pink-600',
      borderColor: 'hover:border-purple-400',
      badge: '熱門題型',
    },
    {
      category: 'H4a_u2_09排序題_知識' as ExerciseCategory,
      filterType: 'ordering',
      title: 'H4a_u2_09 排序題 (知識與理解)',
      subtitle: '順序邏輯排列：四大洋面積由小至大、各大洲面積排序、地震避難步驟、海嘯求生流程',
      count: CHAP4_ORDERING_QUESTIONS.length,
      unit: '題',
      icon: '📊',
      color: 'from-sky-500 to-indigo-600',
      borderColor: 'hover:border-sky-400',
      badge: '全新上線',
    },
    {
      category: 'H4a_u2_01選擇題_知識' as ExerciseCategory,
      filterType: 'choice',
      title: 'H4a_u2_01 選擇題 (知識與理解)',
      subtitle: '地球形狀、七大洲四大洋、自然環境特徵、生活方式、海嘯地震防災（單選及多選）',
      count: CHAP4_CHOICE_QUESTIONS.length,
      unit: '題',
      icon: '🎯',
      color: 'from-cyan-500 to-blue-600',
      borderColor: 'hover:border-cyan-400',
    },
    {
      category: 'H4a_u2_02填充題_知識' as ExerciseCategory,
      filterType: 'fill',
      title: 'H4a_u2_02 填充題 (知識與理解)',
      subtitle: '關鍵字代碼注入：陸地海洋、最大大洲大洋、沙漠駱駝、地震空曠避難',
      count: CHAP4_FILL_BLANK_QUESTIONS.length,
      unit: '題',
      icon: '✍️',
      color: 'from-teal-500 to-emerald-600',
      borderColor: 'hover:border-emerald-400',
    },
    {
      category: 'H4a_u2_03供詞填充題_知識' as ExerciseCategory,
      filterType: 'fill',
      title: 'H4a_u2_03 供詞填充題 (知識與理解)',
      subtitle: '賽博供詞晶片配對：大洲大洋、極地雨林沙漠草原、地震逃生',
      count: CHAP4_WORD_BANK_SETS.length,
      unit: '大組 (35小題)',
      icon: '🧩',
      color: 'from-blue-500 to-indigo-600',
      borderColor: 'hover:border-blue-400',
    },
  ];

  // Chapter 5 Modules
  const chap5Modules = [
    {
      category: 'H4a_u2_04判斷題_知識' as ExerciseCategory,
      filterType: 'true_false',
      title: 'H4a_u2_04 判斷題 (知識與理解)',
      subtitle: '真偽審查：過度放牧荒漠化、中國水資源南多北少、香港酷熱天氣、水塘集水量',
      count: CHAP5_TRUE_FALSE_QUESTIONS.length,
      unit: '題',
      icon: '⚖️',
      color: 'from-rose-500 to-pink-600',
      borderColor: 'hover:border-rose-400',
      badge: '必考重點',
    },
    {
      category: 'H4a_u2_07配對題_知識' as ExerciseCategory,
      filterType: 'matching',
      title: 'H4a_u2_07 配對題 (知識與理解)',
      subtitle: '生態連線配對：天然資源分類、環境破壞因果、荒漠化與治沙、空氣污染影響、減碳措施',
      count: CHAP5_MATCHING_QUESTIONS.length,
      unit: '大組',
      icon: '🔗',
      color: 'from-fuchsia-500 to-purple-600',
      borderColor: 'hover:border-fuchsia-400',
      badge: '熱門題型',
    },
    {
      category: 'H4a_u2_09排序題_知識' as ExerciseCategory,
      filterType: 'ordering',
      title: 'H4a_u2_09 排序題 (知識與理解)',
      subtitle: '連鎖順序排列：土地荒漠化因果、中國水資源降雨量排列、河流由南至北、污染鏈演變',
      count: CHAP5_ORDERING_QUESTIONS.length,
      unit: '題',
      icon: '📊',
      color: 'from-amber-500 to-yellow-600',
      borderColor: 'hover:border-amber-400',
      badge: '全新上線',
    },
    {
      category: 'H4a_u2_01選擇題_知識' as ExerciseCategory,
      filterType: 'choice',
      title: 'H4a_u2_01 選擇題 (知識與理解)',
      subtitle: '天然資源、過度伐林、荒漠化、可再生能源、極端天氣、香港水質與空氣污染',
      count: CHAP5_CHOICE_QUESTIONS.length,
      unit: '題',
      icon: '🎯',
      color: 'from-emerald-500 to-teal-600',
      borderColor: 'hover:border-emerald-400',
    },
    {
      category: 'H4a_u2_02填充題_知識' as ExerciseCategory,
      filterType: 'fill',
      title: 'H4a_u2_02 填充題 (知識與理解)',
      subtitle: '鎖邊工程、退耕還林、南水北調、可再生能源、東江水、排污費、二氧化碳',
      count: CHAP5_FILL_BLANK_QUESTIONS.length,
      unit: '題',
      icon: '✍️',
      color: 'from-blue-500 to-cyan-600',
      borderColor: 'hover:border-cyan-400',
    },
    {
      category: 'H4a_u2_03供詞填充題_知識' as ExerciseCategory,
      filterType: 'fill',
      title: 'H4a_u2_03 供詞填充題 (知識與理解)',
      subtitle: '供詞庫注入：天然資源、過度伐林水災水土流失、鎖邊退耕還林、柴油發電廠廢氣',
      count: CHAP5_WORD_BANK_SETS.length,
      unit: '大組 (30小題)',
      icon: '🧩',
      color: 'from-violet-500 to-purple-600',
      borderColor: 'hover:border-violet-400',
    },
  ];

  const getModuleList = (ch: ChapterNumber) => {
    switch (ch) {
      case 1:
        return chap1Modules;
      case 2:
        return chap2Modules;
      case 3:
        return chap3Modules;
      case 4:
        return chap4Modules;
      case 5:
        return chap5Modules;
    }
  };

  const currentModules = getModuleList(selectedChap).filter(
    (m) => selectedFilter === 'all' || m.filterType === selectedFilter
  );

  // Calculate chapter completion percentage
  const getChapCompletion = (ch: ChapterNumber) => {
    const mods = getModuleList(ch);
    const completed = mods.filter((m) => stats.completedExercises[`${ch}_${m.category}`] !== undefined).length;
    return Math.round((completed / mods.length) * 100);
  };

  const chapMeta: Record<ChapterNumber, { unit: string; title: string; subtitle: string; icon: React.ReactNode; color: string; ring: string }> = {
    1: {
      unit: '單元一',
      title: '第1課 小小考察隊',
      subtitle: '地圖種類 ‧ 圖例符號 ‧ 格網座標 ‧ 導航',
      icon: <Map className="h-5 w-5" />,
      color: 'from-cyan-500 to-blue-600',
      ring: 'border-cyan-400 text-cyan-300',
    },
    2: {
      unit: '單元一',
      title: '第2課 漫遊香港',
      subtitle: '地勢特徵 ‧ 移山填海 ‧ 新市鎮 ‧ 機場',
      icon: <Compass className="h-5 w-5" />,
      color: 'from-emerald-500 to-teal-600',
      ring: 'border-emerald-400 text-emerald-300',
    },
    3: {
      unit: '單元一',
      title: '第3課 香港的氣候',
      subtitle: '四季氣候 ‧ 惡劣天氣警告 ‧ 防暑防寒',
      icon: <CloudRain className="h-5 w-5" />,
      color: 'from-sky-500 to-blue-600',
      ring: 'border-sky-400 text-sky-300',
    },
    4: {
      unit: '單元二',
      title: '第4課 發現地球',
      subtitle: '七大洲四大洋 ‧ 自然環境 ‧ 災害避難',
      icon: <Globe2 className="h-5 w-5" />,
      color: 'from-purple-500 to-indigo-600',
      ring: 'border-purple-400 text-purple-300',
    },
    5: {
      unit: '單元二',
      title: '第5課 地球生病了',
      subtitle: '天然資源 ‧ 氣候變化 ‧ 治沙減碳',
      icon: <AlertTriangle className="h-5 w-5" />,
      color: 'from-rose-500 to-pink-600',
      ring: 'border-rose-400 text-rose-300',
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Cyber Mission Briefing Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-cyan-500/40 bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/40 p-6 sm:p-10 mb-8 shadow-[0_0_50px_rgba(6,182,212,0.15)]">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-400/50 bg-cyan-950/80 text-cyan-300 text-xs font-mono mb-4">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400 animate-spin" />
              <span>賽博香港小學常識特訓系統 // 涵蓋第 1 至第 5 課 全題庫</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight mb-3">
              小四常識地球防衛戰：<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-emerald-400">
                第1至5課 判斷題 ‧ 配對題 ‧ 排序題 ‧ 選擇題 ‧ 填充題
              </span>
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6">
              特工 <strong className="text-cyan-400">{stats.playerName}</strong>！本系統已全面上線小四常識單元一《環境與氣候》（第1-3課）與單元二《地球是我家》（第4-5課），每課皆包含完整的【判斷題】、【配對題】與【排序題】專屬訓練模組！
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  sound.playClick();
                  onOpenNotes(selectedChap);
                }}
                className="px-5 py-2.5 rounded-xl border border-cyan-500/50 bg-cyan-950/70 hover:bg-cyan-900/80 text-cyan-300 font-bold text-xs font-mono flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)] cursor-pointer"
              >
                <BookOpen className="h-4 w-4" />
                <span>開啟第{selectedChap}課作戰筆記</span>
              </button>
            </div>
          </div>

          {/* Quick Progress Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2.5 font-mono text-xs">
            {([1, 2, 3, 4, 5] as ChapterNumber[]).map((ch) => (
              <div
                key={ch}
                onClick={() => {
                  sound.playClick();
                  setSelectedChap(ch);
                }}
                className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                  selectedChap === ch
                    ? 'border-cyan-400 bg-cyan-950/60 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                    : 'border-slate-800 bg-slate-950/70 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="text-slate-400">第{ch}課</span>
                  <span className="text-cyan-300 font-bold">{getChapCompletion(ch)}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-400 transition-all"
                    style={{ width: `${getChapCompletion(ch)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chapter Mission Base Switcher (Tabs for Chapters 1, 2, 3, 4, 5) */}
      <div className="mb-6">
        <div className="text-xs font-mono text-slate-400 mb-2 px-1">
          // 請選擇特訓任務基地（第 1 至 5 課）：
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {([1, 2, 3, 4, 5] as ChapterNumber[]).map((ch) => {
            const meta = chapMeta[ch];
            const isSelected = selectedChap === ch;

            return (
              <button
                key={ch}
                onClick={() => {
                  sound.playClick();
                  setSelectedChap(ch);
                }}
                className={`p-3.5 rounded-2xl border-2 transition-all flex flex-col justify-between text-left cursor-pointer ${
                  isSelected
                    ? `${meta.ring} bg-slate-900 shadow-[0_0_20px_rgba(6,182,212,0.25)] ring-1 ring-cyan-400`
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-slate-500">{meta.unit}</span>
                  <div
                    className={`p-1.5 rounded-lg ${
                      isSelected ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {meta.icon}
                  </div>
                </div>

                <div>
                  <h3 className={`font-bold text-sm ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                    {meta.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{meta.subtitle}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <Filter className="h-4 w-4 text-cyan-400" />
          <span>題型快速篩選：</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'all', label: '全部題型' },
            { id: 'true_false', label: '⚖️ 判斷題' },
            { id: 'matching', label: '🔗 配對題' },
            { id: 'ordering', label: '📊 排序題' },
            { id: 'choice', label: '🎯 選擇題' },
            { id: 'fill', label: '✍️ 填充題' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                sound.playClick();
                setSelectedFilter(tab.id as any);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer ${
                selectedFilter === tab.id
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Exercise Modules Grid */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
            <h3 className="text-lg font-bold text-white font-mono">
              // {chapMeta[selectedChap].title} 特訓模組清單
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            顯示 {currentModules.length} 項訓練專案
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {currentModules.map((m) => {
            const exerciseKey = `${selectedChap}_${m.category}`;
            const bestScore = stats.completedExercises[exerciseKey];
            const isDone = bestScore !== undefined;

            return (
              <div
                key={m.category}
                className={`relative group rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md transition-all duration-300 hover:scale-[1.01] ${m.borderColor} hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 border border-slate-700 text-xl shadow-inner">
                        {m.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono text-cyan-400 block tracking-wider">
                            {m.category.split('_')[0]}
                          </span>
                          {m.badge && (
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-500/40">
                              {m.badge}
                            </span>
                          )}
                        </div>
                        <h4 className="font-bold text-sm sm:text-base text-white group-hover:text-cyan-300 transition-colors">
                          {m.title}
                        </h4>
                      </div>
                    </div>

                    {isDone ? (
                      <div className="text-right font-mono flex-shrink-0">
                        <span className="text-[10px] text-emerald-400 flex items-center gap-1 justify-end">
                          <CheckCircle className="h-3 w-3 inline" /> 最高
                        </span>
                        <span className="text-xs font-bold text-emerald-300">
                          {bestScore}%
                        </span>
                      </div>
                    ) : (
                      <span className="text-[10px] font-mono text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 flex-shrink-0">
                        PENDING
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mb-4 min-h-[38px]">
                    {m.subtitle}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <div className="text-xs font-mono text-slate-400">
                    <span className="px-2 py-0.5 rounded bg-slate-950 text-cyan-300 border border-slate-800 text-[11px]">
                      {m.count} {m.unit}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      sound.playLaser();
                      onStartExercise(selectedChap, m.category);
                    }}
                    className={`px-4 py-2 rounded-xl font-bold font-mono text-xs flex items-center gap-1.5 transition-all cursor-pointer bg-gradient-to-r ${m.color} text-slate-950 hover:brightness-110 shadow-lg`}
                  >
                    <span>{isDone ? '再次訓練' : '啟動特訓'}</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
