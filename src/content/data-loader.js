/**
 * LẠC HỒNG SỐ — Single Source of Truth Data Loader (V3 Integrated 04-Product Web)
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
  headline: 'NGHỊ QUYẾT 57 ĐẾN GẦN THANH NIÊN',
  subtitle: masterData.landing.eyebrow,
};

export const VIDEO_DATA = {
  ...masterData.video,
  webOptimizedPath: normalizeAssetPath(masterData.video.webOptimizedPath),
  subtitlesVttPath: normalizeAssetPath(masterData.video.subtitlesVttPath),
  fixedThumbPath: normalizeAssetPath(masterData.video.fixedThumbPath),
  fixedThumb1080Path: normalizeAssetPath(masterData.video.fixedThumb1080Path),
};

export const SOCIAL_POST_DATA = {
  ...masterData.socialPost,
  downloadPath: normalizeAssetPath(masterData.socialPost.downloadPath),
  mockupImagePath: normalizeAssetPath(masterData.socialPost.mockupImagePath),
};

export const PRESENTATION_DOC_DATA = {
  ...masterData.presentationDoc,
  downloadDocxPath: normalizeAssetPath(masterData.presentationDoc.downloadDocxPath),
  downloadPdfPath: normalizeAssetPath(masterData.presentationDoc.downloadPdfPath),
  speechDownloadPath: normalizeAssetPath(masterData.presentationDoc.speechDownloadPath),
};

export const RUN_OF_SHOW = masterData.runOfShow;

export const FINALE_DATA = {
  ...masterData.finale,
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

const POSTER_UI_EXTENSIONS = {
  'NQ57-01': {
    highlightKeyword: '22/12/2024',
    editorialSummary:
      'Mở đầu bằng câu hỏi gần gũi của người trẻ: dùng smartphone, AI mỗi ngày nhưng dễ ngại văn bản dài — gắn ngay Nghị quyết 57-NQ/TW (Bộ Chính trị, 22/12/2024) vào học tập và dịch vụ công.',
    motifTitle: 'Sổ tay tri thức & câu hỏi mở',
    motifSvgKey: 'question-spark',
    domainPills: ['Phần Mở đầu NQ57', '22/12/2024 · Bộ Chính trị', 'Đời sống số'],
  },
  'NQ57-02': {
    highlightKeyword: 'con người và doanh nghiệp',
    editorialSummary:
      'Chắt lọc Mục I Nghị quyết 57-NQ/TW thành 4 điểm định hướng cốt lõi quanh nguyên tắc lấy con người và doanh nghiệp làm trung tâm, đồng thời giữ an toàn không gian mạng xuyên suốt.',
    motifTitle: 'Trọng tâm con người & 4 định hướng',
    motifSvgKey: 'core-pillars',
    domainPills: ['Mục I.1–I.5 NQ57', '5 nền tảng cốt lõi', 'An toàn số'],
  },
  'NQ57-03': {
    highlightKeyword: '2030 → 2045',
    editorialSummary:
      'Hệ thống hóa chỉ tiêu 2030 → 2045 theo Mục II.1–II.2 (rõ nhãn mục tiêu văn kiện, không phải kết quả hiện tại), tách bạch > 80% dịch vụ công trực tuyến với 80% giao dịch không dùng tiền mặt.',
    motifTitle: 'Lộ trình 2030 → 2045 & khát vọng Việt Nam',
    motifSvgKey: 'vision-2030-2045',
    domainPills: ['Mục II.1 & II.2', '7 nhóm nhiệm vụ', 'Mục tiêu định hướng'],
  },
  'NQ57-04': {
    highlightKeyword: 'đề xuất phần việc',
    editorialSummary:
      'Tổng hợp 5 đề xuất phần việc vừa sức cho đoàn viên Cụm 1 tại cơ sở (chưa phải thống kê hoạt động đã diễn ra): từ học tập số, hỗ trợ dịch vụ công đến giữ an toàn thông tin.',
    motifTitle: 'Cầu nối số & 5 phần việc đề xuất',
    motifSvgKey: 'community-action',
    domainPills: ['Đề xuất Cụm 1', 'Học tập số', 'An toàn thông tin'],
  },
  'NQ57-05': {
    highlightKeyword: 'một việc nhỏ hôm nay',
    editorialSummary:
      'Khép lại bộ ấn phẩm bằng lời mời bắt đầu từ một việc nhỏ hôm nay để lan tỏa trong chi đoàn và khu dân cư Cụm 1, kèm mã QR dẫn thẳng toàn văn trên Cổng TTĐT Chính phủ.',
    motifTitle: 'Lan tỏa cộng đồng & mã QR xác thực',
    motifSvgKey: 'community-ripple',
    domainPills: ['Hiểu đúng · Làm thật', 'Việc nhỏ hôm nay', 'QR chinhphu.vn'],
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
    posterPath: webPath,
    aliasPath: normalizeAssetPath(poster.canonicalAlias),
    filename,
    highlightKeyword: ui.highlightKeyword || '',
    editorialSummary: ui.editorialSummary || poster.subtitle,
    motifTitle: ui.motifTitle || poster.chapterTitle,
    motifSvgKey: ui.motifSvgKey || 'question-spark',
    domainPills: ui.domainPills || [],
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
    actionCue: 'Giữ giao diện LẠC HỒNG SỐ; sau lời chào bấm "Bắt đầu trình chiếu 04 phút →" hoặc Space để sang Video.',
    spokenText:
      'Kính chào Ban Giám khảo. Cụm 1 thực hiện bộ bốn sản phẩm đưa Nghị quyết 57 đến gần thanh niên mang tên Lạc Hồng Số. Trước tiên, mời Ban Giám khảo theo dõi video dài một phút bốn mươi mốt giây.',
    extendedTip: null,
  },
  1: {
    timeRange: '00:08 – 01:50',
    actionCue: 'Bật phát Video 9:16 (101,45 giây) kèm phụ đề tiếng Việt. Diễn giả IM LẶNG hoàn toàn; hết video chuyển sang 01/05.',
    spokenText:
      '[DIỄN GIẢ IM LẶNG trong 101,45 giây để Ban Giám khảo theo dõi trọn video tình huống 2 đoàn viên quét QR, thông điệp Nghị quyết 57 và khẩu hiệu tập thể.]',
    extendedTip:
      'Mở rộng (+20s sau video): Nêu việc sửa lỗi dấu thanh "NGỒI" trên ảnh bìa mà giữ nguyên ảnh chụp thật, tạo phụ đề rời subtitles_vi.vtt và nén bản web mượt.',
  },
  2: {
    timeRange: '01:50 – 01:56',
    actionCue: 'Dừng ngắn tại Ấn phẩm 01/05 (Đặt vấn đề) rồi nhấn ArrowRight sang 02/05.',
    spokenText:
      'Sau câu hỏi gợi mở từ video và ấn phẩm một, mời Ban Giám khảo cùng nhìn vào các quan điểm cốt lõi của Nghị quyết 57-NQ/TW tại ấn phẩm hai.',
    extendedTip: null,
  },
  3: {
    timeRange: '01:56 – 02:10',
    actionCue: 'Tại Ấn phẩm 02/05 (Quan điểm cốt lõi): khẳng định Bộ Chính trị (22/12/2024) và 4+1 quan điểm Mục I, rồi nhấn ArrowRight.',
    spokenText:
      'Ấn phẩm hai tóm tắt Nghị quyết 57-NQ/TW ngày hai mươi hai tháng mười hai năm hai nghìn không trăm hai mươi bốn của Bộ Chính trị: khoa học, công nghệ, đổi mới sáng tạo và chuyển đổi số là đột phá hàng đầu; người dân và doanh nghiệp là trung tâm; dựa trên năm nền tảng thể chế, nhân lực, hạ tầng, dữ liệu, công nghệ chiến lược và an toàn không gian mạng.',
    extendedTip: null,
  },
  4: {
    timeRange: '02:10 – 02:32',
    actionCue: 'Tại Ấn phẩm 03/05 (2030 → 2045): chỉ vào 2 khung chỉ tiêu, nhấn mạnh ĐÂY LÀ MỤC TIÊU VĂN KIỆN (không phải kết quả hiện tại).',
    spokenText:
      'Sang ấn phẩm ba, đây là mục tiêu văn kiện chứ không phải kết quả hiện tại: đến năm hai nghìn không trăm ba mươi, kinh tế số tối thiểu ba mươi phần trăm GDP, trên tám mươi phần trăm dùng dịch vụ công trực tuyến, vào nhóm ba Đông Nam Á và năm mươi thế giới về năng lực cạnh tranh số, Chính phủ điện tử, nhóm ba Đông Nam Á nghiên cứu trí tuệ nhân tạo, chi R&D đạt hai phần trăm GDP. Tầm nhìn hai nghìn không trăm bốn mươi lăm trở thành nước phát triển thu nhập cao, kinh tế số tối thiểu năm mươi phần trăm GDP, thuộc nhóm ba mươi thế giới, thực hiện qua bảy nhóm nhiệm vụ.',
    extendedTip:
      'Mở rộng (+25s): Đọc gọn 4 trụ của 7 nhóm nhiệm vụ (Mục III.1–III.7) và tách bạch > 80% dịch vụ công trực tuyến với 80% giao dịch không dùng tiền mặt.',
  },
  5: {
    timeRange: '02:32 – 02:42',
    actionCue: 'Tại Ấn phẩm 04/05: giới thiệu 5 đề xuất phần việc thanh niên Cụm 1, nhấn ArrowRight sang 05/05.',
    spokenText:
      'Ấn phẩm bốn đề xuất năm phần việc cho thanh niên Cụm 1: học tập số, hỗ trợ dịch vụ công, số hóa công tác Đoàn, sáng kiến cơ sở và an toàn thông tin.',
    extendedTip: null,
  },
  6: {
    timeRange: '02:42 – 02:50',
    actionCue: 'Tại Ấn phẩm 05/05: chốt thông điệp & QR chinhphu.vn, nhấn ArrowRight sang Bài đăng.',
    spokenText:
      'Ấn phẩm năm chốt thông điệp Hiểu đúng, Làm thật, Lan tỏa cùng mã QR tới toàn văn trên Cổng Thông tin Chính phủ.',
    extendedTip: null,
  },
  7: {
    timeRange: '02:50 – 03:08',
    actionCue: 'Tại Mục 3 (Bài đăng MXH & Mockup): có thể chuyển Xem trực quan / Xem nguyên văn hoặc mở Mockup PNG.',
    spokenText:
      'Ở bài đăng mạng xã hội, nhóm giữ mạch Chuyển đổi số bắt đầu từ chính mình, sửa ý số hóa địa chỉ đỏ thành đề xuất khi đủ tư liệu phù hợp, chuẩn hóa hashtag, dự kiến đăng lúc mười bảy giờ ba mươi khi nhóm chốt kênh.',
    extendedTip: null,
  },
  8: {
    timeRange: '03:08 – 03:46',
    actionCue: 'Tại Mục 4 (Thuyết minh 03 trang): giới thiệu 4 thẻ cốt lõi, kế hoạch 5 tuần và nút tải PDF/Word.',
    spokenText:
      'Bản thuyết minh gói trong ba trang nêu rõ lộ trình năm tuần tại Cụm 1 và chỉ số theo dõi đề xuất. Nhóm cam kết minh bạch: tranh minh họa có hỗ trợ AI là giả lập truyền thông, giữ nguyên Huy hiệu Đoàn và đối chiếu nguồn Chính phủ cùng Bộ Khoa học và Công nghệ.',
    extendedTip:
      'Mở rộng (+25s): Giải thích lý do chuyển câu "số hóa địa chỉ đỏ" thành đề xuất có điều kiện tư liệu/quyền sử dụng hợp lệ và tách bạch 57-NQ/TW khỏi 03/NQ-CP, 71/NQ-CP.',
  },
  9: {
    timeRange: '03:46 – 04:00',
    actionCue: 'Giữ Màn hình Tổng kết + mã QR (≥ 5 giây đệm) để chuyển sang 04 phút phản biện.',
    spokenText:
      'Với tinh thần Hiểu đúng, Làm thật, Lan tỏa, Cụm 1 xin cảm ơn và sẵn sàng lắng nghe phản biện của Ban Giám khảo.',
    extendedTip: null,
  },
};

export const STAGE_DEFINITIONS = [
  { stage: 0, id: 'stage-landing', label: 'Mở đầu', shortLabel: 'Mở đầu', productKey: 'overview', revealIdx: 0, autoSeconds: 8 },
  { stage: 1, id: 'stage-video', label: 'Video 9:16', shortLabel: 'Video', productKey: 'video', revealIdx: 1, autoSeconds: 102 },
  { stage: 2, id: 'stage-posters', label: '01 / 05', shortLabel: '01/05', productKey: 'posters', revealIdx: 2, autoSeconds: 8 },
  { stage: 3, id: 'stage-posters', label: '02 / 05', shortLabel: '02/05', productKey: 'posters', revealIdx: 2, autoSeconds: 12 },
  { stage: 4, id: 'stage-posters', label: '03 / 05', shortLabel: '03/05', productKey: 'posters', revealIdx: 2, autoSeconds: 20 },
  { stage: 5, id: 'stage-posters', label: '04 / 05', shortLabel: '04/05', productKey: 'posters', revealIdx: 2, autoSeconds: 10 },
  { stage: 6, id: 'stage-posters', label: '05 / 05', shortLabel: '05/05', productKey: 'posters', revealIdx: 2, autoSeconds: 8 },
  { stage: 7, id: 'stage-social', label: 'Bài đăng', shortLabel: 'Bài đăng', productKey: 'social', revealIdx: 3, autoSeconds: 18 },
  { stage: 8, id: 'stage-presentation', label: 'Thuyết minh', shortLabel: 'Thuyết minh', productKey: 'presentation', revealIdx: 4, autoSeconds: 38 },
  { stage: 9, id: 'stage-finale', label: 'Tổng kết', shortLabel: 'Tổng kết', productKey: 'finale', revealIdx: 5, autoSeconds: 16 },
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
