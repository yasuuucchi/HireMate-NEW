#!/bin/bash

# 環境変数の読み込み
source ai-service/.env

# APIのベースURL
API_BASE_URL="http://localhost:8000"

# テスト用の職務経歴書テキスト（一部抜粋）
RESUME_TEXT='
職務経歴書

【職務要約】
10年以上のソフトウェア開発経験を持つフルスタックエンジニア。
大規模Webアプリケーションの設計・開発からチームマネジメントまで幅広い経験を有する。

【技術スキル】
言語：Python, TypeScript, JavaScript, Java
フレームワーク：React, Node.js, Django, Spring
インフラ：AWS, GCP, Kubernetes
その他：Git, Docker, CI/CD, アジャイル開発
'

# テスト用のカルチャーバリュー
CULTURE_VALUES='[
  {"title": "技術革新", "importance": 80},
  {"title": "チームワーク", "importance": 70},
  {"title": "自己成長", "importance": 60}
]'

echo "=== HireMate AI Service APIテスト ==="

# ヘルスチェック
echo -e "\n1. ヘルスチェック"
curl -s "${API_BASE_URL}/health" | jq '.'

# スキル抽出
echo -e "\n2. スキル抽出"
curl -s -X POST "${API_BASE_URL}/extract-skills" \
  -H "Content-Type: application/json" \
  -d "{\"resume_text\": \"${RESUME_TEXT}\"}" | jq '.'

# カルチャーフィット分析
echo -e "\n3. カルチャーフィット分析"
curl -s -X POST "${API_BASE_URL}/analyze-culture-fit" \
  -H "Content-Type: application/json" \
  -d "{
    \"resume_text\": \"${RESUME_TEXT}\",
    \"culture_values\": ${CULTURE_VALUES}
  }" | jq '.'

# 職務経歴書ファイルの解析
echo -e "\n4. 職務経歴書ファイルの解析"
curl -s -X POST "${API_BASE_URL}/analyze-resume" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@test-data/resume.pdf" | jq '.'

echo -e "\nテスト完了"
