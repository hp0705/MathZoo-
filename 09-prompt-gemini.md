# 09. Prompt cho Gemini

Prompt dưới đây **tự đủ**: Gemini không cần đọc các file khác. Dán nguyên khối trong dấu ``` vào Gemini. Viết bằng tiếng Anh vì máy code theo cách đó chính xác hơn; chữ Việt và Nhật nằm trong dữ liệu mẫu.

Giả định: chạy hoàn toàn offline trên trình duyệt iPad, không cài thư viện. Prompt đã tích hợp bài học và dấu so sánh `>` `<` `=` (file 03), cốt truyện và Quảng trường Lễ hội (file 05), lời khen và báo sai song ngữ có tên bé (file 06), tên bé, giọng đọc, cách đọc dấu, số thứ tự và giờ (file 07), màu (file 08). Nếu bạn đổi nội dung ở các file đó thì nội dung tương ứng trong prompt này cũng cần cập nhật. Chưa chạy thử prompt với Gemini.

Cách dùng: dán prompt, chạy từng mốc M1 đến M6, sau mỗi mốc chạy `node --test tests/` và gửi kết quả lại cho Gemini nếu còn lỗi. Nếu bạn đổi quy ước đọc số (ví dụ "hai mươi bốn" thay vì "hai mươi tư"), sửa cả test T1 lẫn prompt.

```text
ROLE
You are a senior front-end engineer. Build "MathZoo", a children's math learning web app for ages 4-6 (before first grade), with two language packs: Vietnamese (vi) and Japanese (ja). Work in milestones M1..M6. After each milestone print the full contents of every file you created or changed (no placeholders, no "..."), then list which tests should pass. Keep each file under 300 lines; split when larger.

HARD CONSTRAINTS
- Plain HTML5, CSS3, JavaScript ES modules. No npm packages, no CDN, no build step, no network calls at runtime. Works offline from a local static server.
- Tests run with Node's built-in runner only: node --test tests/ (Node 18+). Logic modules must not touch the DOM so Node can import them.
- No ads, analytics, accounts, external links. Persist only in localStorage key "mathzoo.v1", always inside try/catch; the app must work when storage throws.
- Target: iPad Safari landscape 1024x768 (primary), portrait 768x1024, phone portrait 360x640 (reduced layout). No page scrolling on lesson screens. Every touch target >= 72px, gap >= 16px, safe area 24px. Pointer events. Respect prefers-reduced-motion.
- All characters and artwork are original, inline SVG or CSS. Never draw an existing franchise character. Emoji may be used selectively for familiar fruit objects like banana (🍌) where clearer for young children.

FOLDER STRUCTURE
index.html
css/tokens.css, css/app.css
js/core/number-words.js, ordinal-time.js, counting-notes.js, problem-gen.js, compare.js, mastery.js, storage.js, phrases.js, story.js
js/audio/sfx.js, speak.js
js/ui/home-map.js, story-intro.js, lesson.js, scene-give-receive.js, scene-compare.js, activities-extra.js, tracing.js, reward.js, sticker-book.js, parent.js
i18n/vi.json, i18n/ja.json   (UI strings only)
data/lessons.json, data/story.json, data/phrases.json, data/voice-manifest.json
tools/validate-data.mjs
tests/*.test.mjs
docs/manual-tests.md

DESIGN TOKENS (css/tokens.css, CSS variables)
--bg:#FFF8EC; --ink:#2B2A4C; --primary:#1F78C8; --receive:#18835F; --give:#C93A34; --total:#FFC83D; --accent:#6B4BC8; --focus:#1F78C8; --ok-bg:#E4F5EC; --amber:#B26A00; --amber-bg:#FFF1D6; --disabled:#E9E4F2.
Stage fill / border: 1 #FFE08A/#946A00, 2 #BFEFDD/#2E8B6E, 3 #CFE8FF/#2F7FC4, 4 #E3D7FF/#7A5BD0, 5 #FFD0E0/#C2456F, 6 #FFD9B3/#B8610A, 7 #D5F2B5/#4E8F1F, 8 #BDEBF2/#1B7F93, 9 (optional plaza) #E8EAF0/#5B6477.
States: normal fill #FFFFFF with stage border 4px; correct fill #E4F5EC border #18835F with check icon; wrong fill #FFF1D6 border #B26A00 (amber, NEVER red) with a 2x200ms shake; disabled fill #E9E4F2 border #B9B3CC.
Shapes: button radius 28px, card radius 24px, 4px borders, one flat shadow offset 6px. Page background: cream with two soft radial blobs of the stage fill color in opposite corners. Comparison sign cards (>, <, =) use the --accent color (#6B4BC8) for the strokes; never green, coral, red or yellow for signs; > and < differ by shape and direction only. Max 4 prominent colors per screen. No dark mode. Color is never the only signal: pair with icon or motion. Green = receive, coral = give, yellow = total, always with an arrow icon; red only inside the give scene.
Fonts: :lang(vi) uses "Segoe UI", "Roboto", "Noto Sans", "Helvetica Neue", Arial, system-ui, sans-serif (never put Japanese fonts before Latin/Vietnamese fonts so Vietnamese diacritics never split); :lang(ja) uses "Hiragino Maru Gothic ProN", "Yu Gothic UI", "Meiryo", "Noto Sans JP", "Segoe UI", system-ui, sans-serif. Numerals in questions >= 96px, captions >= 28px.

STAGES (74 core lessons in stages 1-8 plus 8 optional lessons in stage 9 = 82 lessons, max 10 lessons per stage; each lesson = exactly 6 activities, 5-8 minutes)
1 age4 Count 1-5, 6 lessons: touch-count each object once; one-to-one matching; more/fewer/equal.
2 age4 Numbers to 10, 10 lessons: digits 0-10, order, previous/next, compare 3 groups (most, fewest). Lesson 9: 'greater than / less than' between two numbers in words only, no symbols. Lesson 10: ordinal numbers (first to tenth) and numbers in daily life.
3 age4-5 Add and take away with real objects within 5, 9 lessons: spoken story, drag objects, recount, show equation above. Split and combine 2-5.
4 age5 Add and take away within 10, 10 lessons: split/combine 6-10, ten-frame, pairs that make 10. Symbols + - = first appear here. No comparison signs yet.
5 age5-6 Count to 20, 10 lessons: one ten plus ones, read and write 11-20. Lessons 8-10 introduce the comparison signs > < = (lesson 8: only > and <, two groups then two numbers within 10; lesson 9: adds =, mixes all three, within 10; lesson 10: compares numbers 11-20 with > < =).
6 age6 Count to 100, 10 lessons: 10x10 board, count by tens, skip count 2/5/10, tens and ones, compare two-digit numbers. Lesson 9 reviews the comparison signs within 20 (three cards, no eye dots); lesson 10 orders numbers and uses > < = with two-digit numbers (compare tens first, then ones). The signs are also reviewed in rotation: the last (review) activity of every third lesson in stages 6 and 7 (lessons 3, 6, 9) reviews 2 A10 items instead of 2 ordinary items.
7 age6 Fluency within 10, 10 lessons: five story types (receive, combine, give away, compare, missing number), read an equation aloud. Lessons 9-10 place > < = between two expressions or an expression and a number, within 10.
8 age6 Optional extension, 9 lessons (same content in both vi and ja): lessons 1-5 round tens and two-digit add/subtract without carrying within 100; lessons 6-9 add across ten and subtract with borrowing within 20.
9 age5-6 OPTIONAL Festival Plaza, 8 lessons (optional:true, not needed for the Star Medal): 1 plane shapes (circle, square, triangle, rectangle); 2 solid shapes (sphere, cylinder, cube, cuboid); 3 position (above/below, front/behind, left/right); 4 patterns (repeat rules, 2 then 3 items); 5 compare length, height, weight and order 3 items; 6 measure with non-standard units (count small blocks); 7 days of the week and the four seasons; 8 whole hours on a clock (hour hand only, no timing, no half hours).
No hard locks: every stage is open; the map only highlights the suggested next lesson with the Sparkle Star mascot. No timers or time pressure anywhere.

ACTIVITY TYPES
A1 touch-count, A2 choose-number (3 cards), A3 drag-to-equal, A4 give-and-receive scene, A5 split-number (two plates), A6 fill ten-frame, A7 match number to group, A8 trace digit 0-9, A9 fill missing numbers on the 100 board, A10 place a comparison sign (variant a: two groups of objects, b: two numbers, c: two expressions; drag one of three cards > < = into the middle slot), A11 order items or number cards and answer 'which position' (ordinals), A12 continue a pattern, A13 pick a shape or solid, or tap a position (left, right, above, below), A14 measure and time (compare lengths, count units, pick a day or season, read a whole hour on a clock).

STORY (data/story.json)
The story is "Zoo MathZoo": the child is the zoo's helper preparing the Math Star Festival, visiting 8 zones (one per stage 1-8), each with one animal friend and one object type, plus an optional 9th zone, the Festival Plaza, shared by all animals (animal = 'Các bạn thú' / 'どうぶつたち', object = lantern). First lesson of a stage plays chapter.intro; last lesson plays chapter.outro; middle lessons play a random beats.mid line at the start and a random beats.close line at the end (never the same line twice in a row). Completing the last lesson of a stage gives a sticker (added once, kept forever, independent of stars). Completing stage 8 plays finale and gives the Star Medal. Stage 9 is optional: the map shows it in the middle with an 'optional' label, the Sparkle Star suggests it only after stage 8, completing it gives the Festival Flag sticker once, and it never blocks or changes the medal. In each lesson all counted objects are the chapter's object type; from stage 3 the A4 story sentences use the chapter's animal and object. Template variables: {name} (child's name), {animal}, {object}. Content to use verbatim:
{
 "chapters": [
  {
   "stage": 1,
   "zone": {
    "vi": "Vườn Cà Rốt",
    "ja": "にんじんばたけ"
   },
   "animal": {
    "vi": "Thỏ Bông",
    "ja": "うさぎの ふわちゃん"
   },
   "object": {
    "vi": "cà rốt",
    "ja": "にんじん",
    "classifier": "củ",
    "counter": "ko"
   },
   "intro": {
    "vi": "Chào bé {name}! Đây là Vườn Cà Rốt. Thỏ Bông đang hái cà rốt cho Lễ hội Ngôi sao Toán. Bé giúp Thỏ đếm nhé!",
    "ja": "こんにちは、{name}ちゃん！ここは にんじんばたけだよ。うさぎの ふわちゃんが おまつりの ために にんじんを とっているよ。いっしょに かぞえよう！"
   },
   "outro": {
    "vi": "Thỏ Bông có đủ cà rốt cho lễ hội rồi. Cảm ơn bé {name} nhiều lắm!",
    "ja": "ふわちゃんの にんじんが いっぱいに なったよ。{name}ちゃん、ありがとう！"
   },
   "sticker": {
    "vi": "Cà rốt vàng",
    "ja": "きんの にんじん"
   }
  },
  {
   "stage": 2,
   "zone": {
    "vi": "Rừng Táo",
    "ja": "りんごのもり"
   },
   "animal": {
    "vi": "Gấu Mật",
    "ja": "くまの はちくん"
   },
   "object": {
    "vi": "táo",
    "ja": "りんご",
    "classifier": "quả",
    "counter": "ko"
   },
   "intro": {
    "vi": "Bé {name} ơi, Gấu Mật nhặt được thật nhiều táo trong rừng. Mình cùng đếm đến mười nhé!",
    "ja": "{name}ちゃん、くまの はちくんが もりで りんごを たくさん ひろったよ。じゅうまで かぞえよう！"
   },
   "outro": {
    "vi": "Gấu Mật vui lắm! Bé {name} đếm táo giỏi quá.",
    "ja": "はちくんは おおよろこび！{name}ちゃん、りんごを じょうずに かぞえたね。"
   },
   "sticker": {
    "vi": "Táo vàng",
    "ja": "きんの りんご"
   }
  },
  {
   "stage": 3,
   "zone": {
    "vi": "Hồ Cá",
    "ja": "さかなのいけ"
   },
   "animal": {
    "vi": "Mèo Mướp",
    "ja": "ねこの みけちゃん"
   },
   "object": {
    "vi": "cá",
    "ja": "さかな",
    "classifier": "con",
    "counter": "hiki"
   },
   "intro": {
    "vi": "Bé {name} đến Hồ Cá rồi! Mèo Mướp câu cá rồi chia cho bạn. Bé giúp Mèo tính nhé!",
    "ja": "{name}ちゃん、さかなの いけに ついたよ！ねこの みけちゃんは つった さかなを ともだちに わけるよ。いっしょに かんがえよう！"
   },
   "outro": {
    "vi": "Mèo Mướp có bữa cá thật ngon. Cảm ơn bé {name}!",
    "ja": "みけちゃんは おいしい さかなを たべられるよ。{name}ちゃん、ありがとう！"
   },
   "sticker": {
    "vi": "Cá lấp lánh",
    "ja": "きらきらの さかな"
   }
  },
  {
   "stage": 4,
   "zone": {
    "vi": "Sân Bóng",
    "ja": "ボールひろば"
   },
   "animal": {
    "vi": "Cáo Cam",
    "ja": "きつねの こんちゃん"
   },
   "object": {
    "vi": "bóng",
    "ja": "ボール",
    "classifier": "quả",
    "counter": "ko"
   },
   "intro": {
    "vi": "Bé {name} giỏi quá, đến Sân Bóng rồi! Cáo Cam có rất nhiều bóng. Mình tính cùng Cáo nhé!",
    "ja": "{name}ちゃん、ボールひろばに きたよ！きつねの こんちゃんの ボールで けいさんしよう！"
   },
   "outro": {
    "vi": "Cáo Cam chơi bóng thật vui. Bé {name} tính giỏi lắm!",
    "ja": "こんちゃんは ボールあそびが たのしいって。{name}ちゃん、けいさんが じょうずだね！"
   },
   "sticker": {
    "vi": "Bóng lấp lánh",
    "ja": "きらきらの ボール"
   }
  },
  {
   "stage": 5,
   "zone": {
    "vi": "Bãi Bóng Bay",
    "ja": "ふうせんひろば"
   },
   "animal": {
    "vi": "Voi Con",
    "ja": "ぞうの ぱおちゃん"
   },
   "object": {
    "vi": "bóng bay",
    "ja": "ふうせん",
    "classifier": "quả",
    "counter": "ko"
   },
   "intro": {
    "vi": "Bé {name} ơi, Voi Con thổi thật nhiều bóng bay! Mười bóng là một chục. Mình đếm đến hai mươi nhé!",
    "ja": "{name}ちゃん、ぞうの ぱおちゃんが ふうせんを たくさん ふくらませたよ！じゅっこで ひとまとまり。にじゅうまで かぞえよう！"
   },
   "outro": {
    "vi": "Bóng bay bay lên trời rồi! Cảm ơn bé {name}, Voi Con vui lắm.",
    "ja": "ふうせんが そらに とんだよ！{name}ちゃん、ぱおちゃんは うれしいって。"
   },
   "sticker": {
    "vi": "Bóng bay cầu vồng",
    "ja": "にじいろの ふうせん"
   }
  },
  {
   "stage": 6,
   "zone": {
    "vi": "Tháp Đom Đóm",
    "ja": "ほたるのとう"
   },
   "animal": {
    "vi": "Cú Mèo",
    "ja": "ふくろうの ほーくん"
   },
   "object": {
    "vi": "đom đóm",
    "ja": "ほたる",
    "classifier": "con",
    "counter": "hiki"
   },
   "intro": {
    "vi": "Bé {name} ơi, trời tối rồi. Cú Mèo cần đếm đom đóm trên tháp, nhiều lắm, đến một trăm! Mình đếm theo chục nhé!",
    "ja": "{name}ちゃん、よるに なったよ。ふくろうの ほーくんが とうの ほたるを かぞえるよ。ひゃくまで！じゅうずつ かぞえよう！"
   },
   "outro": {
    "vi": "Cả tháp sáng lấp lánh! Bé {name} đếm đến một trăm rồi, giỏi quá.",
    "ja": "とうが きらきら ひかったよ！{name}ちゃん、ひゃくまで かぞえられたね。"
   },
   "sticker": {
    "vi": "Đom đóm phát sáng",
    "ja": "ひかる ほたる"
   }
  },
  {
   "stage": 7,
   "zone": {
    "vi": "Vườn Chuối",
    "ja": "バナナのはたけ"
   },
   "animal": {
    "vi": "Khỉ Nâu",
    "ja": "さるの きっきくん"
   },
   "object": {
    "vi": "chuối",
    "ja": "バナナ",
    "classifier": "quả",
    "counter": "ko"
   },
   "intro": {
    "vi": "Bé {name} ơi, Khỉ Nâu hái chuối rồi chia cho các bạn. Mình giúp Khỉ tính thật chính xác, không cần vội nhé!",
    "ja": "{name}ちゃん、さるの きっきくんが バナナを とって ともだちに わけるよ。ゆっくり ただしく けいさんしよう！"
   },
   "outro": {
    "vi": "Khỉ Nâu chia chuối xong rồi. Bé {name} tính giỏi như nhà toán học!",
    "ja": "きっきくんは バナナを わけおわったよ。{name}ちゃん、はかせみたいだね！"
   },
   "sticker": {
    "vi": "Chuối vàng",
    "ja": "きんの バナナ"
   }
  },
  {
   "stage": 8,
   "zone": {
    "vi": "Sân Băng",
    "ja": "こおりのひろば"
   },
   "animal": {
    "vi": "Cánh Cụt",
    "ja": "ペンギンの ぺんちゃん"
   },
   "object": {
    "vi": "viên kẹo",
    "ja": "あめ",
    "classifier": "viên",
    "counter": "ko"
   },
   "intro": {
    "vi": "Bé {name} đến Sân Băng, nơi cuối cùng rồi! Cánh Cụt có một thử thách lớn cho bé. Bé thử sức nhé!",
    "ja": "{name}ちゃん、さいごの こおりのひろばに きたよ！ペンギンの ぺんちゃんから おおきな チャレンジが あるよ。やってみよう！"
   },
   "outro": {
    "vi": "Hoan hô! Bé {name} đã giúp cả tám bạn thú. Lễ hội Ngôi sao Toán bắt đầu thôi!",
    "ja": "やったね！{name}ちゃんは はちにんの どうぶつを たすけたよ。ほしの おまつりが はじまるよ！"
   },
   "sticker": {
    "vi": "Huy chương ngôi sao",
    "ja": "ほしの メダル"
   }
  },
  {
   "stage": 9,
   "optional": true,
   "zone": {
    "vi": "Quảng trường Lễ hội",
    "ja": "おまつりひろば"
   },
   "animal": {
    "vi": "Các bạn thú",
    "ja": "どうぶつたち"
   },
   "object": {
    "vi": "đèn lồng",
    "ja": "ちょうちん",
    "classifier": "cái",
    "counter": "ko"
   },
   "intro": {
    "vi": "Bé {name} ơi, lễ hội còn nhiều trò vui nữa! Các bạn thú cần bé xếp đèn lồng, đo ruy băng và xem giờ. Mình giúp các bạn nhé!",
    "ja": "{name}ちゃん、おまつりには まだ たのしい ことが あるよ！どうぶつたちが ちょうちんを ならべたり、リボンを はかったり、とけいを みたり するよ。いっしょに てつだおう！"
   },
   "outro": {
    "vi": "Lễ hội thật rực rỡ! Cả tám bạn thú cảm ơn bé {name}.",
    "ja": "おまつりが きらきら かがやいたよ！はちにんの どうぶつが {name}ちゃんに ありがとうって！"
   },
   "sticker": {
    "vi": "Cờ lễ hội",
    "ja": "おまつりの はた"
   }
  }
 ],
 "finale": {
  "vi": "Lễ hội bắt đầu rồi! Bé {name} xinh đẹp nhận Huy chương Ngôi sao Toán của Vườn thú MathZoo!",
  "ja": "おまつりが はじまるよ！かわいい{name}ちゃんに ほしの メダルを あげるね！"
 },
 "beats": {
  "mid": [
   {
    "vi": "{animal} đang đợi bé {name} giúp đếm {object} đây!",
    "ja": "{animal}が {name}ちゃんを まっているよ。{object}を いっしょに かぞえよう！"
   },
   {
    "vi": "Bé {name} ơi, {animal} có thêm {object} nữa nè. Mình xem nhé!",
    "ja": "{name}ちゃん、{animal}に また {object}が きたよ。みてみよう！"
   },
   {
    "vi": "Hôm nay {animal} nhờ bé {name} một việc nhỏ nhé!",
    "ja": "きょうも {animal}が {name}ちゃんに おねがいが あるよ！"
   }
  ],
  "close": [
   {
    "vi": "{animal} cảm ơn bé {name}! Bé nhận được một ngôi sao.",
    "ja": "{animal}が ありがとうって！{name}ちゃん、ほしを ひとつ もらったよ。"
   },
   {
    "vi": "Xong rồi! {animal} vẫy tay chào bé {name}.",
    "ja": "できたね！{animal}が {name}ちゃんに てを ふっているよ。"
   },
   {
    "vi": "Bé {name} giúp {animal} xong rồi. Hẹn gặp lại nhé!",
    "ja": "{name}ちゃんの おかげで {animal}は たすかったよ。またね！"
   }
  ]
 }
}

FEEDBACK AND PRAISE (data/phrases.json, js/core/phrases.js)
Every feedback uses the app's current language only (one segment: vi when settings.lang is "vi", ja when "ja"). {name} is replaced by the child's name for that language (display text uses name; speech uses speakVi/speakJa when set). Tiers "wrong3" and "wrong3cmp" use {answer}: for "wrong3" the answer as spoken words (numberToWords); for "wrong3cmp" (used only when the activity type is A10) the full comparison sentence from compareSentence, for example "ba lớn hơn hai" / "さんは により おおきい". Field "for": "any" or "f"; "f" lines are used only when settings.gender is "f". Content to use verbatim:
{
 "praise": [
  {
   "vi": "Giỏi quá, bé {name} xinh đẹp!",
   "ja": "すごいね、かわいい{name}ちゃん！",
   "for": "f"
  },
  {
   "vi": "Đúng rồi! Bé {name} đáng yêu đếm hay quá!",
   "ja": "せいかい！{name}ちゃん、じょうずに かぞえたね！",
   "for": "any"
  },
  {
   "vi": "Tuyệt vời! Bé {name} thông minh ghê!",
   "ja": "やったね、{name}ちゃん！てんさいだね！",
   "for": "any"
  },
  {
   "vi": "Hoan hô bé {name}, đúng rồi!",
   "ja": "だいせいかい！{name}ちゃん、かっこいい！",
   "for": "any"
  },
  {
   "vi": "Chính xác! Bé {name} giỏi lắm!",
   "ja": "えらいね、{name}ちゃん！さいこうだよ！",
   "for": "any"
  },
  {
   "vi": "Wow, bé {name} xinh đẹp làm đúng rồi!",
   "ja": "わあ、かわいい{name}ちゃん、あたりだよ！",
   "for": "f"
  },
  {
   "vi": "Siêu quá! Bé {name} giỏi nhất vườn thú!",
   "ja": "すごーい！{name}ちゃんは どうぶつえんで いちばん！",
   "for": "any"
  },
  {
   "vi": "Bé {name} ơi, đúng rồi đó! Tài quá!",
   "ja": "{name}ちゃん、ぴんぽーん！よくできました！",
   "for": "any"
  }
 ],
 "streak": [
  {
   "vi": "Wow, đúng liên tục luôn! Bé {name} siêu quá!",
   "ja": "わあ、れんぞくで せいかい！{name}ちゃん、すごい！",
   "for": "any"
  },
  {
   "vi": "Bé {name} đúng liền mấy câu rồi, tuyệt vời!",
   "ja": "{name}ちゃん、つづけて あたりだよ！さいこう！",
   "for": "any"
  },
  {
   "vi": "Chuỗi đúng dài ghê! Bé {name} giỏi lắm!",
   "ja": "ずっと せいかいだね！{name}ちゃん、えらい！",
   "for": "any"
  }
 ],
 "wrong1": [
  {
   "vi": "Sai rồi, bé {name} ơi. Cố gắng lên nào, làm lại một lần nữa nhé!",
   "ja": "ちがうよ、{name}ちゃん。がんばって、もういっかい やってみよう！",
   "for": "any"
  },
  {
   "vi": "Chưa đúng rồi. Bé {name} thử lại nào!",
   "ja": "おしい！{name}ちゃん、もういちど ためしてみよう！",
   "for": "any"
  },
  {
   "vi": "Nhầm rồi, không sao đâu bé {name} ơi. Mình thử lần nữa nhé!",
   "ja": "まちがえちゃったね。だいじょうぶ、もういっかい！",
   "for": "any"
  },
  {
   "vi": "Ồ, chưa đúng rồi! Bé {name} cố lên, làm lại nào!",
   "ja": "あれれ、ちがうみたい！{name}ちゃん、もういちど やってみよう！",
   "for": "any"
  },
  {
   "vi": "Không phải rồi. Bé {name} ơi, mình thử một lần nữa nhé!",
   "ja": "ざんねん、ちがうよ。{name}ちゃん、もういっかい ためそうね！",
   "for": "any"
  },
  {
   "vi": "Sai mất rồi! Nhưng bé {name} giỏi mà, thử lại nào!",
   "ja": "まちがいだよ。でも {name}ちゃんなら できるよ、もういちど！",
   "for": "any"
  }
 ],
 "wrong2": [
  {
   "vi": "Không sao đâu. Mình cùng đếm lại với nhau nào!",
   "ja": "だいじょうぶ。いっしょに かぞえなおそう！",
   "for": "any"
  },
  {
   "vi": "Bé {name} đừng buồn, mình đếm lại từng cái nhé!",
   "ja": "{name}ちゃん、ゆっくり ひとつずつ かぞえてみよう！",
   "for": "any"
  },
  {
   "vi": "Chậm thôi nào bé {name} ơi, mình đếm cùng nhau!",
   "ja": "いっしょに ゆびで さわってみよう、{name}ちゃん！",
   "for": "any"
  },
  {
   "vi": "Cố lên bé {name}, mình giúp bé đếm nhé!",
   "ja": "がんばれ、{name}ちゃん！いっしょに かぞえるよ！",
   "for": "any"
  },
  {
   "vi": "Thử một lần nữa nào, mình nhìn thật kỹ từng cái nhé!",
   "ja": "もう いっかい、よーく みてみようね！",
   "for": "any"
  }
 ],
 "wrong3": [
  {
   "vi": "Mình cùng xem nhé! Đáp án là {answer}. Bé {name} thử câu khác nào!",
   "ja": "いっしょに みてみよう！こたえは {answer}だよ。{name}ちゃん、つぎも やってみよう！",
   "for": "any"
  },
  {
   "vi": "Không sao, câu này khó mà. Đáp án là {answer}. Mình làm câu tiếp nhé, bé {name}!",
   "ja": "このもんだいは むずかしいね。こたえは {answer}だよ。{name}ちゃん、つぎへ いこう！",
   "for": "any"
  },
  {
   "vi": "Bé {name} ơi, mình xem cùng nhau nhé. Là {answer} đó. Câu sau mình làm được!",
   "ja": "{name}ちゃん、いっしょに みよう。{answer}だよ。つぎは きっと できるよ！",
   "for": "any"
  }
 ],
 "wrong3cmp": [
  {
   "vi": "Mình cùng xem nhé! {answer} đó. Bé {name} thử câu khác nào!",
   "ja": "いっしょに みてみよう！{answer}よ。{name}ちゃん、つぎも やってみよう！",
   "for": "any"
  },
  {
   "vi": "Không sao, câu này khó mà. {answer} nha. Mình làm câu tiếp nhé, bé {name}!",
   "ja": "このもんだいは むずかしいね。{answer}よ。{name}ちゃん、つぎへ いこう！",
   "for": "any"
  },
  {
   "vi": "Bé {name} ơi, mình xem cùng nhau nhé. {answer} đó. Câu sau mình làm được!",
   "ja": "{name}ちゃん、いっしょに みよう。{answer}よ。つぎは きっと できるよ！",
   "for": "any"
  }
 ],
 "finish": [
  {
   "vi": "Hoan hô bé {name} xinh đẹp! Bé làm xong rồi!",
   "ja": "やったね、かわいい{name}ちゃん！できたよ！",
   "for": "f"
  },
  {
   "vi": "Tuyệt vời! Bé {name} đáng yêu đã hoàn thành!",
   "ja": "だいせいかい！{name}ちゃん、ぜんぶ できたね！",
   "for": "any"
  },
  {
   "vi": "Bé {name} làm xong bài rồi, siêu quá!",
   "ja": "{name}ちゃん、さいごまで よくがんばったね！",
   "for": "any"
  },
  {
   "vi": "Xong rồi! Bé {name} nhận được sao lấp lánh!",
   "ja": "できた、できた！{name}ちゃん、ぴかぴかの ほしだよ！",
   "for": "any"
  },
  {
   "vi": "Giỏi lắm bé {name}, mình làm xong hết rồi!",
   "ja": "すごいね、{name}ちゃん！ぜんぶ おわったよ！",
   "for": "any"
  },
  {
   "vi": "Bé {name} thật là thiên tài! Mời bé nhận sao!",
   "ja": "{name}ちゃんは てんさい！ほしを どうぞ！",
   "for": "any"
  }
 ],
 "greet": [
  {
   "vi": "Chào bé {name} xinh đẹp! Mình cùng chơi nhé!",
   "ja": "こんにちは、かわいい{name}ちゃん！いっしょに あそぼう！",
   "for": "f"
  },
  {
   "vi": "Chào bé {name}! Hôm nay mình chơi gì nào?",
   "ja": "{name}ちゃん、きょうも がんばろうね！",
   "for": "any"
  },
  {
   "vi": "Bé {name} đến rồi! Các bạn thú đang đợi đó!",
   "ja": "{name}ちゃん、どうぶつたちが まっているよ！",
   "for": "any"
  }
 ],
 "idle": [
  {
   "vi": "Bé {name} ơi, mình chạm vào đây nhé!",
   "ja": "{name}ちゃん、ここを さわってみよう！",
   "for": "any"
  },
  {
   "vi": "Cùng thử nào bé {name}, chạm vào hình nhé!",
   "ja": "いっしょに やってみよう、{name}ちゃん！",
   "for": "any"
  },
  {
   "vi": "Mình đang đợi bé {name} đó!",
   "ja": "{name}ちゃんを まっているよ！",
   "for": "any"
  }
 ]
}
Settings (storage): nameVi default "Mây" (max 12 chars, NFC, strip < > & "), nameJa default "マイ" (kana only, max 8), speakVi and speakJa default "" (speech override), gender "f"|"m"|"n" default "f", lang "vi"|"ja". Names never empty (fallback to default). Names are stored only locally.
Rules: fillName(template, name); pickPhrase(list, lastIndex, gender) never returns lastIndex when more than one candidate remains and filters "f" lines unless gender is "f"; composeFeedback({tier, settings, last, answer}) returns {segments:[{text,speak,lang},{text,speak,lang}], idx:{vi,ja}} with segments ordered by settings.lang first; chooseTier(state): correct -> "streak" if 3 or more correct in a row else "praise"; wrong -> "wrong1" for the first wrong on this question, "wrong2" for the second, "wrong3" for the third or later, except "wrong3cmp" instead of "wrong3" when state.activityType is "A10"; finish -> "finish". Display the displayed text (without speak override) in the UI.
Wrong-answer behaviour (onWrong): play the soft "boing" once (max 0.4 s), show the amber state with shake, speak the tier phrase, then run the recount animation (each object lights with its counting note; for A10 run the pairing animation instead: draw a string between each pair of objects from the two groups, one short note per string, and light up the unpaired objects), then let the child try again. wrong2 also switches the activity to real-object mode for the same numbers (nextMode). wrong3 highlights the correct card, speaks the answer, and moves on; that question does not count as first-try correct. Never subtract points, never show red, never end the lesson early.

CORE LOGIC (pure functions, fully unit-tested)
1. numberToWords(n, lang) for 0..100. vi: "mot" form for units digit 1 after tens>=2 ("mốt"), "lăm" for 5 (11-19 and tens>=2), "tư" for 24 only, "mười" for 10-19 prefix. ja returns hiragana and always 4=よん, 7=なな, 9=きゅう.
2. countWords(n, counter, lang): ja counters "tsu" (ひとつ ふたつ みっつ よっつ いつつ むっつ ななつ やっつ ここのつ とお), "ko" and "hiki" with sound changes in the tests. vi returns number words plus the classifier string.
3. noteForCount(n): returns {freq, name, bell}. Ladder repeats every 10: C4 D4 E4 G4 A4 C5 D5 E5 G5 A5 = 261.63 293.66 329.63 392.00 440.00 523.25 587.33 659.25 783.99 880.00. bell = true when n % 10 === 0. Giving away uses the same ladder descending.
4. generateProblem({kind, max, seed, recent}): deterministic per seed (mulberry32). kind add: a>=1,b>=1,a+b<=max. take: start s in 2..max, give g in 1..s, result s-g>=0. combine: groups a,b. compare: two groups with a>b (never negative a-b), ask which is more and by how many. missing: total t, known part p, answer t-p. Never return the same (a,b) pair more than 2 times in a row (recent = previous pairs). Return {kind,a,b,answer,choices}; choices = exactly 3 distinct integers within 0..max including the answer, shuffled by the seed.
5. gradeLesson(results): results = 10 booleans of first-try correctness. stars = 3 if >=9 true, 2 if >=7, else 1. Never depends on time.
6. isMastered(sessions): sessions = [{date:"YYYY-MM-DD",correct,total}]. Mastered when two sessions on two different dates each have correct/total >= 0.8.
7. nextMode(history): if the last 2 answers in this activity are both wrong return "concrete" else "normal".
8. onWrong(state): never decreases stars or score, never ends the lesson; returns {tier, hintKey:"hint.recount", mode} where tier is wrong1/wrong2/wrong3 by wrong count on this question (wrong3cmp instead of wrong3 for A10, and hintKey "hint.pair" for A10).
9. ordinalWords(n, lang) for 1..10. vi: thứ nhất, thứ hai, thứ ba, thứ tư, thứ năm, thứ sáu, thứ bảy, thứ tám, thứ chín, thứ mười. ja: いちばんめ, にばんめ, さんばんめ, よんばんめ, ごばんめ, ろくばんめ, ななばんめ, はちばんめ, きゅうばんめ, じゅうばんめ.
10. clockWords(hour, lang) for 1..12. vi: numberToWords(hour) + " giờ" (for example "bốn giờ", "mười hai giờ"). ja: いちじ, にじ, さんじ, よじ, ごじ, ろくじ, しちじ, はちじ, くじ, じゅうじ, じゅういちじ, じゅうにじ. NOTE: 4, 7 and 9 o'clock are よじ, しちじ, くじ; this is an exception to the numberToWords rule for よん, なな, きゅう.
11. compareSentence(a, b, lang, mode) where mode is "number" or "group". Let A and B be numberToWords(a) and numberToWords(b). number, vi: a>b "A lớn hơn B", a<b "A bé hơn B", a==b "A bằng B". number, ja: a>b "Aは Bより おおきい", a<b "Aは Bより ちいさい", a==b "Aと Bは おなじ" (for example a=3,b=2 gives "さんは により おおきい"; a=2,b=3 gives "には さんより ちいさい"). group, vi: "A nhiều hơn B", "A ít hơn B", and for equal "hai nhóm bằng nhau". group, ja: "Aは Bより おおい", "Aは Bより すくない", and for equal "ふたつは おなじ".
12. signAnswer(a, b) returns ">" if a>b, "<" if a<b, "=" if equal. generateSignSet({count, max, allowEqual, seed}) returns count problems {a,b,answer,choices} where choices is exactly the three cards [">","<","="] in a seed-shuffled order, a and b are in 0..max, and for count 10: with allowEqual false exactly 5 answers are ">" and 5 are "<"; with allowEqual true exactly 2 are "=", 4 are ">" and 4 are "<"; no answer sign appears 3 times in a row; the same (a,b) pair never appears twice in a row; deterministic per seed (mulberry32). generateSignExprSet({count, max, seed}) does the same for A10c, where each side is either a number or {x, op:"+"|"-", y}; every side's value is within 0..max, no subtraction goes below 0, and answer comes from comparing the two values.
13. generateProblem also supports kind "ordinal": a row of n items (n in 3..10), position p in 1..n, answer p, choices exactly 3 distinct integers within 1..n including p.

GIVE-AND-RECEIVE SCENE (A4), example add 3+2
Story audio once (replay button always top-right) -> show the equation (e.g. "3 + 2 = ?" or "7 − 6 = ?") above the objects in all stages -> for subtraction/missing/compare kinds, dim and disable tapping on the subtracted items so only remaining items are counted -> child picks the digit among 3 cards -> read the answer with counter/classifier and object (e.g. "năm quả táo đó!" / "ごこ りんご ですね！") then praise in the active language and wait for speech to finish before advancing. Give-away mirrors: objects fly out of the basket, notes descend, child answers how many are left. Also apply the spoken count+object answer before praise to A1, A2, A3, A5, A6, A7. Hide the top-bar language toggle during story intro and lessons.

COMPARISON SIGN SCENE (A10), example 5 rabbits vs 3 squirrels
Question audio once (replay button always top-right) -> child touch-counts each group (count notes, numbers 5 and 3 appear under the groups) -> three sign cards (> < =) appear below -> child drags one into the middle slot -> correct: seesaw tilt toward the larger group, "ting", read compareSentence(5,3,lang,"number") aloud, then praise -> wrong: amber state, "boing", tier phrase, then the pairing animation (a string between each rabbit and squirrel, the unpaired rabbits glow with a yellow halo and an ink outline), then try again. Layout always puts the two groups left and right (never top and bottom), also on portrait and phone. The signs are drawn as inline SVG: thick round-ended strokes, ">" and "<" look like an open mouth that opens toward the larger side; in lessons s5-l09 and s5-l10 two small eye dots sit on the sign (parent can switch this off), from s5-l11 no eyes. Cards are 112x112px, the sign inside is at least 96px. A10b shows two big digits instead of groups with a "show objects" button. A10c shows expressions such as 3 + 2 and 4 on both sides and only uses values within 10. The hint line is hint.pair: vi "Miệng luôn há về bên có nhiều hơn." ja "おくちは おおきい ほうに あくよ。" Never use ＞ ＜ full-width characters; insert text containing > or < with textContent so HTML is not broken.

AUDIO
- sfx.js: synthesize every effect with Web Audio (no audio files): count note (sine, soft attack, 0.25 s decay), receive "ting" (two rising notes), give "whoosh" (filtered noise sweep down + soft pop), total chime (arpeggio), wrong "boing" (0.4 s max, soft), reward fanfare, pairing blip (short 0.15 s sine, one per string; an unpaired object uses the next ladder note up), seesaw tilt (soft rising or falling slide). Create or resume AudioContext on the first user gesture (iOS Safari). Master volume in settings. Max 3 simultaneous layers (voice, sfx, music); lower music by 60 percent while voice plays.
- speak.js: speakSegments(segments) uses speechSynthesis with lang vi-VN or ja-JP, rate 0.85, pitch 1.05, picks a voice whose lang matches (waits for voiceschanged), 300 ms pause between segments, 50 ms pause after cancel(), cancels the queue when a new feedback starts. If no matching voice for that language exists or speechSynthesis throws, skip speaking that segment (never fall back to another language's voice), resolve after a short timeout and continue; never block a lesson. Optional: for ids in voice-manifest, try assets/audio/{lang}/{id}.m4a first, otherwise speechSynthesis. Sentences containing the child's name always use speechSynthesis. Counting rhythm: 700 ms per object, 400 ms between spoken numbers.
- If no vi-VN voice exists, show a calm notice in the parent area.

I18N
i18n/vi.json and i18n/ja.json (UI strings: ui.*, hint.*, mathwords.*, parent.*, mascot.name) must have exactly the same keys, no empty strings. Vietnamese NFC. Japanese child-facing text is hiragana only (child's name in kana); kanji allowed only under keys starting with "parent." and with furigana (ruby). Math words: vi thêm, bớt, cộng, trừ, bằng, tất cả, còn lại, nhiều hơn, ít hơn, bằng nhau, lớn hơn, bé hơn, thứ nhất; ja ふえる, へる, たす, ひく, は, ぜんぶで, あわせて, のこり, おおい, すくない, おなじ, ちがい, おおきい, ちいさい, いちばんめ. Comparison reading: vi "ba lớn hơn hai", ja "さんは により おおきい"; ja never teaches the names of the signs to the child. Extra hint keys: hint.pair as above. Extra prompts: pattern vi "Tiếp theo là hình gì?", ja "つぎは なにかな？"; measure vi "Dài bằng mấy khối?", ja "ブロック なんこぶんかな？". Equation reading: vi "ba cộng hai bằng năm"; ja "さん たす に は ご".
Sample math stories (use the zone's animal and object with its classifier in vi, e.g. "quả táo", "củ cà rốt", "con cá", for prompts like "Có tất cả mấy quả táo?"): vi "Gấu Mật có 3 quả táo. Bạn cho thêm 2 quả. Tất cả có mấy quả?"; ja "くまの はちくんは りんごを 3こ もっています。2こ もらいました。ぜんぶで なんこ？"; take: vi "Thỏ Bông có 5 quả cam. Thỏ cho bạn 2 quả. Còn mấy quả?"; ja "うさぎの ふわちゃんは みかんを 5こ もっています。ともだちに 2こ あげました。のこりは なんこ？"

DATA SCHEMA
data/lessons.json: { "version":1, "lessons":[ { "id":"s4-l03", "stage":4, "order":3, "title":{"vi":"...","ja":"..."}, "storyBeat":"mid", "activities":[ { "type":"A4", "kind":"add", "max":10, "showSymbols":true, "voiceIds":["story-add-01"] } ] } ] }
Generate all 82 lessons from the STAGES table (lessons per stage: 6,10,9,10,10,10,10,9,8). Stage 9 lessons carry "optional":true; no other lesson does. Comparison sign activities look like { "type":"A10", "variant":"b", "max":10, "showSymbols":true, "eyes":true } (variant a, b or c; eyes true only in s5-l08 and s5-l09). A10 appears only in stages 5-7; lessons s5-l08, s5-l09, s5-l10, s6-l09, s6-l10 and s7-l09 each contain at least one A10; s5-l08 never uses the = card (allowEqual false), s5-l09 and later use allowEqual true; in stages 6 and 7 the last (review) activity of lessons 3, 6 and 9 is a review of 2 A10 items; s2-l10 contains an A11 ordinal activity; stage 9 lessons use A11-A14 and A1. Each lesson has exactly 6 activities, one object type (the stage's object from story.json), and the last activity reviews 2 items from the previous lesson. storyBeat is "open" for the first lesson of a stage, "close" for the last, "mid" otherwise. Stage 4 is the first stage whose activities may set showSymbols:true for + - =; the comparison signs first appear in stage 5.

PARENT AREA
Opened only by pressing and holding a button for 3 seconds (not a math question). Contains: language switch (vi/ja), child's name for vi and ja plus optional speech override for each, praise style (girl/boy/neutral), daily play limit (off, 10, 20, 30 minutes; when reached show a calm end-of-play screen), progress view (stars per lesson, stickers), volume, a switch for the two eye dots on comparison signs (default on), reset progress with confirmation.

TESTS (tests/, all pass with node --test tests/)
T1 numberToWords vi: 0="không",1="một",5="năm",10="mười",11="mười một",14="mười bốn",15="mười lăm",20="hai mươi",21="hai mươi mốt",24="hai mươi tư",25="hai mươi lăm",40="bốn mươi",45="bốn mươi lăm",55="năm mươi lăm",91="chín mươi mốt",100="một trăm".
T2 numberToWords ja: 0="ぜろ",4="よん",7="なな",9="きゅう",10="じゅう",11="じゅういち",14="じゅうよん",19="じゅうきゅう",20="にじゅう",30="さんじゅう",47="よんじゅうなな",74="ななじゅうよん",90="きゅうじゅう",100="ひゃく".
T3 ja counters: ko 1..10 = いっこ,にこ,さんこ,よんこ,ごこ,ろっこ,ななこ,はっこ,きゅうこ,じゅっこ. hiki 1..10 = いっぴき,にひき,さんびき,よんひき,ごひき,ろっぴき,ななひき,はっぴき,きゅうひき,じゅっぴき. tsu 1..10 = ひとつ,ふたつ,みっつ,よっつ,いつつ,むっつ,ななつ,やっつ,ここのつ,とお.
T4 noteForCount: n=1 -> 261.63, n=6 -> 523.25, n=10 -> 880.00 with bell true, n=11 -> 261.63 with bell false, n=20 -> bell true; frequencies within 0.01 Hz.
T5 generateProblem: same seed gives identical output; 1000 seeds per kind satisfy range rules; choices are 3 distinct integers within 0..max containing the answer; with recent=[[2,3],[2,3]] the pair [2,3] is never returned.
T6 gradeLesson: 10 true -> 3, 9 -> 3, 8 -> 2, 7 -> 2, 6 -> 1, 0 -> 1.
T7 isMastered: false for one session; false for two sessions on the same date; false if either is below 0.8; true for two qualifying sessions on different dates.
T8 nextMode: [false,false] -> "concrete"; [true,false] -> "normal"; [false,true,false] -> "normal"; [true,false,false] -> "concrete".
T9 i18n parity: vi.json and ja.json have identical key sets; no empty strings; ja child-facing strings (keys not starting with "parent.") contain no CJK ideographs (regex /[一-龯]/ must not match); same check for ja strings in data/story.json and data/phrases.json.
T10 data validation (tools/validate-data.mjs exits non-zero on failure): 82 lessons with stage counts 6,10,9,10,10,10,10,9,8; every lesson has exactly 6 activities; every voiceId used exists in voice-manifest.json with vi and ja text; no activity max exceeds its stage limit (1:5, 2:10, 3:5, 4:10, 5:20, 6:100, 7:10, 8:100, 9:10); showSymbols is false for stages 1-3 and no A10 exists in stages 1-4 or 8-9; s5-l08, s5-l09, s5-l10, s6-l09, s6-l10 and s7-l09 each contain at least one A10; s2-l10 contains an A11; every stage 9 lesson has optional true and no other lesson does; storyBeat is open/mid/close as specified.
T11 storage: when localStorage.setItem throws, saveProgress() does not throw and the app keeps in-memory state.
T12 onWrong: never decreases stars or score, never ends the lesson, returns hintKey "hint.recount" and tier wrong1/wrong2/wrong3 for wrong counts 1, 2, 3 and above.
T13 phrases data: every tier has equal vi and ja counts and at least these counts: praise 8, streak 3, wrong1 6, wrong2 5, wrong3 3, wrong3cmp 3, finish 6, greet 2, idle 3; every praise, streak, finish and greet line contains {name}; every wrong3 and wrong3cmp line contains {answer}; every wrong1 line contains {name} or a clear "wrong" word (Sai/Chưa đúng/Nhầm/Không phải; ちがう/おしい/まちがえ/ざんねん).
T14 pickPhrase: never returns lastIndex when more than one candidate remains (10000 trials); with gender "m" or "n" no "f" line is ever returned and at least 4 praise lines remain; with gender "f" all lines are candidates.
T15 composeFeedback: with names Mây and マイ, a praise result has 1 segment matching settings.lang (vi contains "Mây" when lang is "vi", ja contains "マイ" when lang is "ja"); with speakVi "May" the speak field contains "May" but text still contains "Mây"; no segment contains "{" after composing.
T16 story data: 9 chapters in stage order 1..9 (chapter 9 has optional true, no other chapter does); each has zone, animal, object, intro, outro, sticker in both languages; intro and outro contain {name}; beats.mid and beats.close each have at least 3 lines.
T17 chooseTier: correct after 2 correct in a row -> "praise"; third correct in a row -> "streak"; wrong counts map to wrong1/wrong2/wrong3; finish -> "finish"; with activityType "A10" the third wrong and later map to "wrong3cmp" instead of "wrong3".
T18 ordinalWords and clockWords: vi 1..10 give thứ nhất, thứ hai, thứ ba, thứ tư, thứ năm, thứ sáu, thứ bảy, thứ tám, thứ chín, thứ mười; ja 1..10 give いちばんめ, にばんめ, さんばんめ, よんばんめ, ごばんめ, ろくばんめ, ななばんめ, はちばんめ, きゅうばんめ, じゅうばんめ. clockWords ja: 1=いちじ, 4=よじ, 7=しちじ, 9=くじ, 10=じゅうじ, 11=じゅういちじ, 12=じゅうにじ; vi: 4="bốn giờ", 5="năm giờ", 12="mười hai giờ".
T19 compareSentence: vi number (3,2)="ba lớn hơn hai", (2,3)="hai bé hơn ba", (3,3)="ba bằng ba"; ja number (3,2)="さんは により おおきい", (2,3)="には さんより ちいさい", (3,3)="さんと さんは おなじ"; vi group (5,3)="năm nhiều hơn ba", (3,5)="ba ít hơn năm"; ja group (5,3)="ごは さんより おおい", (3,5)="さんは ごより すくない"; signAnswer(3,2)=">", (2,3)="<", (4,4)="=".
T20 generateSignSet: same seed gives identical output; for 500 seeds with count 10 and allowEqual false there are exactly 5 ">" and 5 "<" answers; with allowEqual true exactly 2 "=", 4 ">" and 4 "<"; no answer sign appears 3 times in a row; no identical (a,b) pair twice in a row; a and b within 0..max; choices are exactly the set {">","<","="}; answer always equals signAnswer(a,b).
T21 generateSignExprSet and ordinal problems: for 500 seeds every side value is within 0..max (max 10), no subtraction goes below 0, answer equals the comparison of the two computed values, and the same balance rules as T20 hold; generateProblem kind "ordinal" returns n in 3..10, p in 1..n, answer p, and 3 distinct choices within 1..n including p.

MANUAL TEST CHECKLIST (docs/manual-tests.md; tick each item in your final message)
1. At 1024x768, 768x1024 and 360x640 no lesson screen scrolls and all targets are >= 72px.
2. Play lesson s4-l03 in vi and in ja: story audio plays once, replay works, notes rise when objects arrive and fall when they leave.
3. Correct answer: two spoken sentences, vi then ja (or ja then vi when language is ja), each saying the child's name; sentences differ from the previous correct answer.
4. Wrong answer: clear "wrong" wording plus encouragement and try again, amber card, no red; second wrong switches to real-object mode; third wrong shows the answer and moves on.
5. Change the name in the parent area to a different name (and a speech override): feedback shows and speaks the new name without reload.
6. With storage disabled the app still plays a full lesson.
7. Language switch changes all text and voice without reloading.
8. Parent area opens only after a 3-second hold; daily limit ends play calmly.
9. With prefers-reduced-motion on, shake and fireworks are replaced by a simple fade.
10. Colors: each token matches the list; no pure red except the give coral inside the give scene.
11. Finishing a stage adds exactly one sticker; replaying the stage never duplicates or removes it; finishing stage 8 plays the finale and gives the Star Medal.
12. With no vi-VN voice available the lesson still runs and the parent area shows the notice.
13. Comparison signs appear only from stage 5 lesson 9 on; stages 1-4 never show them. The comparison is read aloud in vi ("ba lớn hơn hai") and ja ("さんは により おおきい").
14. A10 wrong answer: amber card, pairing animation with strings and glowing unpaired objects, no red; third wrong speaks a wrong3cmp phrase with the full sentence and moves on.
15. In a 10-question A10 set, left-larger and right-larger answers appear equally often; "=" appears (twice) only from lesson s5-l10 on; groups are always left and right, also in portrait and on the phone layout.
16. Stage 9 shows on the map as optional, finishing it adds exactly one Festival Flag sticker and never affects the Star Medal; the clock reads 4, 7 and 9 o'clock in Japanese as よじ, しちじ, くじ.

MILESTONES
M1 core logic + phrases/chooseTier logic with tests T1-T8, T12-T15, T17-T21 green. M2 data files (lessons, story, phrases, i18n, voice-manifest), tools/validate-data.mjs, tests T9-T11, T16 green. M3 tokens, home map with Sparkle Star, story intro screen, lesson player with A1, A2, A3. M4 give-and-receive scene A4, sfx.js, speak.js, full feedback flow (praise, wrong1-3, streak, finish). M5 A5-A11 (including the comparison sign scene A10 and ordinals), reward screen, sticker book, parent area. M6 stage 9 activities A12-A14 (shapes, positions, patterns, measuring, days, clock), polish, docs/manual-tests.md, run the manual checklist.

DO NOT
Do not add dependencies. Do not fetch anything over the network. Do not use emoji as artwork. Do not invent curriculum content beyond the STAGES table. Do not change the wording in the story and phrase data above without being asked. If something is ambiguous, pick the simplest option and list it under "Assumptions" at the end of your reply.
```
