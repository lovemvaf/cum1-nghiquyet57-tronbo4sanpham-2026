# NGUỒN TƯ LIỆU, BẢN QUYỀN & MINH BẠCH AI (`content/CONTENT_SOURCE_NOTES.md`)

- **Dự án:** `cum1-nghiquyet57-tronbo4sanpham-2026`
- **Ngày kiểm chứng nguồn trực tuyến & tệp cục bộ:** `27/11/2026`

---

## 1. Hệ thống nguồn chính thống của Nghị quyết 57-NQ/TW & Văn bản liên quan

| Văn bản | Cơ quan & Ngày ban hành | Đường dẫn chính thức | Trạng thái & Vai trò |
|---|---|---|---|
| **Nghị quyết số `57-NQ/TW`** | **Bộ Chính trị** (`22/12/2024`) | `https://xaydungchinhsach.chinhphu.vn/toan-van-nghi-quyet-ve-dot-pha-phat-trien-khoa-hoc-cong-nghe-doi-moi-sang-tao-va-chuyen-doi-so-quoc-gia-119241224180048642.htm` | **Nguồn chính (`officialResolutionUrl`) & đích mã QR trên Poster 05 / Finale Web.** (HTTP 200). |
| **Nghị quyết số `57-NQ/TW`** *(Bản đối chiếu)* | **Bộ Chính trị** (`22/12/2024`) | `https://mst.gov.vn/toan-van-nghi-quyet-57-nq-tw-ve-dot-pha-phat-trien-khoa-hoc-cong-nghe-doi-moi-sang-tao-va-chuyen-doi-so-quoc-gia-197250813164610621.htm` | **Nguồn đối chiếu phụ (`secondaryOfficialUrl`)** trên Cổng TTĐT Bộ KH&CN (HTTP 200). |
| **Nghị quyết số `03/NQ-CP`** | **Chính phủ** (`09/01/2025`) | `https://vanban.chinhphu.vn/?docid=212350&pageid=27160` | Văn bản **Chương trình hành động của Chính phủ** — tách biệt hoàn toàn khỏi văn kiện `57-NQ/TW`, chỉ dùng tham khảo khi trả lời phản biện. |
| **Nghị quyết số `71/NQ-CP`** | **Chính phủ** (`01/04/2025`) | `https://chinhphu.vn/?classid=0&docid=213308&pageid=27160` | Văn bản **sửa đổi, bổ sung cập nhật Chương trình hành động của Chính phủ** — tách biệt hoàn toàn khỏi `57-NQ/TW`. |
| **PDF Tư liệu Văn kiện ĐCSVN** | `tulieuvankien.dangcongsan.vn` | `https://tulieuvankien.dangcongsan.vn/Uploads/2024/12/7/27/NQ-57-TW.pdf` | Không khả dụng trực tiếp khi kiểm tra (`WinError 10061`) -> **không dùng** làm đích mã QR. |

---

## 2. Tư liệu cuộc thi & Tài nguyên nhận diện

1. **Đề thi chính thức:** `c:\Users\asus\Downloads\DeThi_VongThucChien_TraiThanhNienSo2026_v2_BanIn.docx` (quy định 04 sản phẩm, 04 tiêu chí chấm = 100 điểm, nguyên tắc minh bạch AI và bản quyền).
2. **Kịch bản & đề xuất nội bộ:** `c:\Users\asus\Downloads\TRẠI THANH NIÊN SỐ (1).xlsx` (3 sheet: `'SCRIPT, NỘI DUNG '`, `'STUDY'`, `'THUYẾT TRÌNH'`).
3. **Tài nguyên nhận diện tổ chức:**
   - **Huy hiệu Đoàn TNCS Hồ Chí Minh:** Sử dụng bản tách nền sạch `huy-hieu-doan-clean.png` (`941 × 1042 px`, RGBA, SHA-256 `a6f768702ee40feda5ace6360cfcf036523a2708b972c9cfa3138a86c1d92078`) từ tệp gốc `huy-hieu-doan-original.jpg` (`925 × 1024 px`). Tệp phụ `huy-hieu-doan-user-png.png` (`250 × 275 px`) được giữ lưu trữ đối chiếu.
   - **Logo Hội Sinh viên Việt Nam:** Chưa có tệp nguồn trong bộ tài liệu gốc -> giữ trạng thái `false` (`null`), không tự vẽ lại hay gắn logo không rõ nguồn gốc.

---

## 3. Minh bạch AI, Mã nguồn mở & Bản quyền Media

- **Minh họa 2D bán hiện thực (`01_lhs_raw.png`..`05_lhs_raw.png`, `03_vision_2030_2045_raw.png`):** Thực hiện với sự hỗ trợ của công cụ AI cho kịch bản giả lập truyền thông, không sao chép mặt/giọng người thật, không đưa dữ liệu cá nhân thật vào công cụ AI công cộng.
- **Chính tả & QR:** Toàn bộ chữ trên poster, thumbnail sửa lỗi và tài liệu dùng font thuần Unicode **Be Vietnam Pro** (`OFL-1.1`) và **Times New Roman**; mã QR sinh trực tiếp bằng thư viện **`qrcode` (MIT)** và kiểm chứng giải mã pixel bằng **`jsqr` (Apache-2.0)**.
- **Thư viện trình chiếu web:** `reveal.js` (MIT), `vite` (MIT), `gsap` (Standard No-Charge License), `@playwright/test` (Apache-2.0) — toàn bộ các gói copyleft hoặc hạn chế (`fullPage.js` GPL-3.0, `react-bits` Commons Clause, `remotion`, `LiquidDistortion`, `murmurations`) đều bị loại trừ (xem chi tiết tại [INPUT_AUDIT.md](../INPUT_AUDIT.md)).
- **Âm nhạc & clip AI trong Video gốc:** Ghi nhận trung thực trạng thái `CHO_NHOM_XAC_NHAN` đối với đoạn nhạc nền (`01:15–01:20`) và đoạn outro Gemini AI (`01:33–01:41.45`) của tệp `1_Doi1_ChuDe1_GOC.mp4`.
