export interface MatchingItem {
  id: string;
  label: string;
}

export interface MatchingTarget {
  id: string;
  text: string;
}

export interface MatchingQuestion {
  id: string;
  type: 'matching';
  chapter: 1 | 2 | 3 | 4 | 5;
  category: string;
  prompt: string;
  leftItems: MatchingItem[];
  rightTargets: MatchingTarget[];
  correctPairs: Record<string, string[]>;
  allowMultiTarget?: boolean;
  explanation?: string;
}

export interface OrderingItem {
  id: string;
  text: string;
}

export interface OrderingQuestion {
  id: string;
  type: 'ordering';
  chapter: 1 | 2 | 3 | 4 | 5;
  category: string;
  prompt: string;
  items: OrderingItem[];
  correctOrder: string[];
  directionHint?: string;
  explanation?: string;
}

// ==========================================
// CHAPTER 4: 配對題 (H4a_u2_07k_001_1 ~ 014_1)
// ==========================================

export const CHAP4_MATCHING_QUESTIONS: MatchingQuestion[] = [
  {
    id: 'H4a_u2_07k_001_1',
    type: 'matching',
    chapter: 4,
    category: 'H4a_u2_07配對題_知識',
    prompt: '以下大洲或大洋有甚麼特色？請將項目與正確特色連線配對。',
    leftItems: [
      { id: '1', label: '1. 亞洲' },
      { id: '2', label: '2. 太平洋' },
      { id: '3', label: '3. 南極洲' },
      { id: '4', label: '4. 北冰洋' },
    ],
    rightTargets: [
      { id: 'A', text: '地球上最大的大洋。' },
      { id: 'B', text: '終年結冰，是地球上最冷的大洲。' },
      { id: 'C', text: '地球上面積最大的大洲。' },
      { id: 'D', text: '地球上面積最小的大洲。' },
      { id: 'E', text: '地球上最小的大洋。' },
    ],
    correctPairs: {
      '1': ['C'],
      '2': ['A'],
      '3': ['B'],
      '4': ['E'],
    },
    explanation: '亞洲是面積最大的大洲(C)，太平洋是最大的大洋(A)，南極洲終年結冰最冷(B)，北冰洋是最小的大洋(E)。',
  },
  {
    id: 'H4a_u2_07k_002_1',
    type: 'matching',
    chapter: 4,
    category: 'H4a_u2_07配對題_知識',
    prompt: '以下大洲或大洋的位置是怎樣的？（答案可多於一個，代表答案的字母可重複使用）',
    allowMultiTarget: true,
    leftItems: [
      { id: '1', label: '1. 太平洋' },
      { id: '2', label: '2. 印度洋' },
      { id: '3', label: '3. 南極洲' },
      { id: '4', label: '4. 亞洲' },
    ],
    rightTargets: [
      { id: 'A', text: '非洲與大洋洲之間的大洋。' },
      { id: 'B', text: '亞洲與北美洲之間的大洋。' },
      { id: 'C', text: '地球最南端的大洲。' },
      { id: 'D', text: '香港的位置所在的大洲。' },
      { id: 'E', text: '香港面對的大洋。' },
    ],
    correctPairs: {
      '1': ['E', 'B'],
      '2': ['A'],
      '3': ['C'],
      '4': ['D'],
    },
    explanation: '太平洋是香港面對的大洋(E)也是亞洲與北美洲之間的大洋(B)；印度洋在非洲與大洋洲之間(A)；南極洲在最南端(C)；亞洲是香港所在大洲(D)。',
  },
  {
    id: 'H4a_u2_07k_003_1',
    type: 'matching',
    chapter: 4,
    category: 'H4a_u2_07配對題_知識',
    prompt: '把以下選項與相關的地理特徵描述配對起來。',
    leftItems: [
      { id: '1', label: '1. 北冰洋' },
      { id: '2', label: '2. 大洋洲' },
      { id: '3', label: '3. 太平洋' },
      { id: '4', label: '4. 亞洲' },
    ],
    rightTargets: [
      { id: 'A', text: '香港位於的大洲。' },
      { id: 'B', text: '地球上面積最小的大洲。' },
      { id: 'C', text: '美國位於的大洲。' },
      { id: 'D', text: '地球上面積最小的大洋。' },
      { id: 'E', text: '香港面對的大洋。' },
    ],
    correctPairs: {
      '1': ['D'],
      '2': ['B'],
      '3': ['E'],
      '4': ['A'],
    },
    explanation: '北冰洋面積最小(D)；大洋洲是最小大洲(B)；太平洋是香港面對的大洋(E)；亞洲是香港位於的大洲(A)。',
  },
  {
    id: 'H4a_u2_07k_004_1',
    type: 'matching',
    chapter: 4,
    category: 'H4a_u2_07配對題_知識',
    prompt: '以下大洋有甚麼地理特色？請連線配對。',
    leftItems: [
      { id: '1', label: '1. 太平洋' },
      { id: '2', label: '2. 北冰洋' },
      { id: '3', label: '3. 大西洋' },
    ],
    rightTargets: [
      { id: 'A', text: '香港面對的大洋。' },
      { id: 'B', text: '地球上最冷的大洋。' },
      { id: 'C', text: '位於亞洲的南面。' },
      { id: 'D', text: '位於北美洲、南美洲、非洲和歐洲之間。' },
    ],
    correctPairs: {
      '1': ['A'],
      '2': ['B'],
      '3': ['D'],
    },
    explanation: '太平洋是香港面對的大洋(A)；北冰洋在北極最冷(B)；大西洋位於美洲與歐非兩洲之間(D)。',
  },
  {
    id: 'H4a_u2_07k_005_1',
    type: 'matching',
    chapter: 4,
    category: 'H4a_u2_07配對題_知識',
    prompt: '以下哪些是亞洲的特點？哪些是大洋洲的特點？（答案可多於一個）',
    allowMultiTarget: true,
    leftItems: [
      { id: '1', label: '1. 亞洲' },
      { id: '2', label: '2. 大洋洲' },
    ],
    rightTargets: [
      { id: 'A', text: '香港位於這個洲。' },
      { id: 'B', text: '位於印度洋東面。' },
      { id: 'C', text: '地球上最大的洲。' },
      { id: 'D', text: '地球上最小的洲。' },
    ],
    correctPairs: {
      '1': ['A', 'C'],
      '2': ['B', 'D'],
    },
    explanation: '亞洲是最大洲且香港位於其中(A, C)；大洋洲是最小洲且位於印度洋東面(B, D)。',
  },
  {
    id: 'H4a_u2_07k_006_1',
    type: 'matching',
    chapter: 4,
    category: 'H4a_u2_07配對題_知識',
    prompt: '以下各描述分別屬於哪一個大洋？（答案可多於一個）',
    allowMultiTarget: true,
    leftItems: [
      { id: '1', label: '1. 太平洋' },
      { id: '2', label: '2. 北冰洋' },
      { id: '3', label: '3. 大西洋' },
    ],
    rightTargets: [
      { id: 'A', text: '地球上最小的大洋。' },
      { id: 'B', text: '位於北美洲、南美洲、歐洲和非洲之間。' },
      { id: 'C', text: '在地球最北端。' },
      { id: 'D', text: '香港面向這個大洋。' },
      { id: 'E', text: '地球上最大的大洋。' },
    ],
    correctPairs: {
      '1': ['D', 'E'],
      '2': ['A', 'C'],
      '3': ['B'],
    },
    explanation: '太平洋是最大大洋且香港面向它(D, E)；北冰洋在最北端且面積最小(A, C)；大西洋在美洲與歐非之間(B)。',
  },
  {
    id: 'H4a_u2_07k_007_1',
    type: 'matching',
    chapter: 4,
    category: 'H4a_u2_07配對題_知識',
    prompt: '以下自然環境有甚麼景觀與氣候特點？請配對。',
    leftItems: [
      { id: '1', label: '1. 熱帶雨林' },
      { id: '2', label: '2. 草原' },
      { id: '3', label: '3. 沙漠' },
      { id: '4', label: '4. 極地' },
    ],
    rightTargets: [
      { id: 'A', text: '終年冰天雪地。' },
      { id: 'B', text: '長滿草的大片土地。' },
      { id: 'C', text: '樹木生長茂密。' },
      { id: 'D', text: '到處是沙丘和小石。' },
      { id: 'E', text: '佈滿泥灘。' },
    ],
    correctPairs: {
      '1': ['C'],
      '2': ['B'],
      '3': ['D'],
      '4': ['A'],
    },
    explanation: '熱帶雨林樹木茂密(C)；草原長滿草(B)；沙漠沙丘小石(D)；極地終年冰雪(A)。',
  },
  {
    id: 'H4a_u2_07k_008_1',
    type: 'matching',
    chapter: 4,
    category: 'H4a_u2_07配對題_知識',
    prompt: '以下自然環境有甚麼氣候與地形特徵？請配對。',
    leftItems: [
      { id: '1', label: '1. 草原' },
      { id: '2', label: '2. 極地' },
      { id: '3', label: '3. 熱帶雨林' },
      { id: '4', label: '4. 沙漠' },
    ],
    rightTargets: [
      { id: 'A', text: '雨量稀少，白天炎熱，晚上寒冷。' },
      { id: 'B', text: '天氣嚴寒，終年結冰。' },
      { id: 'C', text: '地勢平坦空曠，地上長滿草。' },
      { id: 'D', text: '地勢崎嶇不平，不同高度的温差很大。' },
      { id: 'E', text: '陽光充足，雨量多。' },
    ],
    correctPairs: {
      '1': ['C'],
      '2': ['B'],
      '3': ['E'],
      '4': ['A'],
    },
    explanation: '草原平坦空曠長滿草(C)；極地嚴寒終年結冰(B)；熱帶雨林陽光充足雨量多(E)；沙漠乾旱且日夜溫差大(A)。',
  },
  {
    id: 'H4a_u2_07k_009_1',
    type: 'matching',
    chapter: 4,
    category: 'H4a_u2_07配對題_知識',
    prompt: '在以下自然環境生活，人們的生活方式有甚麼特點？請配對。',
    leftItems: [
      { id: '1', label: '1. 沙漠' },
      { id: '2', label: '2. 極地' },
      { id: '3', label: '3. 熱帶雨林' },
      { id: '4', label: '4. 温帶草原' },
    ],
    rightTargets: [
      { id: 'A', text: '有些房屋興建在竹子或木樁上。' },
      { id: 'B', text: '人們以畜牧為生。' },
      { id: 'C', text: '人們以捕魚和捕獵極地動物為生。' },
      { id: 'D', text: '人們穿長袍，並用布包裹頭部。' },
      { id: 'E', text: '人們以驢子運送物品。' },
    ],
    correctPairs: {
      '1': ['D'],
      '2': ['C'],
      '3': ['A'],
      '4': ['B'],
    },
    explanation: '沙漠穿長袍布裹頭防曬(D)；極地捕魚獵獸(C)；雨林房屋建於木樁防洪水(A)；草原以畜牧為生(B)。',
  },
  {
    id: 'H4a_u2_07k_010_1',
    type: 'matching',
    chapter: 4,
    category: 'H4a_u2_07配對題_知識',
    prompt: '以下自然災害有甚麼特點？請配對。',
    leftItems: [
      { id: '1', label: '1. 地震' },
      { id: '2', label: '2. 火山爆發' },
      { id: '3', label: '3. 海嘯' },
    ],
    rightTargets: [
      { id: 'A', text: '由極地冰層融化所引致。' },
      { id: 'B', text: '岩漿從裂縫中噴出地面。' },
      { id: 'C', text: '地殼猛烈震動。' },
      { id: 'D', text: '暴風雨吹襲。' },
      { id: 'E', text: '海水劇烈波動，掀起巨浪撲向陸地。' },
    ],
    correctPairs: {
      '1': ['C'],
      '2': ['B'],
      '3': ['E'],
    },
    explanation: '地震是地殼猛烈震動(C)；火山是岩漿噴出(B)；海嘯是海水劇烈波動掀起巨浪(E)。',
  },
  {
    id: 'H4a_u2_07k_011_1',
    type: 'matching',
    chapter: 4,
    category: 'H4a_u2_07配對題_知識',
    prompt: '以下自然現象可能引發甚麼災難？（答案可多於一個）',
    allowMultiTarget: true,
    leftItems: [
      { id: '1', label: '1. 火山爆發' },
      { id: '2', label: '2. 海嘯' },
    ],
    rightTargets: [
      { id: 'A', text: '火山灰掩蓋房屋。' },
      { id: 'B', text: '海水淹浸沿岸地區。' },
      { id: 'C', text: '巨浪沖毀大量房屋。' },
      { id: 'D', text: '山坡崩塌。' },
    ],
    correctPairs: {
      '1': ['A', 'D'],
      '2': ['B', 'C'],
    },
    explanation: '火山爆發會產生厚火山灰掩埋房屋並引發山坡崩塌(A, D)；海嘯巨浪會沖毀房屋並淹浸沿岸地區(B, C)。',
  },
  {
    id: 'H4a_u2_07k_012_1',
    type: 'matching',
    chapter: 4,
    category: 'H4a_u2_07配對題_知識',
    prompt: '遇到以下自然災害時，我們應該怎樣做？（答案可多於一個）',
    allowMultiTarget: true,
    leftItems: [
      { id: '1', label: '1. 地震' },
      { id: '2', label: '2. 海嘯' },
    ],
    rightTargets: [
      { id: 'A', text: '逃往高地躲避。' },
      { id: 'B', text: '立即走到室外空曠的地方。' },
      { id: 'C', text: '不要靠近岸邊。' },
      { id: 'D', text: '躲在堅固的桌子下。' },
    ],
    correctPairs: {
      '1': ['B', 'D'],
      '2': ['A', 'C'],
    },
    explanation: '地震時應躲在堅固桌子下或走到空曠處(B, D)；海嘯警告時應遠離岸邊逃往高地(A, C)。',
  },
  {
    id: 'H4a_u2_07k_013_1',
    type: 'matching',
    chapter: 4,
    category: 'H4a_u2_07配對題_知識',
    prompt: '以下防災措施起了甚麼重要作用？請連線配對。',
    leftItems: [
      { id: '1', label: '1. 使用先進儀器監測和預報災害' },
      { id: '2', label: '2. 定期進行防災演習' },
      { id: '3', label: '3. 加強建築物的穩固度' },
    ],
    rightTargets: [
      { id: 'A', text: '提醒人們在災害發生前撤離。' },
      { id: 'B', text: '確保在災害發生時，人們懂得應對。' },
      { id: 'C', text: '減低樓房倒塌的危險。' },
      { id: 'D', text: '阻止自然災害發生。' },
    ],
    correctPairs: {
      '1': ['A'],
      '2': ['B'],
      '3': ['C'],
    },
    explanation: '先進預報及早提醒人們撤離(A)；演習讓人熟悉應對(B)；加強建築抗震穩固度減低倒塌危險(C)。',
  },
  {
    id: 'H4a_u2_07k_014_1',
    type: 'matching',
    chapter: 4,
    category: 'H4a_u2_07配對題_知識',
    prompt: '以下措施怎樣減低自然災害的影響？請配對。',
    leftItems: [
      { id: '1', label: '1. 定期進行防災演習' },
      { id: '2', label: '2. 定期檢查求生錦囊中的物品' },
      { id: '3', label: '3. 監測和分析地震儀的資料' },
    ],
    rightTargets: [
      { id: 'A', text: '預測地震，減少地震帶來的損失。' },
      { id: 'B', text: '地震突然發生時，人們懂得怎樣應變。' },
      { id: 'C', text: '減少火山爆發時造成的傷亡。' },
      { id: 'D', text: '確保在災難發生時有合用的求生工具。' },
    ],
    correctPairs: {
      '1': ['B'],
      '2': ['D'],
      '3': ['A'],
    },
    explanation: '演習提升應變力(B)；求生錦囊保證災時有應急工具(D)；分析地震儀數據預測地震減少損失(A)。',
  },
];

// ==========================================
// CHAPTER 5: 配對題 (H4a_u2_07k_015_1 ~ 024_1)
// ==========================================

export const CHAP5_MATCHING_QUESTIONS: MatchingQuestion[] = [
  {
    id: 'H4a_u2_07k_015_1',
    type: 'matching',
    chapter: 5,
    category: 'H4a_u2_07配對題_知識',
    prompt: '以下生活用品來自甚麼天然資源？請配對。',
    leftItems: [
      { id: '1', label: '1. 紙張' },
      { id: '2', label: '2. 牛奶' },
      { id: '3', label: '3. 汽油' },
    ],
    rightTargets: [
      { id: 'A', text: '樹木。' },
      { id: 'B', text: '動物。' },
      { id: 'C', text: '石油。' },
      { id: 'D', text: '煤。' },
    ],
    correctPairs: {
      '1': ['A'],
      '2': ['B'],
      '3': ['C'],
    },
    explanation: '紙張由樹木木漿製成(A)；牛奶取自乳牛等動物(B)；汽油由石油提煉(C)。',
  },
  {
    id: 'H4a_u2_07k_016_1',
    type: 'matching',
    chapter: 5,
    category: 'H4a_u2_07配對題_知識',
    prompt: '把以下物品的原料與其所屬的天然資源分類配對。',
    leftItems: [
      { id: '1', label: '1. 羊毛衣' },
      { id: '2', label: '2. 木製家具' },
      { id: '3', label: '3. 金屬首飾' },
    ],
    rightTargets: [
      { id: 'A', text: '水資源。' },
      { id: 'B', text: '動物資源。' },
      { id: 'C', text: '礦產資源。' },
      { id: 'D', text: '植物資源。' },
    ],
    correctPairs: {
      '1': ['B'],
      '2': ['D'],
      '3': ['C'],
    },
    explanation: '羊毛來自羊隻（動物資源B）；木材來自樹林（植物資源D）；金屬礦石來自礦產資源(C)。',
  },
  {
    id: 'H4a_u2_07k_017_2',
    type: 'matching',
    chapter: 5,
    category: 'H4a_u2_07配對題_知識',
    prompt: '把以下環境問題與相關的致病因素配對。（答案可多於一個）',
    allowMultiTarget: true,
    leftItems: [
      { id: '1', label: '1. 森林的動物數量減少' },
      { id: '2', label: '2. 全球氣候變化' },
      { id: '3', label: '3. 水質污染' },
    ],
    rightTargets: [
      { id: 'A', text: '燃燒大量煤和石油。' },
      { id: 'B', text: '大規模砍伐森林。' },
      { id: 'C', text: '海洋垃圾。' },
      { id: 'D', text: '船隻漏油。' },
    ],
    correctPairs: {
      '1': ['B'],
      '2': ['A', 'B'],
      '3': ['C', 'D'],
    },
    explanation: '伐林直接摧毀動物棲息地(B)；燃煤石油與伐林均加劇溫室效應造成氣候變化(A, B)；海洋垃圾與船隻漏油造成水質污染(C, D)。',
  },
  {
    id: 'H4a_u2_07k_018_2',
    type: 'matching',
    chapter: 5,
    category: 'H4a_u2_07配對題_知識',
    prompt: '把以下人類活動與帶來的生態破壞影響配對。（答案可多於一個）',
    allowMultiTarget: true,
    leftItems: [
      { id: '1', label: '1. 過度耕作' },
      { id: '2', label: '2. 濫伐森林' },
      { id: '3', label: '3. 燃燒大量煤和石油' },
    ],
    rightTargets: [
      { id: 'A', text: '土壤失去植物保護。' },
      { id: 'B', text: '動物的棲息地減少。' },
      { id: 'C', text: '耕地面積減少。' },
      { id: 'D', text: '碳排放增加，加劇氣候變化。' },
    ],
    correctPairs: {
      '1': ['A', 'C'],
      '2': ['A', 'B'],
      '3': ['D'],
    },
    explanation: '過度耕作使土壤失去保護並退化造成耕地減少(A, C)；濫伐森林使土壤失去植物保護且動物棲息地銳減(A, B)；燃燒化石燃料排放大量二氧化碳加劇暖化(D)。',
  },
  {
    id: 'H4a_u2_07k_019_2',
    type: 'matching',
    chapter: 5,
    category: 'H4a_u2_07配對題_知識',
    prompt: '把以下環境問題與帶來的後果影響配對。（答案可多於一個）',
    allowMultiTarget: true,
    leftItems: [
      { id: '1', label: '1. 過度放牧' },
      { id: '2', label: '2. 濫伐森林' },
      { id: '3', label: '3. 水質污染' },
    ],
    rightTargets: [
      { id: 'A', text: '下游出現洪水氾濫。' },
      { id: 'B', text: '使土地不再荒漠化。' },
      { id: 'C', text: '造成土地荒漠化。' },
      { id: 'D', text: '影響食水供應。' },
    ],
    correctPairs: {
      '1': ['C'],
      '2': ['A', 'C'],
      '3': ['D'],
    },
    explanation: '過度放牧草被啃盡導致荒漠化(C)；濫伐森林降低吸水防洪能力引致洪水及荒漠化(A, C)；水污染危害食水供應(D)。',
  },
  {
    id: 'H4a_u2_07k_020_2',
    type: 'matching',
    chapter: 5,
    category: 'H4a_u2_07配對題_知識',
    prompt: '把以下環境問題與相關的緩減解決方法配對。（答案可多於一個）',
    allowMultiTarget: true,
    leftItems: [
      { id: '1', label: '1. 水質污染' },
      { id: '2', label: '2. 森林減少' },
      { id: '3', label: '3. 全球氣候變化' },
    ],
    rightTargets: [
      { id: 'A', text: '以可再生能源替代化石燃料。' },
      { id: 'B', text: '禁止非法排放污水。' },
      { id: 'C', text: '禁止捕獵瀕危動物。' },
      { id: 'D', text: '禁止非法砍伐。' },
    ],
    correctPairs: {
      '1': ['B'],
      '2': ['D'],
      '3': ['A', 'D'],
    },
    explanation: '嚴禁非法排污可治水污染(B)；禁非法砍伐可保森林(D)；可再生能源與保林減碳可緩解氣候變化(A, D)。',
  },
  {
    id: 'H4a_u2_07k_021_1',
    type: 'matching',
    chapter: 5,
    category: 'H4a_u2_07配對題_知識',
    prompt: '以下綠色環保做法可以減少消耗甚麼天然資源？請配對。',
    leftItems: [
      { id: '1', label: '1. 利用太陽能發電' },
      { id: '2', label: '2. 回收汽水罐' },
      { id: '3', label: '3. 減少使用紙張列印' },
    ],
    rightTargets: [
      { id: 'A', text: '金屬礦產。' },
      { id: 'B', text: '化石燃料。' },
      { id: 'C', text: '動物。' },
      { id: 'D', text: '樹木。' },
    ],
    correctPairs: {
      '1': ['B'],
      '2': ['A'],
      '3': ['D'],
    },
    explanation: '太陽能發電減少燃燒煤和石油（化石燃料B）；鋁罐回收節省金屬礦產(A)；減少用紙保護樹木(D)。',
  },
  {
    id: 'H4a_u2_07k_022_1',
    type: 'matching',
    chapter: 5,
    category: 'H4a_u2_07配對題_知識',
    prompt: '把以下空氣污染的影響與相關的具體現象描述配對。',
    leftItems: [
      { id: '1', label: '1. 危害健康' },
      { id: '2', label: '2. 患病人數上升' },
      { id: '3', label: '3. 能見度低' },
    ],
    rightTargets: [
      { id: 'A', text: '增加醫療開支。' },
      { id: 'B', text: '影響船隻航行。' },
      { id: 'C', text: '影響人們視力。' },
      { id: 'D', text: '引發呼吸系統、心臟等疾病。' },
    ],
    correctPairs: {
      '1': ['D'],
      '2': ['A'],
      '3': ['B'],
    },
    explanation: '空氣差危害健康引發呼吸道及心臟病(D)；求診人數上升推高醫療開支(A)；煙霞能見度低妨礙船隻交通航行(B)。',
  },
  {
    id: 'H4a_u2_07k_023_2',
    type: 'matching',
    chapter: 5,
    category: 'H4a_u2_07配對題_知識',
    prompt: '把以下改善空氣質素的方法與相關的作用描述配對。（答案可多於一個）',
    allowMultiTarget: true,
    leftItems: [
      { id: '1', label: '1. 停車等候時關掉引擎' },
      { id: '2', label: '2. 使用電動車輛' },
      { id: '3', label: '3. 節約用電' },
    ],
    rightTargets: [
      { id: 'A', text: '減低耗電量。' },
      { id: 'B', text: '減少汽車排放的廢氣。' },
      { id: 'C', text: '減少道路上的燃油汽車。' },
      { id: 'D', text: '減少食水污染。' },
    ],
    correctPairs: {
      '1': ['B'],
      '2': ['B', 'C'],
      '3': ['A'],
    },
    explanation: '停車熄匙減少汽車廢氣(B)；電動車替代燃油車且零尾氣排放(B, C)；節約用電降低發電廠負擔與耗電量(A)。',
  },
  {
    id: 'H4a_u2_07k_024_1',
    type: 'matching',
    chapter: 5,
    category: 'H4a_u2_07配對題_知識',
    prompt: '以下做法怎樣達致減少碳排放的效果？請配對。',
    leftItems: [
      { id: '1', label: '1. 選用節省能源的電器' },
      { id: '2', label: '2. 在屋頂鋪設太陽能發電板' },
      { id: '3', label: '3. 購買簡約包裝的產品' },
    ],
    rightTargets: [
      { id: 'A', text: '避免製造不必要的東西。' },
      { id: 'B', text: '減少用電量。' },
      { id: 'C', text: '減少購買電器。' },
      { id: 'D', text: '用可再生能源替代不可再生能源。' },
    ],
    correctPairs: {
      '1': ['B'],
      '2': ['D'],
      '3': ['A'],
    },
    explanation: '一級能效電器減少用電(B)；太陽能板用綠色可再生能源發電(D)；簡約包裝避免多餘製造及塑膠廢棄物(A)。',
  },
];

// ==========================================
// CHAPTER 4: 排序題 (H4a_u2_09k_001_1 ~ 002_1, + 地震海嘯逃生順序)
// ==========================================

export const CHAP4_ORDERING_QUESTIONS: OrderingQuestion[] = [
  {
    id: 'H4a_u2_09k_001_1',
    type: 'ordering',
    chapter: 4,
    category: 'H4a_u2_09排序題_知識',
    prompt: '把四大洋的面積由小至大順序排列出來。',
    directionHint: '由小至大（面積最小 → 面積最大）',
    items: [
      { id: 'A', text: '太平洋' },
      { id: 'B', text: '北冰洋' },
      { id: 'C', text: '印度洋' },
      { id: 'D', text: '大西洋' },
    ],
    correctOrder: ['B', 'C', 'D', 'A'],
    explanation: '四大洋面積由小至大依次為：北冰洋(B) → 印度洋(C) → 大西洋(D) → 太平洋(A)。太平洋最大，北冰洋最小。',
  },
  {
    id: 'H4a_u2_09k_002_1',
    type: 'ordering',
    chapter: 4,
    category: 'H4a_u2_09排序題_知識',
    prompt: '把以下四大洲的面積由小至大順序排列出來。',
    directionHint: '由小至大（面積最小 → 面積最大）',
    items: [
      { id: 'A', text: '大洋洲' },
      { id: 'B', text: '亞洲' },
      { id: 'C', text: '歐洲' },
      { id: 'D', text: '非洲' },
    ],
    correctOrder: ['A', 'C', 'D', 'B'],
    explanation: '大洲面積由小至大依次為：大洋洲(A) → 歐洲(C) → 非洲(D) → 亞洲(B)。大洋洲最小，亞洲最大。',
  },
  {
    id: 'H4a_u2_09k_006_custom',
    type: 'ordering',
    chapter: 4,
    category: 'H4a_u2_09排序題_知識',
    prompt: '在室內突然遇到強烈地震時，請按正確的避難應對行動先後順序排列出來。',
    directionHint: '時間先後順序（最先採取的行動 → 隨後的撤離行動）',
    items: [
      { id: 'A', text: '立刻趴下並躲在堅固的桌子下' },
      { id: 'B', text: '雙手抓緊桌腳，保護頭部與頸部' },
      { id: 'C', text: '劇烈搖晃停止後，關閉電源火源並帶上求生包' },
      { id: 'D', text: '經由走廊走火樓梯，迅速走到室外空曠地方集合' },
    ],
    correctOrder: ['A', 'B', 'C', 'D'],
    explanation: '地震發生首要「趴下、掩護、抓緊」(A→B)，搖晃停止後檢查安全並走樓梯疏散至空曠處(C→D)，絕不能搭升降機。',
  },
  {
    id: 'H4a_u2_09k_007_custom',
    type: 'ordering',
    chapter: 4,
    category: 'H4a_u2_09排序題_知識',
    prompt: '身處海岸邊遇到海嘯來襲時，請把正確的避險求生流程順序排列出來。',
    directionHint: '時間先後順序（最先接收警示 → 最終安全避難）',
    items: [
      { id: 'A', text: '接收到海嘯預警或察覺海水急劇退縮' },
      { id: 'B', text: '立即遠離海灘、海岸線及低窪地區' },
      { id: 'C', text: '迅速跑往內陸高地或堅固高樓高層避難' },
      { id: 'D', text: '留在高處安全地點，等待當局解除海嘯警報' },
    ],
    correctOrder: ['A', 'B', 'C', 'D'],
    explanation: '海嘯來襲時先識別前兆與警報(A)，立刻離開岸邊(B)，朝內陸高地狂奔(C)，在安全高處等待警報解除(D)。',
  },
];

// ==========================================
// CHAPTER 5: 排序題 (H4a_u2_09k_003_2 ~ 005_1, + 碳排放及污染鏈)
// ==========================================

export const CHAP5_ORDERING_QUESTIONS: OrderingQuestion[] = [
  {
    id: 'H4a_u2_09k_003_2',
    type: 'ordering',
    chapter: 5,
    category: 'H4a_u2_09排序題_知識',
    prompt: '把以下土地荒漠化的前因後果演變過程順序排列出來。',
    directionHint: '因果演變順序（人類活動起因 → 最終災害結果）',
    items: [
      { id: 'A', text: '過度耕作與放牧' },
      { id: 'B', text: '土地的養分和水分得不到補充' },
      { id: 'C', text: '土地貧瘠乾涸造成荒漠化' },
      { id: 'D', text: '土壤風化鬆散，引發沙塵暴' },
    ],
    correctOrder: ['A', 'B', 'C', 'D'],
    explanation: '人類過度耕作與放牧(A) → 土地養分水分耗盡(B) → 土地荒漠化(C) → 引起嚴重沙塵暴(D)。',
  },
  {
    id: 'H4a_u2_09k_004_1',
    type: 'ordering',
    chapter: 5,
    category: 'H4a_u2_09排序題_知識',
    prompt: '把以下中國四大水資源區按年降雨量由小至大順序排列出來。',
    directionHint: '由小至大（降雨量最少 → 降雨量最多）',
    items: [
      { id: 'A', text: '珠江' },
      { id: 'B', text: '長江' },
      { id: 'C', text: '黃河' },
      { id: 'D', text: '淮河' },
    ],
    correctOrder: ['C', 'D', 'B', 'A'],
    explanation: '我國水資源「南多北少」：北方黃河年降雨量最少(C) → 淮河(D) → 南方長江(B) → 最南端的珠江降雨量最多(A)。',
  },
  {
    id: 'H4a_u2_09k_005_1',
    type: 'ordering',
    chapter: 5,
    category: 'H4a_u2_09排序題_知識',
    prompt: '把以下中國著名河流由南至北地理順序排列出來。',
    directionHint: '由南至北（最南端河流 → 最北端河流）',
    items: [
      { id: 'A', text: '長江' },
      { id: 'B', text: '珠江' },
      { id: 'C', text: '淮河' },
      { id: 'D', text: '黃河' },
    ],
    correctOrder: ['B', 'A', 'C', 'D'],
    explanation: '中國河流由南往北地理分佈依次為：珠江(B, 華南) → 長江(A, 中部) → 淮河(C, 南北分界) → 黃河(D, 北方)。',
  },
  {
    id: 'H4a_u2_19k_002_1',
    type: 'ordering',
    chapter: 5,
    category: 'H4a_u2_09排序題_知識',
    prompt: '使用以下哪種出行方式產生的碳排放由最少至最多排列出來。',
    directionHint: '由少至多（最環保低碳 → 碳排放最多）',
    items: [
      { id: 'A', text: '步行或騎單車' },
      { id: 'B', text: '乘搭大型公共巴士或港鐵' },
      { id: 'C', text: '駕駛燃油私家車或乘搭的士' },
    ],
    correctOrder: ['A', 'B', 'C'],
    explanation: '步行單車零碳排放(A) → 公共交通人均排放低(B) → 私家車/的士人均耗油與碳排放最高(C)。',
  },
  {
    id: 'H4a_u2_19k_003_1',
    type: 'ordering',
    chapter: 5,
    category: 'H4a_u2_09排序題_知識',
    prompt: '把化石燃料燃燒加劇全球氣候變化的前因後果順序排列出來。',
    directionHint: '因果演變順序（人類消耗燃料 → 全球生態影響）',
    items: [
      { id: 'A', text: '開採並大量燃燒煤和石油發電行車' },
      { id: 'B', text: '向大氣中排放大量二氧化碳等溫室氣體' },
      { id: 'C', text: '全球氣溫上升，極端酷熱與暴雨颱風更頻繁' },
    ],
    correctOrder: ['A', 'B', 'C'],
    explanation: '燃燒煤和石油(A) → 排放大量二氧化碳(B) → 加劇溫室效應引發全球暖化與極端天氣(C)。',
  },
  {
    id: 'H4a_u2_19k_005_1',
    type: 'ordering',
    chapter: 5,
    category: 'H4a_u2_09排序題_知識',
    prompt: '把水質污染入侵食物鏈引致人類中毒的連鎖過程順序排列出來。',
    directionHint: '連鎖傳播順序（污染源頭 → 生物富集 → 人類生病）',
    items: [
      { id: 'A', text: '工廠與農場將未經處理的毒廢水排入河流海洋' },
      { id: 'B', text: '水體中的魚類和海產吸入毒素病變或死亡' },
      { id: 'C', text: '漁民在受污染海域捕撈魚蝦並運送至市場' },
      { id: 'D', text: '人類進食受重金屬或化學毒素污染的海鮮後生病中毒' },
    ],
    correctOrder: ['A', 'B', 'C', 'D'],
    explanation: '工廠排廢水(A) → 魚類吸入毒素受污染(B) → 漁船捕獲上市(C) → 市民食用損害健康食物中毒(D)。',
  },
];
