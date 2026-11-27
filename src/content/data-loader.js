/**
 * LẠC HỒNG SỐ — Single Source of Truth Data Loader (V3 Editorial Flagship)
 * Imports directly from ./content-master.json and normalizes all asset paths
 * to relative `./assets/...` so GitHub Pages subpath, localhost, and offline preview
 * all resolve cleanly without root-slash breakage.
 */

import masterData from './content-master.json';

export function normalizeAssetPath(rawPath) {
  if (!rawPath || typeof rawPath !== 'string') return '';
  if (rawPath.startsWith('http://') || rawPath.startsWith('https://') || rawPath.startsWith('./')) {
    return rawPath;
  }
  if (rawPath.startsWith('/assets/')) {
    return `.${rawPath}`;
  }
  if (rawPath.startsWith('public/assets/')) {
    return `./${rawPath.slice('public/'.length)}`;
  }
  if (rawPath.startsWith('/')) {
    return `.${rawPath}`;
  }
  return `./${rawPath}`;
}

export const CAMPAIGN_META = masterData.metadata;
export const CAMPAIGN_STATUS = masterData.status;
export const CONCEPT_TITLE = masterData.conceptTitle;
export const SERIES_TITLE = masterData.seriesTitle;
export const CENTRAL_MESSAGE = masterData.centralMessage;
export const CONCEPT_NOTICE = masterData.conceptNotice;
export const COMPETITION_INFO = masterData.competition;
export const RESOLUTION_INFO = masterData.resolution;

export const OFFICIAL_RESOLUTION_URL = masterData.officialResolutionUrl;
export const SECONDARY_OFFICIAL_URL = masterData.secondaryOfficialUrl;
export const RELATED_IMPLEMENTATION_DOCS = masterData.relatedImplementationDocs || [];
export const SEVEN_TASKS_GROUPED = masterData.sevenTasksGrouped || [];
export const EVALUATION_QUESTIONS = masterData.evaluationQuestions || [];
export const PALETTE = masterData.palette;

export const EMBLEM_ASSET = {
  src: normalizeAssetPath(masterData.emblem.publicDerivedClean),
  alt: masterData.landing.emblemAlt,
};

export const LANDING_DATA = {
  ...masterData.landing,
  eyebrow: 'CỤM 1 · CHỦ ĐỀ 1 · TRẠI THANH NIÊN SỐ ĐỒNG NAI 2026',
  headlineGold: 'NGHỊ QUYẾT 57',
  headlineCream: 'ĐẾN GẦN THANH NIÊN',
  headline: 'NGHỊ QUYẾT 57 ĐẾN GẦN THANH NIÊN',
  subtitle: 'CỤM 1 · CHỦ ĐỀ 1 · TRẠI THANH NIÊN SỐ ĐỒNG NAI 2026',
  introSummary:
    'Hành trình đưa tinh thần đột phá khoa học, công nghệ, đổi mới sáng tạo và chuyển đổi số vào từng việc làm gần gũi của tuổi trẻ Cụm 1.',
  startButtonLabel: 'Bắt đầu hành trình Cụm 1',
  sourceLine: 'Nghị quyết số 57-NQ/TW (22/12/2024) của Bộ Chính trị · Tuổi trẻ Cụm 1',
};

export const VIDEO_DATA = {
  ...masterData.video,
  title: 'Chuyển đổi số – Bắt đầu từ những điều gần gũi nhất',
  pullQuote:
    '“Trong thời đại hiện đại ngày nay, chúng ta không nên chỉ là người chứng kiến sự thay đổi, mà phải là người kiến tạo sự thay đổi đó.”',
  narrativeMoments: [
    {
      index: '01',
      title: 'Từ thói quen thường ngày',
      summary:
        'Tình huống gần gũi của hai nữ đoàn viên khi thao tác ứng dụng và quét mã QR để giải quyết công việc nhanh gọn, thuận tiện hơn.',
    },
    {
      index: '02',
      title: 'Nhận thức đúng tinh thần Nghị quyết',
      summary:
        'Đẩy mạnh số hóa, đồng bộ dữ liệu và đơn giản hóa thủ tục hành chính để công nghệ phục vụ thiết thực đời sống Nhân dân.',
    },
    {
      index: '03',
      title: 'Khát vọng tuổi trẻ tiên phong',
      summary:
        'Khẩu hiệu hành động của đoàn viên Cụm 1: làm chủ công nghệ, giữ gìn truyền thống tốt đẹp và chung tay kiến tạo tương lai.',
    },
  ],
  webOptimizedPath: normalizeAssetPath(masterData.video.webOptimizedPath),
  subtitlesVttPath: normalizeAssetPath(masterData.video.subtitlesVttPath),
  fixedThumbPath: normalizeAssetPath(masterData.video.fixedThumbPath),
  fixedThumb1080Path: normalizeAssetPath(masterData.video.fixedThumb1080Path),
};

export const SOCIAL_POST_DATA = {
  ...masterData.socialPost,
  channelDisplay: 'Tuổi trẻ Cụm 1 · Trại Thanh niên số Đồng Nai 2026',
  topicDisplay: 'Chuyên đề Nghị quyết 57-NQ/TW · Hiểu đúng – Làm thật – Lan tỏa',
  highlights: [
    {
      title: 'Khởi đầu từ nhận thức',
      summary:
        'Biến thói quen dùng điện thoại mỗi ngày thành năng lực làm chủ công nghệ, kiểm chứng thông tin và bảo vệ dữ liệu cá nhân.',
    },
    {
      title: 'Phần việc thiết thực',
      summary:
        'Gợi mở hướng hỗ trợ kỹ năng số cho người dân và nghiên cứu phương án số hóa thông tin về các địa chỉ đỏ tại địa phương, trên cơ sở có tư liệu và quyền sử dụng phù hợp.',
    },
    {
      title: 'Kết nối đồng bộ',
      summary:
        'Gắn kết câu chuyện video, bộ ấn phẩm trực quan và lời mời hành động để mỗi đoàn viên dễ đọc, dễ nhớ và dễ thực hành ngay.',
    },
  ],
  downloadPath: normalizeAssetPath(masterData.socialPost.downloadPath),
  mockupImagePath: normalizeAssetPath(masterData.socialPost.mockupImagePath),
};

export const PRESENTATION_DOC_DATA = {
  ...masterData.presentationDoc,
  storyCards: [
    {
      iconKey: 'spark',
      title: '1. Trăn trở từ thực tiễn',
      summary:
        'Đoàn viên, thanh niên Cụm 1 tiếp xúc với điện thoại thông minh, mạng xã hội và AI mỗi ngày nhưng dễ ngại tiếp cận văn kiện dài — khớp với nhận định tại Phần Mở đầu Nghị quyết 57-NQ/TW ngày 22/12/2024 của Bộ Chính trị.',
    },
    {
      iconKey: 'story',
      title: '2. Mạch chuyện thống nhất',
      summary:
        'Trọn bộ sản phẩm kết nối liền mạch từ câu chuyện gợi mở trong video, hệ thống quan điểm và tầm nhìn 2030–2045 qua bộ ấn phẩm đến lời mời hành động trên không gian số quanh thông điệp “Hiểu đúng – Làm thật – Lan tỏa”.',
    },
    {
      iconKey: 'roadmap',
      title: '3. Lộ trình đồng hành tại cơ sở',
      summary:
        'Đề xuất chuỗi sinh hoạt 5 tuần vừa sức tại chi đoàn Cụm 1: học tập số, hỗ trợ dịch vụ công trực tuyến, số hóa công tác Đoàn, giữ an toàn thông tin và nghiên cứu phương án số hóa thông tin về các địa chỉ đỏ tại địa phương, trên cơ sở có tư liệu và quyền sử dụng phù hợp.',
    },
    {
      iconKey: 'shield',
      title: '4. Chuẩn mực & Minh bạch',
      summary:
        'Tách bạch rõ các chỉ tiêu năm 2030 và tầm nhìn năm 2045 là mục tiêu định hướng trong văn kiện (không phải kết quả hiện tại), tôn trọng nguyên mẫu Huy hiệu Đoàn và dẫn chiếu trực tiếp Cổng TTĐT Chính phủ cùng Bộ Khoa học và Công nghệ.',
    },
  ],
  downloadDocxPath: normalizeAssetPath(masterData.presentationDoc.downloadDocxPath),
  downloadPdfPath: normalizeAssetPath(masterData.presentationDoc.downloadPdfPath),
  speechDownloadPath: normalizeAssetPath(masterData.presentationDoc.speechDownloadPath),
};

export const RUN_OF_SHOW = masterData.runOfShow;

export const FINALE_DATA = {
  ...masterData.finale,
  eyebrow: 'CỤM 1 · CHỦ ĐỀ 1 · TRẠI THANH NIÊN SỐ ĐỒNG NAI 2026',
  heading: 'HIỂU ĐÚNG – LÀM THẬT – LAN TỎA',
  summary:
    'Từ một câu hỏi nhỏ đến những hành động cụ thể tại cơ sở, tuổi trẻ Cụm 1 mong muốn đưa tinh thần Nghị quyết 57-NQ/TW trở thành thói quen số hữu ích, an toàn và bền bỉ mỗi ngày.',
  sourceCredit:
    'Nguồn văn kiện: Nghị quyết số 57-NQ/TW ngày 22/12/2024 của Bộ Chính trị · Cổng TTĐT Chính phủ & Bộ KH&CN.',
};

/**
 * Handcrafted 2D gouache-line inline SVGs aligned with each of the 05 NQ57 posters.
 * Strictly uses palette: #1464B4, #0D2B52, #D62828, #F0C14B, #F7F3E8, #0E5A38.
 */
export const MOTIF_SVGS = {
  'question-spark': `
    <svg class="motif-svg" viewBox="0 0 340 116" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="2" y="2" width="336" height="112" rx="14" fill="#F7F3E8" stroke="#F0C14B" stroke-width="1.5"/>
      <circle cx="268" cy="58" r="42" stroke="#F0C14B" stroke-width="1.2" stroke-dasharray="4 4" opacity="0.68"/>
      <circle cx="268" cy="58" r="26" fill="#F0C14B" fill-opacity="0.18" stroke="#1464B4" stroke-width="1.3"/>
      <path d="M32 86 C50 80, 74 80, 92 86 L92 42 C74 36, 50 36, 32 42 Z" fill="#FFFFFF" stroke="#0D2B52" stroke-width="2" stroke-linejoin="round"/>
      <path d="M92 86 C110 80, 134 80, 152 86 L152 42 C134 36, 110 36, 92 42 Z" fill="#FFFFFF" stroke="#0D2B52" stroke-width="2" stroke-linejoin="round"/>
      <path d="M92 42 L92 93 L98 88 L104 93 L104 42" fill="#D62828" opacity="0.92"/>
      <line x1="44" y1="54" x2="80" y2="52" stroke="#1464B4" stroke-width="2" stroke-linecap="round"/>
      <line x1="44" y1="64" x2="76" y2="62" stroke="#1464B4" stroke-width="2" stroke-linecap="round" opacity="0.72"/>
      <line x1="108" y1="54" x2="140" y2="56" stroke="#0E5A38" stroke-width="2" stroke-linecap="round"/>
      <rect x="170" y="30" width="46" height="66" rx="8" fill="#0D2B52" stroke="#1464B4" stroke-width="2"/>
      <rect x="176" y="38" width="34" height="48" rx="4" fill="#FFFFFF"/>
      <line x1="183" y1="50" x2="203" y2="50" stroke="#1464B4" stroke-width="2" stroke-linecap="round"/>
      <line x1="183" y1="59" x2="198" y2="59" stroke="#0E5A38" stroke-width="2" stroke-linecap="round"/>
      <circle cx="193" cy="74" r="6" fill="#F0C14B" stroke="#0D2B52" stroke-width="1.3"/>
      <path d="M216 42 Q238 22 256 36" stroke="#D62828" stroke-width="1.8" stroke-linecap="round" stroke-dasharray="3 3"/>
      <circle cx="268" cy="58" r="16" fill="#FFFFFF" stroke="#D62828" stroke-width="2"/>
      <path d="M263 53 C263 48, 273 48, 273 53 C273 57, 268 58, 268 62" stroke="#0D2B52" stroke-width="2.2" stroke-linecap="round"/>
      <circle cx="268" cy="67" r="1.7" fill="#D62828"/>
      <line x1="268" y1="22" x2="268" y2="28" stroke="#D62828" stroke-width="1.8" stroke-linecap="round"/>
      <line x1="296" y1="32" x2="291" y2="37" stroke="#F0C14B" stroke-width="2" stroke-linecap="round"/>
      <line x1="304" y1="58" x2="298" y2="58" stroke="#1464B4" stroke-width="1.8" stroke-linecap="round"/>
    </svg>
  `,
  'core-pillars': `
    <svg class="motif-svg" viewBox="0 0 340 116" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="2" y="2" width="336" height="112" rx="14" fill="#F7F3E8" stroke="#F0C14B" stroke-width="1.5"/>
      <circle cx="170" cy="58" r="44" stroke="#F0C14B" stroke-width="1.8" stroke-dasharray="5 4"/>
      <circle cx="170" cy="58" r="30" fill="#FFFFFF" stroke="#1464B4" stroke-width="2.2"/>
      <circle cx="170" cy="49" r="7.5" fill="#0D2B52"/>
      <path d="M156 71 C156 61, 184 61, 184 71" fill="#1464B4" fill-opacity="0.22" stroke="#1464B4" stroke-width="2" stroke-linecap="round"/>
      <path d="M140 50 L86 35 M140 66 L86 81 M200 50 L254 35 M200 66 L254 81" stroke="#1464B4" stroke-width="1.8" stroke-linecap="round"/>
      <circle cx="68" cy="32" r="18" fill="#FFFFFF" stroke="#1464B4" stroke-width="1.8"/>
      <path d="M68 22 L73 34 L68 31 L63 34 Z" fill="#D62828"/>
      <circle cx="68" cy="39" r="3" fill="#F0C14B"/>
      <circle cx="68" cy="84" r="18" fill="#FFFFFF" stroke="#0D2B52" stroke-width="1.8"/>
      <rect x="59" y="77" width="18" height="4" rx="1.5" fill="#1464B4"/>
      <rect x="59" y="83" width="18" height="4" rx="1.5" fill="#F0C14B"/>
      <rect x="59" y="89" width="18" height="4" rx="1.5" fill="#0D2B52"/>
      <circle cx="272" cy="32" r="18" fill="#FFFFFF" stroke="#D62828" stroke-width="1.8"/>
      <path d="M272 21 C266 21, 263 26, 264 31 C265 34, 267 36, 268 39 L276 39 C277 36, 279 34, 280 31 C281 26, 278 21, 272 21 Z" fill="#F0C14B" stroke="#0D2B52" stroke-width="1.4"/>
      <circle cx="272" cy="84" r="18" fill="#FFFFFF" stroke="#0E5A38" stroke-width="1.8"/>
      <path d="M272 73 L282 77 L282 84 C282 90, 277 94, 272 96 C267 94, 262 90, 262 84 L262 77 Z" fill="#0E5A38" fill-opacity="0.16" stroke="#0E5A38" stroke-width="1.6"/>
      <path d="M268 84 L271 87 L277 81" stroke="#0E5A38" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,
  'vision-2030-2045': `
    <svg class="motif-svg" viewBox="0 0 340 116" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="2" y="2" width="336" height="112" rx="14" fill="#F7F3E8" stroke="#F0C14B" stroke-width="1.5"/>
      <circle cx="282" cy="52" r="38" fill="#F0C14B" fill-opacity="0.2" stroke="#F0C14B" stroke-width="1.6" stroke-dasharray="4 4"/>
      <circle cx="282" cy="52" r="22" fill="#F0C14B" fill-opacity="0.45" stroke="#D62828" stroke-width="1.6"/>
      <line x1="24" y1="92" x2="316" y2="92" stroke="#0D2B52" stroke-width="1.8" stroke-linecap="round"/>
      <path d="M54 84 Q146 72 254 44" stroke="#1464B4" stroke-width="2.6" stroke-linecap="round"/>
      <path d="M54 90 Q146 80 258 54" stroke="#F0C14B" stroke-width="1.5" stroke-dasharray="4 4"/>
      <circle cx="118" cy="72" r="11" fill="#1464B4" stroke="#FFFFFF" stroke-width="2"/>
      <rect x="94" y="42" width="48" height="20" rx="6" fill="#0D2B52"/>
      <text x="118" y="56" text-anchor="middle" fill="#F0C14B" font-size="10.5" font-weight="800" font-family="Be Vietnam Pro, sans-serif">2030</text>
      <circle cx="238" cy="48" r="12" fill="#D62828" stroke="#FFFFFF" stroke-width="2"/>
      <rect x="214" y="16" width="48" height="20" rx="6" fill="#D62828"/>
      <text x="238" y="30" text-anchor="middle" fill="#FFFFFF" font-size="10.5" font-weight="800" font-family="Be Vietnam Pro, sans-serif">2045</text>
      <path d="M156 42 C168 30, 184 30, 195 39 C184 37, 172 40, 161 48 Z" fill="#F0C14B" stroke="#0D2B52" stroke-width="1.3"/>
      <path d="M180 26 C190 17, 204 17, 212 24 C204 22, 193 25, 184 31 Z" fill="#F0C14B" stroke="#0D2B52" stroke-width="1.3"/>
      <path d="M268 36 C277 27, 290 27, 298 34 C290 32, 280 34, 272 40 Z" fill="#FFFFFF" stroke="#0D2B52" stroke-width="1.2"/>
    </svg>
  `,
  'community-action': `
    <svg class="motif-svg" viewBox="0 0 340 116" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="2" y="2" width="336" height="112" rx="14" fill="#F7F3E8" stroke="#F0C14B" stroke-width="1.5"/>
      <rect x="28" y="24" width="42" height="68" rx="8" fill="#0D2B52" stroke="#1464B4" stroke-width="2"/>
      <rect x="34" y="32" width="30" height="48" rx="4" fill="#FFFFFF"/>
      <circle cx="49" cy="54" r="10" fill="#0E5A38" fill-opacity="0.16" stroke="#0E5A38" stroke-width="1.8"/>
      <path d="M45 54 L48 57 L54 50" stroke="#0E5A38" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="102" cy="40" r="9.5" fill="#1464B4"/>
      <path d="M88 76 C88 64, 116 64, 116 76" fill="#1464B4" fill-opacity="0.22" stroke="#1464B4" stroke-width="2"/>
      <circle cx="148" cy="42" r="9.5" fill="#F0C14B" stroke="#0D2B52" stroke-width="1.6"/>
      <path d="M134 76 C134 64, 162 64, 162 76" fill="#0E5A38" fill-opacity="0.2" stroke="#0E5A38" stroke-width="2"/>
      <path d="M98 58 Q125 46 152 58" stroke="#1464B4" stroke-width="2.2" stroke-linecap="round"/>
      <path d="M188 76 Q244 26 306 58" stroke="#0D2B52" stroke-width="2" stroke-dasharray="4 3"/>
      <circle cx="192" cy="74" r="9" fill="#1464B4" stroke="#FFFFFF" stroke-width="1.6"/>
      <circle cx="218" cy="54" r="9" fill="#0E5A38" stroke="#FFFFFF" stroke-width="1.6"/>
      <circle cx="246" cy="44" r="9" fill="#0D2B52" stroke="#FFFFFF" stroke-width="1.6"/>
      <circle cx="275" cy="46" r="9" fill="#D62828" stroke="#FFFFFF" stroke-width="1.6"/>
      <circle cx="302" cy="58" r="9" fill="#F0C14B" stroke="#0D2B52" stroke-width="1.6"/>
      <text x="192" y="77.5" text-anchor="middle" fill="#FFFFFF" font-size="9" font-weight="800" font-family="Be Vietnam Pro, sans-serif">1</text>
      <text x="218" y="57.5" text-anchor="middle" fill="#FFFFFF" font-size="9" font-weight="800" font-family="Be Vietnam Pro, sans-serif">2</text>
      <text x="246" y="47.5" text-anchor="middle" fill="#FFFFFF" font-size="9" font-weight="800" font-family="Be Vietnam Pro, sans-serif">3</text>
      <text x="275" y="49.5" text-anchor="middle" fill="#FFFFFF" font-size="9" font-weight="800" font-family="Be Vietnam Pro, sans-serif">4</text>
      <text x="302" y="61.5" text-anchor="middle" fill="#0D2B52" font-size="9" font-weight="800" font-family="Be Vietnam Pro, sans-serif">5</text>
    </svg>
  `,
  'community-ripple': `
    <svg class="motif-svg" viewBox="0 0 340 116" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="2" y="2" width="336" height="112" rx="14" fill="#F7F3E8" stroke="#F0C14B" stroke-width="1.5"/>
      <circle cx="102" cy="60" r="14" fill="#D62828" fill-opacity="0.16" stroke="#D62828" stroke-width="2"/>
      <circle cx="102" cy="60" r="28" stroke="#F0C14B" stroke-width="2"/>
      <circle cx="102" cy="60" r="42" stroke="#1464B4" stroke-width="1.6" stroke-dasharray="5 4"/>
      <circle cx="102" cy="60" r="56" stroke="#F0C14B" stroke-width="1.2" opacity="0.65"/>
      <circle cx="102" cy="60" r="6.5" fill="#D62828"/>
      <circle cx="164" cy="40" r="7" fill="#1464B4"/>
      <circle cx="174" cy="80" r="7" fill="#0E5A38"/>
      <path d="M108 57 L157 42 M108 63 L167 78" stroke="#1464B4" stroke-width="1.8" stroke-linecap="round"/>
      <path d="M210 40 C222 28, 238 28, 248 37 C238 35, 226 38, 215 46 Z" fill="#F0C14B" stroke="#0D2B52" stroke-width="1.3"/>
      <path d="M248 28 C258 19, 272 19, 281 26 C272 24, 262 27, 252 33 Z" fill="#F0C14B" stroke="#0D2B52" stroke-width="1.3"/>
      <path d="M280 42 C289 34, 301 34, 309 41 C301 39, 292 41, 284 47 Z" fill="#D62828" fill-opacity="0.88" stroke="#0D2B52" stroke-width="1.2"/>
      <rect x="252" y="54" width="38" height="38" rx="6" fill="#FFFFFF" stroke="#1464B4" stroke-width="2"/>
      <rect x="258" y="60" width="9" height="9" fill="#0D2B52"/>
      <rect x="275" y="60" width="9" height="9" fill="#0D2B52"/>
      <rect x="258" y="77" width="9" height="9" fill="#0D2B52"/>
      <rect x="275" y="77" width="4.5" height="4.5" fill="#1464B4"/>
      <rect x="280" y="81.5" width="4.5" height="4.5" fill="#D62828"/>
    </svg>
  `,
};

export const PRES_CARD_ICONS = {
  spark: `
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3L14.5 8.5L20 11L14.5 13.5L12 19L9.5 13.5L4 11L9.5 8.5L12 3Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
    </svg>
  `,
  story: `
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3.5" y="5" width="17" height="14" rx="3" stroke="currentColor" stroke-width="1.8"/>
      <path d="M7.5 10H16.5M7.5 14H13.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    </svg>
  `,
  roadmap: `
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="6" cy="17" r="2.5" stroke="currentColor" stroke-width="1.8"/>
      <circle cx="12" cy="10" r="2.5" stroke="currentColor" stroke-width="1.8"/>
      <circle cx="18" cy="6" r="2.5" stroke="currentColor" stroke-width="1.8"/>
      <path d="M8 15L10.3 12M14 8.5L16 7.2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    </svg>
  `,
  shield: `
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3.5L19 6.5V11.8C19 16 15.9 19.3 12 20.5C8.1 19.3 5 16 5 11.8V6.5L12 3.5Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
      <path d="M9 12L11 14L15 10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,
};

const POSTER_UI_EXTENSIONS = {
  'NQ57-01': {
    shortChapterLabel: '01 Khởi nguồn',
    highlightKeyword: '22/12/2024',
    editorialSummary:
      'Mở đầu bằng câu hỏi gần gũi của người trẻ: dùng điện thoại thông minh và AI mỗi ngày nhưng dễ ngại văn bản dài — kết nối ngay Nghị quyết 57-NQ/TW (Bộ Chính trị, 22/12/2024) vào học tập và dịch vụ công.',
    motifTitle: 'Sổ tay tri thức & câu hỏi mở',
    motifSvgKey: 'question-spark',
    domainPills: ['Phần Mở đầu', 'Bộ Chính trị · 22/12/2024', 'Đời sống số'],
  },
  'NQ57-02': {
    shortChapterLabel: '02 Quan điểm',
    highlightKeyword: 'con người và doanh nghiệp',
    editorialSummary:
      'Chắt lọc Mục I Nghị quyết 57-NQ/TW thành 4 điểm định hướng cốt lõi quanh nguyên tắc lấy con người và doanh nghiệp làm trung tâm, đồng thời giữ an toàn không gian mạng xuyên suốt.',
    motifTitle: 'Trọng tâm con người & định hướng cốt lõi',
    motifSvgKey: 'core-pillars',
    domainPills: ['Mục I.1 – I.5', 'Năm nền tảng cốt lõi', 'An toàn số'],
    cleanPillar4Note:
      'Mục I.4: Phát triển nhanh, bền vững, từng bước tự chủ về công nghệ, nhất là công nghệ chiến lược.',
  },
  'NQ57-03': {
    shortChapterLabel: '03 Tầm nhìn',
    highlightKeyword: '2030 → 2045',
    editorialSummary:
      'Hệ thống hóa chỉ tiêu đến năm 2030 và tầm nhìn 2045 theo Mục II.1–II.2 Nghị quyết 57-NQ/TW, phân định rõ hơn 80% sử dụng dịch vụ công trực tuyến với 80% giao dịch không dùng tiền mặt.',
    motifTitle: 'Lộ trình 2030 → 2045 & khát vọng Việt Nam',
    motifSvgKey: 'vision-2030-2045',
    domainPills: ['Mục II.1 & II.2', 'Mục tiêu đến 2030', 'Tầm nhìn 2045'],
  },
  'NQ57-04': {
    shortChapterLabel: '04 Hành động',
    highlightKeyword: 'đề xuất phần việc',
    editorialSummary:
      'Gợi mở 5 đề xuất phần việc vừa sức dành cho đoàn viên Cụm 1 tại cơ sở: từ học tập số, hỗ trợ dịch vụ công trực tuyến đến số hóa công tác Đoàn và giữ an toàn thông tin.',
    motifTitle: 'Cầu nối số & 5 phần việc đề xuất',
    motifSvgKey: 'community-action',
    domainPills: ['Đề xuất Cụm 1', 'Học tập số', 'An toàn thông tin'],
  },
  'NQ57-05': {
    shortChapterLabel: '05 Lan tỏa',
    highlightKeyword: 'một việc nhỏ hôm nay',
    editorialSummary:
      'Khép lại bộ ấn phẩm bằng lời mời bắt đầu từ một việc nhỏ hôm nay để lan tỏa trong chi đoàn và khu dân cư Cụm 1, kèm mã QR dẫn thẳng toàn văn trên Cổng TTĐT Chính phủ.',
    motifTitle: 'Lan tỏa cộng đồng & mã QR xác thực',
    motifSvgKey: 'community-ripple',
    domainPills: ['Hiểu đúng · Làm thật', 'Việc nhỏ hôm nay', 'Cổng TTĐT Chính phủ'],
  },
};

export const POSTERS = masterData.posters.map((poster, index) => {
  const ui = POSTER_UI_EXTENSIONS[poster.posterId] || {};
  const stage = index + 2; // Stages 2..6 correspond to Poster 01..05
  const webPath = normalizeAssetPath(poster.webPath);
  const filename = webPath.split('/').pop() || `${String(poster.id).padStart(2, '0')}.png`;
  return {
    ...poster,
    stage,
    posterNumber: poster.id,
    badgeLabel: poster.index.replace('/', ' / '),
    shortChapterLabel: ui.shortChapterLabel || poster.chapterTitle,
    posterPath: webPath,
    aliasPath: normalizeAssetPath(poster.canonicalAlias),
    filename,
    highlightKeyword: ui.highlightKeyword || '',
    editorialSummary: ui.editorialSummary || poster.subtitle,
    motifTitle: ui.motifTitle || poster.chapterTitle,
    motifSvgKey: ui.motifSvgKey || 'question-spark',
    domainPills: ui.domainPills || [],
    pillar4Note: ui.cleanPillar4Note || poster.pillar4Note,
  };
});

export function getPosterByStage(stage) {
  return POSTERS.find((poster) => poster.stage === stage) || null;
}

export function getPosterByNumber(posterId) {
  return POSTERS.find((poster) => poster.id === posterId) || POSTERS[0];
}

export const SPEAKER_CUES_BY_STAGE = {
  0: {
    timeRange: '00:00 – 00:08',
    actionCue: 'Giữ giao diện LẠC HỒNG SỐ; sau lời chào bấm "Bắt đầu hành trình Cụm 1 →" hoặc Space để sang Video.',
    spokenText:
      'Kính chào Ban Giám khảo. Cụm 1 thực hiện bộ bốn sản phẩm đưa Nghị quyết 57 đến gần thanh niên mang tên Lạc Hồng Số. Trước tiên, mời Ban Giám khảo theo dõi video mở đầu.',
    extendedTip: null,
  },
  1: {
    timeRange: '00:08 – 01:50',
    actionCue: 'Bật phát Video kèm phụ đề tiếng Việt. Diễn giả IM LẶNG hoàn toàn; hết video chuyển sang Bộ ấn phẩm.',
    spokenText:
      '[DIỄN GIẢ IM LẶNG để Ban Giám khảo theo dõi trọn vẹn video tình huống 2 đoàn viên quét QR, thông điệp Nghị quyết 57 và khẩu hiệu tập thể.]',
    extendedTip:
      'Mở rộng (+20s sau video): Nêu việc chuẩn hóa dấu thanh tiếng Việt trên ảnh bìa mà giữ nguyên ảnh chụp thật, đồng thời bổ sung phụ đề tiếng Việt đồng bộ.',
  },
  2: {
    timeRange: '01:50 – 01:56',
    actionCue: 'Dừng ngắn tại Ấn phẩm 01 / 05 (Khởi nguồn) rồi nhấn ArrowRight sang 02 / 05.',
    spokenText:
      'Sau câu hỏi gợi mở từ video và ấn phẩm một, mời Ban Giám khảo cùng nhìn vào các quan điểm cốt lõi của Nghị quyết 57-NQ/TW tại ấn phẩm hai.',
    extendedTip: null,
  },
  3: {
    timeRange: '01:56 – 02:10',
    actionCue: 'Tại Ấn phẩm 02 / 05 (Quan điểm cốt lõi): khẳng định Bộ Chính trị (22/12/2024) và 5 quan điểm Mục I, rồi nhấn ArrowRight.',
    spokenText:
      'Ấn phẩm hai tóm tắt Nghị quyết 57-NQ/TW ngày hai mươi hai tháng mười hai năm hai nghìn không trăm hai bốn của Bộ Chính trị: khoa học, công nghệ, đổi mới sáng tạo và chuyển đổi số là đột phá hàng đầu; người dân và doanh nghiệp là trung tâm; dựa trên năm nền tảng thể chế, nhân lực, hạ tầng, dữ liệu, công nghệ chiến lược và an toàn không gian mạng.',
    extendedTip: null,
  },
  4: {
    timeRange: '02:10 – 02:32',
    actionCue: 'Tại Ấn phẩm 03 / 05 (2030 → 2045): chỉ vào 2 khung chỉ tiêu, nhấn mạnh ĐÂY LÀ MỤC TIÊU VĂN KIỆN (không phải kết quả hiện tại).',
    spokenText:
      'Sang ấn phẩm ba, đây là mục tiêu văn kiện chứ không phải kết quả hiện tại: đến năm hai nghìn không trăm ba mươi, kinh tế số tối thiểu ba mươi phần trăm GDP, trên tám mươi phần trăm dùng dịch vụ công trực tuyến, vào nhóm ba Đông Nam Á và năm mươi thế giới về năng lực cạnh tranh số, Chính phủ điện tử, nhóm ba Đông Nam Á nghiên cứu trí tuệ nhân tạo, chi R&D đạt hai phần trăm GDP. Tầm nhìn hai nghìn không trăm bốn mươi lăm trở thành nước phát triển thu nhập cao, kinh tế số tối thiểu năm mươi phần trăm GDP, thuộc nhóm ba mươi thế giới, thực hiện qua bảy nhóm nhiệm vụ.',
    extendedTip:
      'Mở rộng (+25s): Đọc gọn 4 trụ của 7 nhóm nhiệm vụ (Mục III.1–III.7) và tách bạch > 80% dịch vụ công trực tuyến với 80% giao dịch không dùng tiền mặt.',
  },
  5: {
    timeRange: '02:32 – 02:42',
    actionCue: 'Tại Ấn phẩm 04 / 05: giới thiệu 5 đề xuất phần việc thanh niên Cụm 1, nhấn ArrowRight sang 05 / 05.',
    spokenText:
      'Ấn phẩm bốn đề xuất năm phần việc cho thanh niên Cụm 1: học tập số, hỗ trợ dịch vụ công, số hóa công tác Đoàn, sáng kiến cơ sở và an toàn thông tin.',
    extendedTip: null,
  },
  6: {
    timeRange: '02:42 – 02:50',
    actionCue: 'Tại Ấn phẩm 05 / 05: chốt thông điệp & QR chinhphu.vn, nhấn ArrowRight sang Bài đăng.',
    spokenText:
      'Ấn phẩm năm chốt thông điệp Hiểu đúng, Làm thật, Lan tỏa cùng mã QR tới toàn văn trên Cổng Thông tin Chính phủ.',
    extendedTip: null,
  },
  7: {
    timeRange: '02:50 – 03:08',
    actionCue: 'Tại Bài đăng lan tỏa: có thể chuyển Xem trực quan / Xem nguyên văn hoặc mở bản trình bày bài đăng.',
    spokenText:
      'Ở bài đăng mạng xã hội, nhóm giữ mạch Chuyển đổi số bắt đầu từ chính mình, diễn đạt cẩn trọng phương án nghiên cứu số hóa thông tin địa chỉ đỏ trên cơ sở có tư liệu và quyền sử dụng phù hợp, đồng bộ cùng bộ ấn phẩm.',
    extendedTip: null,
  },
  8: {
    timeRange: '03:08 – 03:46',
    actionCue: 'Tại Thuyết minh & Hành trình: giới thiệu 4 thẻ câu chuyện cốt lõi, lộ trình 5 tuần và Kho tư liệu.',
    spokenText:
      'Bản thuyết minh nêu rõ lộ trình năm tuần tại Cụm 1 và cách đo lường đề xuất. Nhóm giữ chuẩn mực minh bạch: tách bạch mục tiêu văn kiện với kết quả hiện tại, giữ nguyên Huy hiệu Đoàn và đối chiếu nguồn Chính phủ cùng Bộ Khoa học và Công nghệ.',
    extendedTip:
      'Mở rộng (+25s): Giải thích lý do diễn đạt đề xuất số hóa địa chỉ đỏ theo điều kiện tư liệu/quyền sử dụng phù hợp và tách bạch 57-NQ/TW khỏi 03/NQ-CP, 71/NQ-CP.',
  },
  9: {
    timeRange: '03:46 – 04:00',
    actionCue: 'Giữ Màn hình Lan tỏa + mã QR (≥ 5 giây đệm) để chuyển sang 04 phút phản biện.',
    spokenText:
      'Với tinh thần Hiểu đúng, Làm thật, Lan tỏa, Cụm 1 xin cảm ơn và sẵn sàng lắng nghe phản biện của Ban Giám khảo.',
    extendedTip: null,
  },
};

export const STAGE_DEFINITIONS = [
  { stage: 0, id: 'stage-landing', label: 'Mở đầu', shortLabel: 'Mở đầu', productKey: 'overview', revealIdx: 0, autoSeconds: 8 },
  { stage: 1, id: 'stage-video', label: 'Video', shortLabel: 'Video', productKey: 'video', revealIdx: 1, autoSeconds: 102 },
  { stage: 2, id: 'stage-posters', label: '01 / 05', shortLabel: '01/05', productKey: 'posters', revealIdx: 2, autoSeconds: 8 },
  { stage: 3, id: 'stage-posters', label: '02 / 05', shortLabel: '02/05', productKey: 'posters', revealIdx: 2, autoSeconds: 12 },
  { stage: 4, id: 'stage-posters', label: '03 / 05', shortLabel: '03/05', productKey: 'posters', revealIdx: 2, autoSeconds: 20 },
  { stage: 5, id: 'stage-posters', label: '04 / 05', shortLabel: '04/05', productKey: 'posters', revealIdx: 2, autoSeconds: 10 },
  { stage: 6, id: 'stage-posters', label: '05 / 05', shortLabel: '05/05', productKey: 'posters', revealIdx: 2, autoSeconds: 8 },
  { stage: 7, id: 'stage-social', label: 'Bài đăng', shortLabel: 'Bài đăng', productKey: 'social', revealIdx: 3, autoSeconds: 18 },
  { stage: 8, id: 'stage-presentation', label: 'Thuyết minh', shortLabel: 'Thuyết minh', productKey: 'presentation', revealIdx: 4, autoSeconds: 38 },
  { stage: 9, id: 'stage-finale', label: 'Lan tỏa', shortLabel: 'Lan tỏa', productKey: 'finale', revealIdx: 5, autoSeconds: 16 },
];

export function getStageMeta(stage) {
  const def = STAGE_DEFINITIONS.find((s) => s.stage === stage) || STAGE_DEFINITIONS[0];
  const cue = SPEAKER_CUES_BY_STAGE[def.stage] || SPEAKER_CUES_BY_STAGE[0];
  const poster = def.productKey === 'posters' ? getPosterByStage(def.stage) : null;
  return {
    ...def,
    cue,
    poster,
  };
}

export const RESOURCE_HUB_GROUPS = [
  {
    groupTitle: 'Sản phẩm 1 — Video tuyên truyền dọc 9:16 & Phụ đề',
    items: [
      {
        label: 'Video tối ưu web (MP4 · 720×1280 · 101,45s)',
        filename: 'video-web-optimized.mp4',
        href: VIDEO_DATA.webOptimizedPath,
        meta: 'H.264 + AAC · 25,9 MB',
      },
      {
        label: 'Phụ đề tiếng Việt rời (.vtt)',
        filename: 'subtitles_vi.vtt',
        href: VIDEO_DATA.subtitlesVttPath,
        meta: 'WebVTT chuẩn đồng bộ',
      },
      {
        label: 'Thumbnail đã sửa chính tả (1080×1920 PNG)',
        filename: 'thumbnail-chu-dung-1080x1920.png',
        href: VIDEO_DATA.fixedThumb1080Path,
        meta: 'Sửa dấu NGỒI · giữ nguyên ảnh thật',
      },
    ],
  },
  {
    groupTitle: 'Sản phẩm 2 — Bộ 05 ấn phẩm Lạc Hồng Số (1080 × 1350 PNG)',
    items: POSTERS.map((p) => ({
      label: `${p.index} · ${p.title}`,
      filename: p.filename,
      href: p.posterPath,
      meta: `${p.chapterTitle} · 1080 × 1350 px`,
    })),
  },
  {
    groupTitle: 'Sản phẩm 3 — Bài đăng mạng xã hội & Mockup',
    items: [
      {
        label: 'Bài đăng hoàn chỉnh (Word .docx)',
        filename: 'BAI_DANG_CUM1_HOAN_CHINH.docx',
        href: SOCIAL_POST_DATA.downloadPath,
        meta: 'Đã hiệu đính đề xuất & hashtag sạch',
      },
      {
        label: 'Ảnh xem trước Mockup bài đăng (PNG)',
        filename: 'MOCKUP_BAI_DANG.png',
        href: SOCIAL_POST_DATA.mockupImagePath,
        meta: 'Xem trước bố cục trực quan',
      },
    ],
  },
  {
    groupTitle: 'Sản phẩm 4 & Lời nói hỗ trợ trình diễn 04 phút',
    items: [
      {
        label: 'Bản Thuyết minh sản phẩm (PDF ≤ 03 trang)',
        filename: 'THUYET_MINH_CUM1_CHUDE1.pdf',
        href: PRESENTATION_DOC_DATA.downloadPdfPath,
        meta: 'Bản chính nộp & trình bày',
      },
      {
        label: 'Bản Thuyết minh sản phẩm (Word .docx)',
        filename: 'THUYET_MINH_CUM1_CHUDE1.docx',
        href: PRESENTATION_DOC_DATA.downloadDocxPath,
        meta: 'Tệp Word nguồn A4',
      },
      {
        label: 'Kịch bản Lời thuyết trình 04 phút (Word .docx)',
        filename: 'LOI_THUYET_TRINH_04_PHUT_CUM1_NQ57.docx',
        href: PRESENTATION_DOC_DATA.speechDownloadPath,
        meta: 'Kèm thẻ nhịp nhanh & phụ lục 06 phút',
      },
    ],
  },
];
