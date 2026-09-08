from typing import List, Dict, Optional

class CodingDictionaryAdapter:
    """
    Terminology Abstraction Layer.
    Provides synthetic/demo MedDRA and WHO-Drug like dictionaries for clinical trial demonstration.
    Transparently labelled as Demo/Synthetic Terminology Adapter.
    """
    def __init__(self):
        self.dictionary_name = "Synthetic MedDRA & Herbal Formulations Concept Dictionary"
        self.version = "Demo v26.1 (Synthetic/Unlicensed Adapter)"
        self.is_licensed_production = False
        
        # Seeded representative clinical adverse event terms
        self.terms: List[Dict[str, str]] = [
            {
                "code": "10037844",
                "preferred_term": "Rash erythematous",
                "soc_term": "Skin and subcutaneous tissue disorders",
                "status": "Active (Demo)"
            },
            {
                "code": "10019699",
                "preferred_term": "Hepatic enzyme increased",
                "soc_term": "Investigations",
                "status": "Active (Demo)"
            },
            {
                "code": "10013663",
                "preferred_term": "Dyspepsia",
                "soc_term": "Gastrointestinal disorders",
                "status": "Active (Demo)"
            },
            {
                "code": "10028813",
                "preferred_term": "Nausea",
                "soc_term": "Gastrointestinal disorders",
                "status": "Active (Demo)"
            },
            {
                "code": "10019211",
                "preferred_term": "Headache",
                "soc_term": "Nervous system disorders",
                "status": "Active (Demo)"
            },
            {
                "code": "10003011",
                "preferred_term": "Arthralgia",
                "soc_term": "Musculoskeletal and connective tissue disorders",
                "status": "Active (Demo)"
            },
            {
                "code": "10016256",
                "preferred_term": "Fatigue",
                "soc_term": "General disorders and administration site conditions",
                "status": "Active (Demo)"
            },
            {
                "code": "10046735",
                "preferred_term": "Urticaria acute",
                "soc_term": "Skin and subcutaneous tissue disorders",
                "status": "Active (Demo)"
            },
            {
                "code": "10001367",
                "preferred_term": "Alanine aminotransferase increased",
                "soc_term": "Investigations",
                "status": "Active (Demo)"
            },
            {
                "code": "10003781",
                "preferred_term": "Aspartate aminotransferase increased",
                "soc_term": "Investigations",
                "status": "Active (Demo)"
            }
        ]

    def search(self, query: str) -> List[Dict[str, str]]:
        q = query.lower().strip()
        if not q:
            return self.terms[:10]
        results = [
            t for t in self.terms
            if q in t["preferred_term"].lower() or q in t["soc_term"].lower() or q in t["code"]
        ]
        return results

coding_adapter = CodingDictionaryAdapter()
