# LẠC HỒNG SỐ — TRỌN BỘ 04 SẢN PHẨM CỤM 1 (NGHỊ QUYẾT 57-NQ/TW)

**Chủ đề:** *Nghị quyết 57 đến gần thanh niên Cụm 1 — Trọn bộ 04 sản phẩm & trình diễn 04 phút*  
**Cuộc thi:** Trại Thanh niên số thành phố Đồng Nai năm 2026 · Vòng thực chiến  
**Website trình chiếu trực tuyến:** https://lovemvaf.github.io/cum1-nghiquyet57-tronbo4sanpham-2026/  
**Kho mã nguồn:** https://github.com/lovemvaf/cum1-nghiquyet57-tronbo4sanpham-2026

---

## 1. Cấu trúc trọn bộ 04 sản phẩm bàn giao (`deliverables/`)

| Mục | Sản phẩm | Tệp chính bàn giao | Ghi chú kiểm chứng |
|---:|---|---|---|
| **01** | **Video tuyên truyền 9:16** | `deliverables/01_Video/video-web-optimized.mp4` (`25.93 MB`, `720×1280`, `101.448s`), `subtitles_vi.vtt` (`23` cue), `thumbnail-chu-dung-1080x1920.png` *(bản gốc `1_Doi1_ChuDe1_GOC.mp4` `133.47 MB` giữ trên máy, gitignore)* | Giữ nguyên 100% khung hình & âm thanh gốc (`0.000s` sai lệch); đã sửa lỗi dấu `NGỒ̀I` -> `NGỒI` trên ảnh bìa mà giữ nguyên người thật; có cờ `CHO_NHOM_XAC_NHAN` bản quyền nhạc nền (`01:15–01:20`) & outro Gemini AI (`01:33–01:41.45`). |
| **02** | **Bộ 05 ấn phẩm thiết kế** | `deliverables/02_ThietKe/01_dat_cau_hoi_1080x1350.png` → `05_lan_toa_1080x1350.png` (kèm alias `01.png`..`05.png`, `editable/01.svg`..`05.svg`, `CONTACT_SHEET.png`) | Chuẩn `1080 × 1350 px` RGB; giữ nguyên Huy hiệu Đoàn `huy-hieu-doan-clean.png`; `05.png` có mã QR thật dẫn thẳng `xaydungchinhsach.chinhphu.vn`. |
| **03** | **Bài đăng mạng xã hội** | `deliverables/03_BaiDang/BAI_DANG_CUM1_HOAN_CHINH.docx` + `MOCKUP_BAI_DANG.png` *(kèm bản gốc `3_BAI_DANG_GOC_DOI1.docx` đối chiếu)* | Gỡ dấu chấm thừa `#Cum1`, chuyển câu *"số hóa địa chỉ đỏ đã và đang triển khai"* sang đề xuất an toàn `TEAM_PROPOSAL`, ghi rõ video `1 phút 41 giây` + 05 poster + hẹn `17h30` chờ chốt kênh/ngày. |
| **04** | **Thuyết minh & Lời nói** | `deliverables/04_ThuyetMinh/THUYET_MINH_CUM1_CHUDE1.pdf` (`<= 03` trang A4) & `.docx` + `deliverables/05_LoiNoi_HoTro/LOI_THUYET_TRINH_04_PHUT_CUM1_NQ57.docx` | Thuyết minh gói gọn đúng `<= 03` trang; lời thuyết trình `444` từ (`116.3s`) + video (`101.45s`) = `217.75s` (còn `22.25s` đệm trong 4 phút). |

---

## 2. Hướng dẫn trình chiếu trên sân khấu (Online & Offline)

### Cách A — Trình chiếu trực tuyến (có Internet)
Mở trình duyệt Chrome/Edge tới:  
`https://lovemvaf.github.io/cum1-nghiquyet57-tronbo4sanpham-2026/`  
Nhấn phím **`F`** để bật toàn màn hình.

### Cách B — Trình chiếu Offline 100% (không cần Internet)
1. Nhấp đúp tệp **`offline-demo/run-offline.bat`** *(hoặc chạy `offline-demo/run-offline.ps1`)*.
2. Trình duyệt sẽ tự mở `http://127.0.0.1:4175/cum1-nghiquyet57-tronbo4sanpham-2026/` phục vụ từ `dist/` với đầy đủ font, video, phụ đề `.vtt`, 05 poster, QR SVG và toàn bộ tệp tải về.

### Phím tắt điều khiển cho người thuyết trình
- **`ArrowRight` / `ArrowLeft`**: Tiến / lùi giữa 10 chặng (`Mở đầu` → `Video` → `01/05..05/05` → `Bài đăng` → `Thuyết minh` → `Tổng kết`).
- **`Space`**: Tại màn hình **Video** dùng để **Phát / Tạm dừng** video (tuyệt đối không nhảy nhầm sang slide kế); ở các chặng khác chuyển tiếp.
- **`N`**: Mở/đóng thẻ **Lời nói 04 phút đồng bộ theo chặng** (bật chip góc phải trên nếu cần chuyển sang gợi ý **`06:00 mở rộng`**).
- **`Z`**: Phóng to sắc nét poster hiện tại (`‹`/`›` lướt 05 poster, `Esc` đóng).
- **`I`**: Mở bảng tra cứu nhanh **7 nhóm nhiệm vụ, 5 câu hỏi phản biện & Nguồn chính thống**.
- **`D`**: Mở **Kho tải trọn bộ 04 sản phẩm**.
- **`L` / `B`**: Bật **Chế độ nhẹ** / **Tắt nền động** nếu máy chiếu cấu hình thấp.

---

## 3. Việc nhóm cần rà soát trước khi nộp / phát hành (`TEAM_REVIEW_REQUIRED.md`)

1. Điền **`Đội số`**, **`Địa bàn xã/phường cụ thể thuộc Cụm 1`**, **`Họ tên Đội trưởng & phân công nhân sự`** vào `THUYET_MINH_CUM1_CHUDE1.docx`.
2. Điền **tên Fanpage chính thức của Đoàn cơ sở** và **ngày đăng cụ thể** trong `BAI_DANG_CUM1_HOAN_CHINH.docx`, đồng thời duyệt giữ phương án đề xuất *"nghiên cứu số hóa địa chỉ đỏ khi có tư liệu và quyền sử dụng phù hợp"* (hoặc bổ sung minh chứng nếu đã triển khai).
3. Xác nhận **nguồn nhạc nền (`01:15–01:20`)** và **cảnh minh họa Gemini AI (`01:33–01:41.45`)** trong video gốc `1_Doi1_ChuDe1_GOC.mp4`.

---

## 4. Lệnh kiểm thử & Build lại từ nguồn

```bash
npm install
npm run qa:media-posters   # 72 checks (Video, VTT, Thumbnail, 05 Posters, SVGs, jsQR)
pnpm run build             # Build production bundle vao dist/
pnpm test                  # Playwright E2E (1920x1080, 1366x768, 390x844, 360x800)
```
