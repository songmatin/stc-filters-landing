# STC 濾鏡作品頁

這是里卡豆與 STC 合作使用的一頁式濾鏡作品頁，適合直接部署到 GitHub Pages。

## 部署方式

1. 將此資料夾內容作為 GitHub repository 根目錄。
2. 到 GitHub repository 的 `Settings` → `Pages`。
3. Source 選擇 `Deploy from a branch`。
4. Branch 選擇 `main`，資料夾選擇 `/root`。
5. 儲存後等待 GitHub Pages 部署完成。

## 主要檔案

| 檔案 | 用途 |
| --- | --- |
| `index.html` | STC 濾鏡一頁式作品頁。 |
| `assets/css/styles.css` | 網站樣式。 |
| `assets/js/main.js` | 頁尾年份更新。 |
| `robots.txt` | 搜尋引擎爬取設定。 |
| `sitemap.xml` | 網站地圖草案。 |
| `.nojekyll` | 避免 GitHub Pages 啟用 Jekyll 處理。 |

## 待上線後更新

- 將 `sitemap.xml` 裡的 `https://example.github.io/stc-filters/` 換成正式網址。
- 若使用自訂網域，新增 `CNAME` 檔案並設定 DNS。
