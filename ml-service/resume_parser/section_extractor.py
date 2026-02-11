import re

SECTION_HEADERS = [
    "skills",
    "experience",
    "projects",
    "education",
    "certifications"
]

def extract_sections(text):
    sections = {}
    current_section = "other"
    sections[current_section] = []

    for line in text.split("\n"):
        clean_line = line.strip().lower()

        if clean_line in SECTION_HEADERS:
            current_section = clean_line
            sections[current_section] = []
        else:
            sections[current_section].append(line)

    for key in sections:
        sections[key] = " ".join(sections[key]).strip()

    return sections
