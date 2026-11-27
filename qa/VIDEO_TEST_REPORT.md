# BÁO CÁO KIỂM ĐỊNH KỸ THUẬT VIDEO & HÌNH ẢNH BÌA (PRODUCT 1)

**Sản phẩm kiểm định:** Video tuyên truyền dọc 9:16 (Mục 1) · Cụm 1 · Trại Thanh niên số thành phố Đồng Nai 2026  
**Ngày kiểm định:** 27/11/2026  
**Công cụ sử dụng:** `ffprobe`, `ffmpeg` (`blackdetect`, `silencedetect`), `Pillow` / `NumPy`, Playwright Chromium, `node scripts/qa-media-posters.mjs`

---

## 1. Đối chiếu thông số `ffprobe`: Video gốc vs. Bản tối ưu Web

> Nguyên tắc bắt buộc: Giữ nguyên **100%** khung hình, lời thoại, âm nhạc và thời lượng gốc (`101.448s`), tuyệt đối không cắt ghép hay chỉnh sửa nội dung phát biểu trong video gốc.

| Chỉ tiêu kỹ thuật | Bản gốc (`1_Doi1_ChuDe1_GOC.mp4`) | Bản tối ưu Web (`video-web-optimized.mp4`) | Kết quả |
| --- | --- | --- | --- |
| Dung lượng tệp | `139,948,379 B` (`133.47 MB`) | `27,188,713 B` (`25.93 MB`) | Giảm **80.57%** (`< 35 MB`, tối ưu GitHub Pages) |
| Độ phân giải & Tỷ lệ | `1080 × 1920` (`9:16`, SAR `1:1`) | `720 × 1280` (`9:16`, SAR `1:1`) | Đạt chuẩn dọc 9:16 |
| Codec Video | `H.264` (`Main@L5.1`, `yuv420p`, `bt709`) | `H.264` (`High@L4.1`, `yuv420p`, `bt709`) | Tương thích mọi trình duyệt & di động (`+faststart`) |
| Tốc độ khung hình / Số khung | `30 fps` · `3,043 frames` | `30 fps` · `3,043 frames` | Không rơi khung hình |
| Bitrate Video trung bình | `10,838 kb/s` | `2,006 kb/s` (`-crf 24 -maxrate 2400k`) | Mượt, không giật hình |
| Audio Stream | `AAC (LC)`, `44100 Hz`, stereo, `193 kb/s` | `AAC (LC)`, `44100 Hz`, stereo, `129 kb/s` | Rõ tiếng, đồng bộ âm thanh |
| Thời lượng (`format.duration`) | `101.448005s` (`01:41.45`) | `101.448005s` (`01:41.45`) | Sai lệch `0.000s` (`< 0.2s`) |

Bản sao đồng bộ byte tại:
- `deliverables/01_Video/video-web-optimized.mp4`
- `public/assets/video/video-web-optimized.mp4`

---

## 2. Kết quả `blackdetect` & `silencedetect` trên video gốc

### 2.1. `ffmpeg blackdetect` (`d=0.1:pix_th=0.10`)
1. `01:14.900 – 01:15.200` (`74.900s → 75.200s`, thời lượng `0.300s`): Điểm chuyển cảnh tối (black fade) ngay sau phần phát biểu ngoài trời trước khi chuyển sang đoạn nhạc nền và màn hình *"TRẠI THANH NIÊN SỐ"*.
2. `01:41.267 – 01:41.400` (`101.267s → 101.400s`, thời lượng `0.133s`): Nhịp tắt tối kết thúc video ở giây cuối (`~101.17–101.4s` tính cả đoạn chuyển tối cuối khung).

### 2.2. `ffmpeg silencedetect` (`noise=-32dB:d=0.35` & `noise=-28dB:d=0.22`)
Các khoảng lặng / nhịp ngắt tự nhiên đã kiểm tra phục vụ căn mốc phụ đề:
- `3.85s – 4.90s` (`1.04s`): ngắt câu thoại mở đầu trước câu hỏi *"Ủa, sao vậy?"*
- `8.83s – 9.28s`, `10.27s – 10.62s`, `13.14s – 13.61s`, `15.18s – 15.48s`: nhịp đối thoại trên ghế đá
- `23.14s – 23.37s`: chuyển sang đoạn nhạc nền quét mã QR trên ứng dụng (`23.6s – 32.0s`)
- `34.90s – 35.30s`: chuyển cảnh từ ghế đá sang bạn trẻ phát biểu ngoài trời
- `38.47s – 38.83s`, `40.16s – 40.45s`, `42.88s – 43.21s`, `45.03s – 45.42s`, `49.51s – 49.85s`, `52.34s – 52.79s`, `56.14s – 58.03s`, `62.98s – 63.27s`, `65.05s – 65.49s`, `69.50s – 69.76s`, `71.80s – 72.99s`: nhịp ngắt câu trong bài nói về Nghị quyết 57
- `74.70s – 77.50s` & `77.53s – 79.33s`: khoảng chuyển nhạc nền trước khẩu hiệu tập thể
- `81.17s – 81.43s`, `83.60s – 83.90s`, `85.96s – 86.31s`, `91.32s – 91.62s`: ngắt nhịp giữa phần hô khẩu hiệu và lời bình AI kết thúc

---

## 3. Phân đoạn nội dung thoại thực tế & Phụ đề `subtitles_vi.vtt`

### 3.1. Thiếu phụ đề gốc (`hard-sub` / `soft-sub`)
- Kiểm tra `ffprobe` và lưới khung hình (`storyboard`) cho thấy tệp gốc `1_Doi1_ChuDe1_GOC.mp4` **không có track phụ đề nhúng** và **không có phụ đề chạy sẵn (hard-sub)** cho toàn bộ lời thoại.
- **Hướng khắc phục sạch, không sửa video:** Xuất tệp phụ đề rời chuẩn `WEBVTT` tiếng Việt (`deliverables/01_Video/subtitles_vi.vtt` và `public/assets/video/subtitles_vi.vtt`) gồm **23 cue** đồng bộ sát lời thoại thực tế trong video (tuyệt đối không thêm bịa các số liệu 2030/2045 không có trong âm thanh video).

### 3.2. Tóm tắt mốc nội dung thoại thực tế
- **`00:00.0 – 00:35.1` (Mở đầu tình huống):** Hai đoàn viên ngồi ghế đá trao đổi về việc dùng ứng dụng Đoàn viên, hướng dẫn quét mã qua Zalo / Google Camera (`23.6s–32.0s` nhạc nền thao tác quét mã) và xác nhận mở thành công (*"Đấy, vô rồi nè. Nhanh gọn lẹ không?"*).
- **`00:35.3 – 01:14.9` (Thông điệp chính về Nghị quyết 57):** Một đoàn viên phát biểu về tinh thần thực hiện Nghị quyết số 57 của Đảng và Nhà nước về đột phá khoa học, công nghệ, đổi mới sáng tạo và chuyển đổi số quốc gia; số hóa và đồng bộ cơ sở dữ liệu quốc gia giúp nâng cao hiệu quả quản lý, đơn giản hóa thủ tục hành chính; vai trò xung kích làm chủ công nghệ số và lan tỏa tới người dân.
- **`01:15.1 – 01:30.6` (Chuyển cảnh & Khẩu hiệu nhóm):** Nhạc nền (*"Là lúc có chúng tôi..."*) trước phông *"TRẠI THANH NIÊN SỐ – TUỔI TRẺ ĐỒNG NAI DẪN NHỊP CÔNG NGHỆ BỨT PHÁ KỶ NGUYÊN SỐ"*, tiếp nối lời kêu gọi *"không nên chỉ là người chứng kiến sự thay đổi, mà phải là người kiến tạo"* và đồng thanh *"Thanh niên tiên phong – Làm chủ công nghệ – Kiến tạo tương lai! Yeah!"*.
- **`01:31.2 – 01:41.2` (Kết thúc):** Giọng đọc minh họa đoạn clip AI: *"Tuổi trẻ Việt Nam tiên phong chuyển đổi số. Kết nối công nghệ, giữ gìn truyền thống, hướng tới tương lai."*

---

## 4. Sửa lỗi chính tả Hình ảnh bìa (`thumbnail-chu-dung`)

- **Lỗi trên tệp gốc (`1.1_Doi1_ChuDe1_THUMB_GOC.png`, `941 × 1672` RGB):** Dòng chữ `TƯỞNG NGỒI CHƠI` bị dính dấu huyền kép trên chữ `Ồ` (`NGỒ̀I`).
- **Cách xử lý chuẩn:** Phủ mảng tán lá tự nhiên có biên mờ (`feathered bokeh`) chỉ lên vùng tiêu đề đồ họa phía trên (`y < 716`, chừa nguyên mũi tên trắng bên trái), sau đó render lại chữ vector thuần Unicode **`Be Vietnam Pro 800`** bằng Playwright Chromium với đúng nội dung:
  - **`TƯỞNG NGỒI CHƠI`** (chữ trắng trên nền xanh navy viền vàng)
  - **`ĐIỆN THOẠI?`** (chữ vàng trên nền xanh navy)
  - **`NHƯNG ĐANG LÀM CHUYỂN ĐỔI SỐ!`** (chữ đỏ nổi bật trên băng trắng)
- **Kiểm tra pixel ảnh người thật (`y >= 725`):** Max RGB diff = **`0`** (giữ nguyên 100% khuôn mặt, mắt kính, tay cầm điện thoại, áo xanh Đoàn, ghế đá, giày).
- **Tệp xuất:**
  - `deliverables/01_Video/thumbnail-chu-dung.png` (`941 × 1672`, sRGB PNG) + bản sao tại `public/assets/video/thumbnail-chu-dung.png`
  - `deliverables/01_Video/thumbnail-chu-dung-1080x1920.png` (`1080 × 1920`, tỷ lệ `9:16` đồng tỷ lệ không kéo giãn mặt) + bản sao tại `public/assets/video/thumbnail-chu-dung-1080x1920.png`

---

## 5. Ghi nhận minh bạch nguồn & bản quyền (`CHỜ NHÓM XÁC NHẬN`)

| Thành phần trong video gốc | Hiện trạng quan sát được | Trạng thái xác minh |
| --- | --- | --- |
| Lời thoại & cảnh quay thực tế (`00:00–01:31`) | Nhóm tự quay tại sân trường / phông Trại Thanh niên số | Sản phẩm gốc của nhóm |
| Đoạn nhạc nền có lời (`~01:15–01:19`, câu *"Là lúc có chúng tôi..."*) & nhạc nền đoạn quét mã (`~00:24–00:32`) | Không có thông tin tác giả / nguồn cấp phép trong hồ sơ đi kèm | **`CHỜ NHÓM XÁC NHẬN`** nguồn nhạc miễn phí bản quyền hoặc cấp phép sử dụng khi đăng công khai |
| Các cảnh dựng cuối video (`~01:32–01:41`, nam thanh niên hướng dẫn bác lớn tuổi & quét mã QR) | Có dấu nhận diện sao lấp lánh của công cụ tạo video **Gemini AI** ở góc dưới phải | **`CHỜ NHÓM XÁC NHẬN`** & cần ghi chú minh bạch *"có sử dụng đoạn minh họa hỗ trợ bởi AI"* khi nộp/đăng bài |
