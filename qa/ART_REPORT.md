# Báo cáo Thay đổi Hình ảnh (ART_REPORT)

## 1. Nguồn hình & Giấy phép
- **Nguồn**: Microsoft Fluent Emoji – phong cách 3D PNG (`https://github.com/microsoft/fluentui-emoji`)
- **Giấy phép**: **MIT License** (đã xác nhận từ file `LICENSE` trong repo gốc và lưu tại [assets/img/LICENSES.md](file:///c:/Users/Admin/OneDrive/Desktop/MathZoo/assets/img/LICENSES.md)).
- **Tối ưu**: Chuyển đổi qua `tools/fetch-fluent-emoji.py` thành định dạng **WebP** nền trong suốt (`256×256` cho nhân vật, `128×128` cho đồ vật đếm và sao; mỗi ảnh chỉ ~3.4–7.8 KB).

## 2. Danh sách file đã thay / thêm mới
- **Tài liệu kiểm kê & bản quyền**:
  - [assets/img/README.md](file:///c:/Users/Admin/OneDrive/Desktop/MathZoo/assets/img/README.md)
  - [assets/img/LICENSES.md](file:///c:/Users/Admin/OneDrive/Desktop/MathZoo/assets/img/LICENSES.md)
- **Bộ ảnh WebP mới (`19` file)**:
  - `assets/img/animals/`: `rabbit.webp`, `bear.webp`, `cat.webp`, `fox.webp`, `elephant.webp`, `owl.webp`, `monkey.webp`, `penguin.webp`, `lion.webp`
  - `assets/img/objects/`: `carrot.webp`, `apple.webp`, `fish.webp`, `ball.webp`, `balloon.webp`, `firefly.webp`, `banana.webp`, `candy.webp`, `lantern.webp`, `star.webp`
- **Mã nguồn cập nhật**:
  - `js/ui/artwork.js`: thay SVG vẽ mặt tròn giống nhau và emoji chuối `🍌` bằng `<img>` trỏ tới bộ WebP mới, kèm `preloadArtwork()` và fallback SVG khi lỗi tải (`__mzImgFallback`).
  - `js/ui/home-map.js` & `css/app.css`: phóng to avatar con vật vùng lên `68×68px` trong khung tròn `.stage-avatar` (`82×82px`) có nền & viền nổi bật.
  - `js/main.js`: gọi `preloadArtwork()` ngay khi khởi động.
  - `js/ui/activities-plaza.js`: thay 4 emoji unicode (`🖐️`, `👣`, `🥤`, `🥄`) trong bài `measureUnits` bằng SVG vector tự vẽ để hiển thị đồng nhất giữa Windows và iPad.

## 3. Chỗ còn dùng hình SVG cũ & Lý do
- `renderComparisonSign` (`js/ui/artwork.js`): vẫn dùng SVG vector cho dấu `> < =` (kích thước ≥ 96px + mắt chấm tùy chọn) theo đúng đặc tả `08-ui-mau-sac.md`.
- Hình học phẳng/khối 3D, đồng hồ, đo độ dài (`js/ui/activities-plaza.js`): giữ SVG vector sắc nét vì là hình học toán học cần tỷ lệ chính xác.

## 4. Kết quả kiểm tra & Ảnh chụp
- **Kiểm tra tự động**: `npm test` (**21/21 pass**), `npm run validate` (**84 bài học hợp lệ**), `node qa/audit-content.mjs` (**0 lỗi toán/câu hỏi**).
- **Trình duyệt tích hợp (`http://127.0.0.1:4173` qua `python -m http.server`)**:
  - Toàn bộ 19 ảnh WebP tải thành công (`HTTP 200`, `0` fallback SVG, `0` console error, `0` lỗi tràn ngang ở `1920×1080` và `820×1180`).
  - 8 nhân vật + Quảng trường Lễ hội phân biệt rõ ràng; vật đếm không chồng lấn.
- **Ảnh chụp sau khi đổi (`/qa/shots/after/`)**:
  - Trước khi đổi: không có ảnh chụp bản cũ riêng (được mô tả trong `QA_REPORT.md`).
  - Bản đồ vùng VI (`1920×1080`): `qa/shots/after/home_map_vi_1920x1080.png`
  - Bản đồ vùng JA (`1920×1080`): `qa/shots/after/home_map_ja_1920x1080.png`
  - Bài đếm A2 (`1920×1080`): `qa/shots/after/counting_a2_1920x1080.png`
  - Bài cộng/trừ A4 (`1920×1080`): `qa/shots/after/addsub_a4_1920x1080.png`
  - Màn thưởng sao (`1920×1080`): `qa/shots/after/reward_1920x1080.png`
  - Bản đồ vùng VI (`820×1180`): `qa/shots/after/home_map_vi_820x1180.png`
