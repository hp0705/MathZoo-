# 02. Console & Network Log

## 1. Ghi nhận từ server cục bộ & smoke test
- Server `node tools/serve.mjs` chạy tại `http://127.0.0.1:4173`.
- Smoke test `GET /assets/audio/manifest.json` và `GET /api/tts?lang=vi|ja&text=...`: HTTP `200`, không có 404/5xx.
- Unit tests (`npm test`): 21/21 pass; `npm run validate`: 82 bài học & `voice-manifest.json` hợp lệ.

## 2. Log trình duyệt tích hợp (Chromium)
- **Trạng thái**: **KHÔNG XÁC MINH ĐƯỢC ĐẦY ĐỦ** — Trong lúc `browser` subagent đang chạy kiểm thử đến Vùng 2 Bài 10 (`Zone 2 Level 9 -> 10`), người dùng đã bấm **Stop** (`[BROWSER_USER_TAKEOVER]`), dừng phiên kiểm thử trình duyệt tự động trước khi thu thập xong bảng console/viewport đầy đủ cho 6 kích thước và các vùng 3–9.
- **Khuyến nghị**: Chạy lại kiểm thử trình duyệt cho 6 viewport (`1920x1080`, `1366x768`, `1180x820`, `1024x768`, `820x1180`, `768x1024`) và chụp ảnh lưu vào `/qa/shots/` khi có phiên trình duyệt rảnh.
