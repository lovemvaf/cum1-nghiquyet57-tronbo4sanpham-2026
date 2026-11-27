# BÁO CÁO NGHIỆM THU TỔNG THỂ (PASS / FAIL REPORT — GATES G0..G9 & RUBRIC 100 ĐIỂM)

- **Dự án:** `cum1-nghiquyet57-tronbo4sanpham-2026` — *LẠC HỒNG SỐ: Nghị quyết 57 đến gần thanh niên Cụm 1 (Trọn bộ 04 sản phẩm & trình diễn 4 phút)*
- **Ngày kiểm định:** `27/11/2026`
- **Trạng thái hồ sơ:** `DRAFT_PENDING_TEAM_DETAILS` (`CHO_NHOM_DUYET` — bản hoàn thiện hậu kỳ & chuẩn bị trình bày/lưu trữ biên tập trung thực sau mốc hạn `21:00 ngày 26/11/2026`)
- **URL Live Production:** `https://lovemvaf.github.io/cum1-nghiquyet57-tronbo4sanpham-2026/`
- **GitHub Actions Run ID (initial verified deploy):** `45914410880` (`completed / success` tại commit `e8ea6e2`)

---

## 1. Minh bạch mốc thời gian & Các hạng mục `CHƯA XÁC NHẬN`

1. **Mốc thời gian trung thực:** Đề thi Vòng thực chiến ghi hạn nộp **`21:00 ngày 26/11/2026`** và trình bày sáng **`27/11/2026`**. Bản dựng hiện tại ngày **`27/11/2026`** là gói hoàn thiện hậu kỳ, chuẩn hóa dữ liệu và hỗ trợ trình chiếu/lưu trữ biên tập trung thực; **không sửa giả dấu thời gian**.
2. **Thông tin nhóm cần tự chốt trước khi phát hành chính thức (`TEAM_REVIEW_REQUIRED.md`):**
   - `doiSo = null` (`CHƯA XÁC NHẬN` — chỉ thấy `Doi1` trong tên file gốc, Phiếu đăng ký/Excel bỏ trống).
   - `diaBanCuThe = null` (`CHƯA XÁC NHẬN` — đã xác nhận **Cụm 1**, chưa có tên xã/phường cụ thể).
   - `doiTruong = null` (`CHƯA XÁC NHẬN` — thiếu họ tên Đội trưởng và tên từng thành viên phụ trách).
   - **Kênh & ngày đăng Bài đăng MXH:** Đã giữ nguyên giờ dự kiến `17h30`, ghi rõ `Kênh mạng xã hội chính thức của Đoàn cơ sở tại Cụm 1 (chờ nhóm xác nhận tên kênh cụ thể)` và `ngày cụ thể chờ nhóm chốt`.
   - **Bản quyền nhạc nền (`01:15–01:20`) & clip Gemini AI outro (`01:33–01:41.45`):** Đã gắn cờ `CHO_NHOM_XAC_NHAN` trên website (Stage 1), `TEAM_REVIEW_REQUIRED.md` và `THUYET_MINH_CUM1_CHUDE1`.
   - **Logo Hội Sinh viên Việt Nam:** `false` (chưa có tệp gốc -> chỉ dùng Huy hiệu Đoàn TNCS Hồ Chí Minh `huy-hieu-doan-clean.png`, không tự bịa).

---

## 2. Bảng kiểm định Gates `G0..G9` (Section 15)

| Gate | Hạng mục kiểm định | Kết quả | Bằng chứng đo đạc thực tế |
|---|---|---|---|
| **G0** | **Kiểm kê nguồn đầu vào & Bảo toàn 2 repo cũ** | **PASS** | `INPUT_AUDIT.md`, `CONTENT_CONFLICT_LOG.md`, `CLAIMS_REGISTER.csv`. Repo cha `Netvetrian_QKD_KhoaCNTT-DNTU` nguyên vẹn tại `f0138b6`; Repo V2 `lac-hong-so-nghiquyet57-cum1` nguyên vẹn tại `9271d67`. |
| **G1** | **Tính xác thực 57-NQ/TW & Zero Fabrication** | **PASS** | Đính chính chủ thể ban hành **Bộ Chính trị (`22/12/2024`)**; đủ 4+1 quan điểm Mục I; tách bạch `> 80%` DVC trực tuyến với `80%` không dùng tiền mặt; đủ `Top 3 ĐNA AI`, `>= 5 DN`, `2% GDP` (`> 60%` xã hội), `>= 30%` / `>= 50%` GDP, `Top 30`; tách `03/NQ-CP`, `71/NQ-CP`; câu *"số hóa địa chỉ đỏ đã và đang triển khai"* được chuyển sang `TEAM_PROPOSAL` có điều kiện tư liệu. |
| **G2** | **Sản phẩm 1 — Video 9:16, VTT & Thumbnail** | **PASS** | `video-web-optimized.mp4` (`25.93 MB`, `720×1280` H.264/AAC, `101.448s` khớp `0.000s` bản gốc `133.47 MB`); `subtitles_vi.vtt` (`23` cue hợp lệ, không bịa `2030/2045`); `thumbnail-chu-dung.png` sửa dấu `NGỒ̀I` -> `NGỒI`, `max_diff = 0` trên vùng ảnh người thật `y >= 725`; `1080×1920` tỷ lệ chuẩn. `qa:media-posters`: `23/23` checks Video PASS. |
| **G3** | **Sản phẩm 2 — Bộ 05 Ấn phẩm Lạc Hồng Số & QR thật** | **PASS** | Cả 5 PNG (`01..05`) đạt `1080 × 1350 px` RGB, 4 bản sao đồng bộ SHA-256, `editable/01.svg..05.svg` nhúng `Be Vietnam Pro` WOFF2, Huy hiệu Đoàn khớp SHA-256 `a6f768702ee40fed`, `jsQR` giải mã pixel `05.png` trả đúng URL `xaydungchinhsach.chinhphu.vn`. `qa:media-posters`: `49/49` checks Posters PASS (tổng `72/72` PASS). |
| **G4** | **Sản phẩm 3 — Bài đăng MXH & Mockup PNG** | **PASS** | `BAI_DANG_CUM1_HOAN_CHINH.docx` + `MOCKUP_BAI_DANG.png` gỡ dấu chấm `#Cum1`, cập nhật video `1 phút 41 giây` + bộ `05` poster, tách rõ bản gốc `UNVERIFIED` vs bản đề xuất `TEAM_PROPOSAL`, trên web chuyển mượt `Xem trực quan` / `Xem nguyên văn`, 0 icon/số tương tác giả. |
| **G5** | **Sản phẩm 4 — Thuyết minh `<= 03 trang` & Kịch bản 04p** | **PASS** | `THUYET_MINH_CUM1_CHUDE1.docx` & `.pdf` (`249,307 B`, `<= 03` trang A4 `Times New Roman`, đủ 4 mục + kế hoạch 5 tuần + minh bạch AI + nguồn). `LOI_THUYET_TRINH_04_PHUT_CUM1_NQ57.docx` đo `444` từ = `116.3s` + `101.45s` video = `217.75s` (dư `22.25s` đệm trong khung `240s`). |
| **G6** | **Website tích hợp 10 chặng (Reveal + Vite + Offline)** | **PASS** | `pnpm run build` sạch (`417ms`), 0 external CDN, bundle sẵn font `Be Vietnam Pro` (`@fontsource`), đủ 10 chặng (`0..9`), phím `Space` phát/tạm dừng Video không nhảy trang, `Z`/`I`/`D`/`N`/`L`/`B`/`F`, `04:00`/`06:00`, `Auto Demo`, `offline-demo/server.mjs` + `.bat`/`.ps1`. |
| **G7** | **Playwright E2E đa màn hình & Kiểm tra thị giác** | **PASS** | `pnpm test`: `3/3 passed (39.8s)` qua `1920×1080`, `1366×768` (`prefers-reduced-motion: reduce`), `390×844`, `360×800`. Toàn bộ 18 tệp tải về đạt HTTP `200` và > 200 bytes. Đã kiểm tra ảnh chụp và tinh chỉnh `@media (max-width: 480px)` để thanh breadcrumb 4 sản phẩm không cắt chữ trên mobile. |
| **G8** | **Benchmark FPS, Thời gian tải & Walkthrough WebM** | **PASS** | Đo trên `dist/` (`vite preview :4175`): Normal Landing `40.87 fps`, Poster 03 `47.27 fps`, Lite Mode `60.06 fps`, Motion Off `60.14 fps`, Reduced Motion `60.95 fps`; Load FCP `1492 ms` (Normal) / `104 ms` (Reduced); WebM `1280×720` im lặng dài đầy đủ các chặng = `7.20 MB` (`< 8 MB`). |
| **G9** | **Triển khai GitHub Pages & Kiểm định 3 Site Live** | **PASS** | Push sạch lên `lovemvaf/cum1-nghiquyet57-tronbo4sanpham-2026` (không chứa tệp `> 30 MB`, loại trừ video `133.47 MB` và PPT `164.65 MB`), Actions run `45914410880` (`success`), `scripts/verify_all_three_sites.mjs` **PASS cả 3 URL live**. |

---

## 3. Chấm điểm sẵn sàng dự thi (Rubric 4 × 25 = 100 điểm)

> Đánh giá trung thực mức độ sẵn sàng của gói sản phẩm (có trừ nhẹ ở các phần nhóm cần tự điền thông tin định danh/bản quyền trước giờ thi chính thức):

1. **Nội dung & Độ chính xác văn kiện (`24 / 25`):**
   - Đối chiếu 100% Nghị quyết `57-NQ/TW` (`22/12/2024`, Bộ Chính trị), tách bạch văn bản Chính phủ (`03/NQ-CP`, `71/NQ-CP`), xử lý triệt để các claim chưa có minh chứng (`số hóa địa chỉ đỏ`, `media2.mp4`), đủ 7 nhiệm vụ & 5 câu hỏi phản biện. *(-1 điểm mở chờ nhóm chốt minh chứng thực địa nếu có hoặc giữ phương án đề xuất).*
2. **Kỹ thuật & Thẩm mỹ 04 sản phẩm (`24 / 25`):**
   - Video nén mượt `25.93 MB` giữ nguyên `101.45s` + 23 cue VTT + sửa lỗi dấu `NGỒI` giữ nguyên 100% người thật; 05 poster `1080×1350` sắc nét kèm SVG chỉnh sửa được + QR giải mã thật; Thuyết minh PDF `<= 03 trang`; Website mượt `40.87–60.95 fps` chạy được offline. *(-1 điểm chờ nhóm xác nhận nguồn bản quyền đoạn nhạc nền `01:15–01:20` và outro Gemini AI theo quy định Đề thi).*
3. **Tính đồng bộ & Trải nghiệm trình diễn 4 phút (`25 / 25`):**
   - Khớp nhịp `04:00` chuẩn (`101.45s` video + `116.3s` lời nói = `217.75s`, còn `22.25s` đệm), đồng bộ qua 4 nút breadcrumb, bảng `Lời nói 4p (N)` theo từng chặng, chế độ dự phòng `06:00 mở rộng`, `Phóng to (Z)` và `Auto Demo` có thể tạm dừng.
4. **Minh bạch hồ sơ & Sẵn sàng vận hành (`23 / 25`):**
   - Tài liệu đối soát xung đột (`CONTENT_CONFLICT_LOG.md`), sổ đăng ký phát ngôn (`CLAIMS_REGISTER.csv`), công bố AI minh bạch, giữ nguyên Huy hiệu Đoàn. *(-2 điểm tạm giữ vì `doiSo`, `diaBanCuThe`, `doiTruong`, `tên Fanpage` đang ở trạng thái `CHƯA XÁC NHẬN` chờ nhóm điền trước khi nộp/đăng).*

**Tổng điểm sẵn sàng: `96 / 100` (ĐẠT CHUẨN TRÌNH DIỄN & BẢO VỆ — chỉ cần nhóm điền 4 trường định danh + xác nhận bản quyền nhạc/AI trong `TEAM_REVIEW_REQUIRED.md`).**

---

## 4. Kết quả đo FPS & Tải trang (`qa/FPS_LOAD_BENCHMARK.json`)

| Chế độ đo (`dist/` · `vite preview :4175`) | FPS trung bình (2s rAF) | Số khung / Max Delta | FCP / Load Event |
|---|---:|---:|---|
| Normal — Stage 0 Landing | `40.87 fps` | `83` frames / `33.4 ms` | `1492 ms` / `1609.1 ms` |
| Normal — Stage 4 Poster 03 | `47.27 fps` | `95` frames / `33.4 ms` | — |
| Lite Mode (`KeyL`) — Stage 4 | `60.06 fps` | `121` frames / `16.8 ms` | — |
| Motion Off (`KeyB`) — Stage 4 | `60.14 fps` | `121` frames / `16.8 ms` | — |
| `prefers-reduced-motion: reduce` — Stage 0 | `60.95 fps` | `122` frames / `16.8 ms` | `104 ms` / `230.8 ms` |
