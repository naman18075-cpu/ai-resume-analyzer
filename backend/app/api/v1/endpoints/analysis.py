from fastapi import APIRouter, Depends, Request
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.limiter import limiter
from app.db.session import get_db
from app.models.user import User
from app.schemas.analysis import AnalysisCreateRequest, AnalysisDetail, AnalysisListItem
from app.services.analysis_service import analysis_service
from app.services.pdf_service import build_analysis_pdf


router = APIRouter(prefix="/analyses", tags=["Analyses"])


@router.post("", response_model=AnalysisDetail)
@limiter.limit("5/minute")
async def create_analysis(
    request: Request,
    payload: AnalysisCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> AnalysisDetail:
    del request
    data = await analysis_service.create_analysis(db, current_user, payload)
    return AnalysisDetail.model_validate(data)


@router.get("", response_model=list[AnalysisListItem])
async def list_analyses(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[AnalysisListItem]:
    return [AnalysisListItem.model_validate(item) for item in analysis_service.list_analyses(db, current_user)]


@router.get("/{analysis_id}", response_model=AnalysisDetail)
async def get_analysis(
    analysis_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> AnalysisDetail:
    data = analysis_service.get_analysis(db, current_user, analysis_id)
    return AnalysisDetail.model_validate(data)


@router.get("/{analysis_id}/export")
async def export_analysis(
    analysis_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> FileResponse:
    analysis = analysis_service.get_analysis(db, current_user, analysis_id)
    file_path = build_analysis_pdf(analysis)
    return FileResponse(path=file_path, filename=f"analysis-{analysis_id}.pdf", media_type="application/pdf")
