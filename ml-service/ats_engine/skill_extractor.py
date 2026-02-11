import re
from ats_engine.skills_db import SKILLS

def extract_skills(text):
    text = text.lower()
    found_skills = set()

    for skill in SKILLS:
        pattern = r"\b" + re.escape(skill) + r"\b"
        if re.search(pattern, text):
            found_skills.add(skill)

    return list(found_skills)
