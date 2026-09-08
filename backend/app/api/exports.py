from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.models.study import Study
from app.services.cdisc_exporter import cdisc_exporter

router = APIRouter(prefix="/exports", tags=["CDISC & Reports"])

@router.get("/cdisc/{study_id_or_code}/dm")
def export_sdtm_dm(study_id_or_code: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    st = db.query(Study).filter((Study.id == study_id_or_code) | (Study.study_code == study_id_or_code)).first()
    if not st:
        raise HTTPException(status_code=404, detail="Study not found")
    csv_content = cdisc_exporter.generate_sdtm_dm_csv(db, st.id)
    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=SDTM_DM_{st.study_code}.csv"}
    )

@router.get("/cdisc/{study_id_or_code}/ae")
def export_sdtm_ae(study_id_or_code: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    st = db.query(Study).filter((Study.id == study_id_or_code) | (Study.study_code == study_id_or_code)).first()
    if not st:
        raise HTTPException(status_code=404, detail="Study not found")
    csv_content = cdisc_exporter.generate_sdtm_ae_csv(db, st.id)
    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=SDTM_AE_{st.study_code}.csv"}
    )

@router.get("/cdisc/{study_id_or_code}/sv")
def export_sdtm_sv(study_id_or_code: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    st = db.query(Study).filter((Study.id == study_id_or_code) | (Study.study_code == study_id_or_code)).first()
    if not st:
        raise HTTPException(status_code=404, detail="Study not found")
    csv_content = cdisc_exporter.generate_sdtm_sv_csv(db, st.id)
    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=SDTM_SV_{st.study_code}.csv"}
    )

@router.get("/cdisc/{study_id_or_code}/adam")
def export_adam_adsl(study_id_or_code: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    st = db.query(Study).filter((Study.id == study_id_or_code) | (Study.study_code == study_id_or_code)).first()
    if not st:
        raise HTTPException(status_code=404, detail="Study not found")
    csv_content = cdisc_exporter.generate_adam_adsl_csv(db, st.id)
    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=ADAM_ADSL_{st.study_code}.csv"}
    )

@router.get("/cdisc/{study_id_or_code}/ds")
def export_sdtm_ds(study_id_or_code: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    st = db.query(Study).filter((Study.id == study_id_or_code) | (Study.study_code == study_id_or_code)).first()
    if not st:
        raise HTTPException(status_code=404, detail="Study not found")
    csv_content = cdisc_exporter.generate_sdtm_ds_csv(db, st.id)
    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=SDTM_DS_{st.study_code}.csv"}
    )

@router.get("/cdisc/{study_id_or_code}/define-xml")
def export_define_xml(study_id_or_code: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    st = db.query(Study).filter((Study.id == study_id_or_code) | (Study.study_code == study_id_or_code)).first()
    if not st:
        raise HTTPException(status_code=404, detail="Study not found")
    xml_content = cdisc_exporter.generate_define_xml_metadata(st)
    return Response(
        content=xml_content,
        media_type="application/xml",
        headers={"Content-Disposition": f"attachment; filename=Define_XML_{st.study_code}.xml"}
    )
