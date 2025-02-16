from fastapi import FastAPI, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .schemas import (
    AnalysisResponse, ScoringResponse, GenerateQuestionsResponse,
    SkillAnalysis, CultureFitAnalysis
)
from .gemini_client import GeminiClient
from typing import List, Dict
import os
from dotenv import load_dotenv

# 環境変数の読み込み
load_dotenv()

app = FastAPI(title="HireMate AI Service")

# CORSミドルウェアの設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 本番環境では適切なオリジンを指定
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Geminiクライアントの初期化
gemini_client = GeminiClient(os.getenv("GEMINI_API_KEY"))

@app.post("/analyze-resume", response_model=AnalysisResponse)
async def analyze_resume(file: UploadFile) -> AnalysisResponse:
    """職務経歴書を解析し、構造化されたデータを返す"""
    try:
        # ファイルサイズの確認
        max_size = int(os.getenv("MAX_UPLOAD_SIZE", 5242880))  # デフォルト5MB
        file_size = 0
        content = await file.read()
        file_size = len(content)
        await file.seek(0)

        if file_size > max_size:
            raise HTTPException(status_code=400, detail="File too large")

        # ファイル形式の確認
        allowed_extensions = os.getenv("ALLOWED_EXTENSIONS", ".pdf,.doc,.docx").split(",")
        file_ext = os.path.splitext(file.filename)[1].lower()
        if file_ext not in allowed_extensions:
            raise HTTPException(status_code=400, detail="Invalid file format")

        # 職務経歴書の解析
        result = await gemini_client.analyze_resume(file.file, file.content_type)
        return AnalysisResponse(success=True, data=result)

    except Exception as e:
        return AnalysisResponse(success=False, error=str(e))

@app.post("/extract-skills", response_model=SkillAnalysis)
async def extract_skills(resume_text: str) -> SkillAnalysis:
    """職務経歴書からスキルを抽出"""
    try:
        result = await gemini_client.extract_skills(resume_text)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze-culture-fit", response_model=CultureFitAnalysis)
async def analyze_culture_fit(
    resume_text: str,
    culture_values: List[Dict[str, float]]
) -> CultureFitAnalysis:
    """カルチャーフィットを分析"""
    try:
        result = await gemini_client.analyze_culture_fit(resume_text, culture_values)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    """ヘルスチェックエンドポイント"""
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=os.getenv("HOST", "0.0.0.0"),
        port=int(os.getenv("PORT", 8000)),
        reload=True
    )
