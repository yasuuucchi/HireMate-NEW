from typing import List, Dict
import re
from .schemas import ResumeAnalysis

class CandidateScorer:
    def __init__(self, weights: Dict[str, float]):
        """
        スコアリングの重みを初期化
        weights: {
            "skill": float,      # スキル適合度の重み
            "culture": float,    # カルチャーフィット度の重み
            "achievement": float, # 実績度の重み
            "potential": float   # ポテンシャルの重み
        }
        """
        self.weights = weights
        self.total_weight = sum(weights.values())
        # 重みの正規化
        self.weights = {k: v / self.total_weight for k, v in weights.items()}

    def calculate_skill_score(
        self,
        required_skills: List[str],
        nice_to_have_skills: List[str],
        resume_text: str
    ) -> float:
        """スキル適合度を計算"""
        # スキルの出現回数をカウント
        required_matches = sum(
            1 for skill in required_skills
            if re.search(rf'\b{re.escape(skill)}\b', resume_text, re.IGNORECASE)
        )
        nice_matches = sum(
            1 for skill in nice_to_have_skills
            if re.search(rf'\b{re.escape(skill)}\b', resume_text, re.IGNORECASE)
        )

        # スコアの計算（必須スキル: 70%, 歓迎スキル: 30%）
        required_score = (required_matches / len(required_skills)) * 70 if required_skills else 0
        nice_score = (nice_matches / len(nice_to_have_skills)) * 30 if nice_to_have_skills else 0

        return required_score + nice_score

    def calculate_culture_score(
        self,
        culture_values: List[Dict[str, float]],
        resume_text: str
    ) -> float:
        """カルチャーフィット度を計算"""
        total_score = 0
        total_importance = sum(value["importance"] for value in culture_values)

        for value in culture_values:
            # 各バリューの出現回数と関連フレーズの検索
            value_name = value["title"]
            importance = value["importance"] / total_importance
            
            # バリューに関連するキーワードのパターン
            patterns = [
                value_name,
                f"{value_name}を重視",
                f"{value_name}に注力",
                f"{value_name}を大切に",
            ]
            
            matches = sum(
                1 for pattern in patterns
                if re.search(rf'\b{re.escape(pattern)}\b', resume_text, re.IGNORECASE)
            )
            
            # スコアの計算（出現回数 × 重要度）
            value_score = min(matches * 25, 100) * importance
            total_score += value_score

        return total_score

    def calculate_achievement_score(self, resume: ResumeAnalysis) -> float:
        """実績度を計算"""
        total_score = 0
        
        for entry in resume.career_history:
            # 実績の数による加点
            achievement_count = len(entry.achievements)
            achievement_score = min(achievement_count * 20, 100)
            
            # 役職による加点
            role_score = 0
            leadership_roles = ["マネージャー", "リーダー", "部長", "課長", "主任"]
            if any(role in entry.role for role in leadership_roles):
                role_score = 30
            
            # エントリーごとのスコアを計算（実績70%、役職30%）
            entry_score = (achievement_score * 0.7) + (role_score * 0.3)
            total_score += entry_score
        
        # 経歴エントリーの平均を取る
        return total_score / len(resume.career_history) if resume.career_history else 0

    def calculate_potential_score(self, resume: ResumeAnalysis) -> float:
        """ポテンシャルを計算"""
        score = 0
        resume_text = resume.summary.lower()
        
        # 学習意欲や成長に関するキーワード
        learning_patterns = [
            "学習", "勉強", "資格", "研修", "セミナー",
            "新しい技術", "キャリアアップ", "スキルアップ",
            "自己啓発", "独学", "挑戦"
        ]
        
        # キーワードの出現回数による加点
        matches = sum(
            1 for pattern in learning_patterns
            if re.search(rf'\b{re.escape(pattern)}\b', resume_text)
        )
        learning_score = min(matches * 20, 100)
        
        # 直近の実績による加点
        recent_achievements = 0
        if resume.career_history:
            latest_entry = resume.career_history[0]  # 最新の経歴
            recent_achievements = len(latest_entry.achievements)
        achievement_score = min(recent_achievements * 25, 100)
        
        # 総合スコアの計算（学習意欲60%、直近の実績40%）
        score = (learning_score * 0.6) + (achievement_score * 0.4)
        
        return score

    def calculate_total_score(
        self,
        required_skills: List[str],
        nice_to_have_skills: List[str],
        culture_values: List[Dict[str, float]],
        resume: ResumeAnalysis
    ) -> Dict[str, float]:
        """総合スコアを計算"""
        # 各項目のスコアを計算
        skill_score = self.calculate_skill_score(
            required_skills,
            nice_to_have_skills,
            resume.summary
        )
        culture_score = self.calculate_culture_score(
            culture_values,
            resume.summary
        )
        achievement_score = self.calculate_achievement_score(resume)
        potential_score = self.calculate_potential_score(resume)

        # 重み付けされた総合スコアを計算
        total_score = (
            skill_score * self.weights["skill"] +
            culture_score * self.weights["culture"] +
            achievement_score * self.weights["achievement"] +
            potential_score * self.weights["potential"]
        )

        # ランクの判定
        rank = "C"
        if total_score >= 80:
            rank = "A"
        elif total_score >= 60:
            rank = "B"

        return {
            "total_score": total_score,
            "skill_score": skill_score,
            "culture_score": culture_score,
            "achievement_score": achievement_score,
            "potential_score": potential_score,
            "rank": rank
        }
