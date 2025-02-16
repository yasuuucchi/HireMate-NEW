from pydantic import BaseModel
from typing import List, Optional, Dict

class CareerEntry(BaseModel):
    start_date: str
    end_date: Optional[str] = None
    role: str
    description: str
    achievements: List[str]

class ResumeAnalysis(BaseModel):
    summary: str
    career_history: List[CareerEntry]

class AnalysisResponse(BaseModel):
    success: bool
    data: Optional[ResumeAnalysis] = None
    error: Optional[str] = None

class TechnicalSkills(BaseModel):
    languages: List[str]
    frameworks: List[str]
    infrastructure: List[str]
    tools: List[str]

class SkillAnalysis(BaseModel):
    technical_skills: TechnicalSkills
    domain_knowledge: List[str]
    soft_skills: List[str]

class CultureValueFit(BaseModel):
    score: int
    evidence: List[str]
    improvement_suggestions: List[str]

class CultureFitAnalysis(BaseModel):
    culture_fit: Dict[str, CultureValueFit]

class ScoringRequest(BaseModel):
    weights: Dict[str, float]  # スキル、カルチャー、実績、ポテンシャルの重み
    required_skills: List[str]  # 必須スキル
    nice_to_have_skills: List[str]  # 歓迎スキル
    culture_values: List[Dict[str, float]]  # カルチャーバリューと重要度
    resume_analysis: ResumeAnalysis  # 解析済みの職務経歴書データ

class ScoringData(BaseModel):
    total_score: float  # 総合スコア
    skill_score: float  # スキル適合度
    culture_score: float  # カルチャーフィット度
    achievement_score: float  # 実績度
    potential_score: float  # ポテンシャル
    rank: str  # A/B/Cランク

class ScoringResponse(BaseModel):
    success: bool
    data: Optional[ScoringData] = None
    error: Optional[str] = None

class InterviewQuestion(BaseModel):
    category: str  # 質問カテゴリー（technical/culture/achievement/potential/motivation）
    text: str  # 質問文
    good_answer: str  # 高評価となる回答例
    bad_answer: str  # 低評価となる回答例
    evaluation_points: List[str]  # 評価のポイント

class GenerateQuestionsRequest(BaseModel):
    resume_analysis: ResumeAnalysis  # 解析済みの職務経歴書データ
    job_requirements: Dict[str, List[str]]  # 必須スキル、歓迎スキル
    culture_values: List[Dict[str, float]]  # カルチャーバリューと重要度
    category: Optional[str] = None  # 特定のカテゴリーの質問のみを生成する場合
    num_questions: Optional[int] = 3  # 生成する質問の数

class GenerateQuestionsResponse(BaseModel):
    success: bool
    data: Optional[List[InterviewQuestion]] = None
    error: Optional[str] = None

class InterviewSheet(BaseModel):
    id: str
    candidate_id: str
    questions: List[InterviewQuestion]
    notes: Optional[Dict[str, str]] = None  # 質問IDごとのメモ
    ratings: Optional[Dict[str, int]] = None  # 質問IDごとの評価（1-5）
