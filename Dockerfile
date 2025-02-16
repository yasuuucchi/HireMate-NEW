FROM node:18-alpine

WORKDIR /app

# 必要なツールのインストール
RUN apk add --no-cache netcat-openbsd

COPY package*.json ./
COPY prisma ./prisma/
COPY wait-for-it.sh ./

# スクリプトの実行権限を設定
RUN chmod +x wait-for-it.sh && \
    npm install

COPY . .

EXPOSE 3000

# デフォルトのエントリーポイントとコマンドをクリア
ENTRYPOINT []
CMD []
