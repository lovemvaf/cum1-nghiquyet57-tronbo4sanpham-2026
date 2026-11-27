# INPUT AUDIT — HỒ SƠ ĐẦU VÀO TRỌN BỘ 04 SẢN PHẨM (CỤM 1 · NGHỊ QUYẾT 57-NQ/TW)

- **Dự án:** `cum1-nghiquyet57-tronbo4sanpham-2026` (*Nghị quyết 57 đến gần thanh niên Cụm 1 — Trọn bộ 04 sản phẩm & trình diễn 4 phút*)
- **Ngày kiểm định trực tiếp trên đĩa:** `27/11/2026` (kiểm tra bằng Python `hashlib.sha256`, `PIL.Image`, `python-docx`, `python-pptx`, `openpyxl`, `ffprobe`/`ffmpeg`, `git`, `urllib`)
- **Trạng thái hồ sơ:** `DRAFT_PENDING_TEAM_DETAILS` (`Cụm 1` đã xác nhận; `doiSo`, `diaBanCuThe`, `doiTruong` giữ `null` / `CHƯA XÁC NHẬN` vì không có trong đề thi hay bảng Excel đầu vào; hạn nộp trong đề thi là `21:00 ngày 26/11/2026`, bản dựng hiện tại `27/11/2026` phục vụ trình bày/lưu trữ biên tập trung thực).

---

## 1. Bảng kiểm kê tệp gốc (Bytes, SHA-256, Kích thước / Thời lượng)

| STT | Tệp đầu vào (Đường dẫn thực tế) | Dung lượng (Bytes) | SHA-256 kiểm chứng trực tiếp | Thông số kỹ thuật / Cấu trúc quan sát |
|---:|---|---:|---|---|
| 1 | `deliverables/01_Video/1_Doi1_ChuDe1_GOC.mp4` | `139,948,379` | `7aebbe9ada70390a7aeda905013639c71db6869007e992d10a7d1013864246a6` | `ffprobe`: `101.448005 s` (~1m41.45s), `1080 × 1920` (9:16), `30 fps`, video `H.264 Main L5.1 yuv420p` (`10,838,236 bps`, `3,043 frames`), audio `AAC LC stereo 44100 Hz` (`193,359 bps`, `4,370 frames`), tổng bitrate `11,036,067 bps`. `blackdetect`: `74.9–75.2 s` (`0.3 s`) và `101.267–101.4 s` (`0.133 s`). Không có hard-subtitle hay track phụ đề. |
| 2 | `deliverables/01_Video/1.1_Doi1_ChuDe1_THUMB_GOC.png` | `2,753,849` | `39cce38be87e81bb21dc45ddab57fa6c2c03553d5a8d4ef7691750bb002e6efe` | PNG `941 × 1672 px`, mode `RGB`. Ảnh chụp thật 2 nữ đoàn viên ngồi ghế đá cùng lớp đồ họa chữ ở nửa trên; phát hiện lỗi dấu kép `NGỒ̀I` (`TƯỞNG NGỒ̀I CHƠI ĐIỆN THOẠI?`). |
| 3 | `deliverables/03_BaiDang/3_BAI_DANG_GOC_DOI1.docx` | `28,417` | `e1d70a038a31b81b82125bf37fe5f23e4eafd1a34624a80393db99fd1d517a7d` | Word `.docx`, `13` đoạn văn không rỗng (`P0..P12`), `0` bảng. Có tiêu đề `Chuyển đổi số – Bắt đầu từ chính mình`, câu `P7` (*"đã và đang được triển khai, tiêu biểu là số hóa các địa chỉ đỏ..."* — chưa có minh chứng), `P10` dính dấu chấm `#Cum1.`, `P11` thiếu ngày lịch & thiếu kênh đăng, `P12` ghi *"Video tuyên truyền khoảng 1p30s giây"* và bỏ sót bộ 05 poster. |
| 4 | `deliverables/04_ThuyetMinh/PPT_GOC_THAM_KHAO.pptx` | `172,646,484` | `b421ad89b51f5eb3395eb14d34e22a80b2a90b512f3e8f074b193061bff52a61` | PowerPoint `.pptx`, kích thước `13.33 × 7.50 in` (`16:9`), `9` slide (`01/05`, `04/05`, thiếu nhãn, `02/05`, `03/05`, `04/05`, `05/06`, thiếu nhãn, `06/06`). Nhúng `12` ảnh (`image1..12`) + `2` video (`ppt/media/media1.mp4`: `139,948,379 B`, SHA-256 trùng khớp 100% với `1_Doi1_ChuDe1_GOC.mp4`; `ppt/media/media2.mp4`: `6,443,188 B`, SHA-256 `e62014380a0b6fa1a377569d6c5a931210336eab62baf9d5ff676dd7f733201b`, `24.036667 s`, `720 × 1280`, `27 fps`, `H.264/AAC`). |
| 5 | `c:\Users\asus\Downloads\DeThi_VongThucChien_TraiThanhNienSo2026_v2_BanIn.docx` | `40,603` | `56515ae91d72041418c1d09a51723c790dc23015e5c53fce6cf3509e651b84c1` | Đề thi Vòng thực chiến *Trại Thanh niên số thành phố Đồng Nai năm 2026* (`P1..P73`, `5` bảng `Table 0..4`). Quy định `04` sản phẩm (`Video 60–120s 9:16 có phụ đề & nhạc bản quyền`; `Thiết kế 03–05 ấn phẩm 1080×1350 px đúng nhận diện Đoàn`; `Bài đăng Word đủ kênh/giờ dự kiến/ấn phẩm đi kèm`; `Thuyết minh tối đa 03 trang Word/PDF`). Tổng thời gian trình bày sáng `27/11/2026`: tối đa `10 phút` (`≤ 6 phút` trình bày + `4 phút` phản biện). Hạn nộp ghi trên đề: `21:00 ngày 26/11/2026`. |
| 6 | `c:\Users\asus\Downloads\TRẠI THANH NIÊN SỐ (1).xlsx` | `201,433` | `6713c17a317d4e158c2be90bac2ea8c15889d80149d91540da2deff15ee56893` | Excel `.xlsx`, `3` sheet: `'SCRIPT, NỘI DUNG '` (`SHORT 1..5`, tổng thời lượng ghi `60s`, bỏ trống `C6` và `C8`, cột `F2:M10` tóm tắt quan điểm/mục tiêu/7 nhiệm vụ/liên hệ thực tiễn), `'STUDY'` (`Chuyên đề 1 Xây dựng câu chuyện — Dannie Linh Đan`), `'THUYẾT TRÌNH'` (`B2` dẫn nhập thực tế + `C2` liệt kê 5 câu hỏi trọng tâm). |
| 7 | `deliverables/02_ThietKe/identity/original/huy-hieu-doan-original.jpg` | `266,705` | `b37deef716c0666008bb0dab4ddb3b752d3fc218111ac0f738020d3a0e56571a` | JPEG `925 × 1024 px`, mode `RGB`. Tệp gốc Huy hiệu Đoàn TNCS Hồ Chí Minh. |
| 8 | `deliverables/02_ThietKe/identity/original/huy-hieu-doan-user-png.png` | `71,672` | `5ac46c2633b7ca4daadcd3f543fe06b56cbe0c178fb217dcaddd91af194134a1` | PNG `250 × 275 px`, mode `RGBA`. Bản PNG phụ lưu trữ đối chiếu (không dùng cho poster `1080×1350` vì độ phân giải thấp hơn bản clean). |
| 9 | `deliverables/02_ThietKe/identity/derived/huy-hieu-doan-clean.png` | `598,535` | `a6f768702ee40feda5ace6360cfcf036523a2708b972c9cfa3138a86c1d92078` | PNG `941 × 1042 px`, mode `RGBA`. Bản tách nền sạch từ tệp gốc `925 × 1024` dùng đồng bộ cho bộ 05 poster, tài liệu Word và website. *(Logo Hội Sinh viên Việt Nam: chưa có tệp gốc -> `null`/`false`, không tự bịa.)* |

---

## 2. Trích xuất nguyên văn `deliverables/03_BaiDang/3_BAI_DANG_GOC_DOI1.docx`

- `P0`: `BÀI ĐĂNG TRUYỀN THÔNG`
- `P1`: `CỤM 1`
- `P2`: `TRẠI THANH NIÊN SỐ`
- `P3`: `Chuyển đổi số – Bắt đầu từ chính mình`
- `P4`: `Bạn có thể sử dụng điện thoại mỗi ngày, nhưng đã bao giờ tự hỏi mình thực sự làm chủ công nghệ chưa?`
- `P5`: `Từ việc thực hiện dịch vụ công trực tuyến, sử dụng AI trong học tập và công việc đến nhận diện tin giả, bảo vệ dữ liệu cá nhân, chuyển đổi số hiện diện ngay trong những hoạt động thường ngày của chúng ta.`
- `P6`: `Hưởng ứng Nghị quyết 57-NQ/TW về đột phá phát triển khoa học, công nghệ, đổi mới sáng tạo và chuyển đổi số quốc gia, mỗi đoàn viên, thanh niên cần chủ động nâng cao kỹ năng số, ứng dụng công nghệ hiệu quả, an toàn và lan tỏa những tiện ích số đến cộng đồng.`
- `P7`: `Tại Cụm 1, các công trình, phần việc thanh niên gắn với thực hiện Nghị quyết 57 đã và đang được triển khai, tiêu biểu là số hóa các địa chỉ đỏ trên địa bàn. Qua đó, công nghệ trở thành cầu nối giúp thế hệ trẻ tiếp cận, tìm hiểu và gìn giữ những giá trị lịch sử địa phương.` *(Đánh dấu `UNVERIFIED` vì chưa có minh chứng triển khai thực tế.)*
- `P8`: `Hãy bắt đầu từ một việc nhỏ: học thêm một kỹ năng số, kiểm chứng thông tin trước khi chia sẻ hoặc hướng dẫn người thân sử dụng dịch vụ công trực tuyến. Cùng chia sẻ video và kể về một việc làm chuyển đổi số mà bạn có thể thực hiện ngay hôm nay!`
- `P9`: `THANH NIÊN TIÊN PHONG – LÀM CHỦ CÔNG NGHỆ – KIẾN TẠO TƯƠNG LAI`
- `P10`: `#TraiThanhNienSo #NghiQuyet57 #ChuyenDoiSo #TuoiTreTienPhong #ThanhNienSo #Cum1.` *(dính dấu chấm cuối `#Cum1.`)*
- `P11`: `Giờ đăng: 17h30, ngày công bố sản phẩm truyền thông.` *(thiếu ngày lịch cụ thể & thiếu kênh đăng dự kiến)*
- `P12`: `Ấn phẩm đi kèm: Video tuyên truyền khoảng 1p30s giây` *(thiếu bộ 05 ấn phẩm thiết kế; thời lượng video thực tế là `101,448 s` ~ 1 phút 41 giây)*

---

## 3. Kiểm kê lời thoại thực tế trong `1_Doi1_ChuDe1_GOC.mp4` (`101.448s`)

Nghe kiểm tra trực tiếp âm thanh gốc (`101.448s`, không có phụ đề gắn sẵn):
1. **`00:00 – 00:35` (Cảnh 2 nữ đoàn viên áo xanh tại ghế đá):**
   - Bạn 1 than phiền việc nhập app đoàn viên rắc rối (*"Trời ơi, làm gì mà suốt ngày chuyển đổi số, rắc rối!"*).
   - Bạn 2 hướng dẫn thao tác nhanh và quét mã QR qua Zalo hoặc Google Camera (*"Đó, vô nè. Nhanh gọn lẹ không?"*).
2. **`00:35 – 01:15` (Cảnh 1 bạn nữ áo đen phát biểu trực diện, bắt đầu từ chuyển tối `~35s`):**
   - Nói: *"Vì vậy, trên tinh thần là thực hiện Nghị quyết số 57 của Đảng và Nhà nước về đột phá phát triển khoa học, công nghệ, đổi mới sáng tạo cũng như là chuyển đổi số quốc gia..."* (lưu ý thuật ngữ: văn kiện gốc là Nghị quyết số `57-NQ/TW` của **Bộ Chính trị** ban hành `22/12/2024`; video không nêu số liệu `2030`/`2045`).
   - Nhấn mạnh đồng bộ cơ sở dữ liệu quốc gia, đơn giản hóa thủ tục hành chính, nâng cao đời sống nhân dân, và tinh thần xung kích làm chủ công nghệ số, lan tỏa tri thức số đến người dân.
3. **`01:15 – 01:20` (Chuyển tiếp nhạc nền có ca từ *"là lúc có chúng tôi..."*):** Nhạc nền chưa kê khai nguồn bản quyền -> ghi `CHỜ NHÓM XÁC NHẬN`.
4. **`01:20 – 01:33` (Cảnh 4 bạn trước backdrop Trại Thanh niên số thành phố Đồng Nai):**
   - Đọc khẩu hiệu: *"Các bạn ạ, trong thời đại hiện đại ngày nay, chúng ta không nên chỉ là người chứng kiến sự thay đổi, mà phải là người kiến tạo sự thay đổi đó. Thanh niên tiên phong – Làm chủ công nghệ – Kiến tạo tương lai! Yeah!"*
5. **`01:33 – 01:41.45` (Đoạn outro AI):**
   - Xuất hiện biểu tượng ngôi sao Gemini ở góc dưới phải khung hình, chữ nền AI biến dạng nhẹ (*"ỘT NẠN NHẸ"*, *"Cẩm Vân"*), giọng đọc nam: *"Tuổi trẻ Việt Nam, tiên phong chuyển đổi số. Kết nối công nghệ, giữ gìn truyền thống, hướng tới tương lai."* -> Cần nhóm xác nhận nguồn/bản quyền nhạc nền & clip AI outro.

---

## 4. Kiểm kê hai kho lưu trữ kế thừa (Legacy Repos & Live URLs)

| Kho lưu trữ | Đường dẫn cục bộ | Nhánh & Git Commit SHA (đầy đủ) | URL GitHub Pages & Trạng thái HTTP (`27/11/2026`) | Trạng thái bảo toàn |
|---|---|---|---|---|
| **Dự án cũ 1** (`net-ve-tri-an-dntu-2026`) | `../` (thư mục cha của workspace) | `main` · `f0138b6fec60f6f48761fccb2778be2a5d3c153d` (`f0138b6`) | `https://lovemvaf.github.io/net-ve-tri-an-dntu-2026/` -> **HTTP 200** | Nguyên vẹn 100%, không chỉnh sửa |
| **Dự án cũ 2 (V2 Poster)** (`lac-hong-so-nghiquyet57-cum1`) | `../lac-hong-so-nghiquyet57-cum1` | `main` · `9271d6798af80382307082578b9a961289499ebb` (`9271d67`) | `https://lovemvaf.github.io/lac-hong-so-nghiquyet57-cum1/` -> **HTTP 200** | Nguyên vẹn 100%, chỉ kế thừa bộ 05 poster & Huy hiệu Đoàn chuẩn sang kho V3 |
| **Dự án hiện tại (V3)** (`cum1-nghiquyet57-tronbo4sanpham-2026`) | `.` (workspace hiện tại) | `main` *(chưa có commit đầu tiên trên kho mới)* | Chưa xuất bản trong pha audit | Hợp nhất trọn bộ 04 sản phẩm + website trình diễn |

---

## 5. Section 13 — Kiểm định `.research/repos` & `_repos` trên đĩa (Giấy phép & Khả dụng)

Kiểm tra trực tiếp bằng Python trên cây thư mục cục bộ ngày `27/11/2026`:

1. **`.research/repos` (`../.research/repos` — `43` thư mục hiện hữu trên đĩa):**
   - **Được chọn cài qua `package.json` trong dự án V3:**
     - `vite@8.3.8` (**MIT**, xác minh `LICENSE`), `reveal.js@6.0.2` (**MIT**, `LICENSE`), `gsap@3.15.1` (**Standard "No Charge" GreenSock License**, `package.json`), `@playwright/test@1.65.1` (**Apache-2.0**, `LICENSE`), `@fontsource/be-vietnam-pro@5.3.0` (**OFL-1.1**), `qrcode@1.5.4` (**MIT**), `jsqr@1.4.0` (**Apache-2.0**).
   - **Các repo mở khác có mặt trong `.research/repos` nhưng không đóng gói vào bundle V3:** `anime` (MIT), `barba` (MIT), `canvas-confetti` (ISC), `canvas-sketch` (MIT), `canvas-sketch-util` (MIT), `drei` (MIT), `fluid-particles` (MIT), `gpu-flock` (MIT), `gsap-skills` (MIT), `hover-effect` (MIT), `impress.js` (MIT), `interlude` (MIT), `lenis` (MIT), `lottie-web` (MIT), `magicui` (MIT), `motion` (MIT), `motion-canvas` (MIT), `pixijs` (MIT), `postprocessing` (Zlib), `react` (MIT), `react-three-fiber` (MIT), `ShapesSlideshow` (MIT), `SlideshowAnimations` (MIT), `slidev` (MIT), `swiper` (MIT), `tailwindcss` (MIT), `TextCharacterAnimations` (MIT), `theatre` (Apache-2.0), `Three-VFX` (MIT), `three.js` (MIT), `three.quarks` (MIT), `tsparticles` (MIT), `ui` (MIT), `vuejs-core` (MIT).
   - **Các repo bị loại trừ rõ ràng do giấy phép / thiếu license:**
     - `fullPage.js`: **GNU GPL-3.0** (`LICENSE`) -> loại trừ (copyleft mạnh).
     - `react-bits`: **MIT + Commons Clause v1.0** (`LICENSE.md`) -> loại trừ.
     - `remotion`: **Remotion License** (`LICENSE.md`) -> loại trừ.
     - `LiquidDistortion`: không có tệp `LICENSE` và `package.json` không ghi giấy phép -> loại trừ.
     - `murmurations`: không có tệp `LICENSE` và `package.json` không ghi giấy phép -> loại trừ.

2. **`_repos` cục bộ:**
   - Đường dẫn `_repos` bên trong cả 3 thư mục dự án (`../_repos`, `../lac-hong-so-nghiquyet57-cum1/_repos`, `./_repos`) đều **không tồn tại (`False`)** — tức không có bản sao `_repos` đóng gói thừa trong repo nộp thi.
   - Thư mục kỹ năng hệ thống tại `C:\Users\asus\.gemini\config\skills\_repos` (**tồn tại `True`**, `32` thư mục trực tiếp + `33` thư mục trong `_writing_repos`) chỉ dùng tham khảo phương pháp biên tập/kiểm định, **0 dòng mã** chép vào sản phẩm nộp thi:
     - Trong `32` thư mục `_repos`: `28` repo **MIT / Apache-2.0**; `4` repo loại trừ không dùng (`firecrawl` **GNU AGPL-3.0**, `system-prompts-and-models-of-ai-tools` **GNU GPL-3.0**, `multica` **Multica License**, `andrej-karpathy-skills` **không có `LICENSE`**).
     - Trong `33` thư mục `_writing_repos`: `28` repo **MIT**; `1` repo **Apache-2.0** (`31_seyedehsanhadi_sloptrim`); `4` repo chưa có tệp `LICENSE` (`03_theclaymethod_unslop`, `09_lucyfer7566_vn_acad_v2`, `19_thanhan_vn_writer`, `27_jalaalrd_anti_ai_slop` — không dùng).
   - Thư mục `C:\Users\asus\.gemini\antigravity\scratch\video-production-toolkit` (**tồn tại `True`**, `8` thư mục `.agents` + `01`..`07`, không chứa tệp `LICENSE` trên đĩa) chỉ là công cụ tham chiếu quy trình phân tích video cục bộ, không phân phối trong sản phẩm.
