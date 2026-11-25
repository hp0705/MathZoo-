# 06. Lời khen và báo sai (song ngữ, đọc tên bé)

Mọi câu có `{name}` được thay bằng tên bé. Mặc định tên tiếng Việt là **Mây** và tên tiếng Nhật là **マイ** (phụ huynh đổi được, xem file 07). Hai câu sinh ra từ cùng một khóa nhưng **chọn độc lập**, nên bé nghe ví dụ: "Giỏi quá, bé Mây xinh đẹp!" rồi "すごいね、かわいいマイちゃん！".

## Nguyên tắc

1. **Đúng ngôn ngữ đang chọn**: app đang ở tiếng Việt thì phản hồi hoàn toàn bằng tiếng Việt; đang ở tiếng Nhật thì phản hồi hoàn toàn bằng tiếng Nhật. Không dùng giọng đọc của ngôn ngữ khác để đọc thay nếu thiếu gói giọng trên máy. Nút đổi ngôn ngữ chỉ hiện ở màn hình chính và Góc Phụ Huynh (ẩn trong khi đang làm bài).
2. **Đọc đáp án kèm đơn vị rồi mới khen**: ở mọi hoạt động đếm/chia/ghép/tính (`A1`–`A7`), khi bé làm đúng, app đọc rõ số lượng + loại từ/bộ đếm + tên vật (ví dụ `sáu quả táo đó!` / `ろっこ りんご ですね！`), sau đó mới đọc lời khen và đợi đọc xong mới chuyển sang câu tiếp.
2. **Đọc rõ tên bé**: tên đứng ngay sau từ cảm thán và dấu phẩy hoặc sau chữ "bé" ("Giỏi quá, bé Mây…"); câu ngắn (không quá 10 từ ở tiếng Việt); tên là phần cuối của một cụm để giọng đọc không nuốt. Tên tiếng Nhật luôn kèm "ちゃん"; tiếng Việt kèm "bé". Nếu giọng máy đọc sai tên, phụ huynh nhập cách đọc riêng (file 07).
3. **Sai thì nói rõ là sai**, nhưng luôn đi kèm động viên và lời mời làm lại trong cùng một lượt nói. Từ dùng được: "Sai rồi", "Chưa đúng rồi", "Nhầm rồi", "Không phải rồi" / "ちがうよ", "おしい", "まちがえちゃったね". Không dùng từ chê bé (không có "dở", "kém", "ngốc").
4. **Báo sai không trừ điểm, không dùng màu đỏ, không kết thúc bài sớm**. Thẻ sai chuyển sang màu hổ phách kèm lắc nhẹ (file 08). Sau lời nói, app **đếm lại cùng bé** (file 03); với hoạt động điền dấu A10 thì app **ghép cặp** hai nhóm vật thay vì đếm lại (file 03, file 04).
5. **Đa dạng**: mỗi nhóm có nhiều biến thể; không bao giờ chọn lại câu vừa dùng ở lần liền trước cùng nhóm. Có nhóm riêng khi bé đúng liên tiếp.
6. **Ba mức khi sai**: lần 1 nhắc thử lại; lần 2 liên tiếp app đếm cùng bé và chuyển sang vật thật; từ lần 3 app chỉ đáp án một cách nhẹ nhàng và sang câu khác (câu đó không tính là đúng ngay lần đầu).
7. **Giới tính câu khen**: câu có "xinh đẹp" chỉ dùng cho bé gái; phụ huynh chọn "bé gái / bé trai / không chọn" (mặc định bé gái, vì Mây). Mọi nhóm vẫn còn ít nhất 4 câu cho mỗi lựa chọn.
8. Tên bé chỉ lưu trên máy (localStorage), không gửi đi đâu.

## Dòng chảy phản hồi

| Tình huống | Âm | Màu thẻ | Lời nói | Hành động tiếp |
| --- | --- | --- | --- | --- |
| Đúng | chuông "ting" | xanh lá nhạt, hiệu ứng nảy + dấu tích ✓ (không che đáp án) | đọc đáp án (nếu có, ví dụ `một quả chuối đó!` / `いっこ バナナ ですね！`) rồi đọc nhóm `praise` (hoặc `streak`) | đợi đọc xong mới sang câu tiếp |
| Sai lần 1 | "boing" nhẹ, tối đa 0,4 giây | hổ phách, lắc 2 lần + dấu ✕ (không che đáp án) | nhóm `wrong1` | đếm lại, cho chọn lại |
| Sai lần 2 liên tiếp | "boing" nhẹ | hổ phách | nhóm `wrong2` | chuyển sang vật thật, đếm cùng bé |
| Sai từ lần 3 | "boing" nhẹ | hổ phách | nhóm `wrong3` (có `{answer}`) | đếm và sáng thẻ đúng, sang câu khác |
| Sai từ lần 3, hoạt động A10 (điền dấu) | "boing" nhẹ | hổ phách | nhóm `wrong3cmp` (có `{answer}` là cả mệnh đề) | ghép cặp, sáng thẻ dấu đúng, sang câu khác |
| Xong bài | fanfare | vàng nắng | nhóm `finish` + truyện kết (file 05) | màn phần thưởng |

`{answer}` là đáp án đọc thành lời theo file 07: với đếm và chọn số là một số (ví dụ "năm" / "ご"); với hoạt động A10 là **cả mệnh đề so sánh** (ví dụ "ba lớn hơn hai" / "さんは により おおきい"), dùng nhóm `wrong3cmp` vì câu `wrong3` thường có dạng "Đáp án là {answer}" và tiếng Nhật "…おおきいだよ" không tự nhiên.

Các nhóm `wrong1` và `wrong2` dùng chung cho mọi loại hoạt động. Câu `wrong2` nói "đếm lại" vẫn đúng với A10 vì bước ghép cặp bắt đầu bằng việc đếm từng nhóm. Nhóm `praise` số 2 nói "đếm"; với hoạt động không đếm (A10, A11, A12, A13, A14) có thể chọn câu khác trong nhóm (không bắt buộc).

## Danh sách câu

### `praise`: Khen khi đúng

| # | Tiếng Việt | Tiếng Nhật | Dùng cho |
| --- | --- | --- | --- |
| 1 | Giỏi quá, bé {name} xinh đẹp! | すごいね、かわいい{name}ちゃん！ | bé gái |
| 2 | Đúng rồi! Bé {name} đáng yêu đếm hay quá! | せいかい！{name}ちゃん、じょうずに かぞえたね！ | mọi bé |
| 3 | Tuyệt vời! Bé {name} thông minh ghê! | やったね、{name}ちゃん！てんさいだね！ | mọi bé |
| 4 | Hoan hô bé {name}, đúng rồi! | だいせいかい！{name}ちゃん、かっこいい！ | mọi bé |
| 5 | Chính xác! Bé {name} giỏi lắm! | えらいね、{name}ちゃん！さいこうだよ！ | mọi bé |
| 6 | Wow, bé {name} xinh đẹp làm đúng rồi! | わあ、かわいい{name}ちゃん、あたりだよ！ | bé gái |
| 7 | Siêu quá! Bé {name} giỏi nhất vườn thú! | すごーい！{name}ちゃんは どうぶつえんで いちばん！ | mọi bé |
| 8 | Bé {name} ơi, đúng rồi đó! Tài quá! | {name}ちゃん、ぴんぽーん！よくできました！ | mọi bé |

Tối thiểu 8 câu mỗi ngôn ngữ; có thể thêm, nhưng hai ngôn ngữ phải cùng số câu.

### `streak`: Khen khi đúng liên tiếp 3 câu trở lên

| # | Tiếng Việt | Tiếng Nhật | Dùng cho |
| --- | --- | --- | --- |
| 1 | Wow, đúng liên tục luôn! Bé {name} siêu quá! | わあ、れんぞくで せいかい！{name}ちゃん、すごい！ | mọi bé |
| 2 | Bé {name} đúng liền mấy câu rồi, tuyệt vời! | {name}ちゃん、つづけて あたりだよ！さいこう！ | mọi bé |
| 3 | Chuỗi đúng dài ghê! Bé {name} giỏi lắm! | ずっと せいかいだね！{name}ちゃん、えらい！ | mọi bé |

Tối thiểu 3 câu mỗi ngôn ngữ; có thể thêm, nhưng hai ngôn ngữ phải cùng số câu.

### `wrong1`: Sai lần 1 (nói rõ là sai, động viên, cho làm lại)

| # | Tiếng Việt | Tiếng Nhật | Dùng cho |
| --- | --- | --- | --- |
| 1 | Sai rồi, bé {name} ơi. Cố gắng lên nào, làm lại một lần nữa nhé! | ちがうよ、{name}ちゃん。がんばって、もういっかい やってみよう！ | mọi bé |
| 2 | Chưa đúng rồi. Bé {name} thử lại nào! | おしい！{name}ちゃん、もういちど ためしてみよう！ | mọi bé |
| 3 | Nhầm rồi, không sao đâu bé {name} ơi. Mình thử lần nữa nhé! | まちがえちゃったね。だいじょうぶ、もういっかい！ | mọi bé |
| 4 | Ồ, chưa đúng rồi! Bé {name} cố lên, làm lại nào! | あれれ、ちがうみたい！{name}ちゃん、もういちど やってみよう！ | mọi bé |
| 5 | Không phải rồi. Bé {name} ơi, mình thử một lần nữa nhé! | ざんねん、ちがうよ。{name}ちゃん、もういっかい ためそうね！ | mọi bé |
| 6 | Sai mất rồi! Nhưng bé {name} giỏi mà, thử lại nào! | まちがいだよ。でも {name}ちゃんなら できるよ、もういちど！ | mọi bé |

Tối thiểu 6 câu mỗi ngôn ngữ; có thể thêm, nhưng hai ngôn ngữ phải cùng số câu.

### `wrong2`: Sai lần 2 liên tiếp (app đếm cùng bé)

| # | Tiếng Việt | Tiếng Nhật | Dùng cho |
| --- | --- | --- | --- |
| 1 | Không sao đâu. Mình cùng đếm lại với nhau nào! | だいじょうぶ。いっしょに かぞえなおそう！ | mọi bé |
| 2 | Bé {name} đừng buồn, mình đếm lại từng cái nhé! | {name}ちゃん、ゆっくり ひとつずつ かぞえてみよう！ | mọi bé |
| 3 | Chậm thôi nào bé {name} ơi, mình đếm cùng nhau! | いっしょに ゆびで さわってみよう、{name}ちゃん！ | mọi bé |
| 4 | Cố lên bé {name}, mình giúp bé đếm nhé! | がんばれ、{name}ちゃん！いっしょに かぞえるよ！ | mọi bé |
| 5 | Thử một lần nữa nào, mình nhìn thật kỹ từng cái nhé! | もう いっかい、よーく みてみようね！ | mọi bé |

Tối thiểu 5 câu mỗi ngôn ngữ; có thể thêm, nhưng hai ngôn ngữ phải cùng số câu.

### `wrong3`: Sai lần 3 trở đi (app chỉ đáp án, không bắt làm tiếp)

| # | Tiếng Việt | Tiếng Nhật | Dùng cho |
| --- | --- | --- | --- |
| 1 | Mình cùng xem nhé! Đáp án là {answer}. Bé {name} thử câu khác nào! | いっしょに みてみよう！こたえは {answer}だよ。{name}ちゃん、つぎも やってみよう！ | mọi bé |
| 2 | Không sao, câu này khó mà. Đáp án là {answer}. Mình làm câu tiếp nhé, bé {name}! | このもんだいは むずかしいね。こたえは {answer}だよ。{name}ちゃん、つぎへ いこう！ | mọi bé |
| 3 | Bé {name} ơi, mình xem cùng nhau nhé. Là {answer} đó. Câu sau mình làm được! | {name}ちゃん、いっしょに みよう。{answer}だよ。つぎは きっと できるよ！ | mọi bé |

Tối thiểu 3 câu mỗi ngôn ngữ; có thể thêm, nhưng hai ngôn ngữ phải cùng số câu.

### `wrong3cmp`: Sai lần 3 trở đi ở hoạt động điền dấu A10 (mới)

`{answer}` là mệnh đề đầy đủ ("ba lớn hơn hai", "hai bé hơn ba", "ba bằng ba"; ja "さんは により おおきい"…), xem file 07. Chỉ dùng cho A10; các hoạt động khác dùng `wrong3`.

| # | Tiếng Việt | Tiếng Nhật | Dùng cho |
| --- | --- | --- | --- |
| 1 | Mình cùng xem nhé! {answer} đó. Bé {name} thử câu khác nào! | いっしょに みてみよう！{answer}よ。{name}ちゃん、つぎも やってみよう！ | mọi bé |
| 2 | Không sao, câu này khó mà. {answer} nha. Mình làm câu tiếp nhé, bé {name}! | このもんだいは むずかしいね。{answer}よ。{name}ちゃん、つぎへ いこう！ | mọi bé |
| 3 | Bé {name} ơi, mình xem cùng nhau nhé. {answer} đó. Câu sau mình làm được! | {name}ちゃん、いっしょに みよう。{answer}よ。つぎは きっと できるよ！ | mọi bé |

Tối thiểu 3 câu mỗi ngôn ngữ; có thể thêm, nhưng hai ngôn ngữ phải cùng số câu.

### `finish`: Khen khi xong bài

| # | Tiếng Việt | Tiếng Nhật | Dùng cho |
| --- | --- | --- | --- |
| 1 | Hoan hô bé {name} xinh đẹp! Bé làm xong rồi! | やったね、かわいい{name}ちゃん！できたよ！ | bé gái |
| 2 | Tuyệt vời! Bé {name} đáng yêu đã hoàn thành! | だいせいかい！{name}ちゃん、ぜんぶ できたね！ | mọi bé |
| 3 | Bé {name} làm xong bài rồi, siêu quá! | {name}ちゃん、さいごまで よくがんばったね！ | mọi bé |
| 4 | Xong rồi! Bé {name} nhận được sao lấp lánh! | できた、できた！{name}ちゃん、ぴかぴかの ほしだよ！ | mọi bé |
| 5 | Giỏi lắm bé {name}, mình làm xong hết rồi! | すごいね、{name}ちゃん！ぜんぶ おわったよ！ | mọi bé |
| 6 | Bé {name} thật là thiên tài! Mời bé nhận sao! | {name}ちゃんは てんさい！ほしを どうぞ！ | mọi bé |

Tối thiểu 6 câu mỗi ngôn ngữ; có thể thêm, nhưng hai ngôn ngữ phải cùng số câu.

### `greet`: Chào khi mở app

| # | Tiếng Việt | Tiếng Nhật | Dùng cho |
| --- | --- | --- | --- |
| 1 | Chào bé {name} xinh đẹp! Mình cùng chơi nhé! | こんにちは、かわいい{name}ちゃん！いっしょに あそぼう！ | bé gái |
| 2 | Chào bé {name}! Hôm nay mình chơi gì nào? | {name}ちゃん、きょうも がんばろうね！ | mọi bé |
| 3 | Bé {name} đến rồi! Các bạn thú đang đợi đó! | {name}ちゃん、どうぶつたちが まっているよ！ | mọi bé |

Tối thiểu 2 câu mỗi ngôn ngữ; có thể thêm, nhưng hai ngôn ngữ phải cùng số câu.

### `idle`: Nhắc nhẹ khi bé không chạm trong 10 giây (không đo thời gian để chấm điểm)

| # | Tiếng Việt | Tiếng Nhật | Dùng cho |
| --- | --- | --- | --- |
| 1 | Bé {name} ơi, mình chạm vào đây nhé! | {name}ちゃん、ここを さわってみよう！ | mọi bé |
| 2 | Cùng thử nào bé {name}, chạm vào hình nhé! | いっしょに やってみよう、{name}ちゃん！ | mọi bé |
| 3 | Mình đang đợi bé {name} đó! | {name}ちゃんを まっているよ！ | mọi bé |

Tối thiểu 3 câu mỗi ngôn ngữ; có thể thêm, nhưng hai ngôn ngữ phải cùng số câu.

## Quy tắc viết câu mới

- Ngắn, ấm, nhắc tên bé; không có dấu ngoặc, ký hiệu lạ, hay emoji.
- Tiếng Việt chuẩn NFC. Tiếng Nhật chỉ hiragana và katakana, dùng dấu ！ và 。 toàn chiều rộng.
- Câu báo sai luôn có đủ ba phần: nói rõ chưa đúng, động viên, mời làm lại (hoặc đếm lại).
- Thêm câu vào **cả hai ngôn ngữ**, rồi cập nhật file 09 nếu dùng prompt.

