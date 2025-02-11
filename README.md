# HireMate

採用管理システム（ATS）のPoCプロジェクト。詳細な仕様は[SPEC.md](./SPEC.md)を参照してください。

## 実装状況

### ✅ 完了した機能

#### 1. 企業情報管理
- **採用要件登録**
  - 職種名、必須スキル、歓迎スキル、経験年数などの登録
  - 一覧表示、編集、削除機能
  - 箇条書き形式でのスキル入力対応
- **カルチャー・バリュー設定**
  - 企業のコアバリューと重要度（0-100%）の登録
  - 一覧表示、編集、削除機能
  - プログレスバーによる視覚的な表示
- **評価基準重みづけ**
  - 4つの評価軸（スキル適合度、カルチャーフィット度、実績度、ポテンシャル）
  - スライダーと数値入力の組み合わせ
  - 合計100%のバリデーション
  - 自動調整機能（比例配分）

### 🚧 実装中の機能

#### 2. 候補者管理
- 候補者一覧画面
- 候補者登録機能
- 書類解析（職務経歴書要約）

### 📅 今後の実装予定

- 自動スコアリング
- 面接アシスト
- ステータス管理
- 他ATSプラグイン連携

## 開発環境のセットアップ

1. リポジトリのクローン
```bash
git clone https://github.com/yasuuucchi/HireMate-NEW.git
cd HireMate-NEW
```

2. 依存関係のインストール
```bash
npm install
```

3. 環境変数の設定
```bash
# PostgreSQLの接続情報を設定
cp .env.example .env
```

4. データベースのセットアップ
```bash
npx prisma migrate dev
```

5. 開発サーバーの起動
```bash
npm run dev
```

## 技術スタック

- **フロントエンド**
  - Next.js 14
  - React
  - TypeScript
  - TailwindCSS

- **バックエンド**
  - Next.js API Routes
  - PostgreSQL
  - Prisma ORM

- **予定**
  - OpenAI GPT
  - LangChain
  - Firebase Auth

## 開発への参加方法

1. このリポジトリをフォーク
2. 新しいブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。
