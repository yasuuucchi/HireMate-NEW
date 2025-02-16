import os
import json
from typing import BinaryIO, Dict, List
import google.generativeai as genai
from .schemas import ResumeAnalysis, CareerEntry, SkillAnalysis, CultureFitAnalysis

class GeminiClient:
    def __init__(self, api_key: str):
        self.api_key = api_key
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-2.0-flash-exp')

    async def analyze_resume(self, file: BinaryIO, mime_type: str) -> ResumeAnalysis:
        try:
            # ファイルをアップロード
            file_content = file.read()
            
            # プロンプトの設定
            prompt = """
            あなたは職務経歴書を分析する専門家です。
            以下の職務経歴書から、以下の情報を抽出してJSON形式で返してください：

            {
              "summary": "全体の要約（文字列）",
              "career_history": [
                {
                  "start_date": "開始年月（YYYY-MM形式）",
                  "end_date": "終了年月（YYYY-MM形式、現職の場合は'現在'）",
                  "role": "役職名",
                  "description": "業務内容の説明",
                  "achievements": ["主な実績1", "主な実績2", ...]
                },
                ...
              ]
            }

            できるだけ詳細に、かつ構造化された形で情報を抽出してください。
            必ずJSONとして解析可能な形式で返してください。
            """

            # Gemini APIにリクエスト
            response = self.model.generate_content(
                contents=[
                    {
                        "parts": [
                            {"text": prompt},
                            {"file_data": {"mime_type": mime_type, "data": file_content}}
                        ]
                    }
                ]
            )

            # レスポンスをパース
            try:
                # レスポンステキストからJSONを抽出
                # {}で囲まれた部分を探す
                text = response.text
                json_start = text.find('{')
                json_end = text.rfind('}') + 1
                if json_start == -1 or json_end == 0:
                    raise ValueError("JSONが見つかりません")
                
                json_str = text[json_start:json_end]
                data = json.loads(json_str)

                # ResumeAnalysisオブジェクトに変換
                career_history = [
                    CareerEntry(
                        start_date=entry["start_date"],
                        end_date=entry["end_date"],
                        role=entry["role"],
                        description=entry["description"],
                        achievements=entry["achievements"]
                    )
                    for entry in data["career_history"]
                ]

                return ResumeAnalysis(
                    summary=data["summary"],
                    career_history=career_history
                )

            except (json.JSONDecodeError, KeyError, ValueError) as e:
                print(f"Parse error: {str(e)}")
                print(f"Raw response: {text}")
                # パースに失敗した場合は、テキスト全体を要約として扱う
                return ResumeAnalysis(
                    summary=text,
                    career_history=[]
                )

        except Exception as e:
            raise Exception(f"Failed to analyze resume: {str(e)}")

    async def extract_skills(self, resume_text: str) -> SkillAnalysis:
        try:
            prompt = """
            あなたは職務経歴書からスキルを抽出する専門家です。
            以下の職務経歴書から、スキルを以下のカテゴリーに分類してJSON形式で返してください：

            {
              "technical_skills": {
                "languages": ["プログラミング言語1", "プログラミング言語2", ...],
                "frameworks": ["フレームワーク1", "フレームワーク2", ...],
                "infrastructure": ["インフラ技術1", "インフラ技術2", ...],
                "tools": ["ツール1", "ツール2", ...]
              },
              "domain_knowledge": ["業界知識1", "業界知識2", ...],
              "soft_skills": ["ソフトスキル1", "ソフトスキル2", ...]
            }

            各カテゴリーが空の場合は空配列を返してください。
            必ずJSONとして解析可能な形式で返してください。
            """

            response = self.model.generate_content([
                {"text": prompt},
                {"text": resume_text}
            ])

            # レスポンスをパース
            text = response.text
            json_start = text.find('{')
            json_end = text.rfind('}') + 1
            if json_start == -1 or json_end == 0:
                raise ValueError("JSONが見つかりません")
            
            json_str = text[json_start:json_end]
            data = json.loads(json_str)

            return SkillAnalysis(**data)

        except Exception as e:
            raise Exception(f"Failed to extract skills: {str(e)}")

    async def analyze_culture_fit(
        self,
        resume_text: str,
        culture_values: List[Dict[str, float]]
    ) -> CultureFitAnalysis:
        try:
            # カルチャーバリューをプロンプトに組み込む
            values_str = "\n".join([
                f"- {value['title']} (重要度: {value['importance']})"
                for value in culture_values
            ])

            prompt = f"""
            あなたは候補者とカルチャーフィットを分析する専門家です。
            以下の会社のカルチャーバリューと職務経歴書を比較し、各バリューについて適合度を分析してJSON形式で返してください：

            会社のカルチャーバリュー：
            {values_str}

            以下の形式でJSONを返してください：
            {{
              "culture_fit": {{
                "バリュー名": {{
                  "score": 0-100の数値,
                  "evidence": ["根拠となる経歴や実績1", "根拠2", ...],
                  "improvement_suggestions": ["改善提案1", "改善提案2", ...]
                }},
                ...
              }}
            }}

            各バリューについて：
            - scoreは0-100の範囲で、適合度を数値化してください
            - evidenceは職務経歴書から具体的な根拠を抽出してください
            - improvement_suggestionsは必要に応じて改善提案を含めてください

            必ずJSONとして解析可能な形式で返してください。
            """

            response = self.model.generate_content([
                {"text": prompt},
                {"text": resume_text}
            ])

            # レスポンスをパース
            text = response.text
            json_start = text.find('{')
            json_end = text.rfind('}') + 1
            if json_start == -1 or json_end == 0:
                raise ValueError("JSONが見つかりません")
            
            json_str = text[json_start:json_end]
            data = json.loads(json_str)

            return CultureFitAnalysis(**data)

        except Exception as e:
            raise Exception(f"Failed to analyze culture fit: {str(e)}")
