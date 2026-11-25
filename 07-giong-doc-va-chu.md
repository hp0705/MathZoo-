# 07. Giọng đọc, chữ và tên bé

## Chiến lược giọng đọc

- **Bản đầu (v1)**: dùng giọng máy của trình duyệt (`speechSynthesis`, `vi-VN` và `ja-JP`), như dự án Bé Mây. Lý do: câu khen và báo sai chứa **tên bé**, thay đổi theo từng gia đình nên không thu trước được.
- **Sau này (v2, tùy chọn)**: thu giọng người thật cho các câu cố định (số, từ toán, câu truyện) và vẫn dùng giọng máy cho câu có tên bé. Tên file: `vi_num_05`, `ja_num_05`, `sfx_count_05`; app thử tải `assets/audio/{lang}/{id}.m4a`, thiếu hoặc lỗi thì quay về giọng máy.
- Không bao giờ để lỗi giọng đọc chặn bài học; chờ tối đa vài giây rồi đi tiếp.
- Tốc độ đọc chậm hơn nói thường khoảng 15–20% (đề xuất `rate` 0,85). Chưa kiểm chứng trên iPad thật; cần nghe thử cả hai ngôn ngữ.
- iOS chỉ cho phát tiếng sau lần chạm đầu tiên của bé; giọng tiếng Việt có thể cần tải trong Cài đặt của iPad. Nếu không có giọng `vi-VN`, app báo cho phụ huynh ở góc phụ huynh.

## Tên bé

| Trường | Mặc định | Ghi chú |
| --- | --- | --- |
| Tên tiếng Việt (`nameVi`) | Mây | Tối đa 12 ký tự, NFC, bỏ ký tự `< > & "` |
| Tên tiếng Nhật (`nameJa`) | マイ | Katakana hoặc hiragana, tối đa 8 ký tự, **không kanji** |
| Cách đọc riêng (`speakVi`, `speakJa`) | trống | Phụ huynh nhập khi giọng máy đọc sai tên; chỉ dùng để đọc, không hiển thị |
| Cách khen (`gender`) | bé gái | bé gái / bé trai / không chọn, để lọc câu có "xinh đẹp" (file 06) |

Hiển thị: "Bé Mây" và "マイちゃん". Nếu để trống, app giữ giá trị mặc định (không để trống tên). Tên chỉ lưu trên máy.

## Đọc số

| Số | Tiếng Việt | Tiếng Nhật (hiragana) |
| --- | --- | --- |
| 0 | không | ぜろ |
| 1–3 | một, hai, ba | いち, に, さん |
| 4 | bốn | よん |
| 5–6 | năm, sáu | ご, ろく |
| 7 | bảy | なな |
| 8 | tám | はち |
| 9 | chín | きゅう |
| 10 | mười | じゅう |
| 11, 14, 15, 17, 19 | mười một, mười bốn, mười lăm, mười bảy, mười chín | じゅういち, じゅうよん, じゅうご, じゅうなな, じゅうきゅう |
| 20, 21, 24, 25 | hai mươi, hai mươi mốt, hai mươi tư, hai mươi lăm | にじゅう, にじゅういち, にじゅうよん, にじゅうご |
| 30–50 | ba mươi, bốn mươi, năm mươi | さんじゅう, よんじゅう, ごじゅう |
| 60–90 | sáu mươi, bảy mươi, tám mươi, chín mươi | ろくじゅう, ななじゅう, はちじゅう, きゅうじゅう |
| 100 | một trăm | ひゃく |

Quy tắc tiếng Nhật: luôn đọc 4, 7, 9 là よん, なな, きゅう (không dùng し, しち, く), **trừ khi đọc giờ** (xem mục "Giờ đúng" dưới đây). Quy tắc tiếng Việt: từ 21 trở đi dùng "mốt" cho hàng đơn vị 1, "lăm" cho 5; "tư" cho 24 là lựa chọn của mình, nhiều sách dùng "bốn" nên cần đối chiếu sách bạn dùng.

## Số thứ tự (mới)

Dùng ở bài "thứ mấy" (GD2 bài 10) và xếp thứ tự (A11). Số thứ tự trả lời "thứ mấy", khác với số lượng trả lời "có mấy".

| Thứ | Tiếng Việt | Tiếng Nhật (hiragana) |
| --- | --- | --- |
| 1 | thứ nhất | いちばんめ |
| 2 | thứ hai | にばんめ |
| 3 | thứ ba | さんばんめ |
| 4 | thứ tư | よんばんめ |
| 5 | thứ năm | ごばんめ |
| 6 | thứ sáu | ろくばんめ |
| 7 | thứ bảy | ななばんめ |
| 8 | thứ tám | はちばんめ |
| 9 | thứ chín | きゅうばんめ |
| 10 | thứ mười | じゅうばんめ |

Ở tiếng Việt thứ 4 đọc "thứ tư" (không phải "thứ bốn"), thứ 5 đọc "thứ năm". Với hàng đầu, "thứ nhất" và "số 1" đều được dùng (ở Việt Nam không phân biệt chặt); "đầu tiên" chỉ dùng trong lời truyện. Câu hỏi bài ưu tiên "thứ nhất, thứ hai…" để bé quen từ "thứ".

## Đếm vật

Tiếng Nhật có hai cách. **Đếm 1–10 bằng つ**: ひとつ, ふたつ, みっつ, よっつ, いつつ, むっつ, ななつ, やっつ, ここのつ, とお (đều, không phụ thuộc loại vật). Trong câu truyện dùng bộ đếm theo loại:

| Loại | Dùng cho | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| こ (`ko`) | quả, củ, bóng, kẹo, đèn lồng | いっこ | にこ | さんこ | よんこ | ごこ | ろっこ | ななこ | はっこ | きゅうこ | じゅっこ |
| ひき (`hiki`) | cá, đom đóm, thỏ, sóc | いっぴき | にひき | さんびき | よんひき | ごひき | ろっぴき | ななひき | はっぴき | きゅうひき | じゅっぴき |

Từ 11 trở lên, bộ đếm có âm đổi riêng; danh sách đầy đủ sẽ làm khi chốt số vật tối đa của mỗi vùng. Tiếng Việt: đọc số rồi loại từ ("ba quả táo", "hai con cá", "một củ cà rốt", "hai cái đèn lồng").

## Từ toán cốt lõi

| Khái niệm | Tiếng Việt | Tiếng Nhật |
| --- | --- | --- |
| Nhận thêm | thêm, nhận thêm | ふえる, もらう |
| Bớt, cho đi | bớt, cho | へる, あげる |
| Cộng / Trừ | cộng / trừ | たす / ひく |
| Bằng | bằng | は ("3 たす 2 は 5") |
| Tổng | tất cả | ぜんぶで, あわせて |
| Còn lại | còn lại | のこり |
| Hơn kém (số lượng vật) | nhiều hơn, ít hơn, bằng nhau | おおい, すくない, おなじ, ちがい |
| **Hơn kém (giữa hai số)** | **lớn hơn, bé hơn, bằng nhau** | **おおきい, ちいさい, おなじ** |
| **Nhất** | nhiều nhất, ít nhất; lớn nhất, bé nhất | いちばん おおい, いちばん すくない; いちばん おおきい, いちばん ちいさい |

Đọc phép tính: vi "ba cộng hai bằng năm"; ja "さん たす に は ご".

## Đọc dấu so sánh (mới)

Dấu được **vẽ bằng SVG** (file 08), không phụ thuộc font. Trong chuỗi chữ của app, ký tự `>` và `<` phải được chèn bằng `textContent` hoặc escape (`&gt;` `&lt;`) để không làm vỡ HTML.

| Mệnh đề | Tiếng Việt | Tiếng Nhật |
| --- | --- | --- |
| `3 > 2` | "ba lớn hơn hai" | "さんは により おおきい" |
| `2 < 3` | "hai bé hơn ba" | "には さんより ちいさい" |
| `3 = 3` | "ba bằng ba" hoặc "ba bằng nhau với ba" (dùng "ba bằng ba") | "さんと さんは おなじ" |
| Hai nhóm vật, `5 > 3` | "năm con thỏ nhiều hơn ba con sóc" | "うさぎは りすより おおい" |
| Hai phép tính, `3 + 2 > 4` | "ba cộng hai lớn hơn bốn" | "さん たす には よんより おおきい" |

Quy tắc đọc:

- Nhóm vật (số lượng) dùng "nhiều hơn / ít hơn" (おおい / すくない); số và phép tính dùng "lớn hơn / bé hơn" (おおきい / ちいさい). Đúng với cách sách Việt Nam dạy từ nhiều hơn, ít hơn lên lớn hơn, bé hơn.
- Tiếng Nhật chỉ nói **bằng lời**; không dạy tên gọi ký hiệu 「大なり」「小なり」 cho bé (có thể ghi ở góc phụ huynh).
- Trong lời gợi ý: vi "miệng há về bên lớn hơn", ja "おくちは おおきい ほうに あくよ". Hai câu này là cách gợi nhớ, không phải tên của dấu.
- `{answer}` của hoạt động A10 (file 06, nhóm `wrong3cmp`) là **cả mệnh đề** ở cột trên, ví dụ "ba lớn hơn hai", không chỉ một từ.

## Hình, vị trí, đo (GD9, mới)

| Khái niệm | Tiếng Việt | Tiếng Nhật (hiragana) |
| --- | --- | --- |
| Hình tròn | hình tròn | まる |
| Hình vuông | hình vuông | ましかく |
| Hình chữ nhật | hình chữ nhật | ながしかく |
| Hình tam giác | hình tam giác | さんかく |
| Khối cầu | khối cầu | たまの かたち |
| Khối trụ | khối trụ | つつの かたち |
| Khối vuông | khối vuông | さいころの かたち |
| Khối chữ nhật | khối chữ nhật | はこの かたち |
| Trên / dưới | trên, dưới | うえ, した |
| Trước / sau | trước, sau | まえ, うしろ |
| Phải / trái | phải, trái | みぎ, ひだり |
| Dài / ngắn | dài, ngắn; dài nhất, ngắn nhất | ながい, みじかい; いちばん ながい, いちばん みじかい |
| Cao / thấp | cao, thấp | たかい, ひくい |
| Nặng / nhẹ | nặng, nhẹ | おもい, かるい |

Các từ tiếng Nhật cho hình và khối ở bảng trên là cách gọi gần gũi với trẻ mình chọn; tên chính thức (円, 正方形, 長方形, 三角形, 球, 円柱, 立方体, 直方体) chỉ ghi ở góc phụ huynh. Cần người bản ngữ duyệt (file 10).

### Từ vựng và câu mẫu bổ sung (GD2 bài 10, GD9 bài 4 & 6)

| Khái niệm / Mẫu câu | Tiếng Việt | Tiếng Nhật (hiragana / katakana) | Dùng ở |
| --- | --- | --- | --- |
| Số nhà / số trang / số tuổi | số nhà, số trang, số tuổi | おうちの ばんごう, ページの ばんごう, なんさいかな | GD2 bài 10 |
| Quy tắc lặp | quy tắc, xếp theo thứ tự | きまり, じゅんばんに ならべよう | GD9 bài 4 (A12) |
| Câu hỏi quy tắc | Tiếp theo là hình gì? | つぎは なにかな？ | GD9 bài 4 (A12) |
| Đo đơn vị tự chọn | dài bằng mấy khối? | ブロック なんこぶんかな？ | GD9 bài 6 (A14) |
| Kết quả đo | dài bằng năm khối | ブロック ごこぶんだよ | GD9 bài 6 (A14) |

## Ngày trong tuần, mùa, giờ đúng (GD9, mới)

| Khái niệm | Tiếng Việt | Tiếng Nhật (hiragana) |
| --- | --- | --- |
| Các ngày | Thứ Hai, Thứ Ba, Thứ Tư, Thứ Năm, Thứ Sáu, Thứ Bảy, Chủ nhật | げつようび, かようび, すいようび, もくようび, きんようび, どようび, にちようび |
| Bốn mùa | xuân, hạ, thu, đông | はる, なつ, あき, ふゆ |
| Giờ đúng | một giờ, hai giờ, …, mười hai giờ | いちじ, にじ, さんじ, **よじ**, ごじ, ろくじ, **しちじ**, はちじ, **くじ**, じゅうじ, じゅういちじ, じゅうにじ |

**Ngoại lệ quan trọng cho tiếng Nhật khi đọc giờ**: 4 giờ là よじ, 7 giờ là しちじ, 9 giờ là くじ (không phải よんじ, ななじ, きゅうじ). Đây là ngoại lệ của quy tắc "luôn よん, なな, きゅう" ở trên, nên hàm đọc giờ phải xử lý riêng. Tiếng Việt: "ba giờ", "bảy giờ", không dùng "lăm giờ".

Đọc đồng hồ chỉ cho giờ đúng (kim dài chỉ 12). Giờ lẻ, nửa giờ, "sáng, chiều, tối" chưa có trong v1.

## Quy cách chữ

- Số Ả Rập; dấu trừ dùng ký tự − (U+2212); tiếng Việt chuẩn NFC.
- **Dấu so sánh `>` `<` `=`**: vẽ bằng SVG, kích thước tối thiểu 96 px (file 08). Không dùng ký tự Unicode ＞ ＜ toàn chiều rộng.
- Tiếng Nhật cho bé: hiragana, tên bé katakana; kanji chỉ ở góc phụ huynh, kèm furigana (ruby) khi hiện.
- Câu phụ đề trong bài chỉ để phụ huynh; bé nghe giọng, không cần đọc.
- Font: cần font tròn có đủ dấu tiếng Việt và font tròn hỗ trợ kana; bản đầu dùng font hệ thống (file 08). Nếu muốn đóng gói font riêng thì kiểm giấy phép trước.
