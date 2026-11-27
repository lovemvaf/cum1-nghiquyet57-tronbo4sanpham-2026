# HƯỚNG DẪN TRÌNH CHIẾU OFFLINE KHÔNG CẦN INTERNET (`docs/HUONG_DAN_TRINH_CHIEU_OFFLINE.md`)

Tài liệu này hướng dẫn đội thi **Cụm 1** vận hành trọn vẹn bộ 04 sản phẩm **LẠC HỒNG SỐ** trên sân khấu hoặc phòng thi **kể cả khi mất Wi-Fi / không có Internet**.

---

## 1. Chuẩn bị trước giờ lên sân khấu (khuyến nghị làm trước 30 phút)

1. Mở thư mục dự án `cum1-nghiquyet57-tronbo4sanpham-2026/`.
2. Chạy `pnpm run build` (hoặc kiểm tra thư mục `dist/` đã có sẵn `index.html`, `assets/`, và toàn bộ Video + 05 Poster + File Word/PDF).
3. Kiểm tra nhanh **4 tệp dự phòng độc lập** trong `deliverables/`:
   - `deliverables/01_Video/1_Doi1_ChuDe1_GOC.mp4` (hoặc `video-web-optimized.mp4`) + `subtitles_vi.vtt`
   - `deliverables/02_ThietKe/01_dat_cau_hoi_1080x1350.png` → `05_lan_toa_1080x1350.png`
   - `deliverables/03_BaiDang/BAI_DANG_CUM1_HOAN_CHINH.docx` + `MOCKUP_BAI_DANG.png`
   - `deliverables/04_ThuyetMinh/THUYET_MINH_CUM1_CHUDE1.pdf` (`<= 03 trang`)

---

## 2. Cách bật trình chiếu Offline bằng 01 cú nhấp chuột

- **Cách 1 (Khuyên dùng trên Windows):** Nhấp đúp chuột vào tệp:
  `offline-demo/run-offline.bat`
  *(hoặc chạy chuột phải → Run with PowerShell vào `offline-demo/run-offline.ps1`)*.
- Máy chủ nội bộ (`offline-demo/server.mjs`) sẽ khởi chạy tại `http://127.0.0.1:4175/cum1-nghiquyet57-tronbo4sanpham-2026/` và **tự động mở trình duyệt** (Chrome/Edge).
- Toàn bộ font chữ (`Be Vietnam Pro`), Video `9:16`, phụ đề `.vtt`, 05 poster PNG, mã QR SVG, hiệu ứng Canvas và các tệp tải Word/PDF đều nằm sẵn trong `dist/` — **không gọi bất kỳ CDN hay Google Fonts nào ngoài Internet**.

---

## 3. Phím tắt điều khiển cho người trình bày (Nhịp 04:00 chuẩn)

| Phím | Tác dụng |
|---|---|
| **`ArrowRight` / nút `Tiếp ›`** | Chuyển sang màn hình kế tiếp (`Mở đầu` → `Video` → `01/05..05/05` → `Bài đăng` → `Thuyết minh` → `Tổng kết`) |
| **`ArrowLeft` / nút `‹ Lùi`** | Quay lại màn hình trước |
| **`Space`** | Tại màn hình **Video**: **Phát / Tạm dừng** video (không nhảy nhầm sang trang sau); tại các màn hình khác: chuyển tiếp |
| **`Z`** | Phóng to sắc nét poster đang xem (bấm `‹`/`›` để lướt cả 05 poster, `Esc` để đóng) |
| **`N`** | Mở/đóng bảng **Lời nói 04 phút đồng bộ theo chặng** (kèm gợi ý `06:00 mở rộng` nếu bật chip ở góc phải trên) |
| **`I`** | Mở hộp thoại **7 nhiệm vụ, 5 câu hỏi phản biện & Nguồn chính thống** |
| **`D`** | Mở **Kho tải trọn bộ 04 sản phẩm** |
| **`L` / `B`** | Bật **Chế độ nhẹ (`L`)** hoặc **Tắt hẳn nền động (`B`)** nếu máy chiếu/laptop yếu |
| **`F`** | Bật / tắt **Toàn màn hình (Fullscreen)** khi lên sân khấu |

---

## 4. Lưu ý khi mất mạng hoàn toàn trong lúc phản biện

- **Mã QR ở Tổng kết (`Stage 9`):** Đã được render thành SVG trực tiếp trên màn hình, Ban Giám khảo có thể dùng điện thoại (4G/5G cá nhân) quét ngay để mở `xaydungchinhsach.chinhphu.vn`.
- **Liên kết ngoài (`chinhphu.vn`, `mst.gov.vn`):** Nếu laptop trình chiếu không có mạng, không cần bấm mở tab trình duyệt ngoài; mở sẵn mục **`Nguồn & 7NV (I)`** ngay trên web để đối chiếu trực tiếp 5 quan điểm, mục tiêu 2030–2045, 7 nhiệm vụ và 5 câu hỏi đánh giá.
