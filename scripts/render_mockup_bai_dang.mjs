/**
 * Render editorial social post preview card MOCKUP_BAI_DANG.png (1200x1500 sRGB PNG)
 * using real Đoàn emblem, fixed thumbnail-chu-dung.png, revised clean copy, CTA & hashtags.
 * ZERO fake Facebook/Zalo logos, ZERO blue verified ticks, ZERO fake engagement counts or dates.
 */
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from '@playwright/test';

const ROOT = 'c:/Users/asus/Desktop/Netvetrian_QKD_KhoaCNTT-DNTU/cum1-nghiquyet57-tronbo4sanpham-2026';
const EMBLEM_PATH = path.join(ROOT, 'deliverables/02_ThietKe/identity/derived/huy-hieu-doan-clean.png');
const THUMB_PATH = path.join(ROOT, 'deliverables/01_Video/thumbnail-chu-dung.png');
const POSTER_01_PATH = path.join(ROOT, 'deliverables/02_ThietKe/01_dat_cau_hoi_1080x1350.png');
const POSTER_03_PATH = path.join(ROOT, 'deliverables/02_ThietKe/03_muc_tieu_2030_tam_nhin_2045_1080x1350.png');
const POSTER_05_PATH = path.join(ROOT, 'deliverables/02_ThietKe/05_lan_toa_1080x1350.png');

const FONT_400 = path.join(ROOT, 'node_modules/@fontsource/be-vietnam-pro/files/be-vietnam-pro-vietnamese-400-normal.woff2');
const FONT_600 = path.join(ROOT, 'node_modules/@fontsource/be-vietnam-pro/files/be-vietnam-pro-vietnamese-600-normal.woff2');
const FONT_700 = path.join(ROOT, 'node_modules/@fontsource/be-vietnam-pro/files/be-vietnam-pro-vietnamese-700-normal.woff2');
const FONT_800 = path.join(ROOT, 'node_modules/@fontsource/be-vietnam-pro/files/be-vietnam-pro-vietnamese-800-normal.woff2');

const OUT_PRIMARY = path.join(ROOT, 'deliverables/03_BaiDang/MOCKUP_BAI_DANG.png');
const OUT_DOWNLOADS = path.join(ROOT, 'public/assets/downloads/MOCKUP_BAI_DANG.png');

function toDataUri(filePath, mime) {
  const buf = fs.readFileSync(filePath);
  return `data:${mime};base64,${buf.toString('base64')}`;
}

const html = `<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8" />
<style>
  @font-face { font-family: 'Be Vietnam Pro'; font-weight: 400; src: url('${toDataUri(FONT_400, 'font/woff2')}') format('woff2'); }
  @font-face { font-family: 'Be Vietnam Pro'; font-weight: 600; src: url('${toDataUri(FONT_600, 'font/woff2')}') format('woff2'); }
  @font-face { font-family: 'Be Vietnam Pro'; font-weight: 700; src: url('${toDataUri(FONT_700, 'font/woff2')}') format('woff2'); }
  @font-face { font-family: 'Be Vietnam Pro'; font-weight: 800; src: url('${toDataUri(FONT_800, 'font/woff2')}') format('woff2'); }

  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 1200px;
    height: 1500px;
    background: linear-gradient(155deg, #F7F3E8 0%, #EDF3FA 55%, #F7F3E8 100%);
    font-family: 'Be Vietnam Pro', sans-serif;
    color: #0D2B52;
    padding: 40px 44px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .top-ribbon {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 18px;
    border-bottom: 3px solid #1464B4;
  }
  .top-left {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .top-left img {
    width: 58px;
    height: 64px;
    object-fit: contain;
  }
  .kicker {
    font-size: 15px;
    font-weight: 800;
    letter-spacing: 0.08em;
    color: #1464B4;
    text-transform: uppercase;
  }
  .doc-title {
    font-size: 24px;
    font-weight: 800;
    color: #0D2B52;
    margin-top: 2px;
  }
  .status-pill {
    background: #0D2B52;
    color: #F0C14B;
    font-size: 14px;
    font-weight: 700;
    padding: 10px 18px;
    border-radius: 999px;
    letter-spacing: 0.03em;
  }

  .card {
    background: #FFFFFF;
    border: 2px solid #D8E3F0;
    border-radius: 24px;
    box-shadow: 0 20px 50px rgba(13, 43, 82, 0.10);
    padding: 28px 32px;
    display: grid;
    grid-template-columns: 1.08fr 0.92fr;
    gap: 28px;
    flex: 1;
    margin: 22px 0;
  }

  .copy-col {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .channel-bar {
    display: flex;
    align-items: center;
    gap: 14px;
    padding-bottom: 16px;
    border-bottom: 1.5px solid #E5EDF6;
  }
  .channel-bar img {
    width: 48px;
    height: 53px;
    object-fit: contain;
  }
  .channel-name {
    font-size: 17px;
    font-weight: 800;
    color: #0D2B52;
  }
  .channel-meta {
    font-size: 13.5px;
    font-weight: 600;
    color: #475569;
    margin-top: 3px;
  }

  .post-headline {
    font-size: 26px;
    font-weight: 800;
    color: #0D2B52;
    line-height: 1.28;
    margin-top: 16px;
  }

  .post-body {
    margin-top: 14px;
    display: flex;
    flex-direction: column;
    gap: 11px;
    font-size: 15.2px;
    line-height: 1.54;
    color: #1E293B;
  }
  .proposal-highlight {
    background: #FFFBEB;
    border-left: 4px solid #D62828;
    padding: 10px 14px;
    border-radius: 0 10px 10px 0;
    color: #0F172A;
  }
  .proposal-tag {
    display: inline-block;
    font-size: 11.5px;
    font-weight: 800;
    color: #B91C1C;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    margin-bottom: 3px;
  }

  .cta-box {
    margin-top: 14px;
    background: #EFF6FF;
    border: 1.5px solid #BFDBFE;
    border-radius: 14px;
    padding: 13px 16px;
    font-size: 14.5px;
    line-height: 1.48;
    color: #0D2B52;
    font-weight: 600;
  }

  .slogan {
    margin-top: 14px;
    font-size: 15px;
    font-weight: 800;
    color: #D62828;
    letter-spacing: 0.02em;
  }
  .hashtags {
    margin-top: 8px;
    font-size: 14.5px;
    font-weight: 700;
    color: #1464B4;
    line-height: 1.45;
  }

  .source-strip {
    margin-top: 14px;
    padding-top: 12px;
    border-top: 1.5px solid #E5EDF6;
    font-size: 12.8px;
    color: #475569;
    line-height: 1.45;
  }

  .media-col {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .video-frame {
    position: relative;
    border-radius: 18px;
    overflow: hidden;
    border: 2px solid #0D2B52;
    background: #0D2B52;
    height: 755px;
  }
  .video-frame img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center top;
    display: block;
  }
  .video-badge {
    position: absolute;
    bottom: 14px;
    left: 14px;
    right: 14px;
    background: rgba(13, 43, 82, 0.90);
    color: #FFFFFF;
    padding: 10px 14px;
    border-radius: 12px;
    font-size: 13.5px;
    font-weight: 700;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid rgba(240, 193, 75, 0.65);
  }
  .video-badge span.dur {
    color: #F0C14B;
    font-weight: 800;
  }

  .posters-strip-label {
    font-size: 13px;
    font-weight: 800;
    color: #0D2B52;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  .posters-strip {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    align-items: start;
  }
  .posters-strip img {
    width: 100%;
    aspect-ratio: 4 / 5;
    height: auto;
    object-fit: contain;
    background: #F7F3E8;
    border-radius: 10px;
    border: 1.5px solid #CBD5E1;
    display: block;
  }

  .footer-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13.5px;
    color: #475569;
    font-weight: 600;
  }
  .footer-bar strong {
    color: #0D2B52;
  }
</style>
</head>
<body>
  <div class="top-ribbon">
    <div class="top-left">
      <img src="${toDataUri(EMBLEM_PATH, 'image/png')}" alt="Huy hiệu Đoàn TNCS Hồ Chí Minh" />
      <div>
        <div class="kicker">MỤC 3 · BẢN XEM TRƯỚC BÀI ĐĂNG TRUYỀN THÔNG · CỤM 1</div>
        <div class="doc-title">Trại Thanh niên số thành phố Đồng Nai 2026 · Chủ đề 1</div>
      </div>
    </div>
    <div class="status-pill">CHỜ NHÓM CHỐT KÊNH &amp; NGÀY ĐĂNG</div>
  </div>

  <div class="card">
    <div class="copy-col">
      <div>
        <div class="channel-bar">
          <img src="${toDataUri(EMBLEM_PATH, 'image/png')}" alt="Huy hiệu Đoàn" />
          <div>
            <div class="channel-name">Kênh truyền thông Đoàn cơ sở Cụm 1 (chờ xác nhận tên kênh)</div>
            <div class="channel-meta">Giờ đăng dự kiến: 17h30, ngày công bố sản phẩm (ngày cụ thể chờ nhóm chốt)</div>
          </div>
        </div>

        <h1 class="post-headline">Chuyển đổi số – Bắt đầu từ chính mình</h1>

        <div class="post-body">
          <p>Bạn có thể sử dụng điện thoại mỗi ngày, nhưng đã bao giờ tự hỏi mình thực sự làm chủ công nghệ chưa?</p>
          <p>Từ dịch vụ công trực tuyến, ứng dụng trí tuệ nhân tạo trong học tập và công việc đến nhận diện tin giả, bảo vệ dữ liệu cá nhân, chuyển đổi số hiện diện ngay trong sinh hoạt hằng ngày.</p>
          <p>Hưởng ứng <strong>Nghị quyết 57-NQ/TW</strong> (22/12/2024, Bộ Chính trị) về đột phá khoa học, công nghệ, đổi mới sáng tạo và chuyển đổi số quốc gia, mỗi đoàn viên cần chủ động nâng cao kỹ năng số, ứng dụng an toàn và lan tỏa tiện ích số đến cộng đồng.</p>
          <div class="proposal-highlight">
            <div class="proposal-tag">Đề xuất chỉnh câu chờ nhóm duyệt (an toàn minh chứng)</div>
            Cụm 1 đề xuất lồng ghép các phần việc thanh niên, như hỗ trợ kỹ năng số cho người dân và nghiên cứu phương án số hóa thông tin về các địa chỉ đỏ tại địa phương, trên cơ sở có tư liệu và quyền sử dụng phù hợp.
          </div>
        </div>

        <div class="cta-box">
          Hãy bắt đầu từ một việc nhỏ: học thêm một kỹ năng số, kiểm chứng thông tin hoặc hướng dẫn người thân dùng dịch vụ công trực tuyến. Xem trọn video và bộ 05 ấn phẩm đính kèm để chọn ngay hành động hôm nay!
        </div>

        <div class="slogan">THANH NIÊN TIÊN PHONG – LÀM CHỦ CÔNG NGHỆ – KIẾN TẠO TƯƠNG LAI</div>
        <div class="hashtags">#TraiThanhNienSo #NghiQuyet57 #ChuyenDoiSo #TuoiTreTienPhong #ThanhNienSo #Cum1</div>
      </div>

      <div class="source-strip">
        <strong>Nguồn chính thống:</strong> xaydungchinhsach.chinhphu.vn · Đối chiếu: mst.gov.vn<br/>
        <strong>Ấn phẩm đi kèm:</strong> 01 video 9:16 (1 phút 41 giây, kèm phụ đề .vtt) + Bộ 05 ấn phẩm (1080 × 1350 px).
      </div>
    </div>

    <div class="media-col">
      <div class="video-frame">
        <img src="${toDataUri(THUMB_PATH, 'image/png')}" alt="Ảnh bìa video tuyên truyền Cụm 1" />
        <div class="video-badge">
          <span>VIDEO TUYÊN TRUYỀN 9:16 · CÓ PHỤ ĐỀ .VTT</span>
          <span class="dur">01:41</span>
        </div>
      </div>
      <div class="posters-strip-label">Đính kèm bộ 05 ấn phẩm Lạc Hồng Số (1080 × 1350 px)</div>
      <div class="posters-strip">
        <img src="${toDataUri(POSTER_01_PATH, 'image/png')}" alt="Ấn phẩm 01/05" />
        <img src="${toDataUri(POSTER_03_PATH, 'image/png')}" alt="Ấn phẩm 03/05" />
        <img src="${toDataUri(POSTER_05_PATH, 'image/png')}" alt="Ấn phẩm 05/05" />
      </div>
    </div>
  </div>

  <div class="footer-bar">
    <span><strong>Ghi chú minh bạch:</strong> Bản xem trước biên tập (không mô phỏng giao diện nền tảng mạng xã hội bên thứ ba).</span>
    <span>Nghị quyết 57-NQ/TW · Cụm 1 (2026)</span>
  </div>
</body>
</html>`;

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 1500 }, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  fs.mkdirSync(path.dirname(OUT_PRIMARY), { recursive: true });
  fs.mkdirSync(path.dirname(OUT_DOWNLOADS), { recursive: true });
  await page.screenshot({ path: OUT_PRIMARY, type: 'png' });
  fs.copyFileSync(OUT_PRIMARY, OUT_DOWNLOADS);
  await browser.close();
  console.log(JSON.stringify({ ok: true, out: [OUT_PRIMARY, OUT_DOWNLOADS], bytes: fs.statSync(OUT_PRIMARY).size }));
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
