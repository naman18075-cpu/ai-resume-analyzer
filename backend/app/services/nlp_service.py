import re
from collections import Counter
from functools import lru_cache

import numpy as np
import spacy
#from sentence_transformers import SentenceTransformer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from app.utils.skill_catalog import SKILL_CATALOG
from app.utils.text import normalize_skill, normalize_text, unique_list


SECTION_ALIASES = {
    "summary": {"summary", "professional summary", "profile", "about"},
    "experience": {"experience", "work experience", "professional experience"},
    "skills": {"skills", "technical skills", "core skills"},
    "projects": {"projects", "selected projects"},
    "education": {"education", "academic background"},
    "certifications": {"certifications", "licenses", "certification"},
}

ACTION_VERBS = {
    "built",
    "led",
    "designed",
    "implemented",
    "developed",
    "improved",
    "optimized",
    "delivered",
    "scaled",
    "streamlined",
    "automated",
    "launched",
    "orchestrated",
    "drove",
    "mentored",
    "architected",
    "created",
}

CERTIFICATION_MAP = {
    "aws": "AWS Certified Solutions Architect - Associate",
    "azure": "Microsoft Certified: Azure Developer Associate",
    "gcp": "Professional Cloud Developer",
    "kubernetes": "Certified Kubernetes Application Developer",
    "tensorflow": "TensorFlow Developer Certificate",
    "project management": "PMP or Certified ScrumMaster",
    "data analysis": "Google Data Analytics Professional Certificate",
    "cybersecurity": "CompTIA Security+",
}

ROLE_BLUEPRINTS = [
    {"role": "Frontend Engineer", "skills": {"react", "typescript", "tailwind css", "vite", "jest"}},
    {"role": "Full-Stack Engineer", "skills": {"react", "node.js", "postgresql", "docker", "rest api"}},
    {"role": "AI Product Engineer", "skills": {"python", "fastapi", "openai api", "nlp", "postgresql"}},
    {"role": "Data Analyst", "skills": {"sql", "python", "tableau", "power bi", "data analysis"}},
    {"role": "DevOps Engineer", "skills": {"docker", "kubernetes", "aws", "terraform", "ci/cd"}},
]


@lru_cache
def get_spacy_model():
    try:
        return spacy.load("en_core_web_sm")
    except Exception:
        return spacy.blank("en")


@lru_cache
def get_sentence_model():
    #try:
        #return SentenceTransformer("all-MiniLM-L6-v2")
    #except Exception:
        return None


def extract_sections(text: str) -> dict[str, str]:
    current_section = "summary"
    buckets: dict[str, list[str]] = {current_section: []}

    for raw_line in text.splitlines():
        line = raw_line.strip()
        if not line:
            continue
        lowered = normalize_skill(line.rstrip(":"))
        matched_section = next(
            (name for name, aliases in SECTION_ALIASES.items() if lowered in aliases),
            None,
        )
        if matched_section:
            current_section = matched_section
            buckets.setdefault(current_section, [])
            continue
        buckets.setdefault(current_section, []).append(line)

    return {section: normalize_text(" ".join(content)) for section, content in buckets.items() if content}


def extract_skills(text: str) -> list[str]:
    lowered = text.lower()
    found: list[str] = []

    for skill in SKILL_CATALOG:
        pattern = r"\b" + re.escape(skill.lower()) + r"\b"
        if re.search(pattern, lowered):
            found.append(skill)

    nlp = get_spacy_model()
    doc = nlp(text[:40000])
    extras: list[str] = []
    if "ner" in nlp.pipe_names:
        extras.extend(ent.text for ent in doc.ents if 1 < len(ent.text.split()) <= 3)

    return unique_list(found + extras)[:40]


def compare_skills(resume_skills: list[str], jd_skills: list[str]) -> dict[str, list[str] | float]:
    normalized_resume = {normalize_skill(skill): skill for skill in resume_skills}
    matched: list[str] = []
    missing: list[str] = []

    for jd_skill in jd_skills:
        normalized_jd = normalize_skill(jd_skill)
        is_match = normalized_jd in normalized_resume or any(
            normalized_jd in candidate or candidate in normalized_jd
            for candidate in normalized_resume
            if normalized_jd and candidate
        )
        if is_match:
            matched.append(jd_skill)
        else:
            missing.append(jd_skill)

    coverage = len(matched) / len(jd_skills) if jd_skills else 0.0
    return {
        "matched": unique_list(matched),
        "missing": unique_list(missing),
        "coverage": round(coverage, 4),
    }


def semantic_similarity(resume_text: str, job_description_text: str) -> float:
    sentence_model = get_sentence_model()
    if sentence_model:
        embeddings = sentence_model.encode([resume_text[:5000], job_description_text[:5000]])
        numerator = float(np.dot(embeddings[0], embeddings[1]))
        denominator = float(np.linalg.norm(embeddings[0]) * np.linalg.norm(embeddings[1]))
        return round(max(min(numerator / denominator, 1.0), 0.0), 4) if denominator else 0.0

    vectorizer = TfidfVectorizer(stop_words="english")
    matrix = vectorizer.fit_transform([resume_text, job_description_text])
    score = cosine_similarity(matrix[0:1], matrix[1:2])[0][0]
    return round(float(score), 4)


def analyze_bullets(text: str, jd_skills: list[str]) -> dict[str, float | list[dict]]:
    bullet_lines = []
    for raw_line in text.splitlines():
        line = raw_line.strip()
        if re.match(r"^(\u2022|-|\*|\d+[.)])\s+", line):
            bullet_lines.append(re.sub(r"^(\u2022|-|\*|\d+[.)])\s+", "", line))

    if not bullet_lines:
        return {"average_score": 52.0, "weak_bullets": []}

    weak_bullets: list[dict] = []
    bullet_scores: list[float] = []

    for bullet in bullet_lines[:12]:
        words = bullet.split()
        score = 45.0
        lower_bullet = bullet.lower()
        if words and words[0].lower() in ACTION_VERBS:
            score += 20
        if re.search(r"\d+[%xkK]?", bullet):
            score += 20
        if len(words) >= 12:
            score += 10
        if any(normalize_skill(skill) in normalize_skill(lower_bullet) for skill in jd_skills[:10]):
            score += 10

        bullet_scores.append(min(score, 98.0))
        if score < 70:
            suggestion_bits = []
            if not (words and words[0].lower() in ACTION_VERBS):
                suggestion_bits.append("start with a stronger action verb")
            if not re.search(r"\d+[%xkK]?", bullet):
                suggestion_bits.append("add a measurable outcome")
            if len(words) < 12:
                suggestion_bits.append("add more implementation detail")
            weak_bullets.append(
                {
                    "original": bullet,
                    "score": round(score, 1),
                    "issue": ", ".join(suggestion_bits) or "align it more tightly to the target role",
                }
            )

    average_score = sum(bullet_scores) / len(bullet_scores)
    return {
        "average_score": round(average_score, 2),
        "weak_bullets": weak_bullets[:4],
    }


def score_resume_sections(sections: dict[str, str]) -> dict[str, float]:
    scores: dict[str, float] = {}
    for section_name in SECTION_ALIASES:
        content = sections.get(section_name, "")
        if not content:
            scores[section_name] = 35.0
        elif len(content.split()) < 25:
            scores[section_name] = 65.0
        else:
            scores[section_name] = 85.0

    scores["overall"] = round(sum(scores.values()) / len(SECTION_ALIASES), 2)
    return scores


def formatting_score(text: str, sections: dict[str, str]) -> float:
    score = 55.0
    if len(text.split()) >= 250:
        score += 10
    if len(text.splitlines()) >= 12:
        score += 10
    if len(sections) >= 4:
        score += 12
    if re.search(r"\b(email|phone|linkedin)\b", text.lower()):
        score += 8
    return round(min(score, 96.0), 2)


def classify_resume_strength(score: float) -> str:
    if score >= 85:
        return "Outstanding"
    if score >= 75:
        return "Strong"
    if score >= 60:
        return "Competitive"
    return "Needs Work"


def build_executive_summary(
    score: float,
    matched_keywords: list[str],
    missing_keywords: list[str],
    semantic_score_value: float,
) -> str:
    matched_preview = ", ".join(matched_keywords[:4]) or "core job requirements"
    gap_preview = ", ".join(missing_keywords[:3]) or "few major gaps"
    return (
        f"This resume is currently scoring {round(score)} out of 100 for ATS alignment. "
        f"It already demonstrates strength around {matched_preview}, while the largest gap areas "
        f"are {gap_preview}. Semantic alignment is {round(semantic_score_value)}%, so targeted keyword "
        f"coverage and sharper quantified achievements should move this candidate into a stronger shortlist tier."
    )


def build_fallback_bullet_rewrites(weak_bullets: list[dict], jd_skills: list[str]) -> list[dict]:
    rewrites: list[dict] = []
    skill_hint = ", ".join(jd_skills[:2]) if jd_skills else "cross-functional delivery"
    for bullet in weak_bullets[:3]:
        original = bullet["original"]
        cleaned = original[0].lower() + original[1:] if original else original
        rewrites.append(
            {
                "original": original,
                "rewrite": (
                    f"Led {cleaned}, using {skill_hint} to deliver measurable business impact "
                    f"and improve team visibility on results."
                ),
            }
        )
    return rewrites


def build_interview_questions(matched_keywords: list[str], missing_keywords: list[str]) -> list[str]:
    source_skills = missing_keywords[:3] + matched_keywords[:2]
    return [
        f"Tell me about a project where you applied {skill} under tight delivery constraints."
        for skill in source_skills
    ][:5]


def recommend_certifications(missing_keywords: list[str]) -> list[str]:
    recommendations = []
    missing_blob = " ".join(skill.lower() for skill in missing_keywords)
    for keyword, certification in CERTIFICATION_MAP.items():
        if keyword in missing_blob:
            recommendations.append(certification)
    return unique_list(recommendations)[:4]


def recommend_roles(resume_skills: list[str]) -> list[dict]:
    normalized_resume = {normalize_skill(skill) for skill in resume_skills}
    recommendations: list[dict] = []
    for blueprint in ROLE_BLUEPRINTS:
        overlap = blueprint["skills"].intersection(normalized_resume)
        if not overlap:
            continue
        coverage = round((len(overlap) / len(blueprint["skills"])) * 100, 1)
        recommendations.append(
            {
                "role": blueprint["role"],
                "match_score": coverage,
                "why": f"Strong overlap in {', '.join(sorted(overlap)[:3])}.",
            }
        )
    return sorted(recommendations, key=lambda item: item["match_score"], reverse=True)[:3]


def top_skills(skills: list[str]) -> list[str]:
    counter = Counter(skill for skill in skills if skill)
    return [name for name, _ in counter.most_common(6)]
