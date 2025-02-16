#!/bin/bash

# エラーハンドリング関数
handle_response() {
  local response="$1"
  if echo "$response" | jq -e . >/dev/null 2>&1; then
    echo "$response" | jq .
  else
    echo "Error: Invalid JSON response"
    echo "Raw response: $response"
  fi
}

# テスト用の候補者を作成
echo "候補者を作成中..."
CANDIDATE_RESPONSE=$(curl -s -X POST http://localhost:3001/api/candidates \
-H "Content-Type: application/json" \
-d '{
  "name": "テスト太郎",
  "email": "test@example.com",
  "phone": "090-1234-5678",
  "status": "書類選考"
}')

handle_response "$CANDIDATE_RESPONSE"
CANDIDATE_ID=$(echo "$CANDIDATE_RESPONSE" | jq -r '.id // empty')

if [ -z "$CANDIDATE_ID" ]; then
  echo "Error: Failed to get candidate ID"
  exit 1
fi

echo "候補者ID: $CANDIDATE_ID"

# 面接シート新規作成
echo -e "\n面接シートを作成中..."
SHEET_RESPONSE=$(curl -s -X POST http://localhost:3001/api/interview-sheets \
-H "Content-Type: application/json" \
-d "{
  \"candidateId\": \"$CANDIDATE_ID\",
  \"questions\": [
    {
      \"text\": \"これまでのキャリアで最も困難だった課題は何ですか？\",
      \"goodAnswerExample\": \"具体的な状況、取り組み、結果を説明できている\",
      \"badAnswerExample\": \"抽象的な回答や責任転嫁\",
      \"order\": 0
    },
    {
      \"text\": \"当社を志望した理由を教えてください\",
      \"goodAnswerExample\": \"企業理念や事業内容への深い理解\",
      \"badAnswerExample\": \"表面的な理由\",
      \"order\": 1
    }
  ]
}")

handle_response "$SHEET_RESPONSE"
SHEET_ID=$(echo "$SHEET_RESPONSE" | jq -r '.id // empty')

if [ -z "$SHEET_ID" ]; then
  echo "Error: Failed to get sheet ID"
  exit 1
fi

echo "面接シートID: $SHEET_ID"

# 面接シート一覧取得
echo -e "\n面接シート一覧を取得中..."
LIST_RESPONSE=$(curl -s http://localhost:3001/api/interview-sheets)
handle_response "$LIST_RESPONSE"

# 面接シート詳細取得
echo -e "\n面接シート詳細を取得中..."
DETAIL_RESPONSE=$(curl -s http://localhost:3001/api/interview-sheets/$SHEET_ID)
handle_response "$DETAIL_RESPONSE"

# 面接シート更新
echo -e "\n面接シートを更新中..."
UPDATE_RESPONSE=$(curl -s -X PUT http://localhost:3001/api/interview-sheets/$SHEET_ID \
-H "Content-Type: application/json" \
-d '{
  "questions": [
    {
      "text": "リーダーシップを発揮した経験を教えてください",
      "goodAnswerExample": "チーム目標達成のための具体的な行動と成果",
      "badAnswerExample": "独断的な決定や成果が不明確",
      "order": 0
    }
  ]
}')
handle_response "$UPDATE_RESPONSE"

# エラーケースのテスト
echo -e "\nエラーケースをテスト中..."

# 1. 存在しない候補者IDで作成
echo "1. 存在しない候補者IDでの作成テスト"
ERROR1_RESPONSE=$(curl -s -X POST http://localhost:3001/api/interview-sheets \
-H "Content-Type: application/json" \
-d '{
  "candidateId": "non-existent-id",
  "questions": [
    {
      "text": "テスト質問",
      "goodAnswerExample": "良い回答",
      "badAnswerExample": "悪い回答",
      "order": 0
    }
  ]
}')
handle_response "$ERROR1_RESPONSE"

# 2. 不正なJSONフォーマット
echo -e "\n2. 不正なJSONフォーマットのテスト"
ERROR2_RESPONSE=$(curl -s -X POST http://localhost:3001/api/interview-sheets \
-H "Content-Type: application/json" \
-d '{
  "candidateId": "invalid-json')
handle_response "$ERROR2_RESPONSE"

# 3. 存在しないシートIDで更新
echo -e "\n3. 存在しないシートIDでの更新テスト"
ERROR3_RESPONSE=$(curl -s -X PUT http://localhost:3001/api/interview-sheets/non-existent-id \
-H "Content-Type: application/json" \
-d '{
  "questions": [
    {
      "text": "テスト質問",
      "goodAnswerExample": "良い回答",
      "badAnswerExample": "悪い回答",
      "order": 0
    }
  ]
}')
handle_response "$ERROR3_RESPONSE"

# 4. 必須フィールドの欠落
echo -e "\n4. 必須フィールドの欠落テスト"
ERROR4_RESPONSE=$(curl -s -X POST http://localhost:3003/api/interview-sheets \
-H "Content-Type: application/json" \
-d '{
  "candidateId": "'"$CANDIDATE_ID"'",
  "questions": [
    {
      "text": "テスト質問",
      "order": 0
    }
  ]
}')
handle_response "$ERROR4_RESPONSE"

# 最後に面接シートを削除
echo -e "\n面接シートを削除中..."
DELETE_RESPONSE=$(curl -s -X DELETE http://localhost:3003/api/interview-sheets/$SHEET_ID)
handle_response "$DELETE_RESPONSE"
echo "ステータスコード: $?"

# 候補者も削除
echo -e "\n候補者を削除中..."
CANDIDATE_DELETE_RESPONSE=$(curl -s -X DELETE http://localhost:3003/api/candidates/$CANDIDATE_ID)
handle_response "$CANDIDATE_DELETE_RESPONSE"
echo "ステータスコード: $?"
