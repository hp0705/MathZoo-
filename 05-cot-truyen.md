# 05. Cốt truyện: Vườn thú MathZoo

Cốt truyện biến 74 bài chính (cộng 8 bài tùy chọn ở Quảng trường Lễ hội, tổng 82 bài) thành một hành trình. Người code lấy nội dung từ đây; câu chữ nằm trong `data/story.json` (xem file 09). `{name}` là tên bé (Mây / マイ), xem file 06 và 07.

## Tóm tắt

Vườn thú MathZoo sắp mở **Lễ hội Ngôi sao Toán**. Bé là *trợ lý của vườn thú* và đi qua 8 vùng. Mỗi vùng có một bạn thú nhờ bé đếm, thêm, bớt. Xong mỗi bài bé nhận một ngôi sao; xong mỗi vùng bé nhận một sticker vào Sổ sưu tập. Xong vùng thứ tám, bé nhận **Huy chương Ngôi sao Toán**. Sau đó **Quảng trường Lễ hội** (vùng thứ chín, tùy chọn) mở thêm các trò hình, vị trí, đo và giờ cùng cả tám bạn thú; vùng này không cần cho huy chương.

Nhân vật đồng hành trên bản đồ: **Sao Lấp Lánh** (ぴかちゃん), một ngôi sao nhỏ chỉ đường. Chưa có lời thoại riêng, chỉ lấp lánh ở vùng được gợi ý. Mọi nhân vật do dự án tự vẽ, không dùng nhân vật có bản quyền.

## Tám vùng chính và Quảng trường Lễ hội

| GD | Vùng (VI / JA) | Bạn thú (VI / JA) | Vật đếm (VI / JA, loại từ, bộ đếm) | Nhiệm vụ | Sticker |
| --- | --- | --- | --- | --- | --- |
| 1 | Vườn Cà Rốt / にんじんばたけ | Thỏ Bông / うさぎの ふわちゃん | cà rốt / にんじん, củ, ko | đếm 1–5 | Cà rốt vàng / きんの にんじん |
| 2 | Rừng Táo / りんごのもり | Gấu Mật / くまの はちくん | táo / りんご, quả, ko | đếm và nhận số đến 10 | Táo vàng / きんの りんご |
| 3 | Hồ Cá / さかなのいけ | Mèo Mướp / ねこの みけちゃん | cá / さかな, con, hiki | thêm và bớt bằng vật thật trong 5 | Cá lấp lánh / きらきらの さかな |
| 4 | Sân Bóng / ボールひろば | Cáo Cam / きつねの こんちゃん | bóng / ボール, quả, ko | thêm bớt trong 10, làm quen dấu + − = | Bóng lấp lánh / きらきらの ボール |
| 5 | Bãi Bóng Bay / ふうせんひろば | Voi Con / ぞうの ぱおちゃん | bóng bay / ふうせん, quả, ko | đếm đến 20, một chục và mấy đơn vị | Bóng bay cầu vồng / にじいろの ふうせん |
| 6 | Tháp Đom Đóm / ほたるのとう | Cú Mèo / ふくろうの ほーくん | đom đóm / ほたる, con, hiki | đếm đến 100, đếm theo chục | Đom đóm phát sáng / ひかる ほたる |
| 7 | Vườn Chuối / バナナのはたけ | Khỉ Nâu / さるの きっきくん | chuối / バナナ, quả, ko | cộng trừ trong 10 thành thạo | Chuối vàng / きんの バナナ |
| 8 | Sân Băng / こおりのひろば | Cánh Cụt / ペンギンの ぺんちゃん | viên kẹo / あめ, viên, ko | mở rộng: số tròn chục trong 100 và cộng trừ qua 10 trong 20 (đồng bộ hai ngôn ngữ) | Huy chương ngôi sao / ほしの メダル |
| 9 (tùy chọn) | Quảng trường Lễ hội / おまつりひろば | Các bạn thú / どうぶつたち (cả tám bạn) | đèn lồng / ちょうちん, cái, ko | hình, vị trí, quy tắc, đo, ngày giờ (file 03) | Cờ lễ hội / おまつりの はた |

Bộ đếm tiếng Nhật: `ko` = こ, `hiki` = ひき (xem file 07). Màu nền từng vùng ở file 08. Ở vùng 9 mọi bạn thú cùng xuất hiện nên `{animal}` ở các câu bài giữa vùng đọc là "các bạn thú" / "どうぶつたち".

## Truyện mở đầu và kết thúc từng vùng

Truyện mở đầu phát ở bài đầu tiên của vùng; truyện kết phát ở bài cuối. Mỗi đoạn tối đa 2–3 câu ngắn, đọc một lần, có nút nghe lại.

### GD 1. Vườn Cà Rốt ・ にんじんばたけ

| | Tiếng Việt | Tiếng Nhật |
| --- | --- | --- |
| Mở đầu | Chào bé {name}! Đây là Vườn Cà Rốt. Thỏ Bông đang hái cà rốt cho Lễ hội Ngôi sao Toán. Bé giúp Thỏ đếm nhé! | こんにちは、{name}ちゃん！ここは にんじんばたけだよ。うさぎの ふわちゃんが おまつりの ために にんじんを とっているよ。いっしょに かぞえよう！ |
| Kết | Thỏ Bông có đủ cà rốt cho lễ hội rồi. Cảm ơn bé {name} nhiều lắm! | ふわちゃんの にんじんが いっぱいに なったよ。{name}ちゃん、ありがとう！ |

### GD 2. Rừng Táo ・ りんごのもり

| | Tiếng Việt | Tiếng Nhật |
| --- | --- | --- |
| Mở đầu | Bé {name} ơi, Gấu Mật nhặt được thật nhiều táo trong rừng. Mình cùng đếm đến mười nhé! | {name}ちゃん、くまの はちくんが もりで りんごを たくさん ひろったよ。じゅうまで かぞえよう！ |
| Kết | Gấu Mật vui lắm! Bé {name} đếm táo giỏi quá. | はちくんは おおよろこび！{name}ちゃん、りんごを じょうずに かぞえたね。 |

### GD 3. Hồ Cá ・ さかなのいけ

| | Tiếng Việt | Tiếng Nhật |
| --- | --- | --- |
| Mở đầu | Bé {name} đến Hồ Cá rồi! Mèo Mướp câu cá rồi chia cho bạn. Bé giúp Mèo tính nhé! | {name}ちゃん、さかなの いけに ついたよ！ねこの みけちゃんは つった さかなを ともだちに わけるよ。いっしょに かんがえよう！ |
| Kết | Mèo Mướp có bữa cá thật ngon. Cảm ơn bé {name}! | みけちゃんは おいしい さかなを たべられるよ。{name}ちゃん、ありがとう！ |

### GD 4. Sân Bóng ・ ボールひろば

| | Tiếng Việt | Tiếng Nhật |
| --- | --- | --- |
| Mở đầu | Bé {name} giỏi quá, đến Sân Bóng rồi! Cáo Cam có rất nhiều bóng. Mình tính cùng Cáo nhé! | {name}ちゃん、ボールひろばに きたよ！きつねの こんちゃんの ボールで けいさんしよう！ |
| Kết | Cáo Cam chơi bóng thật vui. Bé {name} tính giỏi lắm! | こんちゃんは ボールあそびが たのしいって。{name}ちゃん、けいさんが じょうずだね！ |

### GD 5. Bãi Bóng Bay ・ ふうせんひろば

| | Tiếng Việt | Tiếng Nhật |
| --- | --- | --- |
| Mở đầu | Bé {name} ơi, Voi Con thổi thật nhiều bóng bay! Mười bóng là một chục. Mình đếm đến hai mươi nhé! | {name}ちゃん、ぞうの ぱおちゃんが ふうせんを たくさん ふくらませたよ！じゅっこで ひとまとまり。にじゅうまで かぞえよう！ |
| Kết | Bóng bay bay lên trời rồi! Cảm ơn bé {name}, Voi Con vui lắm. | ふうせんが そらに とんだよ！{name}ちゃん、ぱおちゃんは うれしいって。 |

### GD 6. Tháp Đom Đóm ・ ほたるのとう

| | Tiếng Việt | Tiếng Nhật |
| --- | --- | --- |
| Mở đầu | Bé {name} ơi, trời tối rồi. Cú Mèo cần đếm đom đóm trên tháp, nhiều lắm, đến một trăm! Mình đếm theo chục nhé! | {name}ちゃん、よるに なったよ。ふくろうの ほーくんが とうの ほたるを かぞえるよ。ひゃくまで！じゅうずつ かぞえよう！ |
| Kết | Cả tháp sáng lấp lánh! Bé {name} đếm đến một trăm rồi, giỏi quá. | とうが きらきら ひかったよ！{name}ちゃん、ひゃくまで かぞえられたね。 |

### GD 7. Vườn Chuối ・ バナナのはたけ

| | Tiếng Việt | Tiếng Nhật |
| --- | --- | --- |
| Mở đầu | Bé {name} ơi, Khỉ Nâu hái chuối rồi chia cho các bạn. Mình giúp Khỉ tính thật chính xác, không cần vội nhé! | {name}ちゃん、さるの きっきくんが バナナを とって ともだちに わけるよ。ゆっくり ただしく けいさんしよう！ |
| Kết | Khỉ Nâu chia chuối xong rồi. Bé {name} tính giỏi như nhà toán học! | きっきくんは バナナを わけおわったよ。{name}ちゃん、はかせみたいだね！ |

### GD 8. Sân Băng ・ こおりのひろば

| | Tiếng Việt | Tiếng Nhật |
| --- | --- | --- |
| Mở đầu | Bé {name} đến Sân Băng, nơi cuối cùng rồi! Cánh Cụt có một thử thách lớn cho bé. Bé thử sức nhé! | {name}ちゃん、さいごの こおりのひろばに きたよ！ペンギンの ぺんちゃんから おおきな チャレンジが あるよ。やってみよう！ |
| Kết | Hoan hô! Bé {name} đã giúp cả tám bạn thú. Lễ hội Ngôi sao Toán bắt đầu thôi! | やったね！{name}ちゃんは はちにんの どうぶつを たすけたよ。ほしの おまつりが はじまるよ！ |

### GD 9. Quảng trường Lễ hội ・ おまつりひろば (tùy chọn)

| | Tiếng Việt | Tiếng Nhật |
| --- | --- | --- |
| Mở đầu | Bé {name} ơi, lễ hội còn nhiều trò vui nữa! Các bạn thú cần bé xếp đèn lồng, đo ruy băng và xem giờ. Mình giúp các bạn nhé! | {name}ちゃん、おまつりには まだ たのしい ことが あるよ！どうぶつたちが ちょうちんを ならべたり、リボンを はかったり、とけいを みたり するよ。いっしょに てつだおう！ |
| Kết | Lễ hội thật rực rỡ! Cả tám bạn thú cảm ơn bé {name}. | おまつりが きらきら かがやいたよ！はちにんの どうぶつが {name}ちゃんに ありがとうって！ |

### Kết thúc cả hành trình (sau khi xong vùng 8)

| | Tiếng Việt | Tiếng Nhật |
| --- | --- | --- |
| Lễ hội | Lễ hội bắt đầu rồi! Bé {name} xinh đẹp nhận Huy chương Ngôi sao Toán của Vườn thú MathZoo! | おまつりが はじまるよ！かわいい{name}ちゃんに ほしの メダルを あげるね！ |

## Truyện nhỏ cho các bài giữa vùng

Bài đầu dùng truyện mở đầu vùng; bài cuối dùng truyện kết vùng. Các bài ở giữa chọn ngẫu nhiên một câu mở và một câu kết dưới đây (không lặp câu liền trước). `{animal}` và `{object}` lấy từ bảng trên.

**Câu mở bài giữa vùng**

| Tiếng Việt | Tiếng Nhật |
| --- | --- |
| {animal} đang đợi bé {name} giúp đếm {object} đây! | {animal}が {name}ちゃんを まっているよ。{object}を いっしょに かぞえよう！ |
| Bé {name} ơi, {animal} có thêm {object} nữa nè. Mình xem nhé! | {name}ちゃん、{animal}に また {object}が きたよ。みてみよう！ |
| Hôm nay {animal} nhờ bé {name} một việc nhỏ nhé! | きょうも {animal}が {name}ちゃんに おねがいが あるよ！ |

**Câu kết bài giữa vùng**

| Tiếng Việt | Tiếng Nhật |
| --- | --- |
| {animal} cảm ơn bé {name}! Bé nhận được một ngôi sao. | {animal}が ありがとうって！{name}ちゃん、ほしを ひとつ もらったよ。 |
| Xong rồi! {animal} vẫy tay chào bé {name}. | できたね！{animal}が {name}ちゃんに てを ふっているよ。 |
| Bé {name} giúp {animal} xong rồi. Hẹn gặp lại nhé! | {name}ちゃんの おかげで {animal}は たすかったよ。またね！ |

## Quy tắc viết truyện

- Câu ngắn, mỗi đoạn không quá 3 câu; tiếng Nhật chỉ dùng hiragana (tên bé viết katakana).
- Truyện luôn **nhờ** bé giúp, không dọa, không có nhân vật xấu, không có thua cuộc.
- Truyện nhắc tên bé ít nhất một lần; lời khen và báo sai do file 06 phụ trách, truyện không lặp lại chúng.
- Vật đếm trong một bài chỉ có một loại, trùng với vật của vùng (để bé không đếm nhầm).
- Từ giai đoạn 3, câu chuyện toán (file 04) dùng đúng bạn thú và vật của vùng đó. Ở vùng 9, vật đếm là đèn lồng; các bài về hình, giờ hay đo dùng chính hình, đồng hồ, ruy băng làm vật trên màn.
- Câu chuyện của bài điền dấu (GD5–7) vẫn do bạn thú của vùng đó nhờ, ví dụ "Voi Con muốn biết bên nào có nhiều bóng bay hơn". Không kể thành người thắng hay thua giữa hai bạn.
- Bản đồ vườn thú: vùng đã hoàn thành có sticker; vùng gợi ý tiếp theo có Sao Lấp Lánh. Không khóa vùng nào. Quảng trường Lễ hội hiện ở giữa bản đồ với nhãn "tùy chọn"; Sao Lấp Lánh chỉ gợi ý vùng này sau khi bé xong vùng 8.

## Sổ sưu tập

Mỗi vùng hoàn thành một lần là có 1 sticker (tên ở bảng trên; vùng 9 có sticker "Cờ lễ hội"). Bé chạm vào sticker để nghe tên bạn thú và tên sticker ở cả hai ngôn ngữ. Sticker không mất khi chơi lại, và không phụ thuộc số sao.

## Cấu trúc dữ liệu đề xuất (`data/story.json`)

```json
{
  "version": 1,
  "chapters": [
    { "stage": 1, "zone": {"vi": "...", "ja": "..."}, "animal": {"vi": "...", "ja": "..."},
      "object": {"id": "carrot", "vi": "...", "ja": "...", "classifier": "củ", "counter": "ko"},
      "intro": {"vi": "...{name}...", "ja": "...{name}..."}, "outro": {"vi": "...", "ja": "..."},
      "sticker": {"vi": "...", "ja": "..."} }
  ],
  "finale": {"vi": "...", "ja": "..."},
  "beats": { "mid": [ {"vi": "...", "ja": "..."} ], "close": [ {"vi": "...", "ja": "..."} ] }
}
```
