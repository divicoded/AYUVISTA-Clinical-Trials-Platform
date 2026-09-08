import io
import csv
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from app.models.study import Study
from app.models.participant import Participant
from app.models.visit import Visit
from app.models.safety import SafetyCase

class CDISCExportEngine:
    """
    CDISC standards export engine.
    Generates SDTM-oriented domain datasets (DM, AE, DS, SV) and Define-XML structural metadata.
    """

    @staticmethod
    def generate_sdtm_dm_csv(db: Session, study_id: str) -> str:
        """SDTM Demographics (DM) domain export"""
        study = db.query(Study).filter(Study.id == study_id).first()
        study_code = study.study_code if study else "STUDY"
        participants = db.query(Participant).filter(Participant.study_id == study_id).all()

        output = io.StringIO()
        writer = csv.writer(output)
        # Standard SDTM DM variables
        writer.writerow(["STUDYID", "DOMAIN", "USUBJID", "SUBJID", "RFSTDTC", "ARMCD", "ARM", "SEX", "AGE", "AGEU", "COUNTRY"])

        for p in participants:
            arm_code = "TRT" if "Standard" in p.treatment_arm else "CTRL"
            writer.writerow([
                study_code,
                "DM",
                f"{study_code}-{p.synthetic_id}",
                p.synthetic_id,
                p.enrollment_date.isoformat() if p.enrollment_date else "",
                arm_code,
                p.treatment_arm,
                p.gender.upper()[:1] if p.gender else "U",
                p.age_years,
                "YEARS",
                "IND"
            ])
        return output.getvalue()

    @staticmethod
    def generate_sdtm_ae_csv(db: Session, study_id: str) -> str:
        """SDTM Adverse Events (AE) domain export"""
        study = db.query(Study).filter(Study.id == study_id).first()
        study_code = study.study_code if study else "STUDY"
        cases = db.query(SafetyCase).filter(SafetyCase.study_id == study_id).all()

        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(["STUDYID", "DOMAIN", "USUBJID", "AETERM", "AEDECOD", "AEBODSYS", "AESER", "AESEV", "AEREL", "AESTDTC"])

        for c in cases:
            participant = db.query(Participant).filter(Participant.id == c.participant_id).first()
            subjid = participant.synthetic_id if participant else "SYN-UNKNOWN"
            writer.writerow([
                study_code,
                "AE",
                f"{study_code}-{subjid}",
                c.adverse_event_term,
                c.meddra_preferred_term or c.adverse_event_term,
                c.meddra_soc_term or "Investigations",
                "Y" if c.is_serious else "N",
                c.severity.value,
                c.causality.value,
                c.onset_date.strftime("%Y-%m-%d") if c.onset_date else ""
            ])
        return output.getvalue()

    @staticmethod
    def generate_sdtm_sv_csv(db: Session, study_id: str) -> str:
        """SDTM Subject Visits (SV) domain export"""
        study = db.query(Study).filter(Study.id == study_id).first()
        study_code = study.study_code if study else "STUDY"
        visits = db.query(Visit).filter(Visit.study_id == study_id).limit(500).all()

        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(["STUDYID", "DOMAIN", "USUBJID", "VISITNUM", "VISIT", "SVSTDTC", "SVSTATUS"])

        for v in visits:
            participant = db.query(Participant).filter(Participant.id == v.participant_id).first()
            subjid = participant.synthetic_id if participant else "SYN-UNKNOWN"
            writer.writerow([
                study_code,
                "SV",
                f"{study_code}-{subjid}",
                v.sequence_order,
                v.visit_name,
                v.actual_date.isoformat() if v.actual_date else "",
                v.status.value
            ])
        return output.getvalue()

    @staticmethod
    def generate_adam_adsl_csv(db: Session, study_id: str) -> str:
        """ADaM Subject-Level Analysis Dataset (ADSL) export"""
        study = db.query(Study).filter(Study.id == study_id).first()
        study_code = study.study_code if study else "STUDY"
        participants = db.query(Participant).filter(Participant.study_id == study_id).all()

        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(["STUDYID", "USUBJID", "SUBJID", "TRT01P", "SAFFL", "ITTFL", "COMPLFL", "AGE", "SEX"])

        for p in participants:
            saffl = "Y" if p.participant_status.value in ["ENROLLED", "ACTIVE", "COMPLETED"] else "N"
            ittfl = "Y" if p.randomization_status == "RANDOMIZED" else "N"
            complfl = "Y" if p.participant_status.value == "COMPLETED" else "N"
            writer.writerow([
                study_code,
                f"{study_code}-{p.synthetic_id}",
                p.synthetic_id,
                p.treatment_arm,
                saffl,
                ittfl,
                complfl,
                p.age_years,
                p.gender.upper()[:1] if p.gender else "U"
            ])
        return output.getvalue()

    @staticmethod
    def generate_sdtm_ds_csv(db: Session, study_id: str) -> str:
        """SDTM Disposition (DS) domain export - one record per disposition event per subject"""
        study = db.query(Study).filter(Study.id == study_id).first()
        study_code = study.study_code if study else "STUDY"
        participants = db.query(Participant).filter(Participant.study_id == study_id).all()

        output = io.StringIO()
        writer = csv.writer(output)
        # Standard SDTM DS variables
        writer.writerow([
            "STUDYID", "DOMAIN", "USUBJID", "DSSEQ", "DSTERM", "DSDECOD",
            "DSCAT", "EPOCH", "DSSTDTC"
        ])

        status_map = {
            "COMPLETED":        ("Completed Study",          "COMPLETED",          "PROTOCOL MILESTONE"),
            "WITHDRAWN":        ("Withdrawn by Subject",     "WITHDRAWN BY SUBJECT","DISPOSITION EVENT"),
            "SCREEN_FAILED":    ("Screen Failure",           "SCREEN FAILURE",     "PROTOCOL MILESTONE"),
            "ACTIVE":           ("Ongoing - Treatment",      "ONGOING",            "PROTOCOL MILESTONE"),
            "ENROLLED":         ("Randomization",            "RANDOMIZED",         "PROTOCOL MILESTONE"),
            "LOST_TO_FU":       ("Lost to Follow-up",        "LOST TO FOLLOW-UP",  "DISPOSITION EVENT"),
        }

        for seq, p in enumerate(participants, start=1):
            raw_status = p.participant_status.value if hasattr(p.participant_status, 'value') else str(p.participant_status)
            term, dsdecod, dscat = status_map.get(
                raw_status,
                (f"Completed {raw_status}", raw_status, "PROTOCOL MILESTONE")
            )
            epoch = "TREATMENT" if raw_status in ("ACTIVE", "COMPLETED") else "SCREENING"
            dsstdtc = p.enrollment_date.isoformat() if p.enrollment_date else ""
            writer.writerow([
                study_code, "DS",
                f"{study_code}-{p.synthetic_id}",
                seq, term, dsdecod, dscat, epoch, dsstdtc
            ])
        return output.getvalue()

    @staticmethod
    def generate_define_xml_metadata(study: Study) -> str:
        """Generate Define-XML 2.0 metadata representation"""
        return f"""<?xml version="1.0" encoding="UTF-8"?>
<ODM xmlns="http://www.cdisc.org/ns/odm/v1.3"
     xmlns:def="http://www.cdisc.org/ns/def/v2.0"
     FileOID="AIIA.NEXUS.{study.study_code}.DEFINE"
     CreationDateTime="2026-09-05T12:00:00Z"
     FileType="Snapshot">
  <Study OID="{study.study_code}">
    <GlobalVariables>
      <StudyName>{study.title}</StudyName>
      <StudyDescription>{study.short_title}</StudyDescription>
      <ProtocolName>{study.study_code} {study.protocol_version}</ProtocolName>
    </GlobalVariables>
    <MetaDataVersion OID="MDV.{study.study_code}" Name="CDISC SDTM v3.3 Tabulation Metadata" def:StandardName="SDTM-IG" def:StandardVersion="3.3">
      <!-- ItemGroupDef for Demographics -->
      <ItemGroupDef OID="IG.DM" Name="DM" Repeating="No" IsReferenceData="No" SASDatasetName="DM" Domain="DM" Purpose="Tabulation" def:Structure="One record per subject" def:Class="SPECIAL PURPOSE">
        <Description><TranslatedText xml:lang="en">Demographics</TranslatedText></Description>
        <ItemRef ItemOID="IT.STUDYID" OrderNumber="1" Mandatory="Yes"/>
        <ItemRef ItemOID="IT.DOMAIN" OrderNumber="2" Mandatory="Yes"/>
        <ItemRef ItemOID="IT.USUBJID" OrderNumber="3" Mandatory="Yes"/>
        <ItemRef ItemOID="IT.ARM" OrderNumber="4" Mandatory="Yes"/>
      </ItemGroupDef>
      <!-- ItemGroupDef for Adverse Events -->
      <ItemGroupDef OID="IG.AE" Name="AE" Repeating="Yes" IsReferenceData="No" SASDatasetName="AE" Domain="AE" Purpose="Tabulation" def:Structure="One record per adverse event per subject" def:Class="EVENTS">
        <Description><TranslatedText xml:lang="en">Adverse Events</TranslatedText></Description>
        <ItemRef ItemOID="IT.STUDYID" OrderNumber="1" Mandatory="Yes"/>
        <ItemRef ItemOID="IT.USUBJID" OrderNumber="2" Mandatory="Yes"/>
        <ItemRef ItemOID="IT.AETERM" OrderNumber="3" Mandatory="Yes"/>
        <ItemRef ItemOID="IT.AESER" OrderNumber="4" Mandatory="Yes"/>
      </ItemGroupDef>
    </MetaDataVersion>
  </Study>
</ODM>"""

cdisc_exporter = CDISCExportEngine()
