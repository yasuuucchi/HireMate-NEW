FROM python:3.11-slim

WORKDIR /app

# 必要なパッケージのインストール
RUN apt-get update && apt-get install -y \
    build-essential \
    python3-dev \
    libmagic1 \
    jq \
    && rm -rf /var/lib/apt/lists/*

# 依存関係のインストール
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# アプリケーションのコピー
COPY ./app ./app

# 環境変数の設定
ENV PYTHONPATH=/app
ENV PORT=8000
ENV HOST=0.0.0.0

# ポートの公開
EXPOSE 8000

# アプリケーションの起動
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
