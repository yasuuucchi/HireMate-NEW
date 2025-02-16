#!/bin/bash

# 候補者データを送信
echo "Sending candidate data..."
CANDIDATE_ID=$(curl -s -X POST http://localhost:3001/api/poc/ats/candidate \
  -H "Content-Type: application/json" \
  -d '{
    "name": "山田太郎",
    "email": "yamada@example.com",
    "phone": "090-1234-5678",
    "resumeSummary": "10年以上のソフトウェア開発経験。Webアプリケーション開発のリーダー経験あり。"
  }' | jq -r '.candidateId')

echo "Candidate ID: $CANDIDATE_ID"

# スコアを取得
echo -e "\nRetrieving candidate score..."
curl -s -X POST http://localhost:3001/api/poc/ats/score \
  -H "Content-Type: application/json" \
  -d "{
    \"candidateId\": \"$CANDIDATE_ID\"
  }" | jq .
