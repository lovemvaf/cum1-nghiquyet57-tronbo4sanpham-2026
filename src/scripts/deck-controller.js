/**
 * LẠC HỒNG SỐ — V3 10-Stage Integrated Editorial Deck Controller
 * Manages Reveal.js layout-free view switching across stages 0..9,
 * live Video playback & Vietnamese captions, 05 posters + Zoom Lightbox,
 * Social Post dual view, Thuyết minh 4 story cards + PPT summary modal,
 * synchronized 04:00 / 06:00 speaker drawer, Resource Hub, HUD popover,
 * and pausable Auto Demo + interactive VFX pointer & grand waves.
 */

import Reveal from 'reveal.js';
import QRCode from 'qrcode';
import {
  CONCEPT_NOTICE,
  EMBLEM_ASSET,
  EVALUATION_QUESTIONS,
  FINALE_DATA,
  LANDING_DATA,
  MOTIF_SVGS,
  OFFICIAL_RESOLUTION_URL,
  POSTERS,
  PRESENTATION_DOC_DATA,
  PRES_CARD_ICONS,
  RELATED_IMPLEMENTATION_DOCS,
  RESOURCE_HUB_GROUPS,
  SECONDARY_OFFICIAL_URL,
  SEVEN_TASKS_GROUPED,
  SOCIAL_POST_DATA,
  STAGE_DEFINITIONS,
  VIDEO_DATA,
  getPosterByNumber,
  getPosterByStage,
  getStageMeta,
} from '../content/data-loader.js';
import { createHeritageSkyCanvas } from './heritage-sky-canvas.js';
import { createMotionEngine } from './motion-engine.js';

function escapeHtml(str) {
  return String(str ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function buildDongSonDrumMarkup() {
  const cx = 400;
  const cy = 400;
  const parts = [];
  const rings = [
    { r: 54, stroke: '#F0C14B', width: 2.2, opacity: 0.9 },
    { r: 142, stroke: '#F0C14B', width: 2.0, opacity: 0.78 },
    { r: 164, stroke: '#1464B4', width: 1.6, opacity: 0.75, dash: '5 6' },
    { r: 186, stroke: '#F0C14B', width: 1.8, opacity: 0.72 },
    { r: 236, stroke: '#F0C14B', width: 1.6, opacity: 0.7 },
    { r: 322, stroke: '#F0C14B', width: 2.0, opacity: 0.78 },
    { r: 368, stroke: '#F0C14B', width: 1.8, opacity: 0.72 },
  ];

  rings.forEach((ring) => {
    const dashAttr = ring.dash ? ` stroke-dasharray="${ring.dash}"` : '';
    parts.push(
      `<circle cx="${cx}" cy="${cy}" r="${ring.r}" stroke="${ring.stroke}" stroke-width="${ring.width}" opacity="${ring.opacity}"${dashAttr} />`
    );
  });

  const rays = 16;
  const rInner = 56;
  const rTip = 136;
  let starPath = '';
  for (let i = 0; i < rays; i++) {
    const aTip = (i / rays) * Math.PI * 2 - Math.PI / 2;
    const aLeft = ((i - 0.34) / rays) * Math.PI * 2 - Math.PI / 2;
    const aRight = ((i + 0.34) / rays) * Math.PI * 2 - Math.PI / 2;
    const xL = (cx + Math.cos(aLeft) * rInner).toFixed(2);
    const yL = (cy + Math.sin(aLeft) * rInner).toFixed(2);
    const xT = (cx + Math.cos(aTip) * rTip).toFixed(2);
    const yT = (cy + Math.sin(aTip) * rTip).toFixed(2);
    const xR = (cx + Math.cos(aRight) * rInner).toFixed(2);
    const yR = (cy + Math.sin(aRight) * rInner).toFixed(2);
    starPath += `M${xL} ${yL} L${xT} ${yT} L${xR} ${yR} Z `;
  }
  parts.push(`<path d="${starPath}" fill="#F0C14B" fill-opacity="0.42" stroke="#F0C14B" stroke-width="1.5" />`);
  parts.push(`<circle cx="${cx}" cy="${cy}" r="30" fill="#F0C14B" fill-opacity="0.24" stroke="#F0C14B" stroke-width="1.8" />`);

  for (let i = 0; i < 8; i++) {
    const deg = i * 45;
    parts.push(`
      <g transform="rotate(${deg} ${cx} ${cy})">
        <path d="M 372 115 L 402 104 L 424 111 L 404 117 L 434 123 L 402 124 L 376 130 Z"
          fill="#F0C14B" fill-opacity="0.46" stroke="#F0C14B" stroke-width="1.4" stroke-linejoin="round" />
        <path d="M 388 115 C 392 94, 412 88, 424 98 C 412 98, 404 104, 396 113 Z"
          fill="#F0C14B" fill-opacity="0.56" stroke="#F0C14B" stroke-width="1.3" />
      </g>
    `);
  }
  return parts.join('');
}

function renderSummaryWithHighlight(summaryText, keyword) {
  if (!keyword || !summaryText.includes(keyword)) {
    return escapeHtml(summaryText);
  }
  const idx = summaryText.indexOf(keyword);
  const before = escapeHtml(summaryText.slice(0, idx));
  const match = escapeHtml(summaryText.slice(idx, idx + keyword.length));
  const after = escapeHtml(summaryText.slice(idx + keyword.length));
  return `${before}<mark class="keyword-highlight">${match}</mark>${after}`;
}

function renderPolicyHighlightsMarkup(poster) {
  const targets2030 = poster.targets2030 || [];
  const vision2045 = poster.vision2045 || [];
  const bannerLabel =
    poster.microNote || 'MỤC TIÊU / TẦM NHÌN THEO NGHỊ QUYẾT 57 — KHÔNG PHẢI KẾT QUẢ HIỆN TẠI';

  return `
    <div class="policy-disclaimer-banner">
      <span class="policy-disclaimer-dot" aria-hidden="true"></span>
      <span>${escapeHtml(bannerLabel)}</span>
    </div>
    <div class="policy-cards-grid">
      <div class="policy-subcard policy-subcard-2030">
        <div class="policy-subcard-head">
          <span class="policy-subcard-title">MỤC TIÊU ĐẾN NĂM 2030</span>
          <span class="policy-section-ref">Mục II.1</span>
        </div>
        <ul class="policy-kpi-list">
          ${targets2030
            .map(
              (item) => `
            <li class="policy-kpi-row">
              <strong class="policy-kpi-metric">${escapeHtml(item.metric)}</strong>
              <span class="policy-kpi-label">${escapeHtml(item.label)}</span>
            </li>`
            )
            .join('')}
        </ul>
      </div>
      <div class="policy-subcard policy-subcard-2045">
        <div class="policy-subcard-head">
          <span class="policy-subcard-title">TẦM NHÌN ĐẾN NĂM 2045</span>
          <span class="policy-section-ref">Mục II.2</span>
        </div>
        <ul class="policy-kpi-list">
          ${vision2045
            .map(
              (item) => `
            <li class="policy-kpi-row">
              <strong class="policy-kpi-metric">${escapeHtml(item.metric)}</strong>
              <span class="policy-kpi-label">${escapeHtml(item.label)}</span>
            </li>`
            )
            .join('')}
        </ul>
      </div>
    </div>
  `;
}

function renderPosterDetailBlocks(poster) {
  if (poster.id === 1 && poster.displayFacts?.length) {
    return `
      <div class="fact-chips-head">
        <span class="fact-chips-title">Căn cứ văn kiện gốc (Phần Mở đầu)</span>
        <span class="fact-chips-note">Nghị quyết 57-NQ/TW</span>
      </div>
      <div class="fact-chips-grid">
        ${poster.displayFacts
          .map(
            (fact) => `
          <div class="fact-chip-card">
            <div class="fact-chip-top">
              <strong class="fact-chip-badge">${escapeHtml(fact.label)}</strong>
              <span class="claim-tag claim-tag-policy_fact">${escapeHtml(fact.sourceSection)}</span>
            </div>
            <p class="fact-chip-desc">${escapeHtml(fact.summary)}</p>
          </div>`
          )
          .join('')}
      </div>
    `;
  }

  if (poster.id === 2 && poster.fourPillBadges?.length) {
    return `
      <div class="fact-chips-head">
        <span class="fact-chips-title">4 trụ định hướng cốt lõi (Mục I)</span>
        <span class="fact-chips-note">Nghị quyết 57-NQ/TW</span>
      </div>
      <div class="fact-chips-grid">
        ${poster.fourPillBadges
          .map(
            (item) => `
          <div class="fact-chip-card">
            <div class="fact-chip-top">
              <strong class="fact-chip-badge">${escapeHtml(item.badgeTitle)}</strong>
              <span class="claim-tag claim-tag-policy_fact">${escapeHtml(item.sourceSection)}</span>
            </div>
            <p class="fact-chip-desc">${escapeHtml(item.shortLabel)}</p>
          </div>`
          )
          .join('')}
      </div>
      ${poster.pillar4Note ? `<p class="pillar-extra-note">${escapeHtml(poster.pillar4Note)}</p>` : ''}
    `;
  }

  if (poster.id === 4 && poster.fiveYouthActions?.length) {
    return `
      <div class="fact-chips-head">
        <span class="fact-chips-title">5 đề xuất phần việc thanh niên Cụm 1</span>
        <span class="fact-chips-note">Định hướng tại cơ sở</span>
      </div>
      <div class="fact-chips-grid fact-chips-grid-5">
        ${poster.fiveYouthActions
          .map(
            (item) => `
          <div class="fact-chip-card">
            <div class="fact-chip-top">
              <strong class="fact-chip-badge">${escapeHtml(item.badgeTitle)}</strong>
              <span class="claim-tag claim-tag-youth_action_suggestion">${escapeHtml(item.sourceSection)}</span>
            </div>
            <p class="fact-chip-desc">${escapeHtml(item.shortLabel)}</p>
          </div>`
          )
          .join('')}
      </div>
    `;
  }

  return '';
}

function buildSourcesModalMarkup() {
  const tasksHtml = SEVEN_TASKS_GROUPED.map(
    (pillar, idx) => `
      <div class="sources-pillar-card">
        <div class="sources-pillar-head">
          <span class="sources-pillar-num">Trụ ${idx + 1}/4</span>
          <h5 class="sources-pillar-title">${escapeHtml(pillar.pillarTitle)}</h5>
        </div>
        <ul class="sources-task-list">
          ${pillar.tasks
            .map(
              (task) => `
            <li class="sources-task-item">
              <div class="sources-task-top">
                <span class="sources-task-badge">Nhiệm vụ ${task.taskNumber}</span>
                <span class="sources-task-ref">${escapeHtml(task.nq57Section)}</span>
              </div>
              <p class="sources-task-text">${escapeHtml(task.summary)}</p>
            </li>`
            )
            .join('')}
        </ul>
      </div>
    `
  ).join('');

  const questionsHtml = EVALUATION_QUESTIONS.map(
    (q) => `
      <div class="sources-qa-card">
        <div class="sources-qa-head">
          <span class="sources-qa-num">Câu ${q.id}/5</span>
          <span class="claim-tag claim-tag-policy_fact">${escapeHtml(q.nq57Anchor)}</span>
        </div>
        <h5 class="sources-qa-question">${escapeHtml(q.question)}</h5>
        <p class="sources-qa-answer">${escapeHtml(q.answerSummary)}</p>
        <p class="sources-qa-ref">Đối chiếu: ${escapeHtml(q.excelRef)}</p>
      </div>
    `
  ).join('');

  const relatedHtml = RELATED_IMPLEMENTATION_DOCS.map(
    (doc) => `
      <div class="sources-doc-item">
        <div class="sources-doc-meta">
          <strong>${escapeHtml(doc.code)}</strong>
          <span>${escapeHtml(doc.issuedBy)} · ${escapeHtml(doc.issuedDate)}</span>
        </div>
        <p class="sources-doc-title">${escapeHtml(doc.title)}</p>
        <p class="sources-doc-note">${escapeHtml(doc.separationNote)}</p>
        <a class="sources-ext-link" href="${escapeHtml(doc.url)}" target="_blank" rel="noopener noreferrer">
          Mở văn bản ${escapeHtml(doc.code)} ↗
        </a>
      </div>
    `
  ).join('');

  return `
    <section class="sources-section" aria-labelledby="sec-seven-tasks">
      <div class="sources-section-head">
        <h4 id="sec-seven-tasks">1. 7 nhóm nhiệm vụ &amp; giải pháp trọng tâm (4 trụ · Mục III NQ57)</h4>
      </div>
      <div class="sources-pillars-grid">${tasksHtml}</div>
    </section>

    <section class="sources-section" aria-labelledby="sec-five-questions">
      <div class="sources-section-head">
        <h4 id="sec-five-questions">2. 5 câu hỏi đánh giá &amp; phản biện trọng tâm</h4>
      </div>
      <div class="sources-qa-grid">${questionsHtml}</div>
    </section>

    <section class="sources-section" aria-labelledby="sec-editorial-audit">
      <div class="sources-section-head">
        <h4 id="sec-editorial-audit">3. Đối chiếu hiệu đính dữ liệu &amp; ghi chú kỹ thuật</h4>
      </div>
      <div class="sources-audit-grid">
        <div class="audit-diff-card audit-diff-old">
          <div class="audit-diff-head">
            <span class="diff-badge-red">BẢN GỐC · UNVERIFIED</span>
            <span class="diff-file-name">3_BAI_DANG_GOC_DOI1.docx</span>
          </div>
          <p class="audit-diff-text">"${escapeHtml(SOCIAL_POST_DATA.originalExcerpt?.text || '')}"</p>
          <p class="audit-diff-note">Lý do: ${escapeHtml(SOCIAL_POST_DATA.originalExcerpt?.reason || '')}</p>
        </div>

        <div class="audit-diff-card audit-diff-new">
          <div class="audit-diff-head">
            <span class="diff-badge-green">BẢN HOÀN CHỈNH · ĐỀ XUẤT NHÓM</span>
            <span class="diff-badge-warn">CHỜ NHÓM DUYỆT</span>
          </div>
          <p class="audit-diff-text">"${escapeHtml(SOCIAL_POST_DATA.revisedSafeProposal?.text || '')}"</p>
          <p class="audit-diff-note">${escapeHtml(SOCIAL_POST_DATA.hashtagFixNote || '')} · Kênh dự kiến: ${escapeHtml(SOCIAL_POST_DATA.channelPendingNote || '')}</p>
        </div>

        <div class="sources-audit-note-card">
          <div class="sources-task-top">
            <span class="sources-task-badge">Chuẩn hóa Video &amp; Thumbnail</span>
            <span class="sources-task-ref">101,45 giây · 9:16</span>
          </div>
          <p class="sources-task-text">${escapeHtml(VIDEO_DATA.thumbFixNote || '')}</p>
          <p class="sources-task-text">${escapeHtml(VIDEO_DATA.speechAuditNote || '')}</p>
          <p class="sources-task-ref">${escapeHtml(VIDEO_DATA.musicAndAiLicensing?.note || '')}</p>
        </div>
      </div>
    </section>

    <section class="sources-section" aria-labelledby="sec-official-links">
      <div class="sources-section-head">
        <h4 id="sec-official-links">4. Nguồn chính thống &amp; Ghi chú minh bạch</h4>
      </div>
      <div class="sources-links-box">
        <div class="sources-primary-links">
          <a class="btn-official-cta" href="${escapeHtml(OFFICIAL_RESOLUTION_URL)}" target="_blank" rel="noopener noreferrer">
            <span>Nguồn chính: Toàn văn NQ 57-NQ/TW · chinhphu.vn</span>
            <span aria-hidden="true">↗</span>
          </a>
          <a class="btn-official-secondary" href="${escapeHtml(SECONDARY_OFFICIAL_URL)}" target="_blank" rel="noopener noreferrer">
            <span>Bản đối chiếu: Bộ KH&amp;CN · mst.gov.vn</span>
            <span aria-hidden="true">↗</span>
          </a>
        </div>

        <div class="sources-concept-notice">
          <strong>Lưu ý minh bạch tên gọi, khẩu hiệu &amp; trạng thái hồ sơ:</strong>
          <p>${escapeHtml(CONCEPT_NOTICE)}</p>
          <p class="sources-status-note">${escapeHtml(FINALE_DATA.teamMetadataNotice || '')}</p>
        </div>

        <div class="sources-related-docs">
          <h5>Văn bản triển khai cấp Chính phủ (tách biệt khỏi lời văn gốc 57-NQ/TW):</h5>
          ${relatedHtml}
        </div>
      </div>
    </section>
  `;
}

function buildDownloadsModalMarkup() {
  return RESOURCE_HUB_GROUPS.map(
    (group) => `
      <section class="sources-section">
        <div class="sources-section-head">
          <h4>${escapeHtml(group.groupTitle)}</h4>
        </div>
        <div class="downloads-group-grid">
          ${group.items
            .map(
              (item) => `
            <a class="download-hub-card" href="${escapeHtml(item.href)}" download="${escapeHtml(item.filename)}">
              <div class="download-hub-meta">
                <strong class="download-hub-title">${escapeHtml(item.label)}</strong>
                <span class="download-hub-sub">${escapeHtml(item.filename)} · ${escapeHtml(item.meta)}</span>
              </div>
              <span class="download-hub-icon" aria-hidden="true">↓</span>
            </a>`
            )
            .join('')}
        </div>
      </section>
    `
  ).join('');
}

function buildPptModalMarkup() {
  const ppt = PRESENTATION_DOC_DATA.pptReference;
  const slidesRows = (ppt?.slides || [])
    .map(
      (s) => `
      <li class="ppt-slide-row">
        <span class="ppt-slide-num">Slide ${s.slideNumber}</span>
        <span class="ppt-slide-page">${escapeHtml(s.displayedPageLabel || 'Thiếu số trang')}</span>
        <span class="ppt-slide-topic">${escapeHtml(s.topic)}</span>
      </li>`
    )
    .join('');

  return `
    <section class="sources-section">
      <div class="sources-section-head">
        <h4>1. Minh bạch công cụ số, AI &amp; Bản quyền mở</h4>
      </div>
      <div class="sources-concept-notice">
        <p>${escapeHtml(LANDING_DATA.aiDisclosure)}</p>
        <p class="sources-status-note">Huy hiệu Đoàn TNCS Hồ Chí Minh: dùng nguyên mẫu huy-hieu-doan-clean.png (941 × 1042 px), không vẽ lại bằng AI và không tự tạo Logo Hội Sinh viên.</p>
        <p class="sources-status-note">Phông chữ &amp; Mã nguồn mở: Be Vietnam Pro (OFL-1.1), Times New Roman, Reveal.js, Vite, GSAP, qrcode (MIT), jsQR, Python-docx.</p>
      </div>
    </section>

    <section class="sources-section">
      <div class="sources-section-head">
        <h4>2. Tóm tắt 09 slide PPT gốc tham khảo (tùy chọn — không thay thế Thuyết minh 03 trang)</h4>
      </div>
      <div class="ppt-audit-summary">
        <p>${escapeHtml(ppt?.auditSummary || '')}</p>
      </div>
      <ul class="ppt-slides-list">${slidesRows}</ul>
    </section>
  `;
}

export async function initIntegratedDeck() {
  const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || false;

  const state = {
    stage: 0, // 0..9
    isLiteMode: prefersReduced,
    isMotionOff: false,
    isSixMinMode: false,
    isAutoDemo: false,
    isNotesOpen: false,
    isHudMenuOpen: false,
    isLightboxOpen: false,
    isSourcesOpen: false,
    isDownloadsOpen: false,
    isPptOpen: false,
    socialViewMode: 'visual', // 'visual' | 'raw'
    lightboxItem: { type: 'poster', posterId: 1 },
    isTransitioning: false,
  };

  if (state.isLiteMode) {
    document.body.classList.add('lite-mode');
  }

  const setText = (id, val) => {
    const el = document.getElementById(id);
    if (el && typeof val === 'string') el.textContent = val;
  };
  const setHref = (id, val) => {
    const el = document.getElementById(id);
    if (el && val) el.setAttribute('href', val);
  };

  const headerEmblem = document.getElementById('header-emblem-img');
  if (headerEmblem) {
    headerEmblem.src = EMBLEM_ASSET.src;
    headerEmblem.alt = EMBLEM_ASSET.alt;
  }

  // Hydrate Landing Stage (Stage 0)
  setText('landing-eyebrow', LANDING_DATA.eyebrow);
  setText('landing-concept-pill', LANDING_DATA.conceptTitle);
  setText('landing-tagline-text', LANDING_DATA.tagline.toUpperCase());
  setText('landing-intro', LANDING_DATA.introSummary);
  setText('btn-start-label', LANDING_DATA.startButtonLabel);
  setText('landing-source-line', LANDING_DATA.sourceLine);

  // Hydrate Video Stage (Stage 1)
  const videoEl = document.getElementById('campaign-video');
  const videoSource = videoEl?.querySelector('source');
  const videoTrack = document.getElementById('video-vtt-track');
  if (videoEl) videoEl.poster = VIDEO_DATA.fixedThumb1080Path;
  if (videoSource) videoSource.src = VIDEO_DATA.webOptimizedPath;
  if (videoTrack) videoTrack.src = VIDEO_DATA.subtitlesVttPath;
  videoEl?.load();

  setText('video-title', VIDEO_DATA.title);
  setText('video-pull-quote', VIDEO_DATA.pullQuote);

  const speechLogEl = document.getElementById('video-speech-log');
  if (speechLogEl) {
    speechLogEl.innerHTML = (VIDEO_DATA.narrativeMoments || [])
      .map(
        (moment) => `
        <li class="video-narrative-item">
          <span class="narrative-index">${escapeHtml(moment.index)}</span>
          <div class="narrative-copy">
            <strong>${escapeHtml(moment.title)}</strong>
            <span>${escapeHtml(moment.summary)}</span>
          </div>
        </li>`
      )
      .join('');
  }

  // Hydrate Poster Chapter Pills (Stages 2..6)
  const posterMiniPills = document.getElementById('poster-mini-pills');
  if (posterMiniPills) {
    posterMiniPills.innerHTML = POSTERS.map(
      (p) =>
        `<button type="button" class="stage-pill" data-jump-stage="${p.stage}" aria-label="Ấn phẩm ${escapeHtml(p.badgeLabel)} – ${escapeHtml(p.chapterTitle)}">${escapeHtml(p.shortChapterLabel)}</button>`
    ).join('');
  }

  // Hydrate Social Post Stage (Stage 7)
  setText('social-headline', SOCIAL_POST_DATA.title);
  setText('social-channel-note', SOCIAL_POST_DATA.channelDisplay);
  setText('social-schedule-note', SOCIAL_POST_DATA.topicDisplay);

  const socialParagraphsEl = document.getElementById('social-visual-paragraphs');
  if (socialParagraphsEl) {
    const paras = SOCIAL_POST_DATA.fullPostParagraphs || [];
    socialParagraphsEl.innerHTML = paras
      .slice(1)
      .map((p) => {
        if (p.includes('nghiên cứu phương án số hóa thông tin về các địa chỉ đỏ')) {
          return `<p class="editorial-para editorial-para-proposal">${escapeHtml(p)}</p>`;
        }
        return `<p class="editorial-para">${escapeHtml(p)}</p>`;
      })
      .join('');
  }

  const socialTagsEl = document.getElementById('social-hashtags-row');
  if (socialTagsEl) {
    socialTagsEl.innerHTML = (SOCIAL_POST_DATA.hashtags || [])
      .map((tag) => `<span class="hashtag-pill">${escapeHtml(tag)}</span>`)
      .join('');
  }

  const socialRawPre = document.getElementById('social-raw-pre');
  if (socialRawPre) {
    const rawLines = [
      ...(SOCIAL_POST_DATA.fullPostParagraphs || []),
      '',
      (SOCIAL_POST_DATA.hashtags || []).join(' '),
    ];
    socialRawPre.textContent = rawLines.join('\n');
  }

  const socialHighlightsEl = document.getElementById('social-highlights-list');
  if (socialHighlightsEl) {
    socialHighlightsEl.innerHTML = (SOCIAL_POST_DATA.highlights || [])
      .map(
        (item) => `
        <li class="social-highlight-item">
          <strong>${escapeHtml(item.title)}</strong>
          <p>${escapeHtml(item.summary)}</p>
        </li>`
      )
      .join('');
  }

  // Hydrate Presentation Story Cards (Stage 8)
  const presCardsGrid = document.getElementById('pres-cards-grid');
  if (presCardsGrid) {
    presCardsGrid.innerHTML = (PRESENTATION_DOC_DATA.storyCards || [])
      .map(
        (card) => `
        <article class="pres-card">
          <div class="pres-card-head">
            <span class="pres-card-icon" aria-hidden="true">${PRES_CARD_ICONS[card.iconKey] || PRES_CARD_ICONS.spark}</span>
            <h3 class="pres-card-title">${escapeHtml(card.title)}</h3>
          </div>
          <p class="pres-card-summary">${escapeHtml(card.summary)}</p>
        </article>`
      )
      .join('');
  }

  // Hydrate Finale Stage (Stage 9)
  setText('finale-badge', FINALE_DATA.eyebrow);
  setText('finale-heading', FINALE_DATA.heading);
  setText('finale-summary', FINALE_DATA.summary);
  setText('btn-finale-official-label', FINALE_DATA.officialButtonLabel);
  setText('finale-source-credit', FINALE_DATA.sourceCredit);
  setHref('btn-finale-official', FINALE_DATA.officialUrl);
  setHref('btn-finale-secondary-official', FINALE_DATA.secondaryOfficialUrl);

  const finaleGallery = document.getElementById('finale-gallery');
  if (finaleGallery) {
    finaleGallery.innerHTML = POSTERS.map(
      (p) => `
      <button type="button" class="finale-thumb-card" data-zoom-poster="${p.id}">
        <div class="finale-thumb-img-wrap">
          <img src="${escapeHtml(p.posterPath)}" alt="Ấn phẩm ${escapeHtml(p.index)} – ${escapeHtml(p.title)}" />
        </div>
        <span class="finale-thumb-idx">${escapeHtml(p.badgeLabel)}</span>
        <span class="finale-thumb-role">${escapeHtml(p.chapterTitle)}</span>
      </button>`
    ).join('');
  }

  // Mount Đông Sơn drum SVG backdrops & Finale QR
  const drumMarkup = buildDongSonDrumMarkup();
  const landingDrum = document.getElementById('landing-dong-son-svg');
  const finaleDrum = document.getElementById('finale-dong-son-svg');
  if (landingDrum) landingDrum.innerHTML = drumMarkup;
  if (finaleDrum) finaleDrum.innerHTML = drumMarkup;

  const qrBox = document.getElementById('finale-qr-box');
  if (qrBox) {
    try {
      qrBox.innerHTML = await QRCode.toString(FINALE_DATA.officialUrl, {
        type: 'svg',
        errorCorrectionLevel: 'M',
        margin: 2,
        color: { dark: '#0D2B52', light: '#FFFFFF' },
      });
    } catch (err) {
      console.error('QR generation error:', err);
    }
  }

  // Populate Modals
  const sourcesBody = document.getElementById('sources-modal-body');
  if (sourcesBody) sourcesBody.innerHTML = buildSourcesModalMarkup();

  const downloadsBody = document.getElementById('downloads-modal-body');
  if (downloadsBody) downloadsBody.innerHTML = buildDownloadsModalMarkup();

  const pptBody = document.getElementById('ppt-modal-body');
  if (pptBody) pptBody.innerHTML = buildPptModalMarkup();

  // Preload emblem + 5 posters + video thumbnail
  [EMBLEM_ASSET.src, VIDEO_DATA.fixedThumb1080Path, ...POSTERS.map((p) => p.posterPath)].forEach((src) => {
    const img = new Image();
    img.src = src;
  });

  // Initialize Heritage Sky Canvas & Motion Engine
  const canvasEl = document.getElementById('heritage-sky-canvas');
  const heritageCanvas = createHeritageSkyCanvas(canvasEl);
  const motion = createMotionEngine();
  heritageCanvas.setLiteMode(state.isLiteMode);
  motion.setLiteMode(state.isLiteMode);

  // Initialize Reveal.js with layout & input cleanly managed by our 10-stage engine
  const deck = new Reveal({
    disableLayout: true,
    scrollActivationWidth: null,
    controls: false,
    progress: false,
    keyboard: false,
    touch: false,
    overview: false,
    center: false,
    history: false,
    hash: false,
    transition: 'none',
    backgroundTransition: 'none',
  });
  await deck.initialize();
  window.Reveal = deck;

  // DOM References
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  const hudProgress = document.getElementById('hud-progress');
  const btnHudMenu = document.getElementById('btn-hud-menu');
  const hudToolsPopover = document.getElementById('hud-tools-popover');

  const btnNotes = document.getElementById('btn-notes');
  const btnHudSources = document.getElementById('btn-hud-sources');
  const btnDownloads = document.getElementById('btn-downloads');
  const btnAutoDemo = document.getElementById('btn-auto-demo');
  const btnLite = document.getElementById('btn-lite');
  const btnMotionOff = document.getElementById('btn-motion-off');
  const btnFullscreen = document.getElementById('btn-fullscreen');
  const btnTimingMode = document.getElementById('btn-timing-mode');
  const timingModeLabel = document.getElementById('timing-mode-label');

  const btnVideoOverlayPlay = document.getElementById('btn-video-overlay-play');
  const btnVideoCaptions = document.getElementById('btn-video-captions');
  const btnVideoNextPosters = document.getElementById('btn-video-next-posters');

  const speakerDrawer = document.getElementById('speaker-drawer');
  const speakerDrawerTime = document.getElementById('speaker-drawer-time');
  const speakerDrawerTitle = document.getElementById('speaker-drawer-title');
  const speakerDrawerCue = document.getElementById('speaker-drawer-cue');
  const speakerDrawerText = document.getElementById('speaker-drawer-text');
  const speakerDrawerExtended = document.getElementById('speaker-drawer-extended');

  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxIndex = document.getElementById('lightbox-index');
  const lightboxTitle = document.getElementById('lightbox-title');
  const btnLightboxDownload = document.getElementById('btn-lightbox-download');
  const btnLightboxPrev = document.getElementById('btn-lightbox-prev');
  const btnLightboxNext = document.getElementById('btn-lightbox-next');

  const sourcesModal = document.getElementById('sources-modal');
  const downloadsModal = document.getElementById('downloads-modal');
  const pptModal = document.getElementById('ppt-modal');

  // Auto Demo Timer
  let autoDemoTimer = null;

  function clearAutoDemoTimer() {
    if (autoDemoTimer) {
      window.clearTimeout(autoDemoTimer);
      autoDemoTimer = null;
    }
  }

  function scheduleNextAutoDemoBeat() {
    clearAutoDemoTimer();
    if (!state.isAutoDemo || state.stage >= 9) {
      if (state.stage >= 9 && state.isAutoDemo) {
        setAutoDemo(false);
      }
      return;
    }
    const meta = getStageMeta(state.stage);
    if (state.stage === 1 && videoEl && !videoEl.ended) {
      if (!videoEl.paused) return;
    }
    autoDemoTimer = window.setTimeout(() => {
      if (state.isAutoDemo && state.stage < 9) {
        goToStage(state.stage + 1);
      }
    }, (meta.autoSeconds || 8) * 1000);
  }

  function setAutoDemo(enabled) {
    state.isAutoDemo = Boolean(enabled);
    if (btnAutoDemo) {
      btnAutoDemo.setAttribute('aria-pressed', String(state.isAutoDemo));
      btnAutoDemo.classList.toggle('is-active', state.isAutoDemo);
      const labelSpan = btnAutoDemo.querySelector('span');
      if (labelSpan) labelSpan.textContent = state.isAutoDemo ? 'Tạm dừng tự động' : 'Tự động trình chiếu';
    }
    if (state.isAutoDemo) {
      scheduleNextAutoDemoBeat();
    } else {
      clearAutoDemoTimer();
    }
  }

  function setHudPopover(open) {
    state.isHudMenuOpen = Boolean(open);
    if (hudToolsPopover) hudToolsPopover.hidden = !state.isHudMenuOpen;
    if (btnHudMenu) {
      btnHudMenu.setAttribute('aria-expanded', String(state.isHudMenuOpen));
      btnHudMenu.classList.toggle('is-active', state.isHudMenuOpen);
    }
  }

  function syncNotesUI() {
    const meta = getStageMeta(state.stage);
    if (btnNotes) {
      btnNotes.setAttribute('aria-pressed', String(state.isNotesOpen));
      btnNotes.classList.toggle('is-active', state.isNotesOpen);
    }
    if (!speakerDrawer) return;
    speakerDrawer.hidden = !state.isNotesOpen;
    if (state.isNotesOpen) {
      if (speakerDrawerTime) speakerDrawerTime.textContent = meta.cue.timeRange;
      if (speakerDrawerTitle) speakerDrawerTitle.textContent = `Lời nói · ${meta.label}`;
      if (speakerDrawerCue) speakerDrawerCue.textContent = `Thao tác: ${meta.cue.actionCue}`;
      if (speakerDrawerText) speakerDrawerText.textContent = meta.cue.spokenText;
      if (speakerDrawerExtended) {
        if (state.isSixMinMode && meta.cue.extendedTip) {
          speakerDrawerExtended.textContent = meta.cue.extendedTip;
          speakerDrawerExtended.hidden = false;
        } else {
          speakerDrawerExtended.textContent = '';
          speakerDrawerExtended.hidden = true;
        }
      }
    }
  }

  function syncHeaderAndHud() {
    const meta = getStageMeta(state.stage);
    if (hudProgress) hudProgress.textContent = meta.label;
    if (btnPrev) btnPrev.disabled = state.stage <= 0;
    if (btnNext) btnNext.disabled = state.stage >= 9;

    // 6-Step Story Rail active highlight
    document.querySelectorAll('#product-breadcrumb .crumb-btn').forEach((btn) => {
      const prod = btn.getAttribute('data-crumb-product');
      const active = prod === meta.productKey;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-current', active ? 'step' : 'false');
    });

    if (btnTimingMode && timingModeLabel) {
      btnTimingMode.setAttribute('aria-pressed', String(state.isSixMinMode));
      btnTimingMode.classList.toggle('is-active', state.isSixMinMode);
      timingModeLabel.textContent = state.isSixMinMode ? '06:00 mở rộng' : 'Nhịp 04:00';
    }

    if (btnLite) {
      btnLite.setAttribute('aria-pressed', String(state.isLiteMode));
      btnLite.classList.toggle('is-active', state.isLiteMode);
    }

    if (btnMotionOff) {
      btnMotionOff.setAttribute('aria-pressed', String(state.isMotionOff));
      btnMotionOff.classList.toggle('is-active', state.isMotionOff);
    }

    if (btnHudSources) {
      btnHudSources.setAttribute('aria-pressed', String(state.isSourcesOpen));
      btnHudSources.classList.toggle('is-active', state.isSourcesOpen);
    }

    if (btnDownloads) {
      btnDownloads.setAttribute('aria-pressed', String(state.isDownloadsOpen));
      btnDownloads.classList.toggle('is-active', state.isDownloadsOpen);
    }

    document.querySelectorAll('#poster-mini-pills [data-jump-stage]').forEach((el) => {
      const s = Number(el.getAttribute('data-jump-stage'));
      el.classList.toggle('is-active', s === state.stage);
      el.setAttribute('aria-current', s === state.stage ? 'step' : 'false');
    });

    syncNotesUI();
  }

  function renderPosterStage(stage) {
    const poster = getPosterByStage(stage);
    if (!poster) return;

    const sectionPoster = document.getElementById('stage-posters');
    if (sectionPoster) sectionPoster.setAttribute('data-stage', String(stage));

    const posterStageImg = document.getElementById('poster-stage-img');
    if (posterStageImg) {
      posterStageImg.src = poster.posterPath;
      posterStageImg.alt = `Ấn phẩm ${poster.index} – ${poster.title}`;
    }

    setText('poster-chapter-indicator', `Chặng ${poster.badgeLabel} · ${poster.chapterTitle}`);
    setText('stage-badge', poster.badgeLabel);
    setText('panel-role', poster.chapterTitle.toUpperCase());
    setText('panel-title', poster.title);
    setText('panel-subtitle', poster.subtitle);

    const panelMicroNote = document.getElementById('panel-micro-note');
    if (panelMicroNote) {
      if (poster.microNote && poster.id !== 3) {
        panelMicroNote.textContent = poster.microNote;
        panelMicroNote.hidden = false;
      } else {
        panelMicroNote.textContent = '';
        panelMicroNote.hidden = true;
      }
    }

    const panelSummary = document.getElementById('panel-summary');
    if (panelSummary) {
      panelSummary.innerHTML = renderSummaryWithHighlight(
        poster.editorialSummary,
        poster.highlightKeyword
      );
    }

    const panelPolicyHighlights = document.getElementById('panel-policy-highlights');
    if (panelPolicyHighlights) {
      if (poster.id === 3) {
        panelPolicyHighlights.innerHTML = renderPolicyHighlightsMarkup(poster);
        panelPolicyHighlights.hidden = false;
      } else {
        panelPolicyHighlights.innerHTML = '';
        panelPolicyHighlights.hidden = true;
      }
    }

    const panelFactChips = document.getElementById('panel-fact-chips');
    if (panelFactChips) {
      const markup = renderPosterDetailBlocks(poster);
      if (markup) {
        panelFactChips.innerHTML = markup;
        panelFactChips.hidden = false;
      } else {
        panelFactChips.innerHTML = '';
        panelFactChips.hidden = true;
      }
    }

    setText('motif-title', poster.motifTitle);
    const motifArt = document.getElementById('motif-art');
    if (motifArt) motifArt.innerHTML = MOTIF_SVGS[poster.motifSvgKey] || '';
    const motifPills = document.getElementById('motif-pills');
    if (motifPills) {
      motifPills.innerHTML = (poster.domainPills || [])
        .map((pill) => `<li class="motif-pill">${escapeHtml(pill)}</li>`)
        .join('');
    }

    const panelOfficialWrap = document.getElementById('panel-official-wrap');
    const btnOfficialLink = document.getElementById('btn-official-link');
    const btnOfficialMirror = document.getElementById('btn-official-mirror');
    if (panelOfficialWrap && btnOfficialLink) {
      const showOfficial = Boolean(poster.hasQr && poster.qrTargetUrl);
      panelOfficialWrap.hidden = !showOfficial;
      if (showOfficial) {
        btnOfficialLink.href = poster.qrTargetUrl;
        if (btnOfficialMirror) btnOfficialMirror.href = SECONDARY_OFFICIAL_URL;
      }
    }
  }

  function applyStageState(targetStage) {
    const prevStage = state.stage;
    state.stage = targetStage;

    if (prevStage === 1 && targetStage !== 1 && videoEl && !videoEl.paused) {
      videoEl.pause();
    }

    const meta = getStageMeta(targetStage);
    if (deck.getState().indexh !== meta.revealIdx) {
      deck.slide(meta.revealIdx);
    }

    if (targetStage >= 2 && targetStage <= 6) {
      renderPosterStage(targetStage);
    }

    heritageCanvas.setStage(targetStage);
    if (!state.isLiteMode && !state.isMotionOff && (targetStage === 0 || targetStage === 4 || targetStage === 9)) {
      heritageCanvas.triggerGrandWave?.(`stage-${targetStage}`);
    }

    syncHeaderAndHud();

    if (window.innerWidth <= 1024) {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }

    if (state.isAutoDemo) {
      scheduleNextAutoDemoBeat();
    }
  }

  let activeTransitionSeq = 0;

  async function goToStage(rawTarget) {
    const targetStage = Math.max(0, Math.min(9, Number(rawTarget)));
    if (Number.isNaN(targetStage)) return;

    setHudPopover(false);
    closeAllModals();

    if (targetStage === state.stage && !state.isTransitioning) {
      syncHeaderAndHud();
      return;
    }

    const fromStage = state.stage;
    const seq = ++activeTransitionSeq;
    state.isTransitioning = true;

    await motion.playStageTransition(fromStage, targetStage, () => {
      if (seq !== activeTransitionSeq) return;
      applyStageState(targetStage);
      motion.animateStageEntrance(targetStage);
    });

    if (seq === activeTransitionSeq) {
      state.isTransitioning = false;
    }
  }

  function nextStage() {
    if (state.stage < 9) return goToStage(state.stage + 1);
    return Promise.resolve();
  }

  function prevStage() {
    if (state.stage > 0) return goToStage(state.stage - 1);
    return Promise.resolve();
  }

  function toggleLiteMode(forceValue) {
    state.isLiteMode = typeof forceValue === 'boolean' ? forceValue : !state.isLiteMode;
    document.body.classList.toggle('lite-mode', state.isLiteMode);
    heritageCanvas.setLiteMode(state.isLiteMode);
    motion.setLiteMode(state.isLiteMode);
    syncHeaderAndHud();
  }

  function toggleMotionOff(forceValue) {
    state.isMotionOff = typeof forceValue === 'boolean' ? forceValue : !state.isMotionOff;
    document.body.classList.toggle('motion-off', state.isMotionOff);
    heritageCanvas.setMotionOff(state.isMotionOff);
    motion.setMotionOff(state.isMotionOff);
    syncHeaderAndHud();
  }

  function toggleNotes(forceValue) {
    state.isNotesOpen = typeof forceValue === 'boolean' ? forceValue : !state.isNotesOpen;
    syncNotesUI();
  }

  function closeAllModals() {
    if (state.isLightboxOpen) closeLightbox();
    if (state.isSourcesOpen) closeSourcesModal();
    if (state.isDownloadsOpen) closeDownloadsModal();
    if (state.isPptOpen) closePptModal();
  }

  function renderLightboxAsset(item) {
    state.lightboxItem = item;
    if (item.type === 'asset') {
      if (lightboxImg) {
        lightboxImg.src = item.src;
        lightboxImg.alt = item.title;
      }
      if (lightboxIndex) lightboxIndex.textContent = item.badge || 'XEM TRƯỚC';
      if (lightboxTitle) lightboxTitle.textContent = item.title;
      if (btnLightboxDownload) {
        btnLightboxDownload.href = item.src;
        btnLightboxDownload.setAttribute('download', item.filename);
      }
      if (btnLightboxPrev) btnLightboxPrev.hidden = true;
      if (btnLightboxNext) btnLightboxNext.hidden = true;
      return;
    }

    const poster = getPosterByNumber(item.posterId);
    state.lightboxItem = { type: 'poster', posterId: poster.id };
    if (lightboxImg) {
      lightboxImg.src = poster.posterPath;
      lightboxImg.alt = `Phóng to ấn phẩm ${poster.index} – ${poster.title}`;
    }
    if (lightboxIndex) lightboxIndex.textContent = poster.badgeLabel;
    if (lightboxTitle) lightboxTitle.textContent = poster.title;
    if (btnLightboxDownload) {
      btnLightboxDownload.href = poster.posterPath;
      btnLightboxDownload.setAttribute('download', poster.filename);
    }
    if (btnLightboxPrev) btnLightboxPrev.hidden = false;
    if (btnLightboxNext) btnLightboxNext.hidden = false;
  }

  function openPosterLightbox(posterId) {
    setHudPopover(false);
    closeAllModals();
    const defaultId =
      state.stage >= 2 && state.stage <= 6 ? getPosterByStage(state.stage)?.id || 1 : 1;
    renderLightboxAsset({ type: 'poster', posterId: posterId || defaultId });
    state.isLightboxOpen = true;
    if (lightboxModal) lightboxModal.hidden = false;
    document.getElementById('btn-lightbox-close')?.focus();
  }

  function openCustomAssetLightbox({ src, filename, title, badge }) {
    setHudPopover(false);
    closeAllModals();
    renderLightboxAsset({ type: 'asset', src, filename, title, badge });
    state.isLightboxOpen = true;
    if (lightboxModal) lightboxModal.hidden = false;
    document.getElementById('btn-lightbox-close')?.focus();
  }

  function closeLightbox() {
    state.isLightboxOpen = false;
    if (lightboxModal) lightboxModal.hidden = true;
  }

  function openSourcesModal() {
    setHudPopover(false);
    closeAllModals();
    state.isSourcesOpen = true;
    if (sourcesModal) sourcesModal.hidden = false;
    syncHeaderAndHud();
    document.getElementById('btn-sources-close')?.focus();
  }

  function closeSourcesModal() {
    state.isSourcesOpen = false;
    if (sourcesModal) sourcesModal.hidden = true;
    syncHeaderAndHud();
  }

  function openDownloadsModal() {
    setHudPopover(false);
    closeAllModals();
    state.isDownloadsOpen = true;
    if (downloadsModal) downloadsModal.hidden = false;
    syncHeaderAndHud();
    document.getElementById('btn-downloads-close')?.focus();
  }

  function closeDownloadsModal() {
    state.isDownloadsOpen = false;
    if (downloadsModal) downloadsModal.hidden = true;
    syncHeaderAndHud();
  }

  function openPptModal() {
    setHudPopover(false);
    closeAllModals();
    state.isPptOpen = true;
    if (pptModal) pptModal.hidden = false;
    document.getElementById('btn-ppt-close')?.focus();
  }

  function closePptModal() {
    state.isPptOpen = false;
    if (pptModal) pptModal.hidden = true;
  }

  async function toggleFullscreen() {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      // Ignore fullscreen denial in restricted iframes / headless environments
    }
  }

  // Video Events & Controls
  function syncVideoOverlayAndCaptions() {
    if (!videoEl) return;
    if (btnVideoOverlayPlay) {
      btnVideoOverlayPlay.hidden = !videoEl.paused && !videoEl.ended;
    }
  }

  if (videoEl) {
    videoEl.addEventListener('play', () => {
      syncVideoOverlayAndCaptions();
      if (btnVideoNextPosters) btnVideoNextPosters.classList.remove('is-ended-highlight');
    });
    videoEl.addEventListener('pause', syncVideoOverlayAndCaptions);
    videoEl.addEventListener('ended', () => {
      syncVideoOverlayAndCaptions();
      if (btnVideoNextPosters) btnVideoNextPosters.classList.add('is-ended-highlight');
      if (state.isAutoDemo && state.stage === 1) {
        goToStage(2);
      }
    });
  }

  btnVideoOverlayPlay?.addEventListener('click', () => {
    if (!videoEl) return;
    if (videoEl.paused) {
      videoEl.play().catch(() => {});
    } else {
      videoEl.pause();
    }
  });

  btnVideoCaptions?.addEventListener('click', () => {
    if (!videoEl || !videoEl.textTracks || !videoEl.textTracks.length) return;
    const track = videoEl.textTracks[0];
    const nextShowing = track.mode !== 'showing';
    track.mode = nextShowing ? 'showing' : 'hidden';
    btnVideoCaptions.classList.toggle('is-active', nextShowing);
    btnVideoCaptions.setAttribute('aria-pressed', String(nextShowing));
    btnVideoCaptions.textContent = nextShowing ? 'Phụ đề tiếng Việt: Bật' : 'Phụ đề tiếng Việt: Tắt';
  });

  // Social Post View Toggle & Copy
  const btnSocialVisual = document.getElementById('btn-social-visual');
  const btnSocialRaw = document.getElementById('btn-social-raw');
  const socialVisualView = document.getElementById('social-visual-view');
  const socialRawView = document.getElementById('social-raw-view');

  function setSocialView(mode) {
    state.socialViewMode = mode;
    const isVisual = mode === 'visual';
    if (socialVisualView) socialVisualView.hidden = !isVisual;
    if (socialRawView) socialRawView.hidden = isVisual;
    if (btnSocialVisual) {
      btnSocialVisual.classList.toggle('is-active', isVisual);
      btnSocialVisual.setAttribute('aria-selected', String(isVisual));
    }
    if (btnSocialRaw) {
      btnSocialRaw.classList.toggle('is-active', !isVisual);
      btnSocialRaw.setAttribute('aria-selected', String(!isVisual));
    }
  }

  btnSocialVisual?.addEventListener('click', () => setSocialView('visual'));
  btnSocialRaw?.addEventListener('click', () => setSocialView('raw'));

  document.getElementById('btn-copy-social-text')?.addEventListener('click', async (e) => {
    const btn = e.currentTarget;
    const text = document.getElementById('social-raw-pre')?.textContent || '';
    try {
      await navigator.clipboard.writeText(text);
      btn.textContent = 'Đã sao chép ✓';
      window.setTimeout(() => {
        btn.textContent = 'Sao chép nguyên văn';
      }, 1800);
    } catch {
      btn.textContent = 'Chọn văn bản để sao chép';
    }
  });

  document.getElementById('btn-social-preview-thumb')?.addEventListener('click', () => {
    openCustomAssetLightbox({
      src: VIDEO_DATA.fixedThumb1080Path,
      filename: 'thumbnail-chu-dung-1080x1920.png',
      title: 'Ảnh bìa Video tuyên truyền đính kèm bài đăng',
      badge: 'ẢNH BÌA VIDEO',
    });
  });

  document.getElementById('btn-open-mockup')?.addEventListener('click', () => {
    openCustomAssetLightbox({
      src: SOCIAL_POST_DATA.mockupImagePath,
      filename: 'MOCKUP_BAI_DANG.png',
      title: 'Bản trình bày bài đăng mạng xã hội',
      badge: 'BẢN TRÌNH BÀY',
    });
  });

  // Navigation & Action Wiring
  document.getElementById('btn-start')?.addEventListener('click', () => {
    setAutoDemo(false);
    goToStage(1);
  });
  btnVideoNextPosters?.addEventListener('click', () => {
    setAutoDemo(false);
    goToStage(2);
  });
  document.getElementById('btn-replay')?.addEventListener('click', () => {
    setAutoDemo(false);
    goToStage(0);
  });

  document.querySelectorAll('[data-jump-stage]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = Number(btn.getAttribute('data-jump-stage'));
      if (!Number.isNaN(target)) {
        setAutoDemo(false);
        goToStage(target);
      }
    });
  });

  document.querySelectorAll('[data-zoom-poster]').forEach((btn) => {
    btn.addEventListener('click', () => {
      openPosterLightbox(Number(btn.getAttribute('data-zoom-poster')));
    });
  });

  document.getElementById('poster-frame-btn')?.addEventListener('click', () => {
    openPosterLightbox();
  });
  document.getElementById('btn-inline-zoom')?.addEventListener('click', () => {
    openPosterLightbox();
  });

  document.querySelectorAll('[data-open-sources="true"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      setHudPopover(false);
      if (state.isSourcesOpen) closeSourcesModal();
      else openSourcesModal();
    });
  });

  document.querySelectorAll('[data-open-downloads="true"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      setHudPopover(false);
      if (state.isDownloadsOpen) closeDownloadsModal();
      else openDownloadsModal();
    });
  });

  document.getElementById('btn-open-ppt-ref')?.addEventListener('click', () => {
    setHudPopover(false);
    if (state.isPptOpen) closePptModal();
    else openPptModal();
  });

  btnTimingMode?.addEventListener('click', () => {
    state.isSixMinMode = !state.isSixMinMode;
    syncHeaderAndHud();
  });

  btnPrev?.addEventListener('click', () => {
    setAutoDemo(false);
    prevStage();
  });
  btnNext?.addEventListener('click', () => {
    setAutoDemo(false);
    nextStage();
  });

  btnHudMenu?.addEventListener('click', (e) => {
    e.stopPropagation();
    setHudPopover(!state.isHudMenuOpen);
  });

  document.addEventListener('click', (e) => {
    if (!state.isHudMenuOpen) return;
    const target = e.target;
    if (hudToolsPopover?.contains(target) || btnHudMenu?.contains(target)) return;
    setHudPopover(false);
  });

  btnNotes?.addEventListener('click', () => {
    setHudPopover(false);
    toggleNotes();
  });
  document.getElementById('btn-drawer-close')?.addEventListener('click', () => toggleNotes(false));
  btnAutoDemo?.addEventListener('click', () => {
    setHudPopover(false);
    setAutoDemo(!state.isAutoDemo);
  });
  btnLite?.addEventListener('click', () => {
    setHudPopover(false);
    toggleLiteMode();
  });
  btnMotionOff?.addEventListener('click', () => {
    setHudPopover(false);
    toggleMotionOff();
  });
  btnFullscreen?.addEventListener('click', () => {
    setHudPopover(false);
    toggleFullscreen();
  });

  document.addEventListener('fullscreenchange', () => {
    const active = Boolean(document.fullscreenElement);
    if (btnFullscreen) {
      btnFullscreen.setAttribute('aria-pressed', String(active));
      btnFullscreen.classList.toggle('is-active', active);
    }
  });

  // Desktop subtle pointer parallax for heritage sky canvas
  if (window.matchMedia?.('(pointer: fine)').matches) {
    window.addEventListener(
      'pointermove',
      (e) => {
        if (state.isLiteMode || state.isMotionOff) return;
        const nx = (e.clientX / Math.max(1, window.innerWidth)) * 2 - 1;
        const ny = (e.clientY / Math.max(1, window.innerHeight)) * 2 - 1;
        heritageCanvas.setPointer?.(nx, ny);
      },
      { passive: true }
    );
  }

  // Modal Close Events
  document.getElementById('btn-lightbox-close')?.addEventListener('click', closeLightbox);
  btnLightboxPrev?.addEventListener('click', () => {
    const cur = state.lightboxItem.posterId || 1;
    renderLightboxAsset({ type: 'poster', posterId: cur > 1 ? cur - 1 : 5 });
  });
  btnLightboxNext?.addEventListener('click', () => {
    const cur = state.lightboxItem.posterId || 1;
    renderLightboxAsset({ type: 'poster', posterId: cur < 5 ? cur + 1 : 1 });
  });
  lightboxModal?.addEventListener('click', (e) => {
    if (e.target?.getAttribute?.('data-close-lightbox') === 'true') closeLightbox();
  });

  document.getElementById('btn-sources-close')?.addEventListener('click', closeSourcesModal);
  sourcesModal?.addEventListener('click', (e) => {
    if (e.target?.getAttribute?.('data-close-sources') === 'true') closeSourcesModal();
  });

  document.getElementById('btn-downloads-close')?.addEventListener('click', closeDownloadsModal);
  downloadsModal?.addEventListener('click', (e) => {
    if (e.target?.getAttribute?.('data-close-downloads') === 'true') closeDownloadsModal();
  });

  document.getElementById('btn-ppt-close')?.addEventListener('click', closePptModal);
  pptModal?.addEventListener('click', (e) => {
    if (e.target?.getAttribute?.('data-close-ppt') === 'true') closePptModal();
  });

  // Keyboard Controller
  document.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const tag = e.target?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

    if (e.code === 'Escape') {
      if (state.isSourcesOpen || state.isDownloadsOpen || state.isPptOpen || state.isLightboxOpen) {
        e.preventDefault();
        closeAllModals();
      } else if (state.isHudMenuOpen) {
        e.preventDefault();
        setHudPopover(false);
      } else if (state.isNotesOpen) {
        e.preventDefault();
        toggleNotes(false);
      }
      return;
    }

    if (e.code === 'KeyI') {
      e.preventDefault();
      if (state.isSourcesOpen) closeSourcesModal();
      else openSourcesModal();
      return;
    }

    if (e.code === 'KeyD') {
      e.preventDefault();
      if (state.isDownloadsOpen) closeDownloadsModal();
      else openDownloadsModal();
      return;
    }

    if (e.code === 'KeyZ') {
      e.preventDefault();
      if (state.isLightboxOpen) closeLightbox();
      else openPosterLightbox();
      return;
    }

    if (state.isSourcesOpen || state.isDownloadsOpen || state.isPptOpen) return;

    if (state.isLightboxOpen) {
      if (state.lightboxItem.type === 'poster') {
        const cur = state.lightboxItem.posterId || 1;
        if (e.code === 'ArrowRight') {
          e.preventDefault();
          renderLightboxAsset({ type: 'poster', posterId: cur < 5 ? cur + 1 : 1 });
        } else if (e.code === 'ArrowLeft') {
          e.preventDefault();
          renderLightboxAsset({ type: 'poster', posterId: cur > 1 ? cur - 1 : 5 });
        }
      }
      return;
    }

    switch (e.code) {
      case 'ArrowRight':
        e.preventDefault();
        setAutoDemo(false);
        nextStage();
        break;
      case 'Space':
        if (state.stage === 1 && videoEl) {
          if (tag === 'BUTTON' || tag === 'A') return;
          e.preventDefault();
          if (videoEl.paused) videoEl.play().catch(() => {});
          else videoEl.pause();
          return;
        }
        if (tag === 'BUTTON' || tag === 'A') return;
        e.preventDefault();
        setAutoDemo(false);
        nextStage();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        setAutoDemo(false);
        prevStage();
        break;
      case 'Home':
      case 'KeyR':
        e.preventDefault();
        setAutoDemo(false);
        goToStage(0);
        break;
      case 'End':
        e.preventDefault();
        setAutoDemo(false);
        goToStage(9);
        break;
      case 'KeyN':
        e.preventDefault();
        setHudPopover(false);
        toggleNotes();
        break;
      case 'KeyL':
        e.preventDefault();
        toggleLiteMode();
        break;
      case 'KeyB':
        e.preventDefault();
        toggleMotionOff();
        break;
      case 'KeyF':
        e.preventDefault();
        toggleFullscreen();
        break;
      default:
        break;
    }
  });

  // Mount initial Stage 0
  applyStageState(0);
  motion.animateStageEntrance(0);

  // Clean programmatic test API (zero visible debug UI)
  window.__LHS_DECK__ = {
    getState: () => {
      const meta = getStageMeta(state.stage);
      return {
        stage: state.stage,
        totalStages: STAGE_DEFINITIONS.length,
        stageId: meta.id,
        stageLabel: meta.label,
        productKey: meta.productKey,
        posterIndex: meta.poster ? meta.poster.index : null,
        isLiteMode: state.isLiteMode,
        isMotionOff: state.isMotionOff,
        isSixMinMode: state.isSixMinMode,
        isAutoDemo: state.isAutoDemo,
        isNotesOpen: state.isNotesOpen,
        isHudMenuOpen: state.isHudMenuOpen,
        isLightboxOpen: state.isLightboxOpen,
        isSourcesOpen: state.isSourcesOpen,
        isDownloadsOpen: state.isDownloadsOpen,
        isPptOpen: state.isPptOpen,
        socialViewMode: state.socialViewMode,
        isTransitioning: state.isTransitioning,
      };
    },
    goToStage,
    nextStage,
    prevStage,
    openSourcesModal,
    closeSourcesModal,
    openDownloadsModal,
    closeDownloadsModal,
    getVfxMetrics: () => heritageCanvas.getMetrics?.(),
    destroyCanvas: () => heritageCanvas.destroy(),
  };
}
