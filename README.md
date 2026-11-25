# MathZoo – Ứng dụng học Toán song ngữ Việt – Nhật cho bé 4–6 tuổi

**MathZoo** là ứng dụng web học Toán song ngữ **Tiếng Việt / Tiếng Nhật (hiragana & katakana, không kanji cho bé)** dành cho trẻ 4–6 tuổi, xây dựng bằng HTML, CSS, JavaScript thuần (ES Modules), Web Speech API và Web Audio API — không cần thư viện ngoài hay bước build.

Dự án bao gồm cả **mã nguồn ứng dụng hoàn chỉnh** và **bộ tài liệu đặc tả (spec)** dùng để thiết kế, kiểm thử và đối chiếu chương trình.

---

## Tính năng chính

- **9 giai đoạn, 82 bài học** (74 bài chính ở 8 khu vực Vườn thú + 8 bài tùy chọn tại **Quảng trường Lễ hội / おまつりひろば** không ảnh hưởng Huy chương Ngôi sao).
- **14 dạng hoạt động** trực quan: đếm, nhận biết số, tô nét số `0–9`, cộng/trừ qua tình huống cho–nhận kèm thang nốt ngũ âm, số thứ tự, hình học phẳng & hình khối, thời gian (ngày, mùa, giờ đúng với ngoại lệ tiếng Nhật `よじ`, `しちじ`, `くじ`), quy luật, đo lường, và làm quen dấu so sánh `>` `<` `=` từ giai đoạn 5.
- **Song ngữ Việt – Nhật 100%**: chuyển đổi ngôn ngữ mượt mà trên màn hình chính hoặc trong Góc Phụ Huynh (ẩn khi đang trong bài học).
- **Lời khen & báo sai cá nhân hóa**: gọi tên bé (mặc định *Bé Mây* / *マイちゃん*, phụ huynh đổi được kèm tùy chỉnh cách đọc), đa dạng biến thể không lặp câu liền trước, phản hồi 3 mức dịu nhẹ (không dùng màu đỏ báo lỗi).
- **Góc Phụ Huynh (giữ 3 giây)**: đổi tên bé, giới hạn thời gian chơi hằng ngày, bật/tắt mẹo "cái miệng há" cho dấu `>` `<`, xem tiến độ.
- **Bộ sưu tập Sticker & Huy chương Ngôi sao**: mỗi giai đoạn hoàn thành tặng 1 sticker cố định, hoàn thành giai đoạn 8 mở màn kết thúc và Huy chương Ngôi sao.
- **Hoạt động ổn định kể cả khi `localStorage` bị chặn** (có bộ nhớ dự phòng trong phiên).

---

## Yêu cầu & Cách chạy

- **Trình duyệt hiện đại** (Chrome, Edge, Safari...) hỗ trợ ES Modules, Web Audio API và Web Speech API (`vi-VN`, `ja-JP`).
- **Node.js** (v18+ khuyến nghị) để chạy dev server cục bộ, unit tests và kiểm tra dữ liệu. Không cần cài `npm install` (0 dependencies).

### Chạy ứng dụng cục bộ

```bash
node tools/serve.mjs
```

Mặc định ứng dụng chạy tại `http://127.0.0.1:4173` (có thể đổi cổng bằng biến môi trường `PORT`).

### Chạy kiểm thử & xác thực dữ liệu

```bash
# Chạy toàn bộ 21 unit tests (node --test tests/)
npm test

# Xác thực 82 bài học trong data/lessons.json và data/voice-manifest.json
npm run validate
```

Danh sách kiểm thử thủ công trên trình duyệt / thiết bị xem tại [docs/manual-tests.md](docs/manual-tests.md).

---

## Cấu trúc thư mục

```text
MathZoo/
├── index.html                  # Điểm vào ứng dụng
├── package.json                # Scripts test & validate (ESM, không dependencies)
├── css/
│   ├── tokens.css              # Design tokens, bảng màu đạt chuẩn tương phản
│   └── app.css                 # Giao diện, bố cục responsive (iPad & điện thoại)
├── js/
│   ├── main.js                 # Khởi tạo app, điều hướng màn hình
│   ├── audio/
│   │   ├── sfx.js              # Âm hiệu ứng & thang nốt ngũ âm (Web Audio API)
│   │   └── speak.js            # Đọc giọng máy song ngữ (Web Speech API)
│   ├── core/                   # Logic thuần (tách biệt UI, có unit test)
│   │   ├── compare.js          # So sánh số, dấu > < =, sinh câu đọc
│   │   ├── counting-notes.js   # Ánh xạ số lượng sang nốt nhạc
│   │   ├── mastery.js          # Chấm điểm, lên/xuống chế độ, trạng thái sai 3 mức
│   │   ├── number-words.js     # Đọc số tiếng Việt & tiếng Nhật + bộ đếm
│   │   ├── ordinal-time.js     # Số thứ tự, ngày, mùa, giờ đúng
│   │   ├── phrases.js          # Chọn câu khen/báo sai, chèn tên bé
│   │   ├── problem-gen.js      # Sinh đề toán xác định theo seed & chống lặp
│   │   ├── storage.js          # Lưu tiến độ localStorage kèm fallback an toàn
│   │   └── story.js            # Dữ liệu cốt truyện theo bài & giai đoạn
│   └── ui/                     # Các màn hình & hoạt động tương tác
│       ├── activities-extra.js # Hoạt động mở rộng
│       ├── activities-plaza.js # Hoạt động Quảng trường Lễ hội (GD9)
│       ├── artwork.js          # Hình minh họa SVG nhân vật & đồ vật
│       ├── home-map.js         # Bản đồ Vườn thú MathZoo
│       ├── lesson-a123.js      # Hoạt động A1–A3
│       ├── lesson.js           # Điều phối màn hình bài học
│       ├── parent.js           # Góc Phụ Huynh (giữ 3 giây)
│       ├── reward.js           # Màn hình phần thưởng & huy chương
│       ├── scene-compare.js    # Hoạt động so sánh & dấu > < = (A10)
│       ├── scene-give-receive.js # Cảnh cho / nhận cộng trừ
│       ├── sticker-book.js     # Sổ sticker
│       ├── story-intro.js      # Mở đầu cốt truyện
│       └── tracing.js          # Tô nét chữ số 0–9 (A8)
├── data/
│   ├── lessons.json            # 82 bài học (9 giai đoạn)
│   ├── phrases.json            # Bộ câu khen / báo sai song ngữ
│   ├── story.json              # Cốt truyện Vườn thú MathZoo
│   └── voice-manifest.json     # Danh sách câu thoại & giọng đọc
├── i18n/
│   ├── vi.json                 # Chuỗi giao diện Tiếng Việt
│   └── ja.json                 # Chuỗi giao diện Tiếng Nhật (không kanji cho bé)
├── tests/                      # 21 unit tests (T1–T21)
├── tools/
│   ├── generate-lessons.mjs    # Script sinh dữ liệu bài học
│   ├── serve.mjs               # Static HTTP server cục bộ
│   └── validate-data.mjs       # Script kiểm tra tính hợp lệ dữ liệu
└── docs/
    └── manual-tests.md         # Checklist kiểm thử thủ công trên UI
```

---

## Bộ tài liệu đặc tả (Spec)

Các file markdown ở thư mục gốc lưu toàn bộ đặc tả thiết kế và đối chiếu chương trình:

| File | Nội dung | Ai cần đọc |
| --- | --- | --- |
| `01-pham-vi-va-quyet-dinh.md` | Phạm vi, bảng quyết định (đã chốt / còn mở) | Người duyệt |
| `02-chuan-chuong-trinh.md` | Đối chiếu chương trình Việt Nam – Nhật Bản, nguồn, điều chưa xác minh | Người duyệt |
| `03-noi-dung-bai-hoc.md` | 9 giai đoạn, 82 bài (74 chính + 8 tùy chọn), 14 dạng hoạt động, dấu `>` `<` `=`, số thứ tự, GD9 | Người làm nội dung, code |
| `04-cong-tru-va-am-thanh.md` | Tình huống cho/nhận, thang nốt, âm hiệu ứng, lớp so sánh bằng dấu & âm ghép cặp | Code, âm thanh |
| `05-cot-truyen.md` | Cốt truyện Vườn thú MathZoo, nhân vật, truyện từng bài, Quảng trường Lễ hội (vùng 9) | Người làm nội dung, code |
| `06-loi-khen-va-bao-sai.md` | Lời khen/báo sai song ngữ, đọc tên bé, đa dạng câu, nhóm `wrong3cmp` | Người làm nội dung, code |
| `07-giong-doc-va-chu.md` | Đọc số, bộ đếm, từ toán, quy cách giọng đọc, tên bé, dấu, số thứ tự, hình, ngày giờ | Code, giọng đọc |
| `08-ui-mau-sac.md` | Bảng màu (đã kiểm tương phản), phong cách, bố cục, màn hình, hình dáng dấu so sánh, màu vùng 9 | Thiết kế, code |
| `09-prompt-gemini.md` | Prompt tự đủ để triển khai theo mốc M1–M6, kèm tiêu chí test | Người dùng AI code |
| `10-viec-can-chot.md` | Danh sách điểm đã chốt (mục 11–17) và điều cần kiểm chứng thêm | Người duyệt |
