以下に、**PoC版の仕様書**をまとめます。**認証機能は外し**つつも、要件定義で示されている**企業情報管理・候補者管理・スコアリング・面接アシスト・ステータス管理・他ATS連携**をすべて網羅します。また、**カラーコンセプト**と**UIデザイン方針**も含め、システムとしての全体像をPoCレベルで記載しています。

---

# 1. システム名称と概要

**システム名称**: HireMate

**システム概要**:  
HireMateは以下の機能を備えた採用支援サービスです。

1. **企業情報管理**（採用要件、カルチャー、評価基準の登録および設定）  
2. **候補者管理**（書類アップロード、基本情報管理、ステータス管理）  
3. **自動スコアリング**（4軸評価およびA/B/Cランク判定）  
4. **面接アシスト**（面接質問の自動生成、キャリア可視化、面接シート作成）  
5. **ステータス管理（パイプライン）**（標準8ステータス＋カスタマイズ機能）  
6. **他ATSプラグイン連携**（候補者情報受信とスコア返却API）

このPoC版では**認証（ログイン/ロール管理）**を省略し、**全機能を単一ユーザーで触れる**形にします。正式リリース時にFirebase Authなどの機構を導入する前提で、コア機能の検証を優先します。最終的にはスケーラブルなアーキテクチャを構築し、本番運用へ移行可能な設計を踏襲します。

---

# 2. カラーコンセプト ＆ UIデザイン方針

## 2.1 カラーコンセプト

1. **ベースカラー: 深緑系 (#1F4532 など)**  
   - Greenhouseのような落ち着いたイメージ  
   - システムの信頼感と安定感を演出する  
2. **アクセントカラー: 明るいグリーン (#6CCF4F など)**  
   - ボタンやハイライト要素で利用し、テクノロジー感と爽やかな印象を付与  
3. **セカンダリカラー: 淡いゴールド (#F4D35E など)**  
   - 特別な情報（お知らせバナー等）にワクワク感を加える  
4. **背景・ベース: ホワイト系 (#FFFFFF)**  
   - コンテンツとのコントラストを確保し、可読性を高める

## 2.2 UIデザイン方針

1. **余白を多めに**  
   - フラットデザインをベースにし、深緑×明るいグリーンのコントラストを際立たせる  
2. **角丸＆シャドウ**  
   - ボタンやカードを8px程度のラウンドコーナーにし、浅いシャドウを付与  
   - 柔らかさと先進性の両立  
3. **マイクロインタラクション**  
   - ボタンホバー時に色を若干変化（0.2秒程度）  
   - クリック時にスケールアップ・シャドウ強調などを挿入し、楽しさを演出  
4. **フォント**  
   - Inter, Roboto, Noto Sansあたりを採用し、見出しにやや太字を使う  

---

# 3. 機能要件 (PoC版)

## 3.1 企業情報管理

1. **採用要件登録**  
   - 職種名、必須スキル、歓迎スキル、経験年数目安、募集人数、雇用形態をフォーム入力  
   - PoCでは追加・一覧・編集を行えるUI  
   - 削除は実装を省略してもよいが、あれば尚可

2. **カルチャー・バリュー設定**  
   - 企業のコアバリュー(文字列)と重要度(0～100)を複数登録  
   - 一覧をテーブル表示し、必要なら編集

3. **評価基準重みづけ**  
   - スキル適合度、カルチャーフィット度、実績度、ポテンシャルの4つに合計100となるよう割り振る  
   - スライダーか数値入力で管理画面から変更可能

### ユーザーフロー: 採用要件登録

1. 「企業設定」画面を開き、「採用要件登録」ボタンを押下  
2. 職種名、必須スキル、歓迎スキル、経験年数、募集人数、雇用形態を入力  
3. 「保存」ボタンでDBへ保存し、一覧画面へ戻る

### ユーザーフロー: カルチャー設定

1. 「企業設定」→「カルチャー登録」ページ  
2. バリュー名と重要度を入力し、「保存」ボタン  
3. 一覧画面に登録済み項目が並ぶ

---

## 3.2 候補者管理

1. **候補者一覧画面**  
   - 名前、メールアドレス、電話番号、ステータス、スコアをテーブル表示  
   - PoCでは簡易的にステータス絞り込みを可能にする

2. **候補者登録機能**  
   - フォームで名前、メール、電話、希望ポジション、職務経歴書(ファイル)を入力/アップロード  
   - ファイルをアップ後、AIによる要約処理を非同期で実行し、DBに保存

3. **書類解析 (職務経歴書要約)**  
   - PoCではOpenAI GPT-3.5以上を利用  
   - PDF/Wordのテキストを抽出し、LangChainで要約プロンプトを呼び出す  
   - 簡易的に「期間」「役職」「主要実績」などを抽出  
   - 結果を候補者ドキュメントに保存

4. **候補者詳細画面**  
   - スコア（A/B/C）と要約テキスト、ステータスを表示  
   - キャリアストーリー可視化画面へのリンク（別ページorモーダル）

### ユーザーフロー: 候補者登録

1. 「候補者一覧」画面から「新規登録」ボタン  
2. 名前や連絡先、職務経歴書をアップロード  
3. 「保存」クリックでDBに新規レコード作成、バックエンドがAIマイクロサービスへ要約リクエスト  
4. 要約完了後、候補者の詳細画面で確認可能

---

## 3.3 自動スコアリング

1. **4軸計算**  
   - スキル適合度：必須スキル一致率やOpenAIによる技術キーワード解析  
   - カルチャーフィット度：登録されたカルチャーと要約テキストを比較し、関連度を得点化  
   - 実績度：リーダー経験や成果（営業売上、開発規模）を加点  
   - ポテンシャル：リスキリングや独学の記述を解析し加点

2. **合計スコア**  
   - 4軸 × 企業設定の重み → 合計点 = 0～100  
   - A=80以上、B=60～79、C=59以下（閾値をPoC内で固定or設定画面で変更）

3. **PoC向け最小アルゴリズム**  
   - 要約テキスト中の出現キーワード数 or AI回答のスコア数値  
   - デフォルトで簡易計算し、後から詳細化  
   - 面接官による手動補正UIがあれば尚可

### ユーザーフロー: スコアリング

1. 候補者詳細画面の「スコアを計算」ボタンを押す  
2. バックエンドがAIマイクロサービス呼び出し→ 4軸スコア取得  
3. 合計点とA/B/CランクをDBに保存  
4. 画面上に算出結果が即時反映

---

## 3.4 面接アシスト

1. **キャリアストーリー可視化**  
   - 要約テキストの期間・役職をもとにマイルストーンを生成  
   - CSS/Canvasで川状ラインを描き、左右スクロール対応  
   - マイルストーンクリックでポップアップ（期間や実績の表示）

2. **面接質問自動生成**  
   - 「世界トップクラスのヘッドハンター」を想定したプロンプト例:

     ```
     You are an elite headhunter with 20+ years of experience 
     in uncovering candidates' potential, culture fit, and skill sets.
     Produce 10-15 STAR-based interview questions for the candidate 
     below, focusing on both technical depth and cultural alignment.

     Candidate Resume Summary:
     {resume_text}

     Company Culture & Requirements:
     {culture_values_and_job_requirements}

     For each question:
     1) Provide question text (Situation/Task/Action/Result perspective).
     2) Example of an ideal (high-scoring) answer.
     3) Example of a low-scoring answer.
     ```

   - LLMが回答リストを返し、フロントで表示→ユーザーが必要項目を選択→面接シートに追加

3. **面接シート作成・編集**  
   - 質問リストを並べ替え、不要なものを削除  
   - DBに`InterviewSheet`として保存  
   - PoCでは面接官用の評価UIを同じ画面で実装し、回答メモや5段階評価を入力→DBに保存

---

## 3.5 ステータス管理（パイプライン）

1. **標準ステータス**  
   - 「応募、書類選考、一次面接、二次面接、最終面接、内定、保留、不採用」  
   - 候補者詳細画面でドロップダウン変更 → DBに保存

2. **カスタムステータス**  
   - 簡易フォームで名前を追加し、列挙型に追加する実装  
   - PoCでは一覧管理や順序変更のUIは最小限

3. **自動通知(オプション)**  
   - ステータス変更時にメール送信やコンソール表示  
   - 必要があればSendGridや別のメールAPIを呼び出す

---

## 3.6 他ATSプラグイン連携

1. **Webhook受信**  
   - `POST /poc/ats/candidate` でATSから候補者データを受け取り、DBに登録  
2. **スコア返却**  
   - `POST /poc/ats/score` で算出したスコアやランクを返す  
   - PoCではトークン認証省略し、デモできる程度を実装

### ユーザーフロー: 他ATSプラグイン利用

1. ATSが候補者JSONを`POST /poc/ats/candidate`に送信  
2. サーバーがDB保存 + AI要約→スコア算出  
3. 結果を`POST /poc/ats/score`などでATSへ返送  
4. ATS画面でHireMateのスコアが表示される(デモ想定)

---

# 4. システム構成 (PoC向け)

```
┌───────────────────────────────────┐
│         Frontend (React/Next.js, No Auth)        │
│  - CandidateList, CandidateDetail, CompanySettings│
│  - InterviewSheet pages                           │
└───────────────────────────────────┘
              │
┌───────────────────────────────────┐
│        Backend (Node or Python)   │
│  - CRUD for candidates, job reqs, │
│    interview sheets, etc.         │
│  - Calls AI microservice (LangChain)            │
│  - No login/role checks in PoC                 │
└───────────────────────────────────┘
              │
┌───────────────────────────────────┐
│   AI Microservice (LangChain + OpenAI GPT)  │
│  - Summaries, question generation          │
└───────────────────────────────────┘
              │
┌───────────────────────────────────┐
│   Database (Firestore or simple DB)        │
│   Storage (S3/GCS) for resumes (optional)  │
└───────────────────────────────────┘
```

1. **認証なし**: いったん誰でもアクセス可能  
2. **Frontend**: UIを集中的に実装、複数メニュー(「企業設定」「候補者一覧」「面接シート一覧」など)  
3. **Backend**: PoCではExpress or FastAPIでRESTfulに実装  
4. **AI Microservice**: Python FastAPI + LangChain + OpenAI API

---

# 5. データモデル例 (PoC版)

```ts
// jobRequirements
interface JobRequirement {
  id: string;
  positionName: string;
  requiredSkills: string[];
  niceToHaveSkills: string[];
  experienceYears: number;
  numberOfOpenings: number;
  employmentType: string;
}

// cultureValues
interface CultureValue {
  id: string;
  title: string;
  importance: number;
}

// candidate
interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  resumeUrl: string;
  status: string;
  skillScore: number;
  cultureScore: number;
  achievementScore: number;
  potentialScore: number;
  totalScore: number;
  rank: 'A' | 'B' | 'C';
  resumeSummary: string;
  timeline?: CareerMilestone[];
}

interface CareerMilestone {
  startDate: string;
  endDate: string;
  role: string;
  description: string;
}

// interviewSheet
interface InterviewSheet {
  id: string;
  candidateId: string;
  questions: InterviewQuestion[];
}

interface InterviewQuestion {
  id: string;
  text: string;
  goodAnswerExample: string;
  badAnswerExample: string;
  rating?: number;
  note?: string;
}
```

---

# 6. PoC開発フロー

1. **フロントエンド**  
   - Next.jsアプリで各ページ実装  
   - ページ例: `/company-settings` (採用要件・カルチャー), `/candidates`, `/candidates/[id]` (詳細), `/interview-sheets`  
2. **バックエンド**  
   - Node.js(Express) or Python(FastAPI)  
   - `POST /api/candidates`、`POST /api/candidates/{id}/score`、`POST /api/interview-sheets/generate`など  
   - DBにはFirestoreまたはSQLiteなどPoC向けを利用  
3. **AIマイクロサービス**  
   - Python + LangChain + OpenAI GPT-3.5以上  
   - `POST /summarizeResume`：書類解析  
   - `POST /generateQuestions`：面接質問生成（上記「世界トップクラスのヘッドハンタープロンプト」）  
4. **テスト**  
   - PoCのため最低限の単体テスト  
   - UI E2Eテストで画面フロー確認

---

# 7. まとめ ＆ 今後の拡張

- PoC版では**認証機能を省略**し、全機能を単一ユーザーで操作可能にする。  
- **コア機能**（採用要件登録、候補者管理、スコアリング、面接質問生成、キャリア可視化、ステータス管理、ATS連携）を一通り試し、**機能の実用性とAI品質を検証**。  
- カラーコンセプトは**深緑ベース × 明るいグリーン**を採用し、UI/UXを一度PoCで仕上げる。  
- 将来フェーズで**Firebase Auth**などを導入し、ロール管理（採用担当者・面接官・管理者）やSecurity Rules、メール通知などを正式に追加する計画。

このPoC仕様により、**早期にHireMateの主要機能**をユーザーへ提示でき、採用担当者や開発チームが**実用性を評価**可能となります。高評価を得た後は、**認証やセキュリティ、バイアス対策**など本格的な要件を順次導入する流れを想定しています。# HireMate-NEW
