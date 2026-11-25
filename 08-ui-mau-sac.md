# 08. UI, màu sắc và phong cách

Phong cách chung: app học trẻ em Nhật, nền kem ấm, nút tròn to, viền dày, mỗi vùng một màu pastel, hình phẳng có má hồng. Bảng màu do dự án **tự thiết kế**, không đo từ app nào (mình không đọc được màu từ ảnh màn hình). Nếu bạn gửi ảnh app bạn thích, spec sẽ chỉnh theo.

Tương phản dưới đây đã **tính lại bằng công thức WCAG** (ngày 25/11/2026). Ngưỡng: chữ thường 4,5; chữ to và thành phần giao diện (viền, nút) 3.

## Màu nền tảng

| Token | Hex | Dùng cho | Tương phản |
| --- | --- | --- | --- |
| bg | #FFF8EC | Nền mọi màn (kem) | nền |
| ink | #2B2A4C | Chữ, số, nét viền | 12,9 trên nền kem |
| primary | #1F78C8 | Nút chính, nền nút có chữ trắng | 4,6 với chữ trắng; 4,3 trên nền kem nên **không** dùng làm chữ nhỏ |
| receive | #18835F | Nhận thêm, đúng | 4,7 với chữ trắng |
| give | #C93A34 | Cho đi (chỉ trong cảnh cho và nhận) | 5,1 với chữ trắng |
| total | #FFC83D | Tổng, sao thưởng | 8,8 với chữ ink |
| accent | #6B4BC8 | Phép tính, điểm nhấn, **thẻ dấu so sánh `>` `<` `=`** | 6,1 với chữ trắng; 5,7 trên nền kem |
| ok-bg | #E4F5EC | Nền thẻ đúng | 12,1 với chữ ink |
| amber | #B26A00 | Viền thẻ sai (hổ phách) | 4,0 trên nền kem (đủ cho viền) |
| amber-bg | #FFF1D6 | Nền thẻ sai | 12,2 với chữ ink |
| mint, coral | #BFEFDD, #FFD9D4 | Nền thẻ nhẹ (nhận, cho) | 10,8 và 10,5 với chữ ink |
| disabled | #E9E4F2 / viền #B9B3CC | Nút vô hiệu | |

Quy tắc: **xanh lá = nhận, san hô = cho, vàng = tổng**, luôn kèm hình (mũi tên vào giỏ, mũi tên ra) để bé mù màu vẫn phân biệt. **Không dùng màu đỏ ở nơi nào khác** ngoài cho-đi trong cảnh cho và nhận; báo sai dùng hổ phách.

## Màu từng vùng

| GD | Vùng | Nền pastel | Viền, biểu tượng | Chữ ink trên nền | Viền trên nền kem | Viền trên nền vùng |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Vườn Cà Rốt | #FFE08A | **#946A00** (đổi) | 10,6 | 4,6 | 3,8 |
| 2 | Rừng Táo | #BFEFDD | #2E8B6E | 10,8 | 4,0 | 3,3 |
| 3 | Hồ Cá | #CFE8FF | #2F7FC4 | 10,8 | 4,0 | 3,4 |
| 4 | Sân Bóng | #E3D7FF | #7A5BD0 | 10,0 | 4,7 | 3,6 |
| 5 | Bãi Bóng Bay | #FFD0E0 | #C2456F | 10,0 | 4,5 | 3,5 |
| 6 | Tháp Đom Đóm | #FFD9B3 | #B8610A | 10,3 | 4,2 | 3,3 |
| 7 | Vườn Chuối | #D5F2B5 | #4E8F1F | 11,2 | 3,8 | 3,3 |
| 8 | Sân Băng | #BDEBF2 | #1B7F93 | 10,6 | 4,4 | 3,6 |
| 9 (tùy chọn) | Quảng trường Lễ hội | #E8EAF0 | #5B6477 | 11,3 | 5,6 | 4,9 |

Vùng 9 dùng nền bạc nhạt để khác tám vùng còn lại; sự rực rỡ của lễ hội đến từ đèn lồng và vật trang trí nhiều màu (chỉ trang trí, không mang nghĩa đúng sai). Tỷ lệ tương đương đã tính lại bằng công thức WCAG (ngày 25/11/2026).

Bản cũ dùng viền #B8860B cho vùng 1, chỉ đạt 2,5 trên nền pastel của nó (dưới mức 3), nên đã đổi sang #946A00.

## Màu nhân vật (hình vẽ, viền ink 3 px, không phải chữ)

| Nhân vật | Màu chính | Chi tiết |
| --- | --- | --- |
| Thỏ Bông | #FFFFFF | tai trong #FFB3C7 |
| Gấu Mật | #C98B55 | tai tròn |
| Mèo Mướp | #F6B25C | tai nhọn |
| Cáo Cam | #F28A3C | tai nhọn, mõm trắng |
| Voi Con | #9DB7E8 | vòi dài, tai to |
| Cú Mèo | #A9845E | mắt tròn to |
| Khỉ Nâu | #A8744A | mặt #F3D2B0 |
| Cánh Cụt | #2B2A4C | bụng trắng, mỏ #FFC83D |
| Sao Lấp Lánh | #FFC83D | má hồng, mắt chấm |

Má hồng #FFB3C7 cho mọi nhân vật. Vật đếm dùng màu bão hòa hơn nền; mỗi nhóm chỉ một loại vật.

## Dấu so sánh `>` `<` `=` (mới)

Dấu được vẽ bằng SVG, không dùng ký tự font (file 07).

| Mục | Quy định |
| --- | --- |
| Hình dạng | Dấu `>` và `<` là hai nét dày 8 px đầu tròn, mở góc khoảng 70 độ, như **cái miệng đang há**: miệng há về phía số lớn, mũi nhọn chỉ về số bé. `=` là hai thanh ngang song song bằng nhau, dày 8 px |
| Kích thước | Dấu trong câu hỏi từ 96×96 px; thẻ dấu kéo thả 112×112 px (≥ 72 px vùng chạm, khoảng cách ≥ 16 px) |
| Màu | Nét dấu #6B4BC8 (accent) trên thẻ trắng viền màu vùng 4 px; chữ trắng trên nền accent đạt 6,1. **Không** dùng xanh lá (nhận), san hô hay đỏ (cho), vàng (tổng) cho dấu; phân biệt `>` và `<` bằng hình và hướng, không bằng màu |
| "Mắt chấm" (GD5, bài s5-l09 và s5-l10) | Hai chấm mắt ink nhỏ 10 px trên dấu `>` và `<` để bé thấy cái miệng; bỏ từ s5-l11. Đây là gợi ý trực quan chưa kiểm chứng với bé, có thể tắt trong góc phụ huynh |
| Ô giữa | Ô vuông viền gạch đứt #5B6477 trước khi đặt dấu (viền đạt 3 trên nền kem), đổi sang trạng thái đúng hoặc sai sau khi thả |
| Ghép cặp khi sai | Sợi dây nét ink 3 px nối từng cặp vật; vật dư có vầng sáng vàng #FFC83D kèm viền ink (không chỉ dựa vào màu) |
| Hai nhóm vật | Hai khay riêng hai bên, nền #FFFFFF viền màu vùng; không dùng nền san hô hoặc xanh lá để không lẫn cho/nhận |

Thẻ dấu ở trạng thái "đúng" và "sai" dùng đúng bảng ở mục dưới (xanh lá nhạt kèm dấu tích; hổ phách kèm lắc nhẹ).

## Trạng thái nút và đáp án

| Trạng thái | Nền | Viền | Thêm |
| --- | --- | --- | --- |
| Bình thường | #FFFFFF | màu vùng, 4 px | bóng đổ một lớp dịch xuống 6 px |
| Đang ấn | nhạt đi 8%, thu 0,96 | giữ nguyên | bóng mất |
| Đúng | #E4F5EC | #18835F | dấu tích, bật nhẹ, pháo sao |
| Sai | #FFF1D6 | #B26A00 | lắc nhẹ 2 lần 200 ms; **không đỏ** |
| Vô hiệu | #E9E4F2 | #B9B3CC | chữ xám tím |

Mọi trạng thái đúng/sai có thêm hình hoặc chuyển động để không chỉ dựa vào màu. Không có chế độ tối.

## Phong cách hình thức

- Bo góc: nút 28 px, thẻ 24 px; viền dày 4 px; một lớp bóng phẳng.
- Mỗi màn tối đa 4 màu nổi: nền kem, màu vùng, ink và một màu nhấn.
- Nền có hai vệt màu vùng mờ ở hai góc (gradient tròn) thay vì nền trắng trơn; chuyển màu giữa các màn 300 ms.
- Nhân vật và vật là hình vector phẳng: mắt chấm, má hồng, tai theo loài. Tất cả do dự án tự vẽ.
- Không nhấp nháy nhanh; chuyển động 150–300 ms; tôn trọng cài đặt giảm chuyển động của hệ thống (thay lắc và pháo sao bằng mờ dần).

## Bố cục và kích thước

- **iPad ngang** 1024×768 là màn chuẩn; **iPad dọc** 768×1024 dùng được; điện thoại dọc 360×640 bản gọn.
- Mỗi màn một việc, không cuộn. Vùng chạm tối thiểu 72 px, khoảng cách hai nút 16 px, vùng an toàn 24 px.
- Số trong câu hỏi từ 96 px; phụ đề từ 28 px.
- Nút nghe lại (loa) luôn ở góc trên bên phải, kèm nút đổi nhanh ngôn ngữ `VI / 日本語`.
- Chữ: ưu tiên font hỗ trợ dấu tiếng Việt chuẩn trước các font tiếng Nhật để tránh lỗi tách dấu (như `Gâ´u`):
  - Tiếng Việt (`:lang(vi)`): `"Segoe UI", "Roboto", "Noto Sans", "Helvetica Neue", Arial, system-ui, sans-serif`
  - Tiếng Nhật (`:lang(ja)`): `"Hiragino Maru Gothic ProN", "Yu Gothic UI", "Meiryo", "Noto Sans JP", "Segoe UI", system-ui, sans-serif`
- Phản hồi đúng/sai khi làm bài dùng hiệu ứng trực tiếp trên thẻ (✓ xanh lá / ✕ hổ phách), không hiện thanh chữ nổi đè lên đáp án.

## Danh sách màn hình

| Màn | Mục đích | Ghi chú |
| --- | --- | --- |
| Chào | Chọn hồ sơ bé, hiện "Chào bé Mây ・ こんにちは、マイちゃん" | Ảnh đại diện, không nhập chữ |
| Bản đồ vườn thú | 8 vùng chính và Quảng trường Lễ hội (tùy chọn, ở giữa), gợi ý vùng tiếp theo bằng Sao Lấp Lánh | Không khóa; vùng xong có sticker |
| Truyện mở đầu | Bạn thú của vùng nói chuyện (file 05) | Nghe một lần, có nút nghe lại |
| Phát bài | 6 hoạt động, thanh tiến độ 6 ô | Không đồng hồ |
| Cảnh cho và nhận | Giỏ, bạn thú, vật kéo thả được (file 04) | |
| Cảnh điền dấu (mới) | Hai nhóm vật hoặc hai số, ô giữa, ba thẻ dấu (file 03, 04) | Luôn đặt hai nhóm bên trái và bên phải, kể cả trên iPad dọc và điện thoại (không xếp trên–dưới), vì `>` và `<` chỉ có nghĩa theo chiều ngang |
| Tô số | Viết số 0–9 | Nét có số thứ tự và mũi tên |
| Phần thưởng | 1–3 sao, lời khen song ngữ, sticker, truyện kết | Sao theo số câu đúng ngay lần đầu, không theo tốc độ |
| Sổ sưu tập | 8 sticker, huy chương cuối, sticker Cờ lễ hội của vùng 9 | Chạm để nghe tên |
| Góc phụ huynh | Đổi ngôn ngữ, tên bé, cách khen, thời gian chơi, tiến độ, âm lượng, xóa tiến độ | Mở bằng giữ nút 3 giây, không dùng phép tính |
