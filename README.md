# Cyber Earth: 小四常識地球防衛戰 (第4課與第5課特訓)

專為香港小學四年級學生打造的賽博科技風常識線上練習系統，涵蓋教育出版社單元二《地球是我家》：
- **第4課《發現地球》**：全套選擇題、填充題、供詞填充題、判斷題
- **第5課《地球生病了》**：全套選擇題、填充題、供詞填充題、判斷題

---

## ⚡ GitHub Pages 出現白屏與 `404 main.tsx` 的解決方法

如果您將代碼上傳到了 GitHub 並開啟了 GitHub Pages，但看到白屏且 Console 出現：
```
Failed to load resource: the server responded with a status of 404 () main.tsx:1
```

### 為什麼會這樣？
因為瀏覽器無法直接運行未編譯的 TypeScript 檔案（`.tsx`）。GitHub Pages 預設只是單純讀取倉庫原始碼，並沒有執行打包（Build）。

### 一鍵修復步驟（推薦：使用專案內建的 GitHub Actions 自動打包）：
本專案已為您配置好 `.github/workflows/deploy.yml` 自動打包流程，只需在 GitHub 倉庫切換設定：

1. 打開您的 GitHub 倉庫頁面。
2. 點擊頂部的 **「Settings」**（設定）標籤頁。
3. 在左側選單點擊 **「Pages」**。
4. 在 **「Build and deployment」** 區塊下，找到 **「Source」** 下拉選單：
   * 將預設的 **Deploy from a branch** 改為 👉 **「GitHub Actions」**。
5. 點擊儲存後，GitHub 就會自動執行工作流程，將打包後的網頁自動發布！
6. 等候約 1 分鐘後，刷新您的 GitHub Pages 網址即可正常運行！

---

## 方式一：直接在電腦瀏覽器打開（最簡單，免安裝任何工具）

本應用已經部署上線，您無需在電腦安裝任何程式或 GitHub，直接在瀏覽器打開以下網址即可全螢幕使用：

👉 **線上練習網址：**  
https://ais-pre-zx4fpdepbwjo45udoob5d4-524386916866.asia-northeast1.run.app

* 支援加入瀏覽器書籤（我的最愛），隨時打開即可溫習。
* 答題紀錄與 EXP 成就會自動保存在該電腦的瀏覽器中。

---

## 方式二：下載程式碼並在本地電腦執行 (Local Desktop Run)

如果您想下載整個專案在電腦離線運行：

### 1. 安裝環境準備
* 請先確保電腦已安裝 **Node.js**（建議版本 18 或以上）：  
  官方下載網址：https://nodejs.org/

### 2. 開啟終端機 (Terminal / CMD)
在電腦中打開命令提示字元（Windows: CMD 或 PowerShell / Mac: Terminal），並切換到專案資料夾：
```bash
cd /你的專案資料夾路徑
```

### 3. 安裝依賴套件並啟動
```bash
npm install
npm run dev
```
啟動後在瀏覽器打開終端機顯示的網址（如 `http://localhost:3000`）即可！

