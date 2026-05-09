from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
from dotenv import load_dotenv
import os
import json

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

class ProfileRequest(BaseModel):
    profile_text: str

@app.post("/analyze")
async def analyze(request: ProfileRequest):
    prompt = f"""
You are a brutally honest but helpful career coach analyzing a LinkedIn profile.

Here is the LinkedIn profile text:
{request.profile_text[:3000]}

Respond ONLY with a valid JSON object in this exact format:
{{
  "profile_score": <number from 1-100>,
  "one_liner": "<one savage but funny sentence summarizing the profile>",
  "roast": "<2-3 sentences honestly critiquing the profile's weaknesses>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "weaknesses": ["<weakness 1>", "<weakness 2>", "<weakness 3>"],
  "rewritten_headline": "<a much better headline for this person>",
  "rewritten_about": "<a rewritten about section, 3-4 sentences, professional and compelling>",
  "action_tips": ["<tip 1>", "<tip 2>", "<tip 3>"]
}}
"""
    chat = client.chat.completions.create(
        messages=[{"role": "user", "content": prompt}],
        model="llama-3.3-70b-versatile",
    )

    raw = chat.choices[0].message.content.strip()

    try:
        result = json.loads(raw)
    except:
        result = {
            "profile_score": 50,
            "one_liner": "Could not analyze this profile.",
            "roast": "Please paste your full LinkedIn profile text and try again.",
            "strengths": ["Profile submitted"],
            "weaknesses": ["Could not parse profile"],
            "rewritten_headline": "Please try again",
            "rewritten_about": "Please paste more profile text and try again.",
            "action_tips": ["Paste your full LinkedIn about section, experience, and skills"]
        }

    return result