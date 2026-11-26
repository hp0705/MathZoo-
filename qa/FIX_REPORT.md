# Báo cáo Sửa lỗi MathZoo (FIX_REPORT)

## Tóm tắt kiểm chứng
- **Unit tests (`npm test`)**: **21/21 pass** (chạy lại sau mỗi nhóm A → B → C → D).
- **Xác thực dữ liệu (`npm run validate`)**: **84/84 bài học** và `voice-manifest.json` hợp lệ.
- **Kiểm toán nội dung (`node qa/audit-content.mjs`)**: `mathErrors: 0`, `choiceErrors: 0`, `jaKanjiCount: 0`, `staticIssuesCount: 0`.

---

## Chi tiết từng mục đã sửa

### Nhóm A – Lỗi chặn nội dung (Vùng 9 + sinh bài)
- **A1 (QA-01)** – Đã sửa: `js/ui/activities-plaza.js` (`renderA14MeasureTime`, các hàm `renderCompareMeasure`, `renderMeasureUnits`, `renderDaysSeasons`).
  - Bổ sung 3 nhánh riêng cho `compareMeasure` (dài/ngắn, cao/thấp, nặng/nhẹ bằng hình), `measureUnits` (gang tay/bước chân/cái cốc), và `daysSeasons` (thứ tự ngày trong tuần & 4 mùa có hình + giọng đọc).
  - Kiểm chứng: `qa/audit-content.mjs` xác nhận `staticIssuesCount: 0`.
- **A2 (QA-02)** – Đã sửa: `js/ui/activities-plaza.js` (`renderA13ShapeOrPos`, nhánh `topic === "solid"`).
  - Bổ sung hình khối 3D SVG (`sphere`, `cylinder`, `cube`, `cuboid`) và tên VI/JA (`khối cầu` / `たまの かたち`, `khối trụ` / `つつの かたち`, `khối vuông` / `さいころの かたち`, `khối chữ nhật` / `はこの かたち`).
  - Kiểm chứng: `qa/audit-content.mjs` xác nhận `A13:solid` có nhánh riêng.
- **A3 (QA-03)** – Đã sửa: `js/ui/activities-plaza.js` (`renderA14MeasureTime`, nhánh đo khối).
  - Thay `[len, len - 1, len + 1]` bằng `shuffle([len, len - 1, len + 1])`.
- **A4 (QA-06)** – Đã sửa: `js/ui/activities-plaza.js` (`renderA13ShapeOrPos`).
  - Xóa lời gọi `onSpeakText(prompt)` bị trùng, chỉ giữ 1 lần ở cuối mỗi nhánh.
- **A5 (QA-07)** – Đã sửa: `js/ui/lesson-a123.js` (`renderA2`).
  - Sinh `target` trong `1..max` (đạt được `max`, ví dụ `10`) và tránh lặp `lastA2Target` 2 lần liên tiếp.
- **A6 (QA-08)** – Đã sửa: `js/ui/activities-extra.js` (`renderA9Board`).
  - Giới hạn toàn bộ đáp án nhiễu nằm trong `[1, max]`, không trùng nhau và không trùng đáp án đúng.

### Nhóm B – Giọng đọc (TTS)
- **B1 (QA-04)** – Đã sửa: `js/core/number-words.js` (`JA_HON`, `countWords` hỗ trợ `hon`), `js/ui/scene-give-receive.js` (`buildStoryText`).
  - Loại bỏ ghép số trần `${a}ひき`/`${a}こ`, dùng `countWords(a, counter, "ja")` cho biến âm chuẩn (`いっぴき`, `さんびき`, `いっこ`, `ろっこ`, `いっぽん`...). Bản VI đọc bằng `numberToWords` (`một`, `hai`... `mười lăm`, `hai mươi mốt`).
- **B2** – Đã sửa: `js/ui/tracing.js` (`renderTracing`), `js/ui/lesson.js`.
  - Truyền `numberToWords(digit, lang)` vào `onSpeakText` thay cho chữ số trần `0..9`, giữ nguyên chữ số hiển thị trên màn hình.
- **B3** – Đã sửa: `js/audio/speak.js` (`splitSentences`, `speakSegments`), `data/phrases.json` (`wrong1`).
  - Tự động tách câu dài thành các đoạn ngắn theo dấu câu với khoảng nghỉ `280ms` giữa các đoạn; làm mềm lời báo sai `wrong1` (bỏ `"Sai rồi"` / `"Sai mất rồi!"`, giữ khích lệ nhẹ nhàng).
  - Kiểm chứng: `T13` trong `npm test` pass.
- **B4** – Đã sửa: `tools/generate-audio.mjs` & `assets/audio/`.
  - Bổ sung sinh sẵn MP3 cho các đoạn câu tách lẻ, câu động A4 hữu hạn (`8 chương × 10 số`), toàn bộ prompt A13/A14, và `tracePrompt` đọc bằng chữ.
- **B5 (QA-09)** – Đã sửa: `js/ui/activities-plaza.js` (`SHAPE_NAMES.square.ja` = `"ましかく"`).

### Nhóm C – Hình minh họa & hỗ trợ bé
- **C1 (QA-05)** – Đã sửa: `js/ui/scene-give-receive.js` (`renderGiveReceive`).
  - `kind === "missing"`: hiển thị `b` vật rõ + `a - b` ô `?` nét đứt.
  - `kind === "compare"`: vẽ 2 hàng song song (`a` và `b` vật) để bé đối chiếu 1-1.
- **C2 (QA-10)** – Đã sửa: `js/ui/lesson.js` (`showBanner`), `css/app.css` (`.feedback-banner`).
  - Hiển thị banner ngắn ở phía trên (`top: 82px`, `pointer-events: none`) khi khen/gợi ý và tự ẩn sau `2000ms`, không che khu vực bấm.
- **C3 (QA-11)** – Đã sửa: `js/ui/activities-plaza.js` (`A14 clock`).
  - Thêm nút loa `🔊` (`48x48px`) bên cạnh mỗi lựa chọn giờ để bé nghe đọc trước khi chọn.

### Nhóm D – Bổ sung nội dung lớp 1 (VN + Nhật)
- **D1** – Đã sửa: `js/ui/activities-extra.js` (`renderA15Neighbor`), `js/ui/lesson.js`, `data/lessons.json` (`s9-l09`).
  - Bài số liền trước / liền sau (`1–10` và `1–20`), 0 Kanji, đáp án xáo trộn.
- **D2** – Đã sửa: `js/ui/activities-extra.js` (`renderA16Bond`), `js/ui/lesson.js`, `data/lessons.json` (`s9-l09`).
  - Bài tách/ghép số trong phạm vi 10 (`いくつといくつ` / `"mấy và mấy"`) kèm 2 nhóm hình minh họa.
- **D3 (QA-12)** – Đã sửa: `js/ui/activities-plaza.js` (`renderA13ShapeOrPos` `topic === "position"`).
  - Bổ sung trên/dưới (`うえ/した`) và trước/sau (`まえ/うしろ`) bên cạnh trái/phải (`ひだり/みぎ`).
- **D4** – Đã sửa: `js/core/ordinal-time.js` (`clockWords` hỗ trợ `half`), `js/ui/activities-plaza.js` (`topic === "clockHalf"`), `data/lessons.json` (`s9-l10`).
  - Hỗ trợ đồng hồ nửa giờ (`rưỡi` / `はん`, kim phút chỉ 6, kim giờ nhích giữa) kèm nút loa `🔊`.
- **D5** – Đã sửa: `js/ui/activities-plaza.js` (`renderA12Pattern`).
  - Mở rộng quy luật lặp thêm `AAB` và `ABB` bên cạnh `ABAB`.
- **Cập nhật dữ liệu & kiểm thử**: `data/lessons.json` thêm `s9-l09` và `s9-l10` (mỗi bài 8 hoạt động), cập nhật `tools/validate-data.mjs` (`84` bài).

---

## Mục chưa làm được
- **Không có** (toàn bộ A1–A6, B1–B5, C1–C3, D1–D5 đã hoàn thành và pass `npm test`, `npm run validate`, `qa/audit-content.mjs`).
