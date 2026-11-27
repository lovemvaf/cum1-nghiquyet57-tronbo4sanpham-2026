# -*- coding: utf-8 -*-
"""
Generator & QA pipeline for Cum 1 NQ57 Word Deliverables:
  1. deliverables/03_BaiDang/BAI_DANG_CUM1_HOAN_CHINH.docx
  2. deliverables/04_ThuyetMinh/THUYET_MINH_CUM1_CHUDE1.docx (+ .pdf via Word COM)
  3. deliverables/05_LoiNoi_HoTro/LOI_THUYET_TRINH_04_PHUT_CUM1_NQ57.docx (+ .pdf via Word COM)
Mirrors all deliverables into public/assets/downloads/.
"""

import os
import re
import sys
import json
import shutil
import asyncio
import subprocess
from pathlib import Path

import docx
from docx import Document
from docx.shared import Mm, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import qn, nsdecls

ROOT = Path(r"c:\Users\asus\Desktop\Netvetrian_QKD_KhoaCNTT-DNTU\cum1-nghiquyet57-tronbo4sanpham-2026")
EMBLEM_PATH = ROOT / "deliverables" / "02_ThietKe" / "identity" / "derived" / "huy-hieu-doan-clean.png"
DOWNLOADS_DIR = ROOT / "public" / "assets" / "downloads"
PREVIEW_DIR = ROOT / "qa" / "doc_previews"
QA_DIR = ROOT / "qa"

NAVY = RGBColor(0x0D, 0x2B, 0x52)
BLUE = RGBColor(0x14, 0x64, 0xB4)
RED = RGBColor(0xD6, 0x28, 0x28)
INK = RGBColor(0x11, 0x18, 0x27)
MUTED = RGBColor(0x64, 0x74, 0x8B)
SLATE = RGBColor(0x47, 0x55, 0x69)
WHITE = RGBColor(0xFF, 0xFF, 0xFF)

NBSP = "\u00a0"
UNITS_RE = re.compile(
    r"(\d+(?:[.,]\d+)?)\s+(%|GDP|px|giây|phút|trang|ấn phẩm|sản phẩm|nhóm|mục|cảnh|điểm|hướng|phần việc|chặng|tuần|lần|VNĐ|đồng|triệu|tỷ|mm|pt|dxa|MB|s\b|ĐNA\b|thế giới)"
)


def nb(text: str) -> str:
    """Normalize non-breaking spaces before units/symbols and strip stray control chars."""
    cleaned = text.replace("\r", "").replace("\f", "")
    cleaned = re.sub(r"(\d)\s+×\s+(\d)", f"\\1{NBSP}×{NBSP}\\2", cleaned)
    cleaned = UNITS_RE.sub(lambda m: f"{m.group(1)}{NBSP}{m.group(2)}", cleaned)
    return cleaned


def set_rfonts(rpr, font_name: str = "Times New Roman"):
    rfonts = rpr.find(qn("w:rFonts"))
    if rfonts is None:
        rfonts = OxmlElement("w:rFonts")
        rpr.insert(0, rfonts)
    for attr in ("ascii", "hAnsi", "cs", "eastAsia"):
        rfonts.set(qn(f"w:{attr}"), font_name)


def configure_base_document(doc: Document, normal_pt: float = 13.0, line_spacing: float = 1.15, space_after_pt: float = 4.0):
    """Apply A4 ND 30 margins, Times New Roman Unicode defaults, and clean styles."""
    sec = doc.sections[0]
    sec.page_width = Mm(210)
    sec.page_height = Mm(297)
    sec.top_margin = Mm(20)
    sec.bottom_margin = Mm(20)
    sec.left_margin = Mm(30)
    sec.right_margin = Mm(20)
    sec.header_distance = Mm(10)
    sec.footer_distance = Mm(10)

    # docDefaults
    styles_el = doc.styles.element
    rpr_def = styles_el.find(qn("w:docDefaults") + "/" + qn("w:rPrDefault") + "/" + qn("w:rPr"))
    if rpr_def is not None:
        set_rfonts(rpr_def, "Times New Roman")
        sz = rpr_def.find(qn("w:sz"))
        if sz is None:
            sz = OxmlElement("w:sz")
            rpr_def.append(sz)
        sz.set(qn("w:val"), str(int(normal_pt * 2)))
        sz_cs = rpr_def.find(qn("w:szCs"))
        if sz_cs is None:
            sz_cs = OxmlElement("w:szCs")
            rpr_def.append(sz_cs)
        sz_cs.set(qn("w:val"), str(int(normal_pt * 2)))

    normal = doc.styles["Normal"]
    normal.font.name = "Times New Roman"
    normal.font.size = Pt(normal_pt)
    normal.font.color.rgb = INK
    set_rfonts(normal.element.get_or_add_rPr(), "Times New Roman")
    normal.paragraph_format.line_spacing = line_spacing
    normal.paragraph_format.space_before = Pt(0)
    normal.paragraph_format.space_after = Pt(space_after_pt)

    for h_idx, (pt_size, sb, sa, color) in enumerate(
        [(14.0, 8, 3, NAVY), (13.0, 6, 2, BLUE), (12.0, 4, 2, NAVY)], start=1
    ):
        st = doc.styles[f"Heading {h_idx}"]
        st.font.name = "Times New Roman"
        st.font.size = Pt(pt_size)
        st.font.bold = True
        st.font.color.rgb = color
        set_rfonts(st.element.get_or_add_rPr(), "Times New Roman")
        st.paragraph_format.space_before = Pt(sb)
        st.paragraph_format.space_after = Pt(sa)
        st.paragraph_format.line_spacing = 1.12
        st.paragraph_format.keep_with_next = True


def set_cell_margins(cell, top=60, bottom=60, left=100, right=100):
    tc_pr = cell._tc.get_or_add_tcPr()
    tc_mar = tc_pr.find(qn("w:tcMar"))
    if tc_mar is None:
        tc_mar = OxmlElement("w:tcMar")
        tc_pr.append(tc_mar)
    for k, val in (("top", top), ("bottom", bottom), ("left", left), ("right", right)):
        node = tc_mar.find(qn(f"w:{k}"))
        if node is None:
            node = OxmlElement(f"w:{k}")
            tc_mar.append(node)
        node.set(qn("w:w"), str(val))
        node.set(qn("w:type"), "dxa")


def set_cell_shading(cell, hex_color: str):
    tc_pr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{hex_color}"/>')
    tc_pr.append(shd)


def set_table_borders(table, color="CBD5E1", sz="4", inside="single", outer="single"):
    tbl_pr = table._tbl.tblPr
    borders = tbl_pr.find(qn("w:tblBorders"))
    if borders is not None:
        tbl_pr.remove(borders)
    xml = (
        f'<w:tblBorders {nsdecls("w")}>'
        f'<w:top w:val="{outer}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:left w:val="{outer}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:bottom w:val="{outer}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:right w:val="{outer}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:insideH w:val="{inside}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:insideV w:val="{inside}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f"</w:tblBorders>"
    )
    tbl_pr.append(parse_xml(xml))


def set_row_flags(row, is_header: bool = False):
    tr_pr = row._tr.get_or_add_trPr()
    if tr_pr.find(qn("w:cantSplit")) is None:
        tr_pr.append(OxmlElement("w:cantSplit"))
    if is_header and tr_pr.find(qn("w:tblHeader")) is None:
        tr_pr.append(OxmlElement("w:tblHeader"))


def lock_table_grid(table, col_widths_dxa):
    assert sum(col_widths_dxa) <= 8900, f"Table width {sum(col_widths_dxa)} > 8900 dxa"
    tbl = table._tbl
    tbl_pr = tbl.tblPr
    tbl_w = tbl_pr.find(qn("w:tblW"))
    if tbl_w is None:
        tbl_w = OxmlElement("w:tblW")
        tbl_pr.append(tbl_w)
    tbl_w.set(qn("w:w"), str(sum(col_widths_dxa)))
    tbl_w.set(qn("w:type"), "dxa")
    layout = tbl_pr.find(qn("w:tblLayout"))
    if layout is None:
        layout = OxmlElement("w:tblLayout")
        tbl_pr.append(layout)
    layout.set(qn("w:type"), "fixed")

    old_grid = tbl.find(qn("w:tblGrid"))
    if old_grid is not None:
        tbl.remove(old_grid)
    new_grid = OxmlElement("w:tblGrid")
    for w in col_widths_dxa:
        gc = OxmlElement("w:gridCol")
        gc.set(qn("w:w"), str(w))
        new_grid.append(gc)
    tbl_pr.addnext(new_grid)

    for row in table.rows:
        for idx, w in enumerate(col_widths_dxa):
            tc_pr = row.cells[idx]._tc.get_or_add_tcPr()
            tc_w = tc_pr.find(qn("w:tcW"))
            if tc_w is None:
                tc_w = OxmlElement("w:tcW")
                tc_pr.append(tc_w)
            tc_w.set(qn("w:w"), str(w))
            tc_w.set(qn("w:type"), "dxa")


def add_run(p, text: str, bold=False, italic=False, color=INK, size_pt=None, underline=False):
    r = p.add_run(nb(text))
    r.font.name = "Times New Roman"
    set_rfonts(r._element.get_or_add_rPr(), "Times New Roman")
    r.bold = bold
    r.italic = italic
    r.underline = underline
    if color is not None:
        r.font.color.rgb = color
    if size_pt is not None:
        r.font.size = Pt(size_pt)
    return r


def add_field(p, field_name: str, size_pt=8.5, bold=True, color=NAVY):
    r_begin = p.add_run()
    r_begin.font.name = "Times New Roman"
    r_begin.font.size = Pt(size_pt)
    r_begin.bold = bold
    r_begin.font.color.rgb = color
    fc1 = OxmlElement("w:fldChar")
    fc1.set(qn("w:fldCharType"), "begin")
    r_begin._r.append(fc1)

    r_instr = p.add_run()
    r_instr.font.name = "Times New Roman"
    r_instr.font.size = Pt(size_pt)
    instr = OxmlElement("w:instrText")
    instr.set(qn("xml:space"), "preserve")
    instr.text = f" {field_name} "
    r_instr._r.append(instr)

    r_sep = p.add_run()
    fc2 = OxmlElement("w:fldChar")
    fc2.set(qn("w:fldCharType"), "separate")
    r_sep._r.append(fc2)

    r_val = p.add_run("1")
    r_val.font.name = "Times New Roman"
    r_val.font.size = Pt(size_pt)
    r_val.bold = bold
    r_val.font.color.rgb = color

    r_end = p.add_run()
    fc3 = OxmlElement("w:fldChar")
    fc3.set(qn("w:fldCharType"), "end")
    r_end._r.append(fc3)


def apply_header_footer(doc: Document, doc_subtitle: str):
    sec = doc.sections[0]
    # Header
    hdr = sec.header
    for p in list(hdr.paragraphs):
        p._element.getparent().remove(p._element)
    htbl = hdr.add_table(rows=1, cols=2, width=Mm(157))
    htbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    lock_table_grid(htbl, [950, 7950])
    set_table_borders(htbl, color="1464B4", sz="6", inside="none", outer="none")
    tbl_pr = htbl._tbl.tblPr
    tbl_borders = tbl_pr.find(qn("w:tblBorders"))
    bottom = tbl_borders.find(qn("w:bottom"))
    bottom.set(qn("w:val"), "single")
    bottom.set(qn("w:sz"), "8")
    bottom.set(qn("w:color"), "1464B4")
    set_row_flags(htbl.rows[0], is_header=True)

    c0, c1 = htbl.rows[0].cells
    c0.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
    c1.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
    set_cell_margins(c0, top=20, bottom=50, left=0, right=60)
    set_cell_margins(c1, top=20, bottom=50, left=40, right=0)

    p0 = c0.paragraphs[0]
    p0.paragraph_format.space_after = Pt(0)
    p0.paragraph_format.line_spacing = 1.0
    p0.add_run().add_picture(str(EMBLEM_PATH), width=Mm(11.0))

    p1 = c1.paragraphs[0]
    p1.paragraph_format.space_after = Pt(1)
    p1.paragraph_format.line_spacing = 1.08
    add_run(p1, "TRẠI THANH NIÊN SỐ THÀNH PHỐ ĐỒNG NAI NĂM 2026 · CỤM 1", bold=True, color=NAVY, size_pt=9.5)
    p2 = c1.add_paragraph()
    p2.paragraph_format.space_after = Pt(0)
    p2.paragraph_format.line_spacing = 1.08
    add_run(p2, doc_subtitle, italic=True, color=BLUE, size_pt=9.0)

    # Footer
    ftr = sec.footer
    for p in list(ftr.paragraphs):
        p._element.getparent().remove(p._element)
    ftbl = ftr.add_table(rows=1, cols=2, width=Mm(157))
    ftbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    lock_table_grid(ftbl, [6900, 2000])
    set_table_borders(ftbl, color="CBD5E1", sz="4", inside="none", outer="none")
    f_borders = ftbl._tbl.tblPr.find(qn("w:tblBorders"))
    f_top = f_borders.find(qn("w:top"))
    f_top.set(qn("w:val"), "single")
    f_top.set(qn("w:sz"), "4")
    f_top.set(qn("w:color"), "CBD5E1")
    set_row_flags(ftbl.rows[0], is_header=True)

    fc0, fc1 = ftbl.rows[0].cells
    set_cell_margins(fc0, top=50, bottom=0, left=0, right=60)
    set_cell_margins(fc1, top=50, bottom=0, left=40, right=0)

    fp0 = fc0.paragraphs[0]
    fp0.paragraph_format.space_after = Pt(0)
    fp0.paragraph_format.line_spacing = 1.0
    add_run(fp0, "Nguồn: Nghị quyết 57-NQ/TW, Bộ Chính trị (22/12/2024) · xaydungchinhsach.chinhphu.vn", italic=True, color=SLATE, size_pt=8.5)

    fp1 = fc1.paragraphs[0]
    fp1.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    fp1.paragraph_format.space_after = Pt(0)
    fp1.paragraph_format.line_spacing = 1.0
    add_run(fp1, "Trang ", color=SLATE, size_pt=8.5)
    add_field(fp1, "PAGE", size_pt=8.5, bold=True, color=NAVY)
    add_run(fp1, " / ", color=SLATE, size_pt=8.5)
    add_field(fp1, "NUMPAGES", size_pt=8.5, bold=True, color=NAVY)


def add_shaded_box(doc: Document, title: str, body_lines, bg_hex="F7F3E8", border_hex="1464B4", text_pt=11.5):
    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    lock_table_grid(tbl, [8900])
    set_table_borders(tbl, color=border_hex, sz="8", inside="none", outer="none")
    b = tbl._tbl.tblPr.find(qn("w:tblBorders"))
    left_b = b.find(qn("w:left"))
    left_b.set(qn("w:val"), "single")
    left_b.set(qn("w:sz"), "24")
    left_b.set(qn("w:color"), border_hex)
    for side in ("top", "bottom", "right"):
        s = b.find(qn(f"w:{side}"))
        s.set(qn("w:val"), "single")
        s.set(qn("w:sz"), "4")
        s.set(qn("w:color"), "E2E8F0")
    set_row_flags(tbl.rows[0], is_header=True)
    cell = tbl.rows[0].cells[0]
    set_cell_shading(cell, bg_hex)
    set_cell_margins(cell, top=80, bottom=80, left=140, right=120)
    p = cell.paragraphs[0]
    p.paragraph_format.space_after = Pt(2)
    p.paragraph_format.line_spacing = 1.12
    add_run(p, title, bold=True, color=NAVY, size_pt=text_pt)
    for idx, line in enumerate(body_lines):
        lp = cell.add_paragraph()
        lp.paragraph_format.space_after = Pt(1.5 if idx < len(body_lines) - 1 else 0)
        lp.paragraph_format.line_spacing = 1.12
        if isinstance(line, tuple):
            add_run(lp, line[0], bold=True, color=NAVY, size_pt=text_pt)
            add_run(lp, line[1], color=INK, size_pt=text_pt)
        else:
            add_run(lp, line, color=INK, size_pt=text_pt)
    sp = doc.add_paragraph()
    sp.paragraph_format.space_after = Pt(3)
    sp.paragraph_format.line_spacing = 1.0


def add_data_table(doc: Document, col_widths, headers, rows, font_pt=10.5, pad_v=55):
    tbl = doc.add_table(rows=1 + len(rows), cols=len(col_widths))
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    lock_table_grid(tbl, col_widths)
    set_table_borders(tbl, color="CBD5E1", sz="4")
    set_row_flags(tbl.rows[0], is_header=True)
    for c_idx, h_text in enumerate(headers):
        cell = tbl.rows[0].cells[c_idx]
        set_cell_shading(cell, "0D2B52")
        set_cell_margins(cell, top=pad_v, bottom=pad_v, left=90, right=90)
        cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
        p = cell.paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        p.paragraph_format.line_spacing = 1.08
        add_run(p, h_text, bold=True, color=WHITE, size_pt=font_pt)

    for r_idx, row_vals in enumerate(rows):
        row = tbl.rows[r_idx + 1]
        set_row_flags(row, is_header=False)
        bg = "F8FAFC" if r_idx % 2 == 1 else "FFFFFF"
        for c_idx, val in enumerate(row_vals):
            cell = row.cells[c_idx]
            set_cell_shading(cell, bg)
            set_cell_margins(cell, top=pad_v, bottom=pad_v, left=90, right=90)
            cell.vertical_alignment = WD_ALIGN_VERTICAL.TOP
            p = cell.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            p.paragraph_format.line_spacing = 1.1
            if isinstance(val, list):
                for l_i, seg in enumerate(val):
                    tp = p if l_i == 0 else cell.add_paragraph()
                    tp.paragraph_format.space_after = Pt(1 if l_i < len(val) - 1 else 0)
                    tp.paragraph_format.line_spacing = 1.1
                    if isinstance(seg, tuple):
                        add_run(tp, seg[0], bold=True, color=NAVY, size_pt=font_pt)
                        add_run(tp, seg[1], color=INK, size_pt=font_pt)
                    else:
                        add_run(tp, seg, color=INK, size_pt=font_pt)
            elif isinstance(val, tuple):
                add_run(p, val[0], bold=True, color=NAVY, size_pt=font_pt)
                add_run(p, val[1], color=INK, size_pt=font_pt)
            else:
                add_run(p, str(val), bold=(c_idx == 0 and len(str(val)) <= 22), color=NAVY if c_idx == 0 else INK, size_pt=font_pt)

    sp = doc.add_paragraph()
    sp.paragraph_format.space_after = Pt(3)
    sp.paragraph_format.line_spacing = 1.0
    return tbl


def add_section_heading(doc: Document, text: str, level: int = 1, size_pt: float = None, space_before=6, space_after=2.5):
    p = doc.add_paragraph(style=f"Heading {level}")
    p.paragraph_format.space_before = Pt(space_before)
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.keep_with_next = True
    add_run(p, text, bold=True, color=NAVY if level == 1 else BLUE, size_pt=size_pt or (13.0 if level == 1 else 12.0))
    return p


def add_bullet(doc: Document, lead_bold: str, rest: str, size_pt: float = 12.0, space_after: float = 2.0):
    p = doc.add_paragraph()
    p.paragraph_format.left_indent = Mm(6)
    p.paragraph_format.first_line_indent = Mm(-3.5)
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.line_spacing = 1.12
    add_run(p, "• ", bold=True, color=BLUE, size_pt=size_pt)
    if lead_bold:
        add_run(p, lead_bold, bold=True, color=NAVY, size_pt=size_pt)
    add_run(p, rest, color=INK, size_pt=size_pt)
    return p


# ==============================================================================
# 1. PRODUCT 3: BAI_DANG_CUM1_HOAN_CHINH.docx
# ==============================================================================
def build_product_3_bai_dang() -> Path:
    doc = Document()
    configure_base_document(doc, normal_pt=13.0, line_spacing=1.18, space_after_pt=4.5)
    apply_header_footer(doc, "Mục 3 – Bài đăng mạng xã hội hoàn chỉnh · Chủ đề 1: Nghị quyết đến gần thanh niên")

    # Document banner header
    p_top = doc.add_paragraph()
    p_top.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_top.paragraph_format.space_before = Pt(2)
    p_top.paragraph_format.space_after = Pt(2)
    add_run(p_top, "BÀI ĐĂNG TRUYỀN THÔNG MẠNG XÃ HỘI (MỤC 3)", bold=True, color=NAVY, size_pt=15.0)

    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub.paragraph_format.space_after = Pt(8)
    add_run(p_sub, "Cụm 1 · Trại Thanh niên số thành phố Đồng Nai năm 2026 · Trạng thái: Bản biên tập hoàn chỉnh chờ nhóm chốt kênh & ngày đăng", italic=True, color=BLUE, size_pt=11.0)

    add_section_heading(doc, "I. NỘI DUNG BÀI ĐĂNG HOÀN CHỈNH (SẴN SÀNG ĐĂNG TẢI)", level=1, size_pt=13.5, space_before=4, space_after=4)

    # Framed clean post box
    post_tbl = doc.add_table(rows=1, cols=1)
    post_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    lock_table_grid(post_tbl, [8900])
    set_table_borders(post_tbl, color="1464B4", sz="8")
    set_row_flags(post_tbl.rows[0], is_header=True)
    cell = post_tbl.rows[0].cells[0]
    set_cell_shading(cell, "F8FAFC")
    set_cell_margins(cell, top=110, bottom=110, left=140, right=140)

    cp0 = cell.paragraphs[0]
    cp0.paragraph_format.space_after = Pt(5)
    add_run(cp0, "Chuyển đổi số – Bắt đầu từ chính mình", bold=True, color=NAVY, size_pt=14.0)

    post_paras = [
        "Bạn có thể sử dụng điện thoại mỗi ngày, nhưng đã bao giờ tự hỏi mình thực sự làm chủ công nghệ chưa?",
        "Từ việc thực hiện dịch vụ công trực tuyến, sử dụng trí tuệ nhân tạo trong học tập và công việc đến nhận diện tin giả, bảo vệ dữ liệu cá nhân, chuyển đổi số hiện diện ngay trong những hoạt động thường ngày của chúng ta.",
        "Hưởng ứng Nghị quyết 57-NQ/TW (ban hành ngày 22/12/2024 bởi Bộ Chính trị) về đột phá phát triển khoa học, công nghệ, đổi mới sáng tạo và chuyển đổi số quốc gia, mỗi đoàn viên, thanh niên cần chủ động nâng cao kỹ năng số, ứng dụng công nghệ hiệu quả, an toàn và lan tỏa những tiện ích số đến cộng đồng.",
    ]
    for txt in post_paras:
        p = cell.add_paragraph()
        p.paragraph_format.space_after = Pt(5)
        p.paragraph_format.line_spacing = 1.2
        add_run(p, txt, color=INK, size_pt=12.5)

    # Revised TEAM_PROPOSAL paragraph with explicit superscript [1]
    p_rev = cell.add_paragraph()
    p_rev.paragraph_format.space_after = Pt(5)
    p_rev.paragraph_format.line_spacing = 1.2
    add_run(
        p_rev,
        "Cụm 1 đề xuất lồng ghép các phần việc thanh niên, như hỗ trợ kỹ năng số cho người dân và nghiên cứu phương án số hóa thông tin về các địa chỉ đỏ tại địa phương, trên cơ sở có tư liệu và quyền sử dụng phù hợp.",
        color=INK,
        size_pt=12.5,
    )
    r_sup = add_run(p_rev, "[1]", bold=True, color=RED, size_pt=10.0)
    r_sup.font.superscript = True
    add_run(
        p_rev,
        " Qua đó, công nghệ trở thành cầu nối thiết thực giúp thế hệ trẻ tiếp cận, tìm hiểu và gìn giữ những giá trị lịch sử địa phương.",
        color=INK,
        size_pt=12.5,
    )

    p_cta = cell.add_paragraph()
    p_cta.paragraph_format.space_after = Pt(6)
    p_cta.paragraph_format.line_spacing = 1.2
    add_run(
        p_cta,
        "Hãy bắt đầu từ một việc nhỏ: học thêm một kỹ năng số, kiểm chứng thông tin trước khi chia sẻ hoặc hướng dẫn người thân sử dụng dịch vụ công trực tuyến. Cùng xem trọn bộ video, bộ 05 ấn phẩm truyền thông và chia sẻ một việc làm chuyển đổi số mà bạn có thể thực hiện ngay hôm nay!",
        color=INK,
        size_pt=12.5,
    )

    p_source = cell.add_paragraph()
    p_source.paragraph_format.space_after = Pt(5)
    p_source.paragraph_format.line_spacing = 1.15
    add_run(p_source, "Đọc toàn văn Nghị quyết 57-NQ/TW trên Cổng TTĐT Chính phủ: ", bold=True, color=NAVY, size_pt=11.5)
    add_run(p_source, "xaydungchinhsach.chinhphu.vn (bản đối chiếu: mst.gov.vn).", italic=True, color=BLUE, size_pt=11.5)

    p_slogan = cell.add_paragraph()
    p_slogan.paragraph_format.space_after = Pt(4)
    add_run(p_slogan, "THANH NIÊN TIÊN PHONG – LÀM CHỦ CÔNG NGHỆ – KIẾN TẠO TƯƠNG LAI", bold=True, color=RED, size_pt=11.0)

    p_tags = cell.add_paragraph()
    p_tags.paragraph_format.space_after = Pt(0)
    add_run(p_tags, "#TraiThanhNienSo #NghiQuyet57 #ChuyenDoiSo #TuoiTreTienPhong #ThanhNienSo #Cum1", bold=True, color=BLUE, size_pt=11.5)

    sp = doc.add_paragraph()
    sp.paragraph_format.space_after = Pt(4)

    # Footnote editorial note box
    add_shaded_box(
        doc,
        "[1] Chú thích đối chiếu bản gốc (Đề xuất chỉnh câu chờ nhóm duyệt):",
        [
            ("Câu ở bản gốc (3_BAI_DANG_GOC_DOI1.docx): ", "“Tại Cụm 1, các công trình, phần việc thanh niên gắn với thực hiện Nghị quyết 57 đã và đang được triển khai, tiêu biểu là số hóa các địa chỉ đỏ trên địa bàn.”"),
            ("Lý do hiệu đính & đề xuất: ", "Tại thời điểm kiểm chứng hồ sơ chưa có minh chứng thực địa xác nhận hoạt động số hóa địa chỉ đỏ đã diễn ra, nên bản hoàn chỉnh chuyển sang hình thức đề xuất triển khai có điều kiện về tư liệu và quyền sử dụng phù hợp."),
        ],
        bg_hex="FFFBEB",
        border_hex="D62828",
        text_pt=11.0,
    )

    add_section_heading(doc, "II. THÔNG SỐ ĐĂNG TẢI & BẢNG RÀ SOÁT HIỆU ĐÍNH SO VỚI BẢN GỐC", level=1, size_pt=13.5, space_before=4, space_after=4)

    meta_rows = [
        ["Giờ đăng dự kiến", "17h30, ngày công bố sản phẩm truyền thông (ngày cụ thể chờ nhóm chốt theo lịch Đoàn cơ sở)."],
        ["Kênh dự kiến", "Kênh mạng xã hội chính thức của Đoàn cơ sở tại Cụm 1 (chờ nhóm xác nhận tên kênh Fanpage/Zalo OA cụ thể)."],
        ["Ấn phẩm đi kèm", "01 video tuyên truyền dọc 9:16 (1 phút 41 giây, kèm phụ đề .vtt) và bộ 05 ấn phẩm truyền thông (1080 × 1350 px), kèm MOCKUP_BAI_DANG.png xem trước."],
        ["Sửa lỗi bản gốc", "Đã gỡ dấu chấm thừa cuối #Cum1.; bổ sung bộ 05 ấn phẩm vào mục ấn phẩm đi kèm; chuẩn hóa thời lượng video thực tế 1 phút 41 giây (thay cho 'khoảng 1p30s giây'); làm rõ chủ thể ban hành là Bộ Chính trị (22/12/2024)."],
    ]
    add_data_table(doc, [2400, 6500], ["Hạng mục", "Nội dung chuẩn hóa"], meta_rows, font_pt=11.0, pad_v=60)

    out_path = ROOT / "deliverables" / "03_BaiDang" / "BAI_DANG_CUM1_HOAN_CHINH.docx"
    out_path.parent.mkdir(parents=True, exist_ok=True)
    doc.save(str(out_path))
    return out_path


# ==============================================================================
# 2. PRODUCT 4: THUYET_MINH_CUM1_CHUDE1.docx (STRICTLY <= 3 PAGES A4)
# ==============================================================================
def build_product_4_thuyet_minh() -> Path:
    doc = Document()
    configure_base_document(doc, normal_pt=13.0, line_spacing=1.10, space_after_pt=2.2)
    apply_header_footer(doc, "Mục 4 – Thuyết minh sản phẩm (tối đa 03 trang) · Chủ đề 1: Nghị quyết 57-NQ/TW")

    # Compact official title block
    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_before = Pt(0)
    p_title.paragraph_format.space_after = Pt(1.5)
    add_run(p_title, "BẢN THUYẾT MINH SẢN PHẨM TRUYỀN THÔNG", bold=True, color=NAVY, size_pt=14.0)

    p_meta = doc.add_paragraph()
    p_meta.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_meta.paragraph_format.space_after = Pt(4)
    add_run(
        p_meta,
        "Chủ đề 1: Nghị quyết đến gần thanh niên (Nghị quyết 57-NQ/TW) · Cụm 1 – Trại Thanh niên số TP. Đồng Nai 2026\n"
        "Trạng thái hồ sơ: Bản dự thảo hoàn chỉnh hậu kỳ sau hạn nộp 21h00 ngày 26/11/2026 (chờ nhóm điền Đội số, đơn vị cụ thể và Đội trưởng)",
        italic=True,
        color=BLUE,
        size_pt=10.5,
    )

    # 1. Vấn đề & lý do chọn NQ57
    add_section_heading(doc, "1. Vấn đề thực tiễn và lý do chọn Nghị quyết 57-NQ/TW tại Cụm 1", level=1, size_pt=12.5, space_before=3, space_after=1.5)
    p1 = doc.add_paragraph()
    p1.paragraph_format.space_after = Pt(2.5)
    p1.paragraph_format.line_spacing = 1.12
    add_run(
        p1,
        "Đoàn viên, thanh niên và sinh viên tại Cụm 1 sử dụng điện thoại thông minh, mạng xã hội và trí tuệ nhân tạo mỗi ngày, nhưng nhiều bạn vẫn gặp lúng túng khi thao tác dịch vụ công trực tuyến, kiểm chứng tin giả hoặc bảo vệ dữ liệu cá nhân, đồng thời ít tiếp cận trực tiếp văn bản nghị quyết dài nhiều thuật ngữ. Thực trạng này trùng khớp với nhận định tại Phần Mở đầu Nghị quyết số 57-NQ/TW (ban hành ngày 22/12/2024 bởi Bộ Chính trị) về việc nhận thức chuyển đổi số ở nhiều cấp và Nhân dân chưa thật sự sâu sắc. Vì vậy, nhóm chọn Nghị quyết 57-NQ/TW để “chuyển ngữ” thành bộ sản phẩm ngắn gọn, trực quan, gắn trực tiếp việc học tập, lao động và sinh hoạt chi đoàn tại Cụm 1.",
        size_pt=11.5,
    )

    # 2. Đối tượng & Thông điệp
    add_section_heading(doc, "2. Đối tượng tiếp nhận, quan điểm cốt lõi và thông điệp truyền thông", level=1, size_pt=12.5, space_before=3, space_after=1.5)
    add_bullet(
        doc,
        "Đối tượng tiếp nhận: ",
        "Đoàn viên, thanh niên, học sinh, sinh viên trên địa bàn Cụm 1 (thành phố Đồng Nai); đồng thời hướng đến người dân cơ sở được thanh niên hỗ trợ sử dụng dịch vụ công và tiện ích số.",
        size_pt=11.5,
        space_after=1.5,
    )
    add_bullet(
        doc,
        "Thông điệp truyền thông: ",
        "Chuỗi sản phẩm mang tên gọi sáng tạo “LẠC HỒNG SỐ” với thông điệp “Hiểu đúng – Làm thật – Lan tỏa” (đây là khẩu hiệu truyền thông do nhóm xây dựng để dễ nhớ, không phải trích nguyên văn văn kiện Nghị quyết 57-NQ/TW).",
        size_pt=11.5,
        space_after=1.5,
    )
    add_bullet(
        doc,
        "Chắt lọc 05 quan điểm chỉ đạo (Mục I Nghị quyết 57-NQ/TW): ",
        "KH, CN, ĐMST và CĐS là đột phá quan trọng hàng đầu; người dân và doanh nghiệp là trung tâm, chủ thể, nhà khoa học là nhân tố then chốt, Nhà nước dẫn dắt; thể chế, nhân lực, hạ tầng, dữ liệu và công nghệ chiến lược là trọng tâm cốt lõi; từng bước tự chủ công nghệ; bảo đảm chủ quyền không gian mạng, an ninh mạng và an ninh dữ liệu xuyên suốt.",
        size_pt=11.5,
        space_after=2.5,
    )

    # 3. Giải pháp trọn bộ 04 sản phẩm
    add_section_heading(doc, "3. Giải pháp trọn bộ 04 sản phẩm theo đề thi và công cụ bổ trợ", level=1, size_pt=12.5, space_before=3, space_after=2)
    prod_rows = [
        [
            "Mục 1: Video tuyên truyền\n(MP4 9:16, 101,45 giây)",
            "Gồm 05 đoạn mạch (SHORT 1–5): mở đầu bằng tình huống gần gũi, giới thiệu Nghị quyết 57-NQ/TW, vai trò thanh niên và lời kêu gọi. Giữ nguyên lời thoại gốc; sửa lỗi chính tả “NGỒI” trên ảnh bìa (941 × 1672 px và 1080 × 1920 px), nén bản web và bổ sung tệp phụ đề rời subtitles_vi.vtt.",
        ],
        [
            "Mục 2: Bộ 05 ấn phẩm\n(1080 × 1350 px, PNG/SVG)",
            [
                "Thống nhất nhận diện Huy hiệu Đoàn TNCS Hồ Chí Minh và bảng màu Xanh Đoàn – Vàng ấm – Kem giấy: ",
                ("01/05 Đặt vấn đề; 02/05 Quan điểm cốt lõi; 03/05 Mục tiêu 2030 & Tầm nhìn 2045 ", "(Mục tiêu 2030: kinh tế số ≥ 30 % GDP, > 80 % dùng dịch vụ công trực tuyến, Top 3 ĐNA & Top 50 thế giới về năng lực cạnh tranh số, Chính phủ điện tử, Top 3 ĐNA về R&D AI, chi R&D 2 % GDP; Tầm nhìn 2045: nước phát triển thu nhập cao, kinh tế số ≥ 50 % GDP, Top 30 thế giới — ghi rõ là mục tiêu văn kiện, không phải kết quả hiện tại, cùng 07 nhiệm vụ Mục III gom 04 cụm); "),
                ("04/05 Thanh niên Cụm 1 hành động ", "(05 phần việc đề xuất); "),
                ("05/05 Lan tỏa ", "(kèm mã QR dẫn thẳng đến toàn văn trên Cổng TTĐT Chính phủ)."),
            ],
        ],
        [
            "Mục 3: Bài đăng mạng xã hội\n(Word + Mockup PNG)",
            "Giữ mạch bài “Chuyển đổi số – Bắt đầu từ chính mình”; thay câu chưa có minh chứng (“đã và đang triển khai số hóa địa chỉ đỏ”) bằng phương án đề xuất có điều kiện tư liệu/quyền sử dụng; chuẩn hóa hashtag #TraiThanhNienSo #NghiQuyet57 #ChuyenDoiSo #TuoiTreTienPhong #ThanhNienSo #Cum1 (bỏ dấu chấm thừa) và cập nhật đủ 05 ấn phẩm đi kèm.",
        ],
        [
            "Mục 4: Thuyết minh & Web bổ trợ\n(DOCX/PDF ≤ 03 trang)",
            "Bản thuyết minh 03 trang chuẩn hóa dùng khi trình bày; kèm website trình chiếu 05 cảnh tương tác và kịch bản lời nói 04 phút khớp thời lượng phát video 101,45 giây để cả đội phối hợp nhịp nhàng khi thuyết trình và phản biện.",
        ],
    ]
    add_data_table(doc, [2350, 6550], ["Sản phẩm", "Nội dung, chỉ tiêu trọng tâm & nâng cấp chuẩn xác"], prod_rows, font_pt=10.0, pad_v=45)

    # 4. Phương án tổ chức triển khai thực tế tại Cụm 1
    add_section_heading(doc, "4. Phương án tổ chức triển khai thực tế tại cơ sở Cụm 1", level=1, size_pt=12.5, space_before=2, space_after=1.5)
    p4_intro = doc.add_paragraph()
    p4_intro.paragraph_format.space_after = Pt(2)
    p4_intro.paragraph_format.line_spacing = 1.12
    add_run(
        p4_intro,
        "Nhóm đề xuất 05 hướng phần việc vừa sức cho đoàn viên Cụm 1 (chưa tính là số liệu đã diễn ra): (1) Tham gia phong trào “học tập số”, rèn kỹ năng AI và tin học; (2) Tổ chức điểm hỗ trợ người dân thao tác dịch vụ công trực tuyến và định danh điện tử; (3) Số hóa quản lý đoàn viên, điểm danh mã QR và truyền thông chi đoàn; (4) Đề xuất sáng kiến công nghệ nhỏ, trong đó nghiên cứu phương án số hóa thông tin địa chỉ đỏ khi có tư liệu và quyền sử dụng hợp lệ; (5) Rèn kỹ năng kiểm chứng thông tin và phòng tránh lừa đảo trực tuyến.",
        size_pt=11.0,
    )

    plan_rows = [
        [
            "Kênh & Lịch đăng dự kiến",
            "Đăng khởi động lúc 17h30 ngày công bố sản phẩm trên kênh truyền thông chính thức của Đoàn cơ sở Cụm 1 (tên kênh và ngày cụ thể chờ nhóm xác nhận); duy trì 01 ấn phẩm/tuần trong 05 tuần gắn sinh hoạt chi đoàn.",
        ],
        [
            "Phân công vai trò (chờ nhóm điền tên)",
            "Điều phối chung & phản biện: (chờ nhóm điền tên) · Quay dựng Video & phụ đề: (chờ nhóm điền tên) · Thiết kế 05 poster & Web: (chờ nhóm điền tên) · Soạn Bài đăng & Thuyết minh: (chờ nhóm điền tên).",
        ],
    ]
    add_data_table(doc, [2350, 6550], ["Khía cạnh triển khai", "Kế hoạch dự kiến tại Cụm 1"], plan_rows, font_pt=10.0, pad_v=45)

    # 5. Công cụ số, AI & Minh bạch bản quyền
    add_section_heading(doc, "5. Ứng dụng công cụ số, trí tuệ nhân tạo và tính minh bạch bản quyền", level=1, size_pt=12.5, space_before=2, space_after=1.5)
    add_bullet(
        doc,
        "Minh bạch hình ảnh AI & Video gốc: ",
        "Hình minh họa 2D bán hiện thực trên bộ 05 poster được tạo với sự hỗ trợ của công cụ AI nhằm minh họa ý tưởng truyền thông, không phải ảnh chụp sự kiện thật tại Cụm 1 và không mô phỏng người thật hay lãnh đạo. Video gốc dài 101,45 giây được giữ nguyên hình ảnh và lời thoại thực tế; nhạc nền và đoạn cảnh AI ở phần cuối video gốc được ghi chú rõ “chờ nhóm xác nhận nguồn cấp phép sử dụng” trước khi đăng công khai.",
        size_pt=11.0,
        space_after=1.5,
    )
    add_bullet(
        doc,
        "Nhận diện Đoàn & Công cụ mã nguồn mở: ",
        "Sử dụng đúng nguyên mẫu Huy hiệu Đoàn TNCS Hồ Chí Minh (huy-hieu-doan-clean.png), không dùng AI vẽ lại; không ghép Logo Hội Sinh viên khi chưa có tệp nguồn chính thức. Hệ thống dàn trang, mã QR và trình chiếu dùng phông chữ thuần Unicode (Times New Roman, Be Vietnam Pro giấy phép OFL-1.1) cùng thư viện mã nguồn mở (Reveal.js, Vite, Python-docx).",
        size_pt=11.0,
        space_after=2.0,
    )

    # 6. Nguồn tư liệu chính thống & Chỉ số đo lường khả thi
    add_section_heading(doc, "6. Nguồn tư liệu chính thống và chỉ số đo lường khả thi", level=1, size_pt=12.5, space_before=2, space_after=1.5)
    add_bullet(
        doc,
        "Nguồn tư liệu đối chiếu: ",
        "(1) Toàn văn Nghị quyết số 57-NQ/TW ngày 22/12/2024 của Bộ Chính trị trên Cổng Thông tin điện tử Chính phủ (xaydungchinhsach.chinhphu.vn); (2) Bản đối chiếu toàn văn trên Cổng Bộ Khoa học và Công nghệ (mst.gov.vn); (3) Đề thi Vòng thực chiến Trại Thanh niên số thành phố Đồng Nai 2026 và tài liệu tập huấn của nhóm. Các văn bản triển khai cấp Chính phủ (03/NQ-CP, 71/NQ-CP) được tách riêng làm tài liệu tham khảo khi phản biện, không trộn thành lời của 57-NQ/TW.",
        size_pt=11.0,
        space_after=1.5,
    )
    add_bullet(
        doc,
        "Chỉ số đo lường đề xuất (theo dõi sau khi phát hành chính thức, không báo cáo số liệu giả lập): ",
        "Theo dõi lượt tiếp cận và tỉ lệ xem hết video tuyên truyền trên kênh Đoàn cơ sở; số lượt quét mã QR mở toàn văn Nghị quyết 57-NQ/TW; lượt chia sẻ bài đăng kèm bình luận cam kết “một việc làm số”; và số buổi sinh hoạt chi đoàn hoặc lượt đoàn viên Cụm 1 tham gia thực hành hướng dẫn dịch vụ công trực tuyến cho người dân.",
        size_pt=11.0,
        space_after=0,
    )

    out_path = ROOT / "deliverables" / "04_ThuyetMinh" / "THUYET_MINH_CUM1_CHUDE1.docx"
    out_path.parent.mkdir(parents=True, exist_ok=True)
    doc.save(str(out_path))
    return out_path


# ==============================================================================
# 3. STANDALONE PRESENTATION SCRIPT: LOI_THUYET_TRINH_04_PHUT_CUM1_NQ57.docx
# ==============================================================================
def build_presentation_script():
    """Returns (docx_path, list_of_spoken_paragraphs_for_4min_tts)."""
    doc = Document()
    configure_base_document(doc, normal_pt=13.0, line_spacing=1.15, space_after_pt=3.5)
    apply_header_footer(doc, "Kịch bản thuyết trình 04 phút (kèm tóm tắt nhịp & phụ lục 06 phút) · Chủ đề 1: NQ57")

    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_before = Pt(0)
    p_title.paragraph_format.space_after = Pt(2)
    add_run(p_title, "LỜI THUYẾT TRÌNH TRÌNH BÀY SẢN PHẨM (CHUẨN 04 PHÚT)", bold=True, color=NAVY, size_pt=14.5)

    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub.paragraph_format.space_after = Pt(6)
    add_run(
        p_sub,
        "Gồm trọn 01 phút 41 giây (101,45 giây) phát video + lời nói trực tiếp + ≥ 05 giây đệm chuyển cảnh\n"
        "Quy ước: Chữ đậm xanh than là LỜI NÓI TRỰC TIẾP · Khối xám nghiêng trong ngoặc vuông là CHỈ DẪN THAO TÁC (không đọc)",
        italic=True,
        color=BLUE,
        size_pt=10.5,
    )

    # PAGE 1: 1-PAGE QUICK CUE SUMMARY CARD
    add_section_heading(doc, "PHẦN A. THẺ NHẮC NHỊP NHANH (QUICK CUE SUMMARY CARD · 04:00)", level=1, size_pt=13.0, space_before=2, space_after=3)

    cue_rows = [
        ["00:00 – 00:08\n(08 giây)", "Màn hình giới thiệu (Landing)", "Chào BGK, giới thiệu Cụm 1, Chủ đề 1 – Nghị quyết 57-NQ/TW & mạch Lạc Hồng Số.", "Nhấn Space / mở khu vực Video"],
        ["00:08 – 01:50\n(101,45 giây)", "Phát trọn Video tuyên truyền", "IM LẶNG để BGK xem trọn video 9:16 và phụ đề tiếng Việt.", "Bật phát video toàn màn hình; hết video chuyển sang 01/05"],
        ["01:50 – 02:50\n(~55 giây)", "Bộ 05 ấn phẩm (01/05 → 05/05)", "Chốt vấn đề; 4 điểm cốt lõi Mục I; mục tiêu 2030 (≥ 30 % GDP, > 80 % dịch vụ công, Top 3 ĐNA / Top 50 TG, 2 % R&D) & 2045 (≥ 50 % GDP, Top 30 TG) + 7 nhiệm vụ; 5 phần việc Cụm 1; QR CTA.", "Nhấn ArrowRight qua từng ấn phẩm (01/05 đến 05/05)"],
        ["02:50 – 03:08\n(~16 giây)", "Mục Bài đăng mạng xã hội", "Nêu bài đăng hoàn chỉnh, sửa câu đề xuất có điều kiện tư liệu, hashtag sạch & lịch dự kiến chờ chốt.", "Mở thẻ Bài đăng & Mockup"],
        ["03:08 – 03:44\n(~32 giây)", "Thuyết minh & Kế hoạch Cụm 1", "Nêu 5 hướng triển khai cơ sở, minh bạch AI/Huy hiệu Đoàn, nguồn chinhphu.vn & mst.gov.vn.", "Mở thẻ Thuyết minh 03 trang"],
        ["03:44 – 03:52\n(~08 giây)", "Màn hình tổng kết (Finale)", "Chốt thông điệp “Hiểu đúng – Làm thật – Lan tỏa”, mời BGK đặt câu hỏi phản biện.", "Nhấn ArrowRight đến Tổng kết"],
        ["03:52 – 04:00\n(≥ 08 giây)", "Đệm chuyển giao phản biện", "Khoảng dự phòng an toàn chuyển sang phần 04 phút hỏi đáp phản biện.", "Giữ màn hình Tổng kết + mã QR"],
    ]
    add_data_table(
        doc,
        [1450, 2100, 3550, 1800],
        ["Mốc thời gian", "Điểm dừng trên màn hình", "Ý chính bắt buộc phải chạm", "Thao tác điều khiển"],
        cue_rows,
        font_pt=9.8,
        pad_v=45,
    )

    add_shaded_box(
        doc,
        "Nhắc nhanh số liệu chuẩn Nghị quyết 57-NQ/TW (nhấn mạnh đây là mục tiêu văn kiện, không phải kết quả hiện tại):",
        [
            ("• Mục tiêu 2030: ", "Kinh tế số ≥ 30 % GDP · > 80 % người dân & doanh nghiệp dùng dịch vụ công trực tuyến · Top 3 ĐNA & Top 50 thế giới (năng lực cạnh tranh số, Chính phủ điện tử) + Top 3 ĐNA R&D AI · Chi R&D 2 % GDP."),
            ("• Tầm nhìn 2045: ", "Nước phát triển, thu nhập cao · Kinh tế số ≥ 50 % GDP · Top 30 thế giới về đổi mới sáng tạo và chuyển đổi số."),
            ("• Lưu ý tuyệt đối: ", "Không nói “slide 1, slide 2”; không khẳng định số hóa địa chỉ đỏ đã diễn ra; giữ giọng đều, rõ chữ ở mức ~130–140 từ/phút."),
        ],
        bg_hex="F7F3E8",
        border_hex="0D2B52",
        text_pt=10.5,
    )

    doc.add_page_break()

    # PAGE 2: DETAILED 4-MINUTE SCRIPT (FITS ON ONE CLEAN PAGE)
    add_section_heading(doc, "PHẦN B. KỊCH BẢN LỜI NÓI CHI TIẾT (CHUẨN 04:00 · ĐÃ ĐO KHỚP AUDIO)", level=1, size_pt=12.5, space_before=0, space_after=3)

    spoken_paragraphs = []

    def add_stage_cue(cue_text: str):
        tbl = doc.add_table(rows=1, cols=1)
        tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        lock_table_grid(tbl, [8900])
        set_table_borders(tbl, color="CBD5E1", sz="4", inside="none", outer="none")
        b = tbl._tbl.tblPr.find(qn("w:tblBorders"))
        lb = b.find(qn("w:left"))
        lb.set(qn("w:val"), "single")
        lb.set(qn("w:sz"), "18")
        lb.set(qn("w:color"), "94A3B8")
        set_row_flags(tbl.rows[0], is_header=True)
        c = tbl.rows[0].cells[0]
        set_cell_shading(c, "F1F5F9")
        set_cell_margins(c, top=30, bottom=30, left=100, right=80)
        p = c.paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        p.paragraph_format.line_spacing = 1.05
        add_run(p, cue_text, italic=True, color=MUTED, size_pt=9.8)
        sp = doc.add_paragraph()
        sp.paragraph_format.space_before = Pt(0)
        sp.paragraph_format.space_after = Pt(1)
        sp.paragraph_format.line_spacing = 0.8

    def add_spoken(text: str):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(2.5)
        p.paragraph_format.line_spacing = 1.08
        p.paragraph_format.left_indent = Mm(2.5)
        add_run(p, text, bold=True, color=NAVY, size_pt=11.0)
        spoken_paragraphs.append(nb(text))

    # Beat 1: [00:00 - 00:08] Landing (~8s)
    add_stage_cue("[00:00 – 00:08 · Màn hình giới thiệu (Landing): Giữ giao diện LẠC HỒNG SỐ, sau lời chào bấm mở khu vực phát Video]")
    add_spoken(
        "Kính chào Ban Giám khảo. Cụm 1 thực hiện bộ bốn sản phẩm đưa Nghị quyết 57 đến gần thanh niên mang tên Lạc Hồng Số. Trước tiên, mời Ban Giám khảo theo dõi video dài một phút bốn mươi mốt giây."
    )

    # Beat 2: [00:08 - 01:50] Video 101.45s
    add_stage_cue("[00:08 – 01:50 · Khu vực phát Video (101,45 giây): Phát video kèm phụ đề tiếng Việt. Người trình bày IM LẶNG hoàn toàn trong 101,45 giây. Khi kết thúc, nhấn mũi tên phải sang Ấn phẩm 01/05]")

    # Beat 3: [01:50 - 02:50] 05 Posters (~52s)
    add_stage_cue("[01:50 – 02:04 · Ấn phẩm 01/05 (Đặt vấn đề) → Ấn phẩm 02/05 (Quan điểm cốt lõi)]")
    add_spoken(
        "Sau câu hỏi gợi mở từ video và ấn phẩm một, ấn phẩm hai tóm tắt Nghị quyết 57-NQ/TW ngày hai mươi hai tháng mười hai năm hai nghìn không trăm hai mươi bốn của Bộ Chính trị: khoa học, công nghệ, đổi mới sáng tạo và chuyển đổi số là đột phá hàng đầu; người dân và doanh nghiệp là trung tâm; dựa trên năm nền tảng thể chế, nhân lực, hạ tầng, dữ liệu, công nghệ chiến lược và an toàn không gian mạng."
    )

    add_stage_cue("[02:04 – 02:28 · Nhấn mũi tên phải sang Ấn phẩm 03/05 (Mục tiêu 2030 → Tầm nhìn 2045) · Chỉ hai khung chỉ tiêu]")
    add_spoken(
        "Sang ấn phẩm ba, đây là mục tiêu văn kiện chứ không phải kết quả hiện tại: đến năm hai nghìn không trăm ba mươi, kinh tế số tối thiểu ba mươi phần trăm GDP, trên tám mươi phần trăm dùng dịch vụ công trực tuyến, vào nhóm ba Đông Nam Á và năm mươi thế giới về năng lực cạnh tranh số, Chính phủ điện tử, nhóm ba Đông Nam Á nghiên cứu trí tuệ nhân tạo, chi R&D đạt hai phần trăm GDP. Tầm nhìn hai nghìn không trăm bốn mươi lăm trở thành nước phát triển thu nhập cao, kinh tế số tối thiểu năm mươi phần trăm GDP, thuộc nhóm ba mươi thế giới, thực hiện qua bảy nhóm nhiệm vụ."
    )

    add_stage_cue("[02:28 – 02:50 · Nhấn mũi tên phải sang Ấn phẩm 04/05 (Thanh niên hành động) → Ấn phẩm 05/05 (Lan tỏa & Mã QR)]")
    add_spoken(
        "Ấn phẩm bốn đề xuất năm phần việc cho thanh niên Cụm 1: học tập số, hỗ trợ dịch vụ công, số hóa công tác Đoàn, sáng kiến cơ sở và an toàn thông tin. Ấn phẩm năm chốt thông điệp Hiểu đúng, Làm thật, Lan tỏa cùng mã QR tới toàn văn trên Cổng Thông tin Chính phủ."
    )

    # Beat 4: [02:50 - 03:08] Social Post (~15s)
    add_stage_cue("[02:50 – 03:08 · Chuyển sang mục Bài đăng mạng xã hội & ảnh xem trước (Mockup)]")
    add_spoken(
        "Ở bài đăng mạng xã hội, nhóm giữ mạch Chuyển đổi số bắt đầu từ chính mình, sửa ý số hóa địa chỉ đỏ thành đề xuất khi đủ tư liệu phù hợp, chuẩn hóa hashtag, dự kiến đăng lúc mười bảy giờ ba mươi khi nhóm chốt kênh."
    )

    # Beat 5: [03:08 - 03:44] Thuyết minh & Cụm 1 plan (~28s)
    add_stage_cue("[03:08 – 03:44 · Chuyển sang mục Bản thuyết minh 03 trang & Kế hoạch Cụm 1]")
    add_spoken(
        "Bản thuyết minh gói trong ba trang nêu rõ lộ trình năm tuần tại Cụm 1 và chỉ số theo dõi đề xuất. Nhóm cam kết minh bạch: tranh minh họa có hỗ trợ AI là giả lập truyền thông, giữ nguyên Huy hiệu Đoàn và đối chiếu nguồn Chính phủ cùng Bộ Khoa học và Công nghệ."
    )

    # Beat 6: [03:44 - 03:52] Finale + [03:52 - 04:00] Buffer (~8s)
    add_stage_cue("[03:44 – 03:52 · Nhấn mũi tên phải sang Màn hình tổng kết (Finale)]")
    add_spoken(
        "Với tinh thần Hiểu đúng, Làm thật, Lan tỏa, Cụm 1 xin cảm ơn và sẵn sàng lắng nghe phản biện của Ban Giám khảo."
    )
    add_stage_cue("[03:52 – 04:00 · Đệm dự phòng ≥ 05 giây: Giữ màn hình Tổng kết + mã QR để chuyển sang 04 phút phản biện]")

    doc.add_page_break()

    # APPENDIX: OPTIONAL <= 6 MINUTE EXPANDED VERSION
    add_section_heading(
        doc,
        "PHỤ LỤC: PHIÊN BẢN MỞ RỘNG (CHỈ NÓI KHI NHÓM CHỌN KHUNG ≤ 06 PHÚT · GIỮ NGUYÊN VIDEO 101,45 GIÂY)",
        level=1,
        size_pt=12.5,
        space_before=0,
        space_after=4,
    )
    p_app_note = doc.add_paragraph()
    p_app_note.paragraph_format.space_after = Pt(4)
    add_run(
        p_app_note,
        "Ghi chú: Theo quy chế Trại Thanh niên số, thời lượng trình bày tối đa là 06 phút (trước phần 04 phút phản biện). Phiên bản chính ở Phần B được tối ưu chặt chẽ ở mốc 04 phút để an toàn tuyệt đối. Nếu đội có nhiều thành viên cùng lên thuyết trình và muốn nói kỹ hơn trong khung ≤ 06 phút (vẫn giữ nguyên 101,45 giây video), có thể bổ sung 03 ý mở rộng sau đây vào giữa Phần B (~60–75 giây nói thêm):",
        italic=True,
        color=SLATE,
        size_pt=11.0,
    )

    add_bullet(
        doc,
        "Mở rộng tại Ấn phẩm 03/05 (+25 giây): ",
        "Đọc gọn từng cụm trong 07 nhóm nhiệm vụ trọng tâm (Mục III.1–III.7) được nhóm gom thành 04 trụ cột trực quan: (1) Đổi mới tư duy, phong trào “học tập số” & hoàn thiện thể chế thành lợi thế cạnh tranh; (2) Đầu tư hạ tầng số, dữ liệu & phát triển nhân lực chất lượng cao; (3) Chuyển đổi số trong hệ thống chính trị, an toàn mạng & thúc đẩy doanh nghiệp; (4) Tăng cường hợp tác quốc tế.",
        size_pt=11.5,
        space_after=2.5,
    )
    add_bullet(
        doc,
        "Mở rộng tại Mục Thuyết minh Cụm 1 (+25 giây): ",
        "Giải thích rõ lý do biên tập lại câu “số hóa địa chỉ đỏ” trong Bài đăng gốc từ khẳng định đã làm sang đề xuất thực hiện khi đủ tư liệu lịch sử và quyền sử dụng hợp lệ, thể hiện thái độ trung thực học thuật và kiểm chứng số liệu của đội.",
        size_pt=11.5,
        space_after=2.5,
    )
    add_bullet(
        doc,
        "Mở rộng tại phần Minh bạch kỹ thuật (+20 giây): ",
        "Nêu thêm hai điểm nâng cấp hậu kỳ cho video gốc 101,45 giây: sửa lỗi dấu thanh “NGỒI” trên ảnh bìa mà vẫn giữ nguyên ảnh chụp thật của đoàn viên, đồng thời tạo phụ đề rời subtitles_vi.vtt và nén bản phát web mượt trên cả máy tính lẫn điện thoại.",
        size_pt=11.5,
        space_after=2.5,
    )

    out_path = ROOT / "deliverables" / "05_LoiNoi_HoTro" / "LOI_THUYET_TRINH_04_PHUT_CUM1_NQ57.docx"
    out_path.parent.mkdir(parents=True, exist_ok=True)
    doc.save(str(out_path))
    return out_path, spoken_paragraphs


# ==============================================================================
# WORD COM EXPORT -> PDF -> FITZ PAGE COUNT & 300 DPI PNG PREVIEWS
# ==============================================================================
def word_com_export_pdfs(docx_pdf_pairs):
    """Use PowerShell + Word.Application COM to update fields and export clean PDFs."""
    lines = [
        "$ErrorActionPreference = 'Stop'",
        "$word = New-Object -ComObject Word.Application",
        "$word.Visible = $false",
        "$word.DisplayAlerts = 0",
        "try {",
    ]
    for dpath, ppath in docx_pdf_pairs:
        ds = str(dpath).replace("'", "''")
        ps = str(ppath).replace("'", "''")
        lines.extend([
            f"  $doc = $word.Documents.Open('{ds}', $false, $true)",
            "  $doc.Repaginate()",
            "  foreach ($sec in $doc.Sections) {",
            "    $sec.Headers.Item(1).Range.Fields.Update() | Out-Null",
            "    $sec.Footers.Item(1).Range.Fields.Update() | Out-Null",
            "  }",
            "  $doc.Fields.Update() | Out-Null",
            f"  $doc.ExportAsFixedFormat('{ps}', 17)",
            "  $doc.Close($false)",
        ])
    lines.extend([
        "} finally {",
        "  $word.Quit()",
        "}",
    ])
    ps_script = QA_DIR / "_word_export_tmp.ps1"
    ps_script.parent.mkdir(parents=True, exist_ok=True)
    ps_script.write_text("\n".join(lines), encoding="utf-8-sig")
    try:
        subprocess.run(["powershell", "-NoProfile", "-ExecutionPolicy", "Bypass", "-File", str(ps_script)], check=True)
    finally:
        if ps_script.exists():
            ps_script.unlink()


def render_pdf_pages_to_png(pdf_path: Path, prefix: str, dpi: int = 180):
    import fitz
    PREVIEW_DIR.mkdir(parents=True, exist_ok=True)
    for old in PREVIEW_DIR.glob(f"{prefix}_p*.png"):
        old.unlink()
    doc = fitz.open(str(pdf_path))
    page_count = doc.page_count
    pngs = []
    zoom = dpi / 72.0
    mat = fitz.Matrix(zoom, zoom)
    for idx, page in enumerate(doc, start=1):
        pix = page.get_pixmap(matrix=mat, alpha=False)
        out_png = PREVIEW_DIR / f"{prefix}_p{idx}.png"
        pix.save(str(out_png))
        pngs.append(out_png)
    doc.close()
    return page_count, pngs


# ==============================================================================
# TTS TIMING CHECK FOR 4-MIN SCRIPT
# ==============================================================================
async def _synth_tts(text: str, out_mp3: Path, voice: str = "vi-VN-HoaiMyNeural"):
    import edge_tts
    comm = edge_tts.Communicate(text, voice=voice)
    await comm.save(str(out_mp3))


def measure_spoken_tts(spoken_paragraphs) -> dict:
    full_spoken = "\n\n".join(spoken_paragraphs)
    tmp_mp3 = QA_DIR / "_tmp_loi_noi_04p.mp3"
    asyncio.run(_synth_tts(full_spoken, tmp_mp3))
    res = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", str(tmp_mp3)],
        capture_output=True,
        text=True,
        check=True,
    )
    spoken_sec = float(res.stdout.strip())
    mp3_bytes = tmp_mp3.stat().st_size
    if tmp_mp3.exists():
        tmp_mp3.unlink()

    video_sec = 101.448
    total_sec = spoken_sec + video_sec
    buffer_sec = 240.0 - total_sec
    word_count = len(full_spoken.split())

    report = {
        "voice": "vi-VN-HoaiMyNeural",
        "spoken_paragraphs": len(spoken_paragraphs),
        "spoken_word_count": word_count,
        "spoken_seconds": round(spoken_sec, 2),
        "video_seconds": video_sec,
        "total_seconds": round(total_sec, 2),
        "target_limit_seconds": 240.0,
        "buffer_seconds": round(buffer_sec, 2),
        "within_235s_gate": total_sec <= 235.0,
        "temp_mp3_bytes_cleaned": mp3_bytes,
    }
    txt = (
        f"VOICE={report['voice']}\n"
        f"SPOKEN_PARAGRAPHS={report['spoken_paragraphs']}\n"
        f"SPOKEN_WORDS={report['spoken_word_count']}\n"
        f"SPOKEN_SECONDS={report['spoken_seconds']}\n"
        f"VIDEO_SECONDS={report['video_seconds']}\n"
        f"TOTAL_SECONDS={report['total_seconds']}\n"
        f"BUFFER_SECONDS={report['buffer_seconds']}\n"
        f"WITHIN_235S_GATE={report['within_235s_gate']}\n"
    )
    (QA_DIR / "WORD_TIMING_MEASUREMENT.txt").write_text(txt, encoding="utf-8")
    return report


def run_skill_audits(docx_files):
    skill_auditor_dir = Path(r"C:\Users\asus\.gemini\config\skills\xu-ly-van-phong\scripts\auditor\docx")
    scripts = [
        ("nonbreak", skill_auditor_dir / "audit_docx_nonbreak.py", []),
        ("xml_schema", skill_auditor_dir / "audit_docx_xml_schema.py", []),
        ("table_bounds", skill_auditor_dir / "audit_docx_table_bounds.py", []),
        ("effective_style_nd30", skill_auditor_dir / "audit_docx_effective_style.py", ["nd30"]),
    ]
    results = {}
    for df in docx_files:
        results[df.name] = {}
        for label, sc, extra in scripts:
            p = subprocess.run(["python", str(sc), str(df)] + extra, capture_output=True, text=True)
            results[df.name][label] = {"rc": p.returncode, "out": p.stdout.strip()}
    return results


def mirror_to_downloads(files):
    DOWNLOADS_DIR.mkdir(parents=True, exist_ok=True)
    for f in files:
        shutil.copy2(f, DOWNLOADS_DIR / f.name)


def main():
    p3_docx = build_product_3_bai_dang()
    p4_docx = build_product_4_thuyet_minh()
    p5_docx, spoken_paras = build_presentation_script()

    p3_pdf = QA_DIR / "doc_previews" / "BAI_DANG_CUM1_HOAN_CHINH.pdf"
    p4_pdf = p4_docx.with_suffix(".pdf")
    p5_pdf = QA_DIR / "doc_previews" / "LOI_THUYET_TRINH_04_PHUT_CUM1_NQ57.pdf"
    p3_pdf.parent.mkdir(parents=True, exist_ok=True)

    word_com_export_pdfs([(p3_docx, p3_pdf), (p4_docx, p4_pdf), (p5_docx, p5_pdf)])

    c3, pngs3 = render_pdf_pages_to_png(p3_pdf, "bai_dang", dpi=180)
    c4, pngs4 = render_pdf_pages_to_png(p4_pdf, "thuyet_minh", dpi=180)
    c5, pngs5 = render_pdf_pages_to_png(p5_pdf, "loi_noi", dpi=180)

    mirror_to_downloads([p3_docx, p4_docx, p4_pdf, p5_docx])

    timing = measure_spoken_tts(spoken_paras)
    audits = run_skill_audits([p3_docx, p4_docx, p5_docx])

    summary = {
        "page_counts": {
            "BAI_DANG_CUM1_HOAN_CHINH.pdf": c3,
            "THUYET_MINH_CUM1_CHUDE1.pdf": c4,
            "LOI_THUYET_TRINH_04_PHUT_CUM1_NQ57.pdf": c5,
        },
        "previews": {
            "bai_dang": [str(p) for p in pngs3],
            "thuyet_minh": [str(p) for p in pngs4],
            "loi_noi": [str(p) for p in pngs5],
        },
        "tts_timing": timing,
        "skill_audits": audits,
    }
    print(json.dumps(summary, ensure_ascii=False, indent=2))

    if c4 > 3:
        print(f"ERROR: THUYET_MINH page count is {c4} > 3!", file=sys.stderr)
        sys.exit(2)
    if not timing["within_235s_gate"]:
        print(f"ERROR: Total presentation time {timing['total_seconds']}s > 235s!", file=sys.stderr)
        sys.exit(3)


if __name__ == "__main__":
    main()
