# BÁO CÁO KIỂM ĐỊNH ĐỒNG THỜI 03 WEBSITE LIVE (`VERIFY_BOTH_LEGACY_SITES.md`)

- **Ngày kiểm định:** `27/11/2026`
- **Kịch bản chạy:** `node scripts/verify_all_three_sites.mjs` (Playwright Chromium headless, viewport `1920×1080`, bypass cache `?v=<timestamp>`)
- **Kết quả chung:** **PASS 3 / 3 WEBSITE LIVE** — Hai kho lưu trữ cũ giữ nguyên trạng `100%`, không bị ghi đè hay chỉnh sửa tệp nào.

---

## 1. Bảng đối chiếu 03 Kho lưu trữ & 03 Live URLs

| Dự án | Đường dẫn cục bộ | Git Branch & Commit SHA | Live GitHub Pages URL | HTTP & Kết quả DOM Live |
|---|---|---|---|---|
| **1. V3 Trọn bộ 04 sản phẩm (MỚI)** | `./` (`cum1-nghiquyet57-tronbo4sanpham-2026/`) | `main` · `e8ea6e2` *(deploy run `45914410880`)* | `https://lovemvaf.github.io/cum1-nghiquyet57-tronbo4sanpham-2026/` | **HTTP 200 · PASS:** Video `101.45s` + thumb `1080×1920` + VTT; 5 poster `1080×1350`; Stage 4 `2030/2045`; Social card; Thuyết minh 4 thẻ + PDF `249,307 B` HTTP 200; Finale QR SVG + `chinhphu.vn` + `mst.gov.vn`; 0 console/404/20-11/debug. |
| **2. Legacy V2 — Lạc Hồng Số (05 Poster)** | `../lac-hong-so-nghiquyet57-cum1/` | `main` · `9271d6798af80382307082578b9a961289499ebb` (`9271d67`) | `https://lovemvaf.github.io/lac-hong-so-nghiquyet57-cum1/` | **HTTP 200 · PASS:** Landing hiển thị đủ 5 poster `01_dat_cau_hoi..05_lan_toa`; Stage 3 hiển thị poster `1080×1350` cùng khối `2030` & `2045` nguyên vẹn. `git status` sạch, `0` thay đổi. |
| **3. Legacy V10 — Nét vẽ tri ân (20/11)** | `../` (`Netvetrian_QKD_KhoaCNTT-DNTU/`) | `main` · `f0138b6fec60f6f48761fccb2778be2a5d3c153d` (`f0138b6`) | `https://lovemvaf.github.io/net-ve-tri-an-dntu-2026/` | **HTTP 200 · PASS:** Giữ nguyên chủ đề `Nét Vẽ Tri Ân — Một Dòng Code, Vạn Chân Trời \| Khoa CNTT – DNTU 20/11`, ảnh poster `1500×2667` tải đầy đủ, không bị ghi đè bởi Lạc Hồng Số. Commit `f0138b6` giữ nguyên không sửa đổi. |

---

## 2. Ảnh chụp màn hình kiểm chứng trực tiếp trên Live URLs (`qa/SCREENSHOTS/`)

- **Site V3 (Mới):**
  - `qa/SCREENSHOTS/live_v3_landing.png` — Trang mở đầu 04 sản phẩm + Huy hiệu Đoàn
  - `qa/SCREENSHOTS/live_v3_video.png` — Mục 1 Video `101,45s` + Thumbnail đã sửa dấu `NGỒI` + Nhật ký thoại
  - `qa/SCREENSHOTS/live_v3_poster03.png` — Mục 2 Ấn phẩm `03/05` (`2030 → 2045`)
  - `qa/SCREENSHOTS/live_v3_social.png` — Mục 3 Bài đăng MXH & Đối chiếu kiểm chứng
  - `qa/SCREENSHOTS/live_v3_thuyet_minh.png` — Mục 4 Thuyết minh 4 thẻ + PDF/DOCX/Lời nói 04p
  - `qa/SCREENSHOTS/live_v3_finale.png` — Tổng kết + QR SVG + 2 link chính thống
- **Site Legacy V2:**
  - `qa/SCREENSHOTS/live_v2_lhs_landing.png`
  - `qa/SCREENSHOTS/live_v2_lhs_scene03.png`
- **Site Legacy V10:**
  - `qa/SCREENSHOTS/live_v10_netvetrian.png`
