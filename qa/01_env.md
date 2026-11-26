# 01. Nhận diện môi trường & Kiến trúc MathZoo

## 1. Tech Stack
- **Frontend**: HTML5, CSS3, JavaScript thuần (ES Modules, không framework, không bundler, 0 dependencies runtime trong `package.json`).
- **Âm thanh hiệu ứng (SFX)**: Web Audio API (`js/audio/sfx.js` — `AudioContext` / `webkitAudioContext`).
- **Giọng đọc (TTS)**: Kết hợp 3 tầng trong `js/audio/speak.js`:
  1. **Audio MP3 tĩnh tạo sẵn** (`assets/audio/vi/*.mp3`, `assets/audio/ja/*.mp3`, chỉ mục `assets/audio/manifest.json`) sinh từ `edge-tts` (`vi-VN-HoaiMyNeural`, `ja-JP-NanamiNeural`).
  2. **API TTS cục bộ** (`/api/tts` trong `tools/serve.mjs` gọi `tools/tts_helper.py` + `edge-tts`, cache vào `.cache/tts/`) cho câu động (tên bé tùy chỉnh, câu ghép mới).
  3. **Fallback Web Speech API** (`window.speechSynthesis` / `SpeechSynthesisUtterance`) khi không có file tĩnh và `/api/tts` không khả dụng.
- **Thư viện bên thứ ba**:
  - Runtime web app: **Không có** (0 npm dependencies).
  - Công cụ tạo giọng nói cục bộ (dev/server): Python `edge-tts` (7.3.1).
  - Kiểm thử QA: Playwright (`qa/node_modules/playwright`) cài riêng trong `/qa/`.

## 2. Cách chạy ứng dụng
- **Dev server cục bộ**: `node tools/serve.mjs` (mặc định `http://127.0.0.1:4173`, đổi cổng qua biến môi trường `PORT`).
- **Unit tests có sẵn**: `npm test` (`node --test tests/`, 21 test).
- **Xác thực dữ liệu**: `npm run validate` (`node tools/validate-data.mjs`).

## 3. Danh sách file nội dung & dữ liệu
- `data/lessons.json`: 82 bài học chia 9 giai đoạn (Vùng 1–8 chính + Vùng 9 Quảng trường Lễ hội tùy chọn).
- `data/story.json`: Cốt truyện theo 8 chương (nhân vật, đồ vật, `intro`, `beats.mid`, `beats.close`, `finale`).
- `data/phrases.json`: Bộ câu khen (`praise`, `streak`), báo sai 3 mức (`wrong1`, `wrong2`, `wrong3`, `wrong3cmp`), hoàn thành (`finish`).
- `data/voice-manifest.json`: 7 câu thoại cốt truyện mẫu song ngữ.
- `i18n/vi.json`, `i18n/ja.json`: Chuỗi giao diện, câu hỏi UI, gợi ý, từ toán học, Góc Phụ Huynh.
- `assets/audio/manifest.json`: Danh sách hash MP3 tĩnh (`vi`: 192, `ja`: 222).
- Logic sinh đề động: `js/core/problem-gen.js`, `js/core/compare.js`, `js/core/number-words.js`, `js/core/ordinal-time.js`.

## 4. Cách lưu tiến độ
- Lưu trong `localStorage` dưới key `mathzoo.v1` (`js/core/storage.js`):
  - `version`, `settings` (`nameVi`, `nameJa`, `speakVi`, `speakJa`, `gender`, `lang`, `volume`, `dailyLimit`, `showSignEyes`), `stars` (sao theo `lesson.id`), `stickers` (mảng stage đã mở), `sessions`, `medal`, `playToday`.
- Có **in-memory fallback** (`memoryFallback`) khi `localStorage` bị chặn hoặc ném lỗi (Private mode / sandbox).
