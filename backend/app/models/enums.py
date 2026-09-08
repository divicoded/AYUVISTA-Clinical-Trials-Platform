import enum

class UserRole(str, enum.Enum):
    ADMIN = "ADMIN"
    PRINCIPAL_INVESTIGATOR = "PRINCIPAL_INVESTIGATOR"
    STUDY_COORDINATOR = "STUDY_COORDINATOR"
    MONITOR = "MONITOR"
    ETHICS = "ETHICS"
    PHARMACOVIGILANCE = "PHARMACOVIGILANCE"
    LEADERSHIP = "LEADERSHIP"
    REGULATOR_READ_ONLY = "REGULATOR_READ_ONLY"

class StudyStatus(str, enum.Enum):
    DRAFT = "DRAFT"
    SUBMITTED = "SUBMITTED"
    ACTIVE = "ACTIVE"
    SUSPENDED = "SUSPENDED"
    COMPLETED = "COMPLETED"
    LOCKED = "LOCKED"
    CLOSED = "CLOSED"

class LifecycleStage(str, enum.Enum):
    PROTOCOL = "PROTOCOL"
    IEC_SUBMISSION = "IEC_SUBMISSION"
    IEC_APPROVAL = "IEC_APPROVAL"
    CTRI_REGISTRATION = "CTRI_REGISTRATION"
    SITE_ACTIVATION = "SITE_ACTIVATION"
    RECRUITMENT = "RECRUITMENT"
    TREATMENT = "TREATMENT"
    FOLLOW_UP = "FOLLOW_UP"
    DATABASE_LOCK = "DATABASE_LOCK"
    CLOSE_OUT = "CLOSE_OUT"

class RiskLevel(str, enum.Enum):
    HEALTHY = "HEALTHY"
    WATCH = "WATCH"
    AT_RISK = "AT_RISK"
    CRITICAL = "CRITICAL"

class SiteStatus(str, enum.Enum):
    PENDING = "PENDING"
    INITIATED = "INITIATED"
    ACTIVE = "ACTIVE"
    SUSPENDED = "SUSPENDED"
    CLOSED = "CLOSED"

class ParticipantStatus(str, enum.Enum):
    SCREENED = "SCREENED"
    ELIGIBLE = "ELIGIBLE"
    ENROLLED = "ENROLLED"
    ACTIVE = "ACTIVE"
    WITHDRAWN = "WITHDRAWN"
    COMPLETED = "COMPLETED"

class ConsentStatus(str, enum.Enum):
    PENDING = "PENDING"
    OBTAINED = "OBTAINED"
    WITHDRAWN = "WITHDRAWN"
    SUPERSEDED = "SUPERSEDED"
    INVALID = "INVALID"

class VisitName(str, enum.Enum):
    SCREENING = "Screening"
    BASELINE = "Baseline"
    V1 = "V1 (Week 2)"
    V2 = "V2 (Week 4)"
    V3 = "V3 (Week 8)"
    V4 = "V4 (Week 12)"
    END_OF_TREATMENT = "End of Treatment"
    FOLLOW_UP = "Follow-up"
    FINAL = "Final"

class VisitStatus(str, enum.Enum):
    SCHEDULED = "SCHEDULED"
    COMPLETED = "COMPLETED"
    MISSED = "MISSED"
    RESCHEDULED = "RESCHEDULED"
    OUTSIDE_WINDOW = "OUTSIDE_WINDOW"

class QuerySeverity(str, enum.Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"

class QueryStatus(str, enum.Enum):
    OPEN = "OPEN"
    IN_REVIEW = "IN_REVIEW"
    ANSWERED = "ANSWERED"
    CLOSED = "CLOSED"
    REOPENED = "REOPENED"

class MonitoringStatus(str, enum.Enum):
    PLANNED = "PLANNED"
    SCHEDULED = "SCHEDULED"
    COMPLETED = "COMPLETED"
    OVERDUE = "OVERDUE"

class DeviationSeverity(str, enum.Enum):
    MINOR = "MINOR"
    MAJOR = "MAJOR"
    CRITICAL = "CRITICAL"

class DeviationStatus(str, enum.Enum):
    OPEN = "OPEN"
    UNDER_REVIEW = "UNDER_REVIEW"
    CAPA_REQUIRED = "CAPA_REQUIRED"
    RESOLVED = "RESOLVED"
    CLOSED = "CLOSED"

class IECDecision(str, enum.Enum):
    DRAFT = "DRAFT"
    SUBMITTED = "SUBMITTED"
    UNDER_REVIEW = "UNDER_REVIEW"
    APPROVED = "APPROVED"
    APPROVED_WITH_CONDITIONS = "APPROVED_WITH_CONDITIONS"
    RETURNED = "RETURNED"
    REJECTED = "REJECTED"
    EXPIRED = "EXPIRED"

class AESeverity(str, enum.Enum):
    MILD = "MILD"
    MODERATE = "MODERATE"
    SEVERE = "SEVERE"
    LIFE_THREATENING = "LIFE_THREATENING"
    DEATH = "DEATH"

class AEExpectedness(str, enum.Enum):
    EXPECTED = "EXPECTED"
    UNEXPECTED = "UNEXPECTED"

class AECausality(str, enum.Enum):
    CERTAIN = "CERTAIN"
    PROBABLE = "PROBABLE"
    POSSIBLE = "POSSIBLE"
    UNLIKELY = "UNLIKELY"
    CONDITIONAL = "CONDITIONAL"
    NOT_ASSESSABLE = "NOT_ASSESSABLE"

class SafetyWorkflowState(str, enum.Enum):
    REPORTED = "REPORTED"
    VALIDATED = "VALIDATED"
    MEDICAL_REVIEW = "MEDICAL_REVIEW"
    CODING = "CODING"
    CAUSALITY_REVIEW = "CAUSALITY_REVIEW"
    REGULATORY_ASSESSMENT = "REGULATORY_ASSESSMENT"
    SUBMITTED = "SUBMITTED"
    CLOSED = "CLOSED"

class SignalState(str, enum.Enum):
    DETECTED = "DETECTED"
    UNDER_REVIEW = "UNDER_REVIEW"
    MONITORING = "MONITORING"
    CLOSED = "CLOSED"

class TaskPriority(str, enum.Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    URGENT = "URGENT"

class TaskStatus(str, enum.Enum):
    OPEN = "OPEN"
    IN_PROGRESS = "IN_PROGRESS"
    BLOCKED = "BLOCKED"
    COMPLETED = "COMPLETED"
