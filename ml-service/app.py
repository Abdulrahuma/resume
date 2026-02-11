from fastapi import FastAPI
from pydantic import BaseModel
import os
import pdfplumber
import docx

app = FastAPI()

class ResumePath(BaseModel):
    file_path: str

@app.post("/parse-resume")
def parse_resume(data: ResumePath):
    path = data.file_path
    print("Received path:", path)

    if not os.path.exists(path):
        return {"error": f"File not found at {path}"}

    ext = os.path.splitext(path)[1].lower()

    if ext == ".pdf":
        text = ""
        with pdfplumber.open(path) as pdf:
            for page in pdf.pages:
                text += page.extract_text() or ""
    elif ext == ".docx":
        doc = docx.Document(path)
        text = "\n".join([p.text for p in doc.paragraphs])
    else:
        return {"error": "Unsupported file format"}

    return {"text": text}

from resume_parser.section_extractor import extract_sections
from ats_engine.skill_extractor import extract_skills
from ats_engine.skill_matcher import match_skills

from ats_engine.tfidf_matcher import tfidf_similarity
from ats_engine.score_calculator import (
    skill_match_score,
    section_score,
    final_ats_score
)

class ATSRequest(BaseModel):
    resume_text: str
    job_description: str

@app.post("/analyze")
def analyze_resume(data: ATSRequest):
    sections = extract_sections(data.resume_text)

    resume_skills = extract_skills(data.resume_text)
    jd_skills = extract_skills(data.job_description)

    matched, missing = match_skills(resume_skills, jd_skills)

    skill_score = skill_match_score(matched, jd_skills)
    keyword_sim = tfidf_similarity(data.resume_text, data.job_description)
    sec_score = section_score(sections)

    ats_score = final_ats_score(skill_score, keyword_sim, sec_score)

    return {
        "ats_score": ats_score,
        "skill_score": round(skill_score, 2),
        "resume_skills": resume_skills,
        "jd_skills": jd_skills,
        "matched_skills": matched,
        "missing_skills": missing

    }



