# Dockerfile para Bot WhatsApp com Venom-Bot (Railway)

# 1. Imagem base Node
FROM node:20-alpine

# 2. Diretório de trabalho
WORKDIR /usr/src/app

# 3. Copia package.json e yarn.lock (se tiver) para instalar dependências primeiro
COPY package.json yarn.lock* ./

# 4. Instala yarn e dependências (produção)
RUN corepack enable && corepack prepare yarn@stable --activate
RUN yarn install --production --frozen-lockfile --network-concurrency 1

# 5. Copia todo o restante do projeto
COPY . .

# 6. Expõe a porta (se necessário)
EXPOSE 3000

# 7. Comando para rodar o bot
CMD ["node", "index.js"]
