from typing import Dict, Any
from app.models.enums import RiskLevel

def calculate_study_risk(
    recruitment_lag_pct: float,
    open_queries_count: int,
    critical_queries_count: int,
    overdue_monitoring_count: int,
    deviations_count: int,
    critical_deviations_count: int,
    regulatory_days_remaining: int,
    active_sae_count: int
) -> Dict[str, Any]:
    """
    Transparent rule-based Operational Risk Engine.
    Computes a deterministic 0-100 risk score and level (HEALTHY, WATCH, AT_RISK, CRITICAL).
    """
    score = 0.0
    contributing_factors = []

    # 1. Recruitment Lag factor (Max 25 pts)
    # recruitment_lag_pct is positive if behind schedule
    if recruitment_lag_pct > 30.0:
        score += 25.0
        contributing_factors.append(f"Severe recruitment lag (+{recruitment_lag_pct:.1f}% behind schedule)")
    elif recruitment_lag_pct > 15.0:
        score += 15.0
        contributing_factors.append(f"Moderate recruitment lag (+{recruitment_lag_pct:.1f}%)")
    elif recruitment_lag_pct > 5.0:
        score += 5.0
        contributing_factors.append(f"Minor recruitment lag (+{recruitment_lag_pct:.1f}%)")

    # 2. Data Quality & Queries (Max 20 pts)
    dq_score = min(10.0, open_queries_count * 0.5) + (critical_queries_count * 5.0)
    dq_score = min(20.0, dq_score)
    score += dq_score
    if dq_score > 0:
        contributing_factors.append(f"Data queries: {open_queries_count} open ({critical_queries_count} critical)")

    # 3. Monitoring Visits (Max 15 pts)
    if overdue_monitoring_count > 0:
        mon_score = min(15.0, overdue_monitoring_count * 10.0)
        score += mon_score
        contributing_factors.append(f"Overdue CRA site monitoring visits ({overdue_monitoring_count})")

    # 4. Protocol Deviations (Max 15 pts)
    dev_score = min(10.0, deviations_count * 2.0) + (critical_deviations_count * 5.0)
    dev_score = min(15.0, dev_score)
    score += dev_score
    if dev_score > 0:
        contributing_factors.append(f"Protocol deviations: {deviations_count} total ({critical_deviations_count} critical)")

    # 5. Regulatory Deadlines (Max 10 pts)
    if regulatory_days_remaining <= 0:
        score += 10.0
        contributing_factors.append("Overdue regulatory/CTRI milestone")
    elif regulatory_days_remaining <= 14:
        score += 7.0
        contributing_factors.append(f"Approaching regulatory deadline ({regulatory_days_remaining} days remaining)")
    elif regulatory_days_remaining <= 30:
        score += 3.0
        contributing_factors.append(f"Upcoming regulatory milestone ({regulatory_days_remaining} days)")

    # 6. Safety & SAE alerts (Max 15 pts)
    if active_sae_count > 0:
        sae_score = min(15.0, active_sae_count * 7.5)
        score += sae_score
        contributing_factors.append(f"Expedited safety investigations active ({active_sae_count} SAE)")

    final_score = min(100.0, round(score, 1))

    # Risk level categorization
    if final_score >= 70.0:
        level = RiskLevel.AT_RISK if final_score < 85.0 else RiskLevel.CRITICAL
    elif final_score >= 40.0:
        level = RiskLevel.WATCH
    else:
        level = RiskLevel.HEALTHY

    return {
        "score": final_score,
        "level": level,
        "factors": contributing_factors
    }
