# 05. Ma trận đối chiếu chương trình Lớp 1 (Việt Nam & Nhật Bản 小学1年)

| Kỹ năng | Trạng thái | Vùng / Level | Nhận xét chuyên môn (Mầm non / Lớp 1) |
| --- | --- | --- | --- |
| Đếm & nhận biết số 1–10 | **Có** | Vùng 1 (`s1-l01`..`s1-l08`), Vùng 2 | Đầy đủ A1 (chạm đếm), A2 (chọn số), A7 (nối), A8 (tô số 0–9). Tuy nhiên A2 không bao giờ sinh ra `target = max` (vd: số 10). |
| Đếm & nhận biết số 11–20 | **Có** | Vùng 4 (`s4-l01`..`s4-l10`) | Có đếm, điền bảng số A9 tới 20, cộng trừ tới 20. |
| Đọc số, số 0 | **Có** | Vùng 1 (`s1-l04`, `s1-l08`), Vùng 4, Vùng 7 (`100`) | Có số 0 trong tập viết A8 và kết quả trừ `a - a = 0`. |
| So sánh nhiều/ít/bằng, `>`, `<`, `=` | **Có** | Vùng 1 (`A3`), Vùng 5 (`A10a`, `A10b`, `A10c`) | Dạy trực quan ghép cặp 1-1 trước (`A3`, `A10a` có mắt chấm), rồi sang số và biểu thức (`A10c`). |
| Thứ tự số, số liền trước/liền sau | **Một phần** | Vùng 2 (`A11` thứ nhất..thứ mười), Vùng 4 (`A9` bảng số) | Có số thứ tự (ordinal) và điền số thiếu trên bảng, nhưng **chưa có câu hỏi tường minh "số liền trước / số liền sau của X là mấy?"** (ひとつまえ/ひとつあと). |
| Phân tách/ghép số phạm vi 10 (`いくつといくつ` / "mấy và mấy") | **Một phần** | Vùng 2 (`A5` chia 2 đĩa), Vùng 3 (`A6` khung mười) | Có hoạt động chia tổng `total` thành 2 đĩa (`left + right = total`), rất trực quan, nhưng **chưa có dạng tìm phần còn thiếu dạng số ("5 gồm 2 và mấy?")** có đáp án chọn. |
| Cộng, trừ phạm vi 10 (hình ảnh/câu chuyện → ký hiệu) | **Có** | Vùng 2, Vùng 3 (`A4` `add`, `take`, `combine`, `missing`, `compare`) | Chuyển tiếp tốt từ câu chuyện + vật thể sang phép tính `a + b = ?` / `a - b = ?`. Riêng `missing` và `compare` vẽ hình chưa sát ngữ cảnh (chỉ vẽ 1 nhóm). |
| Hình cơ bản (tròn, vuông, tam giác, chữ nhật) & hình khối | **Một phần (Lỗi logic)** | Vùng 9 (`s9-l01` plane, `s9-l02` solid) | Hình phẳng (`s9-l01`) hoạt động. Nhưng `s9-l02` (`topic: "solid"`) bị rơi về hình phẳng trong code (`renderA13ShapeOrPos` không xử lý `"solid"`). Ngoài ra `SHAPE_NAMES.square.ja` dùng `しかく` thay vì `ましかく`. |
| Phân loại & quy luật lặp (pattern) | **Một phần** | Vùng 9 (`s9-l04` `A12`) | Có quy luật ABAB (`A12`), chưa có bài phân loại theo màu/kích thước/loại. |
| Vị trí / phương hướng (trên-dưới, trái-phải, trước-sau, trong-ngoài) | **Một phần** | Vùng 9 (`s9-l03` `A13` `position`) | Chỉ có **trái / phải** (`ひだり / みぎ`). **Thiếu** trên-dưới (`うえ/した`), trước-sau (`まえ/うしろ`), trong-ngoài. |
| So sánh dài/ngắn, cao/thấp, nặng/nhẹ | **Không (Lỗi rơi nhánh)** | Vùng 9 (`s9-l05` `compareMeasure`, `s9-l06` `measureUnits`) | Dù `lessons.json` có `s9-l05` và `s9-l06`, `renderA14MeasureTime` chỉ kiểm tra `topic === "clock"` nên toàn bộ đều rơi về bài **đo bằng khối**, không có bài so sánh dài/cao/nặng. |
| Giờ đúng, nửa giờ, ngày trong tuần | **Một phần (Lỗi rơi nhánh)** | Vùng 9 (`s9-l07` `daysSeasons`, `s9-l08` `clock`) | Giờ đúng (`s9-l08`) hoạt động tốt, xử lý đúng ngoại lệ `よじ`, `しちじ`, `くじ`. **Chưa có nửa giờ** (`何時半` / giờ rưỡi). `s9-l07` (`daysSeasons`) bị rơi về đo khối nên **ngày trong tuần & 4 mùa không chạy**. |
| Đặc thù Nhật (`数え方`, `よん/なな/きゅう`, hiragana, từ vựng) | **Một phần** | `number-words.js`, `ordinal-time.js`, `i18n/ja.json` | 100% nội dung cho bé dùng hiragana/katakana (0 Kanji). Đọc số `よん/なな/きゅう` và giờ `よじ/しちじ/くじ` chuẩn. **Lỗi**: câu chuyện A4 ghép chuỗi `${a}ひき` / `${a}こ` bằng số Ả Rập nên TTS có thể đọc sai âm biến âm (`いっぴき`, `さんびき`, `いっこ`...). |
| Đặc thù Việt (thuật ngữ, `lăm/mốt/tư`, dấu `>/<`) | **Có** | `number-words.js`, `i18n/vi.json` | Đủ "nhiều hơn/ít hơn/bằng nhau", "thêm/bớt", "cộng/trừ", "mười lăm", "hai mươi mốt", "hai mươi tư", dấu `> < =`. |

## Thiếu / Thừa / Nên điều chỉnh cho trẻ 4–6 tuổi
- **Áp lực thời gian / điểm số**: Tốt — không có đồng hồ đếm ngược gây áp lực trong bài học, báo sai dùng màu hổ phách dịu nhẹ (không dùng màu đỏ phạt), tối đa 3 lần sai sẽ chuyển câu nhẹ nhàng.
- **Yêu cầu biết đọc chữ**: Phần lớn câu hỏi đều có giọng đọc (`onSpeakText`) + hình minh họa. **Tuy nhiên**:
  - Bài **Đồng hồ (`s9-l08`)** các nút đáp án chỉ hiển thị chữ (`"bốn giờ"`, `"よじ"`) mà không đọc to các lựa chọn khi chạm/hover, bé 4–5 tuổi chưa biết đọc sẽ phải đoán.
  - Bài **Nối số (`A7`)** & **Tô số (`A8`)** khá dễ; phần **Đo khối (`A14`)** đáp án luôn nằm ở nút đầu tiên (`[len, len-1, len+1]` chưa trộn).
  - Vùng 7 mở rộng tới **100** (`max: 100`): hơi quá sức với trẻ 4–5 tuổi (chuẩn mầm non/đầu lớp 1 là 10–20), nhưng phù hợp cho bé chuẩn bị vào lớp 1 làm quen bảng số 100.
