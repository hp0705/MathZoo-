# 02. Đối chiếu chuẩn chương trình Việt Nam và Nhật Bản

Hai nước khác nhau ở một điểm lớn: Việt Nam nêu rõ con số cho mẫu giáo 5 tuổi (đếm, thêm bớt trong 10), còn Nhật Bản không đặt con số cho mầm non, chỉ yêu cầu "quan tâm và cảm nhận" về số lượng. Vì vậy ở mức 4–5 tuổi, gói Nhật dùng chuẩn Việt Nam làm thang tham chiếu nội dung và giữ phong cách học qua chơi theo tinh thần Nhật.

| Mảng | Việt Nam (mẫu giáo 5 tuổi, rồi Toán lớp 1) | Nhật Bản (幼稚園教育要領, rồi 小学校算数 第1学年) | Quyết định cho app |
| --- | --- | --- | --- |
| Đếm | Đếm trong 10, đếm tuần tự đến 30 (MT24). Lớp 1: đếm, đọc, viết số trong 10, 20, 100 | Mầm non: 数量や図形、標識や文字などへの関心・感覚 (không có con số). Lớp 1: 具体物を数える, 数の順序, 数直線 | Mốc chung: 10, 20, 100 |
| Nhận biết số, số thứ tự | Nhận biết chữ số 1–10 chỉ số lượng và **số thứ tự** (MT27); số trong đời sống | Lớp 1: 2位数の表し方, 十を単位としてみる | Dạy chục và đơn vị ở giai đoạn 6 tuổi; **thêm bài số thứ tự ở GD2** |
| So sánh bằng lời | So sánh 2 nhóm trong 10: bằng, nhiều hơn, ít hơn (MT27); 3 nhóm: nhiều nhất, ít nhất (MT25) | Lớp 1: 1対1対応で数量を比べる | Ghép một-một là hoạt động mở đầu |
| **Dấu so sánh > < =** | **Không thuộc mẫu giáo.** Toán lớp 1 có bài "Bé hơn. Dấu <", "Lớn hơn. Dấu >", "Bằng nhau. Dấu =" trong phạm vi 10 | Chưa xác minh lớp nào dạy ký hiệu (xem "Điều chưa xác minh") | **Làm quen từ GD5 (5–6 tuổi)**, ôn lại ở GD6 sau khi đã học bằng lời; xem file 03 |
| Thêm/bớt, cộng/trừ | Thêm bớt trong 10; 3+4=7, 10−7=3 (MT25, MT27). Lớp 1: cộng trừ không nhớ trong 100 | Lớp 1: 1位数と1位数の加法及びその逆の減法が確実にできる | Trong 10 bắt buộc; số tròn chục dùng chung |
| Tách và gộp số | Gộp, tách nhóm 6–10 theo nhiều cách (MT26); **tách 10 đối tượng thành 2 nhóm bằng ít nhất 2 cách và so sánh số lượng hai nhóm** | Cấu trúc số là nền của cộng trừ | "Tách số" là cầu nối sang cộng trừ; thêm bước so sánh hai nhóm sau khi tách |
| Hình khối | Hình tròn, vuông, tam giác, chữ nhật; khối cầu, trụ, vuông, chữ nhật (MT30) | 図形の特徴, 前後・左右・上下 | **Đưa vào GD9 (tùy chọn)** |
| Vị trí, hướng | Phía trên–dưới, trước–sau, phải–trái của bản thân và của vật khác | 前後・左右・上下 | **GD9** |
| Quy tắc, mẫu hình | Sắp xếp theo quy tắc | Chưa xác minh | **GD9** |
| Đo | So sánh dài–ngắn (MT29); đo bằng đơn vị đo tự chọn | 長さ・かさの比較 | **GD9** (so sánh và đo bằng đơn vị tự chọn) |
| Thời gian | Các ngày trong tuần, mùa; giờ đúng (MT34) | 時刻の読み | **GD9** |

## Dấu > < theo chuẩn Việt Nam

- **Mẫu giáo 5–6 tuổi**: nội dung chương trình là so sánh số lượng của hai, ba đối tượng trong phạm vi 10 bằng các cách khác nhau và nói được kết quả "bằng nhau, nhiều nhất, ít nhất". Không có ký hiệu.
- **Lớp 1**: các bài về ký hiệu nằm ngay đầu chương số trong phạm vi 10. Một kế hoạch bài dạy Toán 1 (Cánh Diều) nêu mục tiêu "sử dụng các dấu (>, <, =) để so sánh các số trong phạm vi 10".
- **Kết luận cho app**: dấu không bắt buộc với bé dưới 6 tuổi. Spec dạy dấu như **bước chuẩn bị vào lớp 1**, đặt sau khi bé đã vững "nhiều hơn, ít hơn" bằng vật và "lớn hơn, bé hơn" bằng lời. Việc này khớp với nguyên tắc mẫu giáo "học bằng vật thật trước".

## Chuẩn mẫu giáo 5–6 tuổi: đã có và mới thêm

Danh sách dưới đây là nội dung toán của mẫu giáo lớn mình đối chiếu lần này, kèm nơi spec xử lý.

| Nội dung chuẩn | Trạng thái trong spec | Nơi xử lý |
| --- | --- | --- |
| Đếm trong 10 và đếm theo khả năng | Đã có | GD1–2, 5, 6 |
| Chữ số, số lượng, số thứ tự trong 10 | Số thứ tự **mới thêm** | GD2 bài 10 (file 03) |
| So sánh số lượng 2 và 3 nhóm, nói bằng nhau, nhiều nhất, ít nhất | Đã có | GD1–2 |
| Gộp và tách các nhóm bằng nhiều cách; tách 10 thành 2 nhóm ít nhất 2 cách | Đã có (A5) | GD3–5 |
| Thêm bớt trong 10 | Đã có | GD3–4, 7 |
| Dấu > < = | **Mới thêm** (nội dung lớp 1, làm quen) | GD5–7 |
| Sắp xếp theo quy tắc | **Mới thêm** | GD9 bài 4 |
| So sánh, sắp xếp theo thứ tự dài–ngắn, cao–thấp, nặng–nhẹ | **Mới thêm** | GD9 bài 5 |
| Đo độ dài bằng đơn vị tự chọn | **Mới thêm** | GD9 bài 6 |
| Hình phẳng, hình khối | **Mới thêm** (trước nằm ngoài phạm vi) | GD9 bài 1–2 |
| Định hướng: trên–dưới, trước–sau, phải–trái | **Mới thêm** | GD9 bài 3 |
| Ngày trong tuần, mùa, giờ đúng | **Mới thêm** | GD9 bài 7–8 |
| Số trong đời sống (số nhà, số tuổi) | **Mới thêm** (không dạy thông tin cá nhân) | GD2 bài 10 |

**Điều mình không thêm** vì vượt mức dưới 6 tuổi hoặc ngoài trọng tâm: cộng trừ có nhớ trong 100 (đã có ở GD8 tùy chọn), giờ lẻ và nửa giờ, tiền, lịch ngày tháng, đo bằng cm hay kg, phép nhân chia.

## Điều chưa xác minh (cần kiểm trước khi chốt nội dung)

- Mốc "100" và phép cộng qua 10 ở lớp 1 Nhật: mình dựa vào cách sách giáo khoa chia bài, chưa đọc được văn bản MEXT nêu rõ con số.
- **Lớp nào ở Nhật dạy ký hiệu 不等号 (> <)**: mình không tìm được đoạn nêu rõ và chưa xác minh. Bạn đã chốt (25/11/2026) dùng dấu giống nhau ở cả hai gói, nên thiết kế không đổi; tiếng Nhật vẫn đọc bằng lời "より おおきい/ちいさい" và không dạy tên gọi ký hiệu cho bé (file 07).
- Mục tiêu mẫu giáo Việt Nam lấy từ tài liệu của trường mầm non và bài báo giáo dục bám chương trình, không phải văn bản Thông tư gốc. **Mã MT (MT24–MT34) không thống nhất giữa các tài liệu**: một kế hoạch giáo dục cho "nhận biết số 5–10, số thứ tự" mang mã MT34, trong khi bản cũ của spec ghi MT34 là giờ đúng. Vì vậy spec nên bám **nội dung**, không bám số mã. Cần đối chiếu Thông tư gốc của chương trình giáo dục mầm non (bản sửa đổi mới nhất) trước khi trích số mã.
- Các mục "quy tắc", "định hướng phải–trái", "đo bằng đơn vị tự chọn", "ngày trong tuần, mùa, giờ đúng" mình ghi theo hiểu biết về chương trình mẫu giáo lớn; lần tra này chưa đọc được đoạn văn bản gốc cho từng mục. Cần đối chiếu.
- Chương trình lớp 1 Việt Nam mình đọc chỉ nêu cộng trừ không nhớ trong 100; sách giáo khoa có thể dạy qua 10 trong 20. Cần đối chiếu sách bạn dùng.
- **Mùa trong năm (đã chốt):** dùng 4 mùa xuân, hạ, thu, đông cho gói Việt để đồng bộ 1–1 với 4 mùa của gói Nhật (はる, なつ, あき, ふゆ).

## Nguồn (tra cứu ngày 25/11/2026)

- Văn bản MEXT, Toán lớp 1: https://www.mext.go.jp/content/1384661_4_1_1.pdf
- Tài liệu tỉnh Saitama về 「幼児期の終わりまでに育ってほしい姿」: https://www.pref.saitama.lg.jp/documents/66063/14youchienkyouiku.pdf
- Chương trình GDPT 2018, môn Toán (Hoatieu): https://hoatieu.vn/chuong-trinh-giao-duc-pho-thong-tong-the-mon-toan-161480
- Mục tiêu giáo dục mẫu giáo 5 tuổi MT23–MT34 (tài liệu trường mầm non, VNPT storage)
- Nội dung hình thành biểu tượng số lượng cho trẻ mẫu giáo 5–6 tuổi (nêu đếm trong 10, số thứ tự, tách 10 thành 2 nhóm): https://vjol.info.vn/tctbgd/article/download/96826/81821
- Nội dung so sánh số lượng hai, ba đối tượng trong phạm vi 10 (bằng nhau, nhiều nhất, ít nhất): https://vjol.info.vn/tctbgd/article/download/91251/77367
- Mục lục SGK Toán 1 có "Bé hơn. Dấu <", "Lớn hơn. Dấu >", "Bằng nhau. Dấu =": https://loigiaihay.com/lon-hon-dau-e2070.html
- Giáo án Toán 1 Cánh Diều, bài Luyện tập trang 26 (dùng dấu > < = trong phạm vi 10): https://vietjack.com/giao-an-toan-1/luyen-tap-trang-26-cd.jsp
- App tham khảo (chỉ đọc mô tả, chưa dùng thử): 学研 幼児さんすう (App Store id6505134376), トドさんすう (Appliv), さんすう思考力プラス (Appliv), ワンダーボックス (App Store id1492420477)
