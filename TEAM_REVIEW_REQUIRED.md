# DANH MỤC CHỜ NHÓM XÁC NHẬN & PHÊ DUYỆT (`TEAM_REVIEW_REQUIRED.md`)

- **Dự án:** `cum1-nghiquyet57-tronbo4sanpham-2026` (*Nghị quyết 57 đến gần thanh niên Cụm 1 — Trọn bộ 04 sản phẩm*)
- **Trạng thái hồ sơ:** `DRAFT_PENDING_TEAM_DETAILS` (`CHO_NHOM_DUYET`)
- **Mốc thời gian:** Đề thi ghi hạn nộp **`21:00 ngày 26/11/2026`** và trình bày sáng **`27/11/2026`**. Bản dựng hiện tại ngày `27/11/2026` là gói hoàn thiện hậu kỳ & chuẩn bị thuyết trình/lưu trữ biên tập trung thực, không sửa giả dấu thời gian.

---

## 1. Các mục thông tin còn `CHƯA XÁC NHẬN` (Nhóm tự điền trước khi nộp/đăng)

| Hạng mục | Giá trị hiện tại | Lý do giữ trống / gắn cờ | Việc nhóm cần chốt |
|---|---|---|---|
| **Đội số (`doiSo`)** | `null` (`CHƯA XÁC NHẬN`) | Tên tệp gốc ghi `Doi1`, nhưng Phiếu đăng ký trong Đề thi và bảng Excel bỏ trống, không đủ căn cứ khẳng định số đội chính thức nếu chưa đối chiếu Tổ Thư ký. | Điền chính xác số đội trên Phiếu đăng ký & đặt tên thư mục nộp bài `Doi[số đội]_ChuDe1`. |
| **Địa bàn cụ thể (`diaBanCuThe`)** | `null` (`CHƯA XÁC NHẬN`) | Đã xác nhận phạm vi **Cụm 1**, chưa có tên xã/phường/chi đoàn cụ thể trong Đề thi hay Excel. | Chốt tên xã/phường/đơn vị cụ thể thuộc Cụm 1 trong Bài đăng & Thuyết minh trước khi phát hành. |
| **Đội trưởng & SĐT (`doiTruong`)** | `null` (`CHƯA XÁC NHẬN`) | Không có thông tin họ tên Đội trưởng và phân công tên từng thành viên trong bộ tệp đầu vào. | Điền họ tên Đội trưởng và tên thành viên phụ trách vào bảng phân công trong `THUYET_MINH_CUM1_CHUDE1.docx`. |
| **Kênh đăng & Ngày phát hành cụ thể** | `Kênh mạng xã hội chính thức của Đoàn cơ sở tại Cụm 1 (chờ nhóm xác nhận tên kênh)` · `17h30` (chưa có ngày lịch) | Bản Word gốc `3_BAI_DANG_GOC_DOI1.docx` chỉ ghi `17h30, ngày công bố sản phẩm truyền thông` và bỏ trống tên Fanpage. | Điền tên Fanpage chính thức của Đoàn cơ sở Cụm 1 và ngày đăng cụ thể (`dd/mm/2026`). |
| **Logo Hội Sinh viên Việt Nam** | `false` (`CHƯA CÓ FILE GỐC`) | Chỉ có tệp gốc Huy hiệu Đoàn TNCS Hồ Chí Minh (`huy-hieu-doan-original.jpg`); không tự vẽ lại hay lấy nguồn ngoài luồng. | Giữ nguyên chỉ hiển thị Huy hiệu Đoàn TNCS Hồ Chí Minh, hoặc bổ sung tệp vector/PNG chính thức nếu đơn vị yêu cầu. |

---

## 2. Các nội dung biên tập & bản quyền video cần nhóm rà soát (`CHO_NHOM_XAC_NHAN`)

1. **Bản quyền đoạn nhạc nền & đoạn outro AI trong video `1_Doi1_ChuDe1_GOC.mp4` (`101,45 s`):**
   - Trong khoảng **`01:15 – 01:20`** có đoạn nhạc bài hát nền (*"là lúc có chúng tôi..."*) và từ **`01:33 – 01:41.45`** là đoạn video minh họa tạo bằng **Gemini AI** (có dấu sao góc dưới phải).
   - Theo Đề thi Mục I & III (*"âm nhạc có bản quyền — dùng thư viện có bản quyền của CapCut, Canva hoặc tự sản xuất"*), nhóm cần **xác nhận rõ nguồn nhạc nền (thuộc kho nhạc miễn phí/CapCut hay tự thu) và xác nhận clip outro AI không chứa dữ liệu cá nhân hay gương mặt người thật chưa xin phép** trước khi phát sóng công khai.
2. **Duyệt câu chỉnh sửa thay thế đoạn *"số hóa các địa chỉ đỏ đã và đang được triển khai"* trong Bài đăng Mục 3:**
   - **Bản gốc (`3_BAI_DANG_GOC_DOI1.docx`, `P7`):** *"Tại Cụm 1, các công trình, phần việc thanh niên gắn với thực hiện Nghị quyết 57 đã và đang được triển khai, tiêu biểu là số hóa các địa chỉ đỏ trên địa bàn."* -> Gắn cờ `UNVERIFIED` trong `CLAIMS_REGISTER.csv` vì chưa có minh chứng.
   - **Đề xuất thay thế an toàn (`TEAM_PROPOSAL` trong `BAI_DANG_CUM1_HOAN_CHINH.docx`):** *"Cụm 1 đề xuất lồng ghép các phần việc thanh niên, như hỗ trợ kỹ năng số cho người dân và nghiên cứu phương án số hóa thông tin về các địa chỉ đỏ tại địa phương, trên cơ sở có tư liệu và quyền sử dụng phù hợp."*
   - **Yêu cầu:** Nếu Cụm 1 thực sự có công trình số hóa địa chỉ đỏ đã nghiệm thu kèm hình ảnh/đường dẫn chứng minh, nhóm bổ sung minh chứng vào hồ sơ; nếu chưa, giữ nguyên câu `TEAM_PROPOSAL` đã sửa.
3. **Lưu ý lời thoại `00:35–00:42` trong video gốc & slide 6 PPT gốc (`media2.mp4`):**
   - Trong video gốc không cắt sửa, bạn nữ áo đen nói *"Nghị quyết số 57 của Đảng và Nhà nước"* -> đã được đính chính chuẩn xác thành **Bộ Chính trị ban hành ngày `22/12/2024`** trên Poster 01–03, Thuyết minh, Bài đăng và Website.
   - Slide 6 trong `PPT_GOC_THAM_KHAO.pptx` (`media2.mp4`, `24,04s`) dùng thì quá khứ *"đã tích cực ứng dụng..."* mà chưa có hồ sơ xác nhận ảnh ghép -> không dùng thay thế Thuyết minh 03 trang chính thức.
4. **Xác nhận bộ 05 ảnh minh họa 2D & ảnh bìa video đã sửa lỗi chính tả:**
   - Ảnh bìa mới `thumbnail-chu-dung.png` (`941×1672`) và `thumbnail-chu-dung-1080x1920.png` sửa lỗi `NGỒ̀I` thành `NGỒI` bằng Unicode thuần mà không chạm vào pixel người thật ở phần dưới ảnh.
   - Bộ 05 poster `01.png`..`05.png` (`1080 × 1350 px`) dùng tranh 2D minh họa giả lập có hỗ trợ AI (đã công bố minh bạch trên web và Thuyết minh).
