# Báo cáo QA – Vườn thú MathZoo

> File chi tiết kèm theo trong `/qa/`: [01_env.md](01_env.md) | [02_console_log.md](02_console_log.md) | [03_content_dump.json](03_content_dump.json) | [04_voice_log.json](04_voice_log.json) | [04b_voice_listen_checklist.md](04b_voice_listen_checklist.md) | [05_curriculum_coverage.md](05_curriculum_coverage.md)

---

## 1. Tóm tắt (10 dòng)
- **Trạng thái app**: Chạy ổn định trên server cục bộ (`node tools/serve.mjs`), 21/21 unit test và 82/82 bài học pass `validate-data.mjs`.
- **Tổng số lỗi phát hiện**: **0 P0**, **6 P1**, **6 P2** (12 lỗi từ kiểm toán code + dữ liệu + giọng đọc).
- **5 vấn đề quan trọng nhất**:
  1. **[P1] Quảng trường Lễ hội (Vùng 9)**: 4 bài (`s9-l02` hình khối 3D, `s9-l05` so sánh đo, `s9-l06` đơn vị đo, `s9-l07` ngày trong tuần & 4 mùa) bị **rơi nhánh** về hình phẳng hoặc đo khối, nội dung thực tế không hiển thị đúng chủ đề.
  2. **[P1] Đáp án A14 (Đo khối) không xáo trộn**: Mảng lựa chọn luôn là `[len, len - 1, len + 1]`, đáp án đúng **luôn ở vị trí đầu tiên**.
  3. **[P1] Giọng đọc A4 Tiếng Nhật ghép số Ả Rập với bộ đếm (`${a}ひき`, `${a}こ`)**: Không dùng `countWords()`, khiến TTS có thể đọc sai biến âm (`1ひき` → *いちひき* thay vì *いっぴき*, `3ひき` → *さんひき* thay vì *さんびき*).
  4. **[P1] Hình minh họa A4 (`missing` & `compare`) sai ngữ cảnh**: `missing` tô mờ ngược số lượng và `compare` chỉ vẽ 1 nhóm thay vì 2 nhóm để bé so sánh.
  5. **[P1] Rủi ro iPad Safari & đọc lặp**: `renderA13ShapeOrPos` gọi `onSpeakText(prompt)` **2 lần** cho câu hình học; `lesson.js` ẩn `bannerEl` nên khi iOS chưa mở khóa âm thanh, bé không thấy chữ khích lệ/gợi ý.

---

## 2. Môi trường & Cách app phát giọng
(Chi tiết tại [qa/01_env.md](01_env.md))
- **Stack**: HTML5, CSS3, JavaScript thuần (ES Modules, 0 runtime dependencies). Hiệu ứng âm thanh dùng Web Audio API (`js/audio/sfx.js`). Tiến độ lưu tại `localStorage` key `mathzoo.v1` có fallback RAM (`js/core/storage.js`).
- **Cách phát giọng (`js/audio/speak.js`)**:
  1. Ưu tiên MP3 tĩnh sinh sẵn từ `edge-tts` (`assets/audio/vi/*.mp3` [192 file], `assets/audio/ja/*.mp3` [222 file], chỉ mục `assets/audio/manifest.json`).
  2. Câu động (tên bé tùy chỉnh, câu chuyện A4, phép tính) gọi `/api/tts` trên `tools/serve.mjs` (gọi `tools/tts_helper.py` + `edge-tts`, cache tại `.cache/tts/`).
  3. Fallback `window.speechSynthesis` (chọn giọng `Online.*Natural` / `HoaiMy` / `Nanami`, `rate: 0.95`, `pitch: 1.02`) khi deploy tĩnh/offline.

---

## 3. Danh sách lỗi theo mức độ

### Mức P1 (Nặng – sai nội dung dạy học / sai đáp án / lỗi giọng đọc chính)

| ID | Nơi xảy ra | Cách tái hiện | Kết quả thực tế | Kết quả mong đợi | Bằng chứng |
| --- | --- | --- | --- | --- | --- |
| **QA-01** | Vùng 9: `s9-l05`, `s9-l06`, `s9-l07` (`A14`) | Mở Bài 5, 6, 7 ở Quảng trường Lễ hội | `renderA14MeasureTime` chỉ kiểm tra `if (topic === "clock")`, nên `compareMeasure`, `measureUnits`, `daysSeasons` đều rơi vào nhánh đo khối | Hiển thị đúng bài so sánh dài/cao/nặng, đơn vị đo, và ngày/mùa | `js/ui/activities-plaza.js:117-168`; `qa/audit-content.mjs` (12 activity lỗi) |
| **QA-02** | Vùng 9: `s9-l02` (`A13`, `topic: "solid"`) | Mở Bài 2 ở Quảng trường Lễ hội | `renderA13ShapeOrPos` chỉ kiểm tra `if (topic === "position")`, nên `solid` rơi vào nhánh hình phẳng 2D (`circle/square/triangle/rectangle`) | Hiển thị hình khối 3D (khối cầu, trụ, vuông, chữ nhật) | `js/ui/activities-plaza.js:56-85`; `data/lessons.json` |
| **QA-03** | Vùng 9: `s9-l05..06..07` / `A14` đo khối | Chơi hoạt động đo khối bất kỳ | `const opts = [len, len - 1, len + 1]` không trộn thứ tự; đáp án đúng **100% ở nút đầu tiên** | Các lựa chọn phải được xáo trộn ngẫu nhiên | `js/ui/activities-plaza.js:169` |
| **QA-04** | Vùng 2–8: `A4` (`scene-give-receive.js`, mode JA) | Chơi bài cộng/trừ A4 ở ngôn ngữ `日本語` | `buildStoryText` ghép `${a}${unit}` (`1ひき`, `3ひき`, `6こ`, `8こ`, `10ひき`), không dùng `countWords()` | Dùng `countWords(a, counter, "ja")` để TTS đọc đúng biến âm (`いっぴき`, `さんびき`, `いっこ`...) | `js/ui/scene-give-receive.js:11-21`; `qa/04_voice_log.json` |
| **QA-05** | Vùng 2–4: `A4` (`missing`, `compare`) | Chơi câu hỏi `kind: "missing"` hoặc `"compare"` | `missing` làm mờ `b` vật cuối thay vì thể hiện phần thiếu; `compare` chỉ vẽ 1 nhóm `a` vật thay vì 2 nhóm `a` và `b` | `missing` hiển thị rõ nhóm đã thấy & phần ẩn; `compare` vẽ 2 nhóm song song | `js/ui/scene-give-receive.js:53-74` |
| **QA-06** | Vùng 9: `s9-l01` (`A13` hình học) | Mở câu hỏi chọn hình phẳng | `renderA13ShapeOrPos` gọi `onSpeakText(prompt)` ở cả dòng 97 và dòng 114, khiến câu bị hủy giữa chừng rồi đọc lại | Chỉ gọi `onSpeakText(prompt)` 1 lần | `js/ui/activities-plaza.js:97,114` |

### Mức P2 (Nhẹ – bất tiện, thiếu phủ sóng nhỏ, rủi ro phụ)

| ID | Nơi xảy ra | Cách tái hiện | Kết quả thực tế | Kết quả mong đợi | Bằng chứng |
| --- | --- | --- | --- | --- | --- |
| **QA-07** | Vùng 1–4: `A2` (`renderA2`) | Chơi hoạt động đếm chọn số A2 | `generateProblem({ kind: "add", max })` sinh `p.a` tối đa `max - 1`, nên `target` không bao giờ bằng `max` (vd: số 10) | `target` có thể nhận giá trị `1..max` | `js/ui/lesson-a123.js:48-49` |
| **QA-08** | Vùng 4, 7: `A9` (`renderA9Board`) | Chơi bảng số khi `answer === max` | `while (choices.length < 3) choices.push(choices[choices.length - 1] + 2)` có thể tạo đáp án `22` vượt `max=20` | Đáp án nhiễu nằm trong `[1, max]` | `js/ui/activities-extra.js:125` |
| **QA-09** | Vùng 9: `s9-l01` (`SHAPE_NAMES.square.ja`) | Chơi hình vuông ở mode Nhật | Dùng `"しかく"` thay vì `"ましかく"` như đặc tả (`07-giong-doc-va-chu.md`) | Thống nhất `"ましかく"` để phân biệt với `"ながしかく"` | `js/ui/activities-plaza.js:13` |
| **QA-10** | Toàn app: `lesson.js` (`showBanner`) | Trả lời đúng hoặc sai khi tắt/chưa có âm thanh | `showBanner` luôn đặt `bannerEl.hidden = true`, không hiện chữ khen/gợi ý | Hiện banner hoặc phụ đề ngắn khi cần hỗ trợ trực quan | `js/ui/lesson.js:24-27` |
| **QA-11** | Vùng 9: `s9-l08` (`clock` A14) | Bé 4–5 tuổi chưa biết đọc chơi bài đồng hồ | Nút chọn giờ chỉ có chữ (`"bốn giờ"`, `"よじ"`), không có nút nghe từng lựa chọn | Có thể chạm giữ/nút loa đọc lựa chọn | `js/ui/activities-plaza.js:147-162` |
| **QA-12** | Vùng 9: `s9-l03` (`position` A13) | Chơi bài vị trí | Chỉ kiểm tra `trái / phải`, chưa có `trên / dưới`, `trước / sau` | Bổ sung cặp vị trí trên-dưới, trước-sau | `js/ui/activities-plaza.js:57-83` |

---

## 4. Kết quả giọng đọc (TTS)

### Bảng vấn đề theo ngôn ngữ
| Tiêu chí | Tiếng Việt (`vi-VN`) | Tiếng Nhật (`ja-JP`) |
| --- | --- | --- |
| Nguồn giọng chính | `vi-VN-HoaiMyNeural` (MP3 tĩnh + `/api/tts`) | `ja-JP-NanamiNeural` (`rate=-8%`, `pitch=+3Hz`) |
| Fallback trình duyệt | `Online/Natural` → `HoaiMy/Linh/Google` (`rate=0.95`) | `Online/Natural` → `Nanami/Aoi/Kyoko/O-Ren` (`rate=0.95`) |
| Đọc số & phép tính | Đúng `lăm`, `mốt`, `tư`, `mười`, `cộng/trừ/bằng` trong `number-words.js` | Đúng `よん/なな/きゅう` và giờ `よじ/しちじ/くじ`; **0 Kanji** ở phần của bé |
| Lỗi ghép số Ả Rập | Câu A4 dùng `${a} quả` (tạm ổn nhưng nếu fallback trình duyệt dễ đọc khựng) | **Lỗi [QA-04]**: A4 dùng `${a}ひき`, `${a}こ` (TTS có thể đọc sai biến âm) |
| Câu quá dài (>12 từ) | **21/128** mẫu log > 12 từ (câu dẫn chuyện `story-intro` 15–22 từ & câu A4) | Câu truyện + A4 dài 35–48 ký tự, nên tách nghỉ rõ hơn |
| Chồng giọng / Cancel | Có gọi `cancelSpeech()` trước mỗi `speakSegments`; nhưng `A13` gọi 2 lần liên tiếp **[QA-06]** | Tương tự |
| Khoảng nghỉ & đổi ngôn ngữ | Nghỉ `240ms` giữa các đoạn; không fallback chéo ngôn ngữ | Tương tự |

### 15 mẫu `text_được_đọc` đáng ngờ nhất (trích từ [04_voice_log.json](04_voice_log.json))
1. `A4:give-receive(hiki)` (ja): `"かめは さかなを 1ひき もっています。ともだちに 1ひき あげました。のこりは いくつ？"` — dùng `1ひき` thay vì `いっぴき`.
2. `A4:give-receive(hiki)` (ja): `"かめは さかなを 3ひき もっています。ともだちに 1ひき あげました。のこりは いくつ？"` — dùng `3ひき` thay vì `さんびき`.
3. `A4:give-receive(hiki)` (ja): `"かめは さかなを 6ひき もっています。ともだちに 1ひき あげました。のこりは いくつ？"` — dùng `6ひき` thay vì `ろっぴき`.
4. `A4:give-receive(hiki)` (ja): `"かめは さかなを 8ひき もっています。ともだちに 1ひき あげました。のこりは いくつ？"` — dùng `8ひき` thay vì `はっぴき`.
5. `A4:give-receive(hiki)` (ja): `"かめは さかなを 10ひき もっています。ともだちに 1ひき あげました。のこりは いくつ？"` — dùng `10ひき` thay vì `じゅっぴき`.
6. `A4:give-receive(ko)` (ja): `"くまさんは りんごを 1こ もっています。1こ もらいました。ぜんぶで いくつ？"` — dùng `1こ` thay vì `いっこ`.
7. `A4:give-receive(ko)` (ja): `"くまさんは りんごを 6こ もっています。1こ もらいました。ぜんぶで いくつ？"` — dùng `6こ` thay vì `ろっこ`.
8. `A4:give-receive(ko)` (ja): `"くまさんは りんごを 4こ もっています。1こ もらいました。ぜんぶで いくつ？"` — số `4こ` phụ thuộc bộ đọc số của TTS.
9. `A4:give-receive` (vi): `"Gấu Mật có 1 quả táo. Cho bạn 1 quả. Còn mấy quả?"` — sinh động nhưng phụ thuộc `/api/tts` (không có trong MP3 tĩnh).
10. `story-intro:ch1` (vi): `"Chào bé Mây! Đây là Vườn Cà Rốt. Thỏ Bông đang hái cà rốt cho Lễ hội Ngôi sao Toán. Bé giúp Thỏ đếm nhé!"` — dài 27 từ, hơi dài với bé 4 tuổi.
11. `story-intro:ch4` (vi): `"Chào mừng bé Mây tới Sân Bóng! Chú Khỉ Nhanh đang xếp bóng để chuẩn bị đá giao hữu đó!"` — dài 21 từ.
12. `feedback:wrong1` (vi): `"Sai rồi, bé Mây ơi. Cố gắng lên nào, làm lại một lần nữa nhé!"` — dài 16 từ.
13. `prompt:tracePrompt(5)` (vi): `"Tô theo nét số 5 nhé!"` — chứa chữ số trần `5`.
14. `prompt:tracePrompt(5)` (ja): `"すうじの 5を なぞってみよう！"` — chứa chữ số trần `5`.
15. `A13` (vi/ja): `"Chọn hình ... nhé!"` / `"...を えらぼう！"` — bị gọi `onSpeakText` **2 lần liên tiếp** trong `activities-plaza.js`.

Checklist nghe thử trên iPad cho người chấm: xem [qa/04b_voice_listen_checklist.md](04b_voice_listen_checklist.md).

---

## 5. Kết quả kiểm toán nội dung
(Dữ liệu đầy đủ 82 bài tại [qa/03_content_dump.json](03_content_dump.json))
- **Tổng số bài học**: **82 bài** (Vùng 1–8: 74 bài, Vùng 9: 8 bài), tổng **820** lượt hoạt động.
- **Kiểm tra toán học tự động (`audit-content.mjs`)**: **880/880** phép tính & dấu so sánh sinh ra từ `problem-gen.js` và `compare.js` đúng **100%** (0 lỗi toán, 0 đáp án trùng/âm).
- **Phân bố vị trí đáp án (`0 / 1 / 2`)**: `266 / 376 / 238` (cân bằng ở `problem-gen.js` & `compare.js`), **nhưng** `A14` đo khối luôn đặt đáp án ở vị trí `0` **[QA-03]**.
- **Tỷ lệ lặp cặp số mẫu**: `42.3%` trên 540 lượt sinh ngẫu nhiên (chủ yếu do `max=5` có ít cặp khả dĩ, có `isRepeatedTwice` chống lặp 2 lần liên tiếp).
- **Lệch VI/JA & Kanji**: 0 Kanji trong chuỗi dành cho bé; nhưng `SHAPE_NAMES.square.ja` dùng `しかく` thay vì `ましかく` **[QA-09]**.
- **Danh sách đầy đủ câu/bài bị lỗi**:
  - Vùng 9 / `s9-l02` (`A13`, `topic: "solid"`, các câu 1,3,5,6): rơi về hình phẳng **[QA-02]**.
  - Vùng 9 / `s9-l05` (`A14`, `topic: "compareMeasure"`, câu 1,3,5,6): rơi về đo khối **[QA-01]**.
  - Vùng 9 / `s9-l06` (`A14`, `topic: "measureUnits"`, câu 1,3,5,6): rơi về đo khối **[QA-01]**.
  - Vùng 9 / `s9-l07` (`A14`, `topic: "daysSeasons"`, câu 1,3,5,6): rơi về đo khối **[QA-01]**.
  - Vùng 9 / `s9-l05..06` (`A14` đo khối): đáp án luôn ở vị trí đầu **[QA-03]**.

---

## 6. Ma trận phủ chương trình Lớp 1 (rút gọn từ [05_curriculum_coverage.md](05_curriculum_coverage.md))
- **Đạt tốt**: Đếm & nhận biết 1–20, số 0, so sánh `> < =` trực quan, cộng/trừ phạm vi 10 có câu chuyện, đọc giờ đúng (`よじ/しちじ/くじ`), thuật ngữ Toán Việt & hiragana Nhật (0 Kanji).
- **Một phần**: Thứ tự số (thiếu hỏi tường minh *liền trước/liền sau*), tách/ghép số (có chia đĩa A5 nhưng thiếu bài hỏi số), vị trí (chỉ có *trái/phải*, thiếu *trên/dưới, trước/sau*), quy luật (chỉ có ABAB), giờ (thiếu *nửa giờ*).
- **Chưa hoạt động đúng do lỗi code**: Hình khối 3D (`s9-l02`), so sánh dài/cao/nặng (`s9-l05`), đơn vị đo (`s9-l06`), ngày trong tuần & 4 mùa (`s9-l07`).

---

## 7. Kết quả màn hình, Console & Rủi ro iPad Safari
- **Kiểm tra đa kích thước (PC 1920x1080, 1366x768; iPad 1180x820, 1024x768, 820x1180, 768x1024) & Console trình duyệt**: **KHÔNG XÁC MINH ĐƯỢC ĐẦY ĐỦ** — phiên `browser` subagent bị dừng bởi thao tác người dùng (`[BROWSER_USER_TAKEOVER]`) khi đang kiểm thử đến Vùng 2 Bài 10.
- **Rủi ro iPad Safari (suy luận từ code)**:
  1. **iOS Autoplay Audio (`js/main.js`, `js/audio/speak.js`)**: `AudioContext` được unlock ở `pointerdown` (`once: true`), nhưng `HTMLAudioElement.play()` trong `speak.js` nếu gọi tự động khi vừa tải trang (chưa có chạm) có thể bị iOS Safari chặn; hiện có fallback `catch` nên không treo bài học.
  2. **Định dạng audio & `speechSynthesis`**: MP3 (`audio/mpeg`) được iOS Safari hỗ trợ tốt. Tuy nhiên nếu offline/static với câu động (không có MP3 tĩnh), Safari chỉ đọc được tiếng Việt nếu máy đã tải voice `vi-VN`; `waitForVoices` đã xử lý `voiceschanged`.
  3. **Viewport & Cảm ứng (`css/app.css`, `index.html`)**: Không dùng `100vh` (dùng `height: 100%` + `overflow: hidden`), có `user-select: none`, `touch-action: manipulation` trên nút và `touch-action: none` trên canvas tô nét, `viewport` có `user-scalable=no` và `viewport-fit=cover`. **Rủi ro nhỏ**: `.modal-card` dùng `max-height: 90vh`, vẫn ổn nhưng trên iOS Safari thanh địa chỉ có thể che nhẹ mép dưới nếu nội dung dài.
  4. **Font Việt/Nhật (`css/tokens.css`)**: Dùng system font (`Hiragino Maru Gothic ProN` cho `:lang(ja)`, `Segoe UI`/`Roboto`/`Helvetica Neue` cho `:lang(vi)`), không phụ thuộc font tải mạng nên **an toàn khi offline**.

---

## 8. Việc chưa kiểm chứng được
- **Kiểm thử tương tác thực tế trên trình duyệt qua toàn bộ 6 viewport (PC & iPad) và vùng 3–9**: **KHÔNG XÁC MINH ĐƯỢC** do `[BROWSER_USER_TAKEOVER]` dừng subagent trình duyệt ở Vùng 2 Bài 10.
- **Chất lượng âm thanh thực tế qua loa iPad Safari**: Agent không nghe được âm thanh trực tiếp — cần người dùng kiểm tra theo [qa/04b_voice_listen_checklist.md](04b_voice_listen_checklist.md).
