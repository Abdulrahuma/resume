def skill_match_score(matched_skills, jd_skills):
    if not jd_skills:
        return 0
    return (len(matched_skills) / len(jd_skills)) * 100


def section_score(sections):
    required = ["skills", "experience", "projects", "education"]
    score = 0

    for section in required:
        if section in sections and len(sections[section]) > 30:
            score += 25
    return score


def final_ats_score(skill_score, keyword_similarity, section_score):
    final_score = (
        (skill_score * 0.4) +
        (keyword_similarity * 100 * 0.3) +
        (section_score * 0.2)
    )
    return round(final_score, 2)
