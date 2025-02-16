import asyncio
import os
from dotenv import load_dotenv
from ai_service.app.gemini_client import GeminiClient

# .envファイルから環境変数を読み込む
load_dotenv()

# テスト用の職務経歴書テキスト
SAMPLE_RESUME = """
職務経歴書

【基本情報】
氏名：山田太郎
年齢：35歳
最終学歴：○○大学 工学部 情報工学科

【職務要約】
10年以上のソフトウェア開発経験を持つフルスタックエンジニア。
大規模Webアプリケーションの設計・開発からチームマネジメントまで幅広い経験を有する。

【職務経歴】
2020年4月 - 現在
株式会社テックイノベーション
シニアソフトウェアエンジニア / テックリード

- マイクロサービスアーキテクチャを採用した新規プロジェクトの立ち上げと技術選定を主導
- TypeScript、React、Node.js、Kubernetes等を用いたスケーラブルなシステム開発
- 10名規模の開発チームのマネジメントとメンタリング
- アジャイル開発手法の導入と改善活動の推進

2015年4月 - 2020年3月
株式会社ウェブソリューションズ
Webアプリケーションエンジニア

- Python/Djangoを用いた基幹システムの開発
- AWS上でのインフラ構築・運用
- パフォーマンス改善によるレスポンスタイム50%削減
- 新人エンジニアの教育・育成（5名）

2012年4月 - 2015年3月
株式会社システムクリエイト
ソフトウェアエンジニア

- Java/Spring Frameworkを使用した受託開発
- データベース設計とSQL最適化
- ユニットテストの導入と品質改善

【技術スキル】
言語：Python, TypeScript, JavaScript, Java
フレームワーク：React, Node.js, Django, Spring
インフラ：AWS, GCP, Kubernetes
その他：Git, Docker, CI/CD, アジャイル開発

【資格】
- 情報処理技術者試験 応用情報技術者
- AWS認定ソリューションアーキテクト プロフェッショナル
- TOEIC 850点

【自己PR】
技術力とリーダーシップを兼ね備え、チーム全体の生産性向上に貢献してきました。
新しい技術への探究心を持ち続け、継続的な学習を心がけています。
コミュニケーション能力を活かし、ビジネスサイドと技術サイドの橋渡し役として、
プロジェクトの成功に貢献してきました。
"""

# テスト用のカルチャーバリュー
SAMPLE_CULTURE_VALUES = [
    {"title": "技術革新", "importance": 80},
    {"title": "チームワーク", "importance": 70},
    {"title": "自己成長", "importance": 60}
]

async def test_skill_extraction():
    """スキル抽出機能のテスト"""
    print("\n=== スキル抽出テスト ===")
    client = GeminiClient(os.getenv("GEMINI_API_KEY"))
    
    try:
        result = await client.extract_skills(SAMPLE_RESUME)
        print("\n技術スキル:")
        print(f"- 言語: {', '.join(result.technical_skills.languages)}")
        print(f"- フレームワーク: {', '.join(result.technical_skills.frameworks)}")
        print(f"- インフラ: {', '.join(result.technical_skills.infrastructure)}")
        print(f"- ツール: {', '.join(result.technical_skills.tools)}")
        print("\n業界知識:")
        print(f"- {', '.join(result.domain_knowledge)}")
        print("\nソフトスキル:")
        print(f"- {', '.join(result.soft_skills)}")
    except Exception as e:
        print(f"Error in skill extraction: {str(e)}")

async def test_culture_fit():
    """カルチャーフィット分析のテスト"""
    print("\n=== カルチャーフィット分析テスト ===")
    client = GeminiClient(os.getenv("GEMINI_API_KEY"))
    
    try:
        result = await client.analyze_culture_fit(SAMPLE_RESUME, SAMPLE_CULTURE_VALUES)
        print("\nカルチャーフィット分析結果:")
        for value_name, fit_data in result.culture_fit.items():
            print(f"\n{value_name}:")
            print(f"スコア: {fit_data.score}")
            print("根拠:")
            for evidence in fit_data.evidence:
                print(f"- {evidence}")
            if fit_data.improvement_suggestions:
                print("改善提案:")
                for suggestion in fit_data.improvement_suggestions:
                    print(f"- {suggestion}")
    except Exception as e:
        print(f"Error in culture fit analysis: {str(e)}")

async def main():
    """メイン実行関数"""
    if not os.getenv("GEMINI_API_KEY"):
        print("Error: GEMINI_API_KEY is not set in .env file")
        return

    await test_skill_extraction()
    await test_culture_fit()

if __name__ == "__main__":
    asyncio.run(main())
