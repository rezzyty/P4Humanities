import React, { useState } from 'react';
import { X, BookOpen, Globe2, AlertTriangle, Map, Compass, CloudRain } from 'lucide-react';
import { ChapterNumber } from '../types';
import { sound } from '../utils/audio';

interface StudyNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultChapter?: ChapterNumber;
}

export const StudyNotesModal: React.FC<StudyNotesModalProps> = ({
  isOpen,
  onClose,
  defaultChapter = 1,
}) => {
  const [activeTab, setActiveTab] = useState<ChapterNumber>(defaultChapter);

  if (!isOpen) return null;

  const tabs: { ch: ChapterNumber; label: string; icon: React.ReactNode }[] = [
    { ch: 1, label: '第1課 小小考察隊', icon: <Map className="h-4 w-4" /> },
    { ch: 2, label: '第2課 漫遊香港', icon: <Compass className="h-4 w-4" /> },
    { ch: 3, label: '第3課 香港的氣候', icon: <CloudRain className="h-4 w-4" /> },
    { ch: 4, label: '第4課 發現地球', icon: <Globe2 className="h-4 w-4" /> },
    { ch: 5, label: '第5課 地球生病了', icon: <AlertTriangle className="h-4 w-4" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl border border-cyan-500/50 bg-slate-900/95 shadow-[0_0_50px_rgba(6,182,212,0.25)] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-cyan-500/30 px-6 py-4 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-950 border border-cyan-500/50 text-cyan-400">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-mono text-cyan-400">// TACTICAL BRIEFING DATABASE</div>
              <h2 className="text-lg font-bold text-white">常識温習戰術晶片筆記 (小四全單元)</h2>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-400 hover:text-white hover:border-rose-500 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Chapter Tabs */}
        <div className="flex overflow-x-auto border-b border-slate-800 bg-slate-950/40 px-6 pt-3 gap-1.5">
          {tabs.map((t) => (
            <button
              key={t.ch}
              onClick={() => {
                sound.playClick();
                setActiveTab(t.ch);
              }}
              className={`px-3.5 py-2 rounded-t-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 cursor-pointer flex-shrink-0 ${
                activeTab === t.ch
                  ? 'bg-slate-900 border-t-2 border-l border-r border-cyan-400 text-cyan-300 shadow-[0_-5px_15px_rgba(6,182,212,0.1)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-slate-200 text-sm">
          {activeTab === 1 && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-cyan-500/30 bg-cyan-950/20">
                <h3 className="text-base font-bold text-cyan-300 mb-2">1. 地圖種類與地理範圍</h3>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  <li><strong>世界地圖</strong>：顯示香港位於亞洲，香港在世界地圖上只是一小點。展示七大洲和四大洋。</li>
                  <li><strong>亞洲地圖</strong>：顯示中國位於亞洲，香港是中國東南端的城市。</li>
                  <li><strong>香港全境圖</strong>：顯示香港的三個主要區域（香港島、九龍、新界包括離島）。</li>
                  <li><strong>香港街道圖</strong>：詳細顯示各區街道名稱、重要建築物、交通站點設施。</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
                <h3 className="text-base font-bold text-cyan-300 mb-2">2. 地圖要素與圖例符號</h3>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  <li><strong>四大要素</strong>：標題（說明內容）、方向標（通常標向正北）、比例尺（換算實際距離與大小）、圖例（解釋地圖符號意義）。</li>
                  <li><strong>格網座標</strong>：以英文字母和數字組合（如 B2），方便快速精準找出景物位置。</li>
                  <li><strong>常見圖例</strong>：✉ 信封（郵政局）、H（酒店）、小（小學）、中（中學）、米字型（港鐵站）。</li>
                  <li><strong>電子地圖優點</strong>：路線規劃、計算時間、街景視圖、自動定位、搜尋店家電話地址。</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 2 && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-cyan-500/30 bg-cyan-950/20">
                <h3 className="text-base font-bold text-cyan-300 mb-2">1. 香港地勢特徵與發展限制</h3>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  <li>香港地形<strong>「山多平地少」</strong>，平地極少且分佈分散，海岸線非常曲折。</li>
                  <li>較大片平地位於九龍，以及新界北部和西北部。</li>
                  <li>全港最高山峰為<strong>大帽山</strong>（高957米），第二高峰為鳳凰山（高934米）。</li>
                  <li>因缺乏可用平地，香港建築物特色為<strong>「向高空發展」</strong>與<strong>「依山而建」</strong>。</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
                <h3 className="text-base font-bold text-cyan-300 mb-2">2. 克服限制與土地發展利弊</h3>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  <li><strong>移山填海</strong>：增加土地建屋，但會改變海岸線、收窄維港距離、引致水流湍急，並造成海洋污染威脅<strong>中華白海豚</strong>等海洋生態（在大嶼山北面設有<strong>沙洲及龍鼓洲海岸公園</strong>保護海豚）。</li>
                  <li><strong>赤鱲角機場</strong>：削平赤鱲角島山丘並填海興建，建跨海大橋與鐵路連接市區；已擴建第三條跑道。</li>
                  <li><strong>啟德舊址發展</strong>：騰出土地興建公私營房屋、啟德體育園、啟德郵輪碼頭。</li>
                  <li><strong>發展新市鎮</strong>：第一代（荃灣、沙田、屯門）；第二代（大埔、元朗、粉嶺/上水）；第三代（將軍澳、天水圍、東涌）。</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 3 && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-cyan-500/30 bg-cyan-950/20">
                <h3 className="text-base font-bold text-cyan-300 mb-2">1. 香港四季氣候特點</h3>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  <li><strong>春季（3-4月）</strong>：溫暖潮濕多霧，植物生長好時機；但易發霉、衣服難乾、大霧能見度低影響海陸空交通。</li>
                  <li><strong>夏季（5-9月）</strong>：炎熱多雨（雨量最多月份），常受暴雨、雷暴與熱帶氣旋吹襲。</li>
                  <li><strong>秋季（10-11月）</strong>：清涼乾爽少雨，宜遠足、放風箏、燒烤；但天氣乾燥極易引發山火。</li>
                  <li><strong>冬季（12-次年2月）</strong>：寒冷乾燥，偶受寒流侵襲氣溫驟降；香港不會下雪。</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-950/20">
                <h3 className="text-base font-bold text-rose-300 mb-2">2. 惡劣天氣警告與應對安全</h3>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  <li><strong>熱帶氣旋警告</strong>：一號 ➔ 三號 ➔ 八號（停課停工）➔ 九號 ➔ 十號。當風玻璃窗貼膠紙防震碎，盡快回家。</li>
                  <li><strong>暴雨警告</strong>：黃雨(每小時超過30mm) ➔ 紅雨(每小時超過50mm) ➔ 黑雨(每小時超過70mm)。遠離河道山泥傾瀉高危斜坡。</li>
                  <li><strong>雷暴警告</strong>：立即停止水上活動，切勿站在山頂或大樹金屬下避雷。</li>
                  <li><strong>酷熱天氣警告</strong>：多喝水、穿透氣衣服、避免長時間戶外暴曬防中暑。</li>
                  <li><strong>寒冷天氣警告</strong>：注意保暖、關心長者、小心使用電暖爐（切勿覆蓋雜物或共用插座）。</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 4 && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-cyan-500/30 bg-cyan-950/20">
                <h3 className="text-base font-bold text-cyan-300 mb-2">1. 地球表面、大洲大洋與自然環境</h3>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  <li>地球是巨大球體，表面由陸地和海洋組成，海洋面積遠大於陸地。</li>
                  <li><strong>七大洲</strong>：亞洲（最大）、非洲、北美洲、南美洲、南極洲、歐洲、大洋洲（最小）。</li>
                  <li><strong>四大洋</strong>：太平洋（最大）、大西洋、印度洋、北冰洋（最小）。香港面向太平洋。</li>
                  <li><strong>自然環境</strong>：溫帶草原（平坦畜牧）、熱帶雨林（炎熱多雨高腳屋）、沙漠（日夜溫差大穿長袍騎駱駝）、極地（嚴寒捕魚住冰屋）。</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
                <h3 className="text-base font-bold text-cyan-300 mb-2">2. 自然災害與防災應變</h3>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  <li><strong>地震</strong>：地殼劇烈震動。室內趴下躲堅固桌下，室外走到空曠處，<strong>切勿乘搭升降機</strong>。</li>
                  <li><strong>海嘯</strong>：多由海底地震引發巨浪。迅速遠離海岸逃往內陸高地。</li>
                  <li><strong>火山爆發</strong>：噴出高溫熔岩與有毒火山灰，破壞農田房屋。</li>
                  <li><strong>防災措施</strong>：先進儀器預報、定期演習、加強抗震建築、人道救援（紅十字會、世界宣明會）。</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 5 && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-cyan-500/30 bg-cyan-950/20">
                <h3 className="text-base font-bold text-cyan-300 mb-2">1. 天然資源與環境危機</h3>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  <li>四大天然資源：動物、植物、水、礦產資源（大多有限）。</li>
                  <li><strong>過度伐林與放牧</strong>：水土流失、涵養水分能力大減引發水浸、土地荒漠化。</li>
                  <li><strong>過度燃燒煤石油</strong>：排放大量二氧化碳，加劇溫室效應與全球氣候變化。</li>
                  <li><strong>水質污染</strong>：工業污水與垃圾破壞海洋河流生態，威脅食水供應與健康。</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20">
                <h3 className="text-base font-bold text-emerald-300 mb-2">2. 治理對策與綠色生活</h3>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  <li><strong>治沙工程</strong>：沙漠邊緣「鎖邊工程」植樹鋪沙障；貴州畢節「退耕還林」。</li>
                  <li><strong>解決缺水</strong>：我國水資源南多北少，推行「南水北調」工程。香港輸入東江水，徵收排污費。</li>
                  <li><strong>雙碳承諾</strong>：2030碳達峰、2060碳中和；發展太陽能、風能、水能可再生能源。</li>
                  <li><strong>香港空氣改善</strong>：停車熄匙、推廣電動車、天然氣清潔發電。</li>
                  <li><strong>學生低碳生活</strong>：衣（按需購買、舊衣捐贈）、食（簡約包裝、不浪費）、住（節電省水、一級能效）、行（多走樓梯、乘公共交通）。</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="border-t border-cyan-500/30 px-6 py-3 bg-slate-950/80 flex justify-end">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold font-mono text-xs transition-colors cursor-pointer"
          >
            關閉戰術筆記 (CLOSE)
          </button>
        </div>
      </div>
    </div>
  );
};
