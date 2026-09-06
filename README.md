# 電商易 EshopEasy

香港中小企網站及 iOS App 宣傳頁。公開品牌為 **電商易**（中文）／ **EshopEasy**（英文）。倉庫名稱維持 `katan-studio`，GitHub Pages 路徑為 [`/eshop-easy/`](https://eshopeasyhk.github.io/eshop-easy/)。

聯絡人：電商易技術顧問。查詢 WhatsApp：[wa.me/85246726613](https://wa.me/85246726613)。

## 本機預覽

靜態檔案，以任何 HTTP server 開啟根目錄即可（請勿使用 `file://`，相對路徑及字型較為穩定）：

```bash
python3 -m http.server 8080
```

然後開啟 <http://localhost:8080/>。

## 開啟 GitHub Pages

上線目標：<https://eshopeasyhk.github.io/eshop-easy/>

私隱政策：<https://eshopeasyhk.github.io/eshop-easy/privacy.html>

1. 將 `main` 推送至 GitHub（本倉庫的預設分支）。
2. 開啟 **Settings → Pages**。
3. **Source** 選擇 **Deploy from a branch**。
4. Branch 選擇 **`main`**，資料夾選擇 **`/ (root)`**。
5. 儲存。數分鐘後即可使用上述 Pages 網址。

無需 Jekyll build（已放置 `.nojekyll`）。`index.html`、`privacy.html`、`css/`、`js/`、`assets/` 全部使用相對路徑，於 `/eshop-easy/` 底下可正常載入。

## 內容備註

- 套餐價（港幣）：形象網站 HK$3,800；商務網站 HK$9,800；網店／預約 HK$19,800；iOS App 視專案複雜程度面議，價格低至 HK$24,800（涵蓋設計、製作及上架）；每月保養 HK$280–480。
- 核心服務並重：網站設計與建構；iOS App 設計、製作及上架服務。
- 作品案例僅列出已上線的 [Wonderland JP](https://wonderlandjpjp.com)（wonderlandjpjp.com），不展示虛構評價或標誌。
- 查詢熱線 WhatsApp：46726613。


## 內容後台（簡易 CMS）

- 後台網址：https://eshopeasyhk.github.io/eshop-easy/admin/
- 可改：主題色、文案、聯絡電話、套餐、常見問題
- 登入：用 `eshopeasyhk` 帳戶的 GitHub Personal Access Token（classic，需 `repo`）
- 儲存後會更新 `data/site.json` 並推上 `main`；GitHub Pages 約 1–2 分鐘刷新
- Token 只存在瀏覽器 sessionStorage，關閉分頁即清除；請勿把 Token 貼到公開地方
