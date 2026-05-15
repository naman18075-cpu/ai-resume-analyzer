from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle

from app.core.config import settings


def build_analysis_pdf(analysis: dict) -> Path:
    file_path = settings.export_dir / f"{analysis['id']}.pdf"
    document = SimpleDocTemplate(str(file_path), pagesize=A4)
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        name="TitleAccent",
        parent=styles["Heading1"],
        textColor=colors.HexColor("#1d4ed8"),
        fontSize=20,
        leading=24,
    )

    content = [
        Paragraph("AI Resume Analyzer Report", title_style),
        Spacer(1, 12),
        Paragraph(f"<b>Role:</b> {analysis['target_role']}", styles["BodyText"]),
        Paragraph(
            f"<b>Company:</b> {analysis['company_name'] or 'Not specified'}",
            styles["BodyText"],
        ),
        Paragraph(f"<b>ATS Score:</b> {analysis['ats_score']}/100", styles["BodyText"]),
        Spacer(1, 12),
        Paragraph(analysis["executive_summary"], styles["BodyText"]),
        Spacer(1, 16),
    ]

    score_data = [
        ["Metric", "Score"],
        ["Keyword Match", analysis["score_breakdown"]["keyword_score"]],
        ["Semantic Match", analysis["score_breakdown"]["semantic_score"]],
        ["Formatting", analysis["score_breakdown"]["formatting_score"]],
        ["Section Quality", analysis["score_breakdown"]["section_score"]],
        ["Impact", analysis["score_breakdown"]["impact_score"]],
    ]

    score_table = Table(score_data, colWidths=[220, 90])
    score_table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#dbeafe")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.HexColor("#0f172a")),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
                ("PADDING", (0, 0), (-1, -1), 8),
            ]
        )
    )
    content.extend([score_table, Spacer(1, 16)])

    content.append(Paragraph("<b>Top Recommendations</b>", styles["Heading2"]))
    for suggestion in analysis["improvement_suggestions"]:
        content.append(Paragraph(f"• {suggestion}", styles["BodyText"]))

    content.append(Spacer(1, 16))
    content.append(Paragraph("<b>Missing Keywords</b>", styles["Heading2"]))
    content.append(Paragraph(", ".join(analysis["missing_keywords"]) or "None", styles["BodyText"]))

    document.build(content)
    return file_path
