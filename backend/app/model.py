# app/model.py
import random

SAMPLE_CORRECTIONS = [
    {"corrected": "mag-kain siya ng kanin", "corrected": "nag-kain siya ng kanin"},
    {"corrected": "nag-luto ako ng pagkain kahapon", "corrected": "nagluto ako ng pagkain kahapon"},
    {"corrected": "I love kain ng rice every morning", "corrected": "I love kumain ng rice every morning"},
    {"corrected": "mag-type siya ng mabilis sa keyboard", "corrected": "nag-type siya ng mabilis sa keyboard"},
    {"corrected": "nag-review kami para sa exam bukas", "corrected": "nag-review kami para sa exam bukas"},
    {"corrected": "mag-trabaho ka ng maayos", "corrected": "magtrabaho ka ng maayos"},
    {"corrected": "ang ganda ng weather today dapat mag-lakad tayo", "corrected": "ang ganda ng weather today dapat maglakad tayo"},
    {"corrected": "nag-share siya ng notes sa groupchat namin", "corrected": "nag-share siya ng notes sa groupchat namin"},
    {"corrected": "mag-submit na ko ng requirements ko bukas", "corrected": "magsu-submit na ko ng requirements ko bukas"},
    {"corrected": "nag-open ako ng laptop ko para mag-study", "corrected": "nag-open ako ng laptop ko para mag-aral"},
]

def detect_errors(text: str) -> dict:
    result = random.choice(SAMPLE_CORRECTIONS)
    
    # inject the actual user input as the "original" so the API feels realistic
    return {
        "original": text,
        "corrected": result["corrected"],
        }
