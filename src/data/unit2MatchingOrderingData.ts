/**
 * Unit 2: 地球是我家
 * Chapter 4: 第4課 發現地球 & Chapter 5: 第5課 地球生病了
 * Matching & Ordering Question Bank extracted from textbook.
 */

import { MatchingQuestion, OrderingQuestion } from './unit4HealthData';

// ==========================================
// CHAPTER 4: 第4課 發現地球 (Matching & Ordering)
// ==========================================

export const CHAP4_MATCHING_QUESTIONS: MatchingQuestion[] = [
  {
    id: 'H4a_u2_07k_001_1',
    type: 'matching',
    unitTitle: '單元二 第4課 發現地球',
    category: 'H4a_u2_07配對題_知識',
    prompt: '以下大洲或大洋有甚麼特色？把大洲或大洋與正確的特色配對起來。',
    leftItems: [
      { id: '1', text: '1. 亞洲' },
      { id: '2', text: '2. 太平洋' },
      { id: '3', text: '3. 南極洲' },
      { id: '4', text: '4. 北冰洋' },
    ],
    rightItems: [
      { id: 'A', text: 'A. 地球上最大的大洋。' },
      { id: 'B', text: 'B. 終年結冰，是地球上最冷的大洲。' },
      { id: 'C', text: 'C. 地球上面積最大的大洲。' },
      { id: 'D', text: 'D. 地球上面積最小的大洲。' },
      { id: 'E', text: 'E. 地球上最小的大洋。' },
    ],
    correctPairs: {
      '1': ['C'],
      '2': ['A'],
      '3': ['B'],
      '4': ['E'],
    },
    explanation: '亞洲是最大大洲；太平洋是最大大洋；南極洲最冷終年結冰；北冰洋是最小大洋。',
  },
  {
    id: 'H4a_u2_07k_002_1',
    type: 'matching',
    unitTitle: '單元二 第4課 發現地球',
    category: 'H4a_u2_07配對題_知識',
    allowMultipleMatches: true,
    prompt: '以下大洲或大洋的位置是怎樣的？（答案可多於一個，代碼可重複使用）',
    leftItems: [
      { id: '1', text: '1. 太平洋' },
      { id: '2', text: '2. 印度洋' },
      { id: '3', text: '3. 南極洲' },
      { id: '4', text: '4. 亞洲' },
    ],
    rightItems: [
      { id: 'A', text: 'A. 非洲與大洋洲之間的大洋。' },
      { id: 'B', text: 'B. 亞洲與北美洲之間的大洋。' },
      { id: 'C', text: 'C. 地球最南端的大洲。' },
      { id: 'D', text: 'D. 香港的位置所在的大洲。' },
      { id: 'E', text: 'E. 香港面對的大洋。' },
    ],
    correctPairs: {
      '1': ['E', 'B'],
      '2': ['A'],
      '3': ['C'],
      '4': ['D'],
    },
    explanation: '太平洋位處亞洲與北美洲之間，也是香港正面對的大洋；印度洋在非洲和大洋洲之間；南極洲在地球最南端；香港在亞洲。',
  },
  {
    id: 'H4a_u2_07k_007_1',
    type: 'matching',
    unitTitle: '單元二 第4課 發現地球',
    category: 'H4a_u2_07配對題_知識',
    prompt: '以下自然環境有甚麼特點？把自然環境與特點配對起來。',
    leftItems: [
      { id: '1', text: '1. 熱帶雨林' },
      { id: '2', text: '2. 草原' },
      { id: '3', text: '3. 沙漠' },
      { id: '4', text: '4. 極地' },
    ],
    rightItems: [
      { id: 'A', text: 'A. 終年冰天雪地。' },
      { id: 'B', text: 'B. 長滿草的大片土地。' },
      { id: 'C', text: 'C. 樹木生長茂密。' },
      { id: 'D', text: 'D. 到處是沙丘和小石。' },
    ],
    correctPairs: {
      '1': ['C'],
      '2': ['B'],
      '3': ['D'],
      '4': ['A'],
    },
    explanation: '熱帶雨林樹木茂密；草原長滿草；沙漠到處是沙丘小石；極地終年冰天雪地。',
  },
  {
    id: 'H4a_u2_07k_010_1',
    type: 'matching',
    unitTitle: '單元二 第4課 發現地球',
    category: 'H4a_u2_07配對題_知識',
    prompt: '以下自然災害有甚麼特點？',
    leftItems: [
      { id: '1', text: '1. 地震' },
      { id: '2', text: '2. 火山爆發' },
      { id: '3', text: '3. 海嘯' },
    ],
    rightItems: [
      { id: 'A', text: 'A. 由極地冰層融化所引致。' },
      { id: 'B', text: 'B. 岩漿從裂縫中噴出地面。' },
      { id: 'C', text: 'C. 地殼猛烈震動。' },
      { id: 'D', text: 'D. 暴風雨吹襲。' },
      { id: 'E', text: 'E. 海水劇烈波動，掀起巨浪撲向陸地。' },
    ],
    correctPairs: {
      '1': ['C'],
      '2': ['B'],
      '3': ['E'],
    },
    explanation: '地震是地殼猛烈震動；火山爆發是岩漿噴出地面；海嘯是海水劇烈波動掀起巨浪。',
  },
  {
    id: 'H4a_u2_07k_013_1',
    type: 'matching',
    unitTitle: '單元二 第4課 發現地球',
    category: 'H4a_u2_07配對題_知識',
    prompt: '以下防災措施起了甚麼作用？',
    leftItems: [
      { id: '1', text: '1. 使用先進儀器監測和預報災害' },
      { id: '2', text: '2. 定期進行防災演習' },
      { id: '3', text: '3. 加強建築物的穩固度' },
    ],
    rightItems: [
      { id: 'A', text: 'A. 提醒人們在災害發生前撤離。' },
      { id: 'B', text: 'B. 確保在災害發生時，人們懂得應對。' },
      { id: 'C', text: 'C. 減低樓房倒塌的危險。' },
      { id: 'D', text: 'D. 阻止自然災害發生。' },
    ],
    correctPairs: {
      '1': ['A'],
      '2': ['B'],
      '3': ['C'],
    },
    explanation: '監測預報可提醒提前撤離；演習讓人們懂得正確應對；加強建築物穩固度可減低倒塌危險。',
  },
];

export const CHAP4_ORDERING_QUESTIONS: OrderingQuestion[] = [
  {
    id: 'H4a_u2_09k_001_1',
    type: 'ordering',
    unitTitle: '單元二 第4課 發現地球',
    category: 'H4a_u2_09排序題_知識',
    prompt: '把四大洋的面積由小至大順序排列出來。',
    items: [
      { id: 'A', text: 'A. 太平洋' },
      { id: 'B', text: 'B. 北冰洋' },
      { id: 'C', text: 'C. 印度洋' },
      { id: 'D', text: 'D. 大西洋' },
    ],
    correctOrder: ['B', 'C', 'D', 'A'],
    explanation: '四大洋面積由小至大：北冰洋（最小） → 印度洋 → 大西洋 → 太平洋（最大）。',
  },
  {
    id: 'H4a_u2_09k_002_1',
    type: 'ordering',
    unitTitle: '單元二 第4課 發現地球',
    category: 'H4a_u2_09排序題_知識',
    prompt: '把以下各大洲的面積由小至大順序排列出來。',
    items: [
      { id: 'A', text: 'A. 大洋洲' },
      { id: 'B', text: 'B. 亞洲' },
      { id: 'C', text: 'C. 歐洲' },
      { id: 'D', text: 'D. 非洲' },
    ],
    correctOrder: ['A', 'C', 'D', 'B'],
    explanation: '大洲面積由小至大：大洋洲（最小） → 歐洲 → 非洲 → 亞洲（最大）。',
  },
];

// ==========================================
// CHAPTER 5: 第5課 地球生病了 (Matching & Ordering)
// ==========================================

export const CHAP5_MATCHING_QUESTIONS: MatchingQuestion[] = [
  {
    id: 'H4a_u2_07k_017_2',
    type: 'matching',
    unitTitle: '單元二 第5課 地球生病了',
    category: 'H4a_u2_07配對題_知識',
    allowMultipleMatches: true,
    prompt: '把以下環境問題與相關的因素配對。（答案可多於一個）',
    leftItems: [
      { id: '1', text: '1. 森林的動物數量減少' },
      { id: '2', text: '2. 全球氣候變化' },
      { id: '3', text: '3. 水質污染' },
    ],
    rightItems: [
      { id: 'A', text: 'A. 燃燒大量煤和石油。' },
      { id: 'B', text: 'B. 大規模砍伐森林。' },
      { id: 'C', text: 'C. 海洋垃圾。' },
      { id: 'D', text: 'D. 船隻漏油。' },
    ],
    correctPairs: {
      '1': ['B'],
      '2': ['A', 'B'],
      '3': ['C', 'D'],
    },
    explanation: '砍伐森林破壞動物棲息地；燃燒化石燃料與砍伐森林導致溫室效應加劇氣候變化；海洋垃圾與船隻漏油造成水質污染。',
  },
  {
    id: 'H4a_u2_07k_019_2',
    type: 'matching',
    unitTitle: '單元二 第5課 地球生病了',
    category: 'H4a_u2_07配對題_知識',
    allowMultipleMatches: true,
    prompt: '把以下環境問題與帶來的影響配對。（答案可多於一個）',
    leftItems: [
      { id: '1', text: '1. 過度放牧' },
      { id: '2', text: '2. 濫伐森林' },
      { id: '3', text: '3. 水質污染' },
    ],
    rightItems: [
      { id: 'A', text: 'A. 下游出現洪水氾濫。' },
      { id: 'B', text: 'B. 使土地不再荒漠化。' },
      { id: 'C', text: 'C. 造成土地荒漠化。' },
      { id: 'D', text: 'D. 影響食水供應。' },
    ],
    correctPairs: {
      '1': ['C'],
      '2': ['A', 'C'],
      '3': ['D'],
    },
    explanation: '過度放牧導致土地荒漠化；濫伐森林造成水土流失引發下游洪水及土地荒漠化；水質污染危害食水供應。',
  },
  {
    id: 'H4a_u2_07k_020_2',
    type: 'matching',
    unitTitle: '單元二 第5課 地球生病了',
    category: 'H4a_u2_07配對題_知識',
    allowMultipleMatches: true,
    prompt: '把以下環境問題與相關的緩減方法配對。（答案可多於一個）',
    leftItems: [
      { id: '1', text: '1. 水質污染' },
      { id: '2', text: '2. 森林減少' },
      { id: '3', text: '3. 全球氣候變化' },
    ],
    rightItems: [
      { id: 'A', text: 'A. 以可再生能源替代化石燃料。' },
      { id: 'B', text: 'B. 禁止非法排放污水。' },
      { id: 'C', text: 'C. 禁止捕獵瀕危動物。' },
      { id: 'D', text: 'D. 禁止非法砍伐。' },
    ],
    correctPairs: {
      '1': ['B'],
      '2': ['D'],
      '3': ['A', 'D'],
    },
    explanation: '防止水質污染需禁止非法排污；減少森林需禁止非法砍伐；應對氣候變化需使用可再生能源並保護森林植樹造林。',
  },
  {
    id: 'H4a_u2_07k_023_2',
    type: 'matching',
    unitTitle: '單元二 第5課 地球生病了',
    category: 'H4a_u2_07配對題_知識',
    allowMultipleMatches: true,
    prompt: '把以下改善空氣質素的方法與相關的描述配對。（答案可多於一個）',
    leftItems: [
      { id: '1', text: '1. 停車等候時關掉引擎' },
      { id: '2', text: '2. 使用電動車輛' },
      { id: '3', text: '3. 節約用電' },
    ],
    rightItems: [
      { id: 'A', text: 'A. 減低耗電量。' },
      { id: 'B', text: 'B. 減少汽車排放的廢氣。' },
      { id: 'C', text: 'C. 減少道路上的燃油汽車。' },
      { id: 'D', text: 'D. 減少食水污染。' },
    ],
    correctPairs: {
      '1': ['B'],
      '2': ['B', 'C'],
      '3': ['A'],
    },
    explanation: '停車熄匙減少汽車廢氣；使用電動車能減少燃油車及車輛廢氣；節約用電能減低發電廠耗電與廢氣。',
  },
];

export const CHAP5_ORDERING_QUESTIONS: OrderingQuestion[] = [
  {
    id: 'H4a_u2_09k_003_2',
    type: 'ordering',
    unitTitle: '單元二 第5課 地球生病了',
    category: 'H4a_u2_09排序題_知識',
    prompt: '把以下荒漠化的前因後果順序排列出來。',
    items: [
      { id: 'A', text: 'A. 過度耕作。' },
      { id: 'B', text: 'B. 土地荒漠化。' },
      { id: 'C', text: 'C. 引發沙塵暴。' },
      { id: 'D', text: 'D. 土地的養分和水分得不到補充。' },
    ],
    correctOrder: ['A', 'D', 'B', 'C'],
    explanation: '過度耕作（起因） → 養分水分無法補充（惡化） → 土地荒漠化（結果） → 引發沙塵暴（次生災害）。',
  },
  {
    id: 'H4a_u2_09k_004_1',
    type: 'ordering',
    unitTitle: '單元二 第5課 地球生病了',
    category: 'H4a_u2_09排序題_知識',
    prompt: '把以下中國水資源區按年降雨量由小至大順序排列出來。',
    items: [
      { id: 'A', text: 'A. 珠江' },
      { id: 'B', text: 'B. 長江' },
      { id: 'C', text: 'C. 黃河' },
      { id: 'D', text: 'D. 淮河' },
    ],
    correctOrder: ['C', 'D', 'B', 'A'],
    explanation: '年降雨量由小至大（北方到南方）：黃河（最小） → 淮河 → 長江 → 珠江（最大）。',
  },
  {
    id: 'H4a_u2_09k_005_1',
    type: 'ordering',
    unitTitle: '單元二 第5課 地球生病了',
    category: 'H4a_u2_09排序題_知識',
    prompt: '把以下中國河流由南至北順序排列出來。',
    items: [
      { id: 'A', text: 'A. 長江' },
      { id: 'B', text: 'B. 珠江' },
      { id: 'C', text: 'C. 淮河' },
      { id: 'D', text: 'D. 黃河' },
    ],
    correctOrder: ['B', 'A', 'C', 'D'],
    explanation: '由南至北地理位置順序：珠江（最南） → 長江 → 淮河 → 黃河（最北）。',
  },
];
